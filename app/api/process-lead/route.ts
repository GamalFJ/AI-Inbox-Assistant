import { createClient } from "@/utils/supabase/server";
import { generateDraftVariants } from "@/utils/ai";
import { isAtCap, getResetDate, MONTHLY_CAP } from "@/utils/usage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { lead_id } = await req.json();

        // 1. Check monthly cap — finish current if mid-stream, but surface the limit
        const atCap = await isAtCap(supabase, user.id);
        if (atCap) {
            return NextResponse.json({
                error: "monthly_cap_reached",
                message: `You have reached your ${MONTHLY_CAP} leads/month limit for the Founding Member plan. Your leads will resume on ${new Date(getResetDate()).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.`,
                resetDate: getResetDate(),
            }, { status: 429 });
        }

        // 2. Fetch the lead
        const { data: lead, error: leadError } = await supabase
            .from("leads")
            .select("*")
            .eq("id", lead_id)
            .eq("user_id", user.id)
            .single();

        if (leadError) throw new Error("Lead not found or access denied");

        // 3. Fetch the user's profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("business_type, example_replies, booking_link")
            .eq("id", user.id)
            .single();

        if (profileError) throw new Error("User profile not found");

        // 3. Generate all 3 tone variants in parallel
        const { variants, lead_type, followup_plan } = await generateDraftVariants(lead, profile);

        // 4. Update lead classification and status
        await supabase
            .from("leads")
            .update({
                classification: lead_type,
                status: lead_type === "spam" ? "spam" : lead.status
            })
            .eq("id", lead.id);

        // 5. Delete any existing drafts for this lead so we start fresh
        await supabase
            .from("drafts")
            .delete()
            .eq("lead_id", lead.id)
            .eq("user_id", user.id);

        // 6. Insert all 3 variant drafts
        const draftRows = variants.map((v) => ({
            lead_id: lead.id,
            user_id: user.id,
            suggested_subject: v.suggested_subject,
            body: v.draft_body,
            status: "pending",
            tone_variant: v.tone_variant,
        }));

        const { data: drafts, error: draftError } = await supabase
            .from("drafts")
            .insert(draftRows)
            .select();

        if (draftError) throw draftError;

        // 7. Create follow-up tasks (only once, not per variant)
        if (followup_plan && followup_plan.length > 0) {
            // Remove old tasks for this lead first to avoid duplicates
            await supabase.from("tasks").delete().eq("lead_id", lead.id).eq("user_id", user.id);

            const tasks = followup_plan.map((offset: string) => {
                const days = parseInt(offset);
                const dueAt = new Date();
                dueAt.setDate(dueAt.getDate() + (isNaN(days) ? 2 : days));
                return {
                    lead_id: lead.id,
                    user_id: user.id,
                    title: `Follow up (${offset})`,
                    due_at: dueAt.toISOString(),
                    status: "pending"
                };
            });

            await supabase.from("tasks").insert(tasks);
        }

        // 8. Return all drafts so the UI can show all 3 variants
        return NextResponse.json({ drafts, lead_type });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
