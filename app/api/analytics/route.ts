import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/analytics
 *
 * Returns aggregated analytics for the authenticated user:
 *  - totalLeads: total number of leads
 *  - draftsSent: number of drafts with status = 'sent'
 *  - pendingDrafts: number of drafts with status = 'pending'
 *  - spamBlocked: number of leads classified as spam
 *  - hoursSaved: estimated hours saved (2 min per draft sent/pending ≈ 0.033 hrs each)
 *  - avgResponseTime: average time between lead creation and draft creation (in minutes)
 *  - leadsByType: breakdown of leads by classification
 *  - recentActivity: last 7 days of lead counts
 */
export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch all leads
        const { data: leads, error: leadsError } = await supabase
            .from("leads")
            .select("id, created_at, status, classification")
            .eq("user_id", user.id);

        if (leadsError) throw leadsError;

        // Fetch all drafts
        const { data: drafts, error: draftsError } = await supabase
            .from("drafts")
            .select("id, created_at, lead_id, status")
            .eq("user_id", user.id);

        if (draftsError) throw draftsError;

        // Fetch pending tasks
        const { data: tasks, error: tasksError } = await supabase
            .from("tasks")
            .select("id, status, due_at")
            .eq("user_id", user.id);

        if (tasksError) throw tasksError;

        const allLeads = leads || [];
        const allDrafts = drafts || [];
        const allTasks = tasks || [];

        // --- Core Metrics ---
        const totalLeads = allLeads.length;
        const draftsSent = allDrafts.filter((d) => d.status === "sent").length;
        const pendingDrafts = allDrafts.filter((d) => d.status === "pending").length;
        const spamBlocked = allLeads.filter((l) => l.classification === "spam").length;

        // Estimated hours saved: ~2 min per AI-drafted reply
        const totalDrafts = allDrafts.length;
        const hoursSaved = Math.round((totalDrafts * 2) / 60 * 10) / 10; // 1 decimal place

        // --- Lead Classification Breakdown ---
        const leadsByType: Record<string, number> = {};
        allLeads.forEach((lead) => {
            const type = lead.classification || "unclassified";
            leadsByType[type] = (leadsByType[type] || 0) + 1;
        });

        // --- Average Response Time (lead creation → draft creation) ---
        let totalResponseMs = 0;
        let responseCount = 0;

        allDrafts.forEach((draft) => {
            const lead = allLeads.find((l) => l.id === draft.lead_id);
            if (lead) {
                const leadTime = new Date(lead.created_at).getTime();
                const draftTime = new Date(draft.created_at).getTime();
                const diff = draftTime - leadTime;
                if (diff >= 0) {
                    totalResponseMs += diff;
                    responseCount++;
                }
            }
        });

        const avgResponseMinutes =
            responseCount > 0
                ? Math.round(totalResponseMs / responseCount / 60000 * 10) / 10
                : null;

        // --- Recent Activity (last 7 days) ---
        const now = new Date();
        const recentActivity: { date: string; leads: number; drafts: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(day.getDate() - i);
            const dayStr = day.toISOString().split("T")[0];

            const dayLeads = allLeads.filter(
                (l) => l.created_at.split("T")[0] === dayStr
            ).length;
            const dayDrafts = allDrafts.filter(
                (d) => d.created_at.split("T")[0] === dayStr
            ).length;

            recentActivity.push({
                date: dayStr,
                leads: dayLeads,
                drafts: dayDrafts,
            });
        }

        // --- Pending Tasks ---
        const pendingTasks = allTasks.filter((t) => t.status === "pending").length;
        const overdueTasks = allTasks.filter((t) => {
            return t.status === "pending" && new Date(t.due_at) < now;
        }).length;

        return NextResponse.json({
            totalLeads,
            draftsSent,
            pendingDrafts,
            totalDrafts,
            spamBlocked,
            hoursSaved,
            avgResponseMinutes,
            leadsByType,
            recentActivity,
            pendingTasks,
            overdueTasks,
        });
    } catch (error: any) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
