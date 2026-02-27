import { createClient } from "@/utils/supabase/server";
import { generateDraftForLead } from "@/utils/ai";
import { getMonthlyLeadCount, MONTHLY_CAP, getResetDate } from "@/utils/usage";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhook/ingest
 *
 * Accepts inbound email payloads from email forwarding providers
 * (Postmark, Mailgun, Resend inbound, SendGrid, or custom).
 *
 * Expected body (JSON):
 * {
 *   secret: string;         // Must match WEBHOOK_SECRET env var
 *   user_id: string;        // The Supabase user ID whose lead this belongs to
 *   from: string;           // Sender email address
 *   subject: string;        // Email subject line
 *   body: string;           // Plain-text email body
 * }
 *
 * On success: creates a lead record and fires the AI draft pipeline.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const { secret, user_id, from: emailFrom, subject, body } = payload;

        // 1. Validate webhook secret
        const expectedSecret = process.env.WEBHOOK_SECRET;
        if (!expectedSecret || secret !== expectedSecret) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!user_id || !emailFrom) {
            return NextResponse.json(
                { error: "Missing required fields: user_id, from" },
                { status: 400 }
            );
        }

        // 2. Create a service-role client to bypass RLS (this is a server-side internal webhook)
        const supabase = await createClient();

        // 3. Insert the lead
        const { data: lead, error: leadError } = await supabase
            .from("leads")
            .insert({
                user_id,
                email_from: emailFrom,
                subject: subject || "(No Subject)",
                body: body || "",
                status: "new",
            })
            .select()
            .single();

        if (leadError) throw leadError;

        // 4. Fetch user profile for AI context
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("business_type, example_replies, booking_link")
            .eq("id", user_id)
            .single();

        if (profileError || !profile) {
            // Still return success — lead was saved, just without AI processing
            console.warn(`Profile not found for user ${user_id}. Skipping AI draft.`);
            return NextResponse.json({ success: true, lead_id: lead.id, draft: null });
        }

        // 5b. Check monthly cap — lead is already saved above (never dropped), but skip AI if at cap
        const monthlyCount = await getMonthlyLeadCount(supabase, user_id);
        if (monthlyCount > MONTHLY_CAP) {
            console.info(`User ${user_id} at monthly cap (${monthlyCount}/${MONTHLY_CAP}). Lead saved, AI skipped.`);
            return NextResponse.json({
                success: true,
                lead_id: lead.id,
                draft_id: null,
                cap_reached: true,
                resetDate: getResetDate(),
            });
        }

        // 6. Generate AI draft
        const draftResult = await generateDraftForLead(lead, profile);

        // 7. Update lead classification
        await supabase
            .from("leads")
            .update({
                classification: draftResult.lead_type,
                status: draftResult.lead_type === "spam" ? "spam" : "new",
            })
            .eq("id", lead.id);

        // 7. Save draft
        const { data: draft, error: draftError } = await supabase
            .from("drafts")
            .insert({
                lead_id: lead.id,
                user_id,
                suggested_subject: draftResult.suggested_subject,
                body: draftResult.draft_body,
                status: "pending",
            })
            .select()
            .single();

        if (draftError) {
            console.error("Failed to save draft:", draftError);
        }

        // 8. Create follow-up tasks
        if (draftResult.followup_plan?.length > 0) {
            const tasks = draftResult.followup_plan.map((offset: string) => {
                const days = parseInt(offset);
                const dueAt = new Date();
                dueAt.setDate(dueAt.getDate() + (isNaN(days) ? 2 : days));
                return {
                    lead_id: lead.id,
                    user_id,
                    title: `Follow up (${offset})`,
                    due_at: dueAt.toISOString(),
                    status: "pending",
                };
            });
            await supabase.from("tasks").insert(tasks);
        }

        return NextResponse.json({
            success: true,
            lead_id: lead.id,
            draft_id: draft?.id ?? null,
            classification: draftResult.lead_type,
        });
    } catch (error: any) {
        console.error("Webhook ingest error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
