import { createClient } from "@/utils/supabase/server";
import { generateDraftForLead } from "@/utils/ai";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cron/poll-emails
 *
 * Vercel Cron endpoint — runs on a schedule to process any unprocessed leads.
 * This serves as a fallback for users who don't use the webhook-based ingestion.
 *
 * It finds leads that:
 *  1. Have status = 'new'
 *  2. Don't have any associated drafts yet
 *
 * Then it runs the full AI pipeline on each (generate draft → classify → schedule tasks).
 *
 * Secured via CRON_SECRET env var (matches Vercel's injected secret).
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Verify authorization (Vercel Cron sets this header automatically)
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();

        // 2. Fetch all 'new' leads that haven't been processed yet (no drafts)
        const { data: newLeads, error: leadsError } = await supabase
            .from("leads")
            .select("*, drafts(id)")
            .eq("status", "new")
            .is("classification", null)
            .order("created_at", { ascending: true })
            .limit(10); // Process up to 10 leads per cron tick to avoid timeouts

        if (leadsError) throw leadsError;

        if (!newLeads || newLeads.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No unprocessed leads found.",
                processed: 0,
            });
        }

        // Filter to only leads that truly have no drafts
        const unprocessedLeads = newLeads.filter(
            (lead: any) => !lead.drafts || lead.drafts.length === 0
        );

        if (unprocessedLeads.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All new leads already have drafts.",
                processed: 0,
            });
        }

        const results: { lead_id: string; status: string; error?: string }[] = [];

        for (const lead of unprocessedLeads) {
            try {
                // 3. Fetch the user's profile for AI context
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("business_type, example_replies, booking_link")
                    .eq("id", lead.user_id)
                    .single();

                if (!profile) {
                    results.push({
                        lead_id: lead.id,
                        status: "skipped",
                        error: "Profile not found",
                    });
                    continue;
                }

                // 4. Generate AI draft
                const draftResult = await generateDraftForLead(lead, profile);

                // 5. Update lead classification
                await supabase
                    .from("leads")
                    .update({
                        classification: draftResult.lead_type,
                        status: draftResult.lead_type === "spam" ? "spam" : "new",
                    })
                    .eq("id", lead.id);

                // 6. Save the draft
                await supabase.from("drafts").insert({
                    lead_id: lead.id,
                    user_id: lead.user_id,
                    suggested_subject: draftResult.suggested_subject,
                    body: draftResult.draft_body,
                    status: "pending",
                });

                // 7. Create follow-up tasks
                if (draftResult.followup_plan?.length > 0) {
                    const tasks = draftResult.followup_plan.map((offset: string) => {
                        const days = parseInt(offset);
                        const dueAt = new Date();
                        dueAt.setDate(dueAt.getDate() + (isNaN(days) ? 2 : days));
                        return {
                            lead_id: lead.id,
                            user_id: lead.user_id,
                            title: `Follow up (${offset})`,
                            due_at: dueAt.toISOString(),
                            status: "pending",
                        };
                    });
                    await supabase.from("tasks").insert(tasks);
                }

                results.push({ lead_id: lead.id, status: "processed" });
            } catch (err: any) {
                console.error(`Failed to process lead ${lead.id}:`, err);
                results.push({
                    lead_id: lead.id,
                    status: "error",
                    error: err.message,
                });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.filter((r) => r.status === "processed").length,
            skipped: results.filter((r) => r.status === "skipped").length,
            errors: results.filter((r) => r.status === "error").length,
            details: results,
        });
    } catch (error: any) {
        console.error("Cron poll-emails error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
