import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

/**
 * GET /api/admin/usage-stats
 *
 * On-demand admin endpoint that returns a full usage snapshot:
 *   - Total user count
 *   - Per-user leads this month (top 20 heaviest users)
 *   - Estimated AI cost (current month & all-time)
 *   - Threshold status
 *
 * Protected by ADMIN_SECRET env var.
 * Call it with:  Authorization: Bearer <ADMIN_SECRET>
 *
 * Example:
 *   curl https://your-app.vercel.app/api/admin/usage-stats \
 *        -H "Authorization: Bearer your-admin-secret"
 */

const COST_PER_LEAD_USD = 0.009;

export async function GET(req: NextRequest) {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = req.headers.get("authorization");

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // ─── Total users ─────────────────────────────────────────────────────────
    const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

    // ─── All-time leads ───────────────────────────────────────────────────────
    const { count: allTimeLeads } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true });

    // ─── This month's leads ───────────────────────────────────────────────────
    const { data: monthlyLeads } = await supabase
        .from("leads")
        .select("user_id, created_at")
        .gte("created_at", startOfMonth);

    // ─── Per-user monthly breakdown ───────────────────────────────────────────
    const leadsPerUser: Record<string, number> = {};
    for (const row of monthlyLeads ?? []) {
        leadsPerUser[row.user_id] = (leadsPerUser[row.user_id] ?? 0) + 1;
    }

    const topUsers = Object.entries(leadsPerUser)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([user_id, lead_count]) => ({
            user_id,
            lead_count,
            estimated_cost_usd: parseFloat((lead_count * COST_PER_LEAD_USD).toFixed(4)),
            above_threshold: lead_count >= parseInt(process.env.ALERT_LEADS_PER_USER ?? "200", 10),
        }));

    const totalMonthlyLeads = Object.values(leadsPerUser).reduce((a, b) => a + b, 0);

    // ─── Thresholds ───────────────────────────────────────────────────────────
    const userThreshold = parseInt(process.env.ALERT_USER_THRESHOLD ?? "50", 10);
    const leadsPerUserThreshold = parseInt(process.env.ALERT_LEADS_PER_USER ?? "200", 10);

    return NextResponse.json({
        generated_at: now.toISOString(),
        month: now.toLocaleString("en-US", { month: "long", year: "numeric" }),

        users: {
            total: totalUsers ?? 0,
            threshold: userThreshold,
            threshold_breached: (totalUsers ?? 0) >= userThreshold,
        },

        leads: {
            all_time: allTimeLeads ?? 0,
            this_month: totalMonthlyLeads,
            per_user_threshold: leadsPerUserThreshold,
            heavy_users_count: topUsers.filter((u) => u.above_threshold).length,
            top_users_this_month: topUsers,
        },

        estimated_cost: {
            this_month_usd: parseFloat((totalMonthlyLeads * COST_PER_LEAD_USD).toFixed(4)),
            all_time_usd: parseFloat(((allTimeLeads ?? 0) * COST_PER_LEAD_USD).toFixed(4)),
            cost_per_lead_usd: COST_PER_LEAD_USD,
            model: "gpt-4o",
        },

        thresholds: {
            ALERT_USER_THRESHOLD: userThreshold,
            ALERT_LEADS_PER_USER: leadsPerUserThreshold,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "✅ set" : "❌ not set",
            ADMIN_SECRET: adminSecret ? "✅ set" : "❌ not set",
        },
    });
}
