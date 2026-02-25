import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { Resend } from "resend";

/**
 * GET /api/cron/usage-monitor
 *
 * Runs once per day (scheduled in vercel.json).
 * Checks two early-warning thresholds and emails the admin if either is breached:
 *
 *   1. ALERT_USER_THRESHOLD      — total confirmed users in the system
 *   2. ALERT_LEADS_PER_USER      — leads any single user has processed this calendar month
 *
 * All thresholds are configured via environment variables so you can tune them
 * from the Vercel dashboard without a code deploy.
 *
 * Environment variables (add to .env.local + Vercel dashboard):
 *   ADMIN_EMAIL               — where to send alerts (your email)
 *   ALERT_USER_THRESHOLD      — default 50
 *   ALERT_LEADS_PER_USER      — default 200 (per calendar month per user)
 *   CRON_SECRET               — shared secret injected by Vercel Cron
 */

const COST_PER_LEAD_USD = 0.009; // ~$0.009 per lead at GPT-4o rates (1500 in + 500 out tokens)

export async function GET(req: NextRequest) {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ─── Config ───────────────────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL;
    const userThreshold = parseInt(process.env.ALERT_USER_THRESHOLD ?? "50", 10);
    const leadsPerUserThreshold = parseInt(process.env.ALERT_LEADS_PER_USER ?? "200", 10);

    if (!adminEmail) {
        console.warn("[usage-monitor] ADMIN_EMAIL not set — alerts will be skipped.");
    }

    const supabase = createServiceClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const alerts: string[] = [];
    const now = new Date();

    // ─── 1. Total user count ─────────────────────────────────────────────────
    const { count: totalUsers, error: userCountError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

    if (userCountError) {
        console.error("[usage-monitor] Failed to count users:", userCountError.message);
    }

    const userCount = totalUsers ?? 0;

    if (userCount >= userThreshold) {
        alerts.push(
            `🚨 <strong>User threshold reached:</strong> You now have <strong>${userCount} users</strong> (threshold: ${userThreshold}).`
        );
    }

    // ─── 2. Per-user lead volume this calendar month ─────────────────────────
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data: monthlyCounts, error: leadsError } = await supabase
        .from("leads")
        .select("user_id")
        .gte("created_at", startOfMonth);

    if (leadsError) {
        console.error("[usage-monitor] Failed to query monthly leads:", leadsError.message);
    }

    // Aggregate per-user
    const leadsPerUser: Record<string, number> = {};
    for (const row of monthlyCounts ?? []) {
        leadsPerUser[row.user_id] = (leadsPerUser[row.user_id] ?? 0) + 1;
    }

    const heavyUsers = Object.entries(leadsPerUser)
        .filter(([, count]) => count >= leadsPerUserThreshold)
        .sort(([, a], [, b]) => b - a);

    if (heavyUsers.length > 0) {
        const rows = heavyUsers
            .map(([userId, count]) => {
                const estimatedCost = (count * COST_PER_LEAD_USD).toFixed(2);
                return `<tr style="border-bottom:1px solid #eee">
                    <td style="padding:8px 12px;font-family:monospace;font-size:12px">${userId}</td>
                    <td style="padding:8px 12px;text-align:center"><strong>${count}</strong></td>
                    <td style="padding:8px 12px;text-align:center">~$${estimatedCost}</td>
                </tr>`;
            })
            .join("");

        alerts.push(`
⚡ <strong>${heavyUsers.length} high-volume user(s)</strong> exceeded ${leadsPerUserThreshold} leads this month:
<table style="width:100%;border-collapse:collapse;margin-top:8px;font-size:13px">
    <thead>
        <tr style="background:#f5f5f5">
            <th style="padding:8px 12px;text-align:left">User ID</th>
            <th style="padding:8px 12px">Leads This Month</th>
            <th style="padding:8px 12px">Est. AI Cost</th>
        </tr>
    </thead>
    <tbody>${rows}</tbody>
</table>`);
    }

    // ─── 3. Overall monthly cost estimate ────────────────────────────────────
    const totalMonthlyLeads = Object.values(leadsPerUser).reduce((a, b) => a + b, 0);
    const estimatedMonthlyCost = (totalMonthlyLeads * COST_PER_LEAD_USD).toFixed(2);

    // ─── 4. Send alert email if needed ───────────────────────────────────────
    if (alerts.length > 0 && adminEmail) {
        const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:24px">
    <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px 32px">
            <p style="margin:0;color:#94a3b8;font-size:12px;letter-spacing:0.08em;text-transform:uppercase">AI Inbox Assistant</p>
            <h1 style="margin:8px 0 0;color:white;font-size:22px;font-weight:700">⚠️ Usage Alert</h1>
            <p style="margin:6px 0 0;color:#cbd5e1;font-size:13px">${monthLabel} · Generated ${now.toUTCString()}</p>
        </div>

        <!-- Alerts -->
        <div style="padding:28px 32px">
            <p style="color:#374151;font-size:15px;margin-top:0">
                One or more usage thresholds have been breached. Here's a summary:
            </p>

            ${alerts
                .map(
                    (a) => `
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px 20px;margin-bottom:16px;color:#92400e;font-size:14px;line-height:1.6">
                ${a}
            </div>`
                )
                .join("")}

            <!-- Monthly cost snapshot -->
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-top:8px">
                <p style="margin:0;font-size:14px;color:#166534">
                    📊 <strong>Monthly snapshot:</strong>
                    ${totalMonthlyLeads} leads processed in ${monthLabel} ·
                    Estimated AI cost: <strong>~$${estimatedMonthlyCost}</strong> ·
                    Total users: <strong>${userCount}</strong>
                </p>
            </div>
        </div>

        <!-- Actions -->
        <div style="padding:0 32px 28px">
            <p style="color:#374151;font-size:14px;font-weight:600;margin-bottom:12px">Suggested actions:</p>
            <ul style="color:#6b7280;font-size:13px;line-height:1.8;padding-left:18px;margin:0">
                <li>Review pricing — consider raising the monthly plan price.</li>
                <li>Introduce a lead-processing cap tier.</li>
                <li>Promote a higher-tier plan as an upsell.</li>
                <li>Investigate your OpenAI spend in the <a href="https://platform.openai.com/usage" style="color:#2563eb">OpenAI dashboard</a>.</li>
            </ul>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;border-top:1px solid #f1f5f9;padding:16px 32px">
            <p style="margin:0;color:#94a3b8;font-size:11px">
                This alert was sent by your AI Inbox Assistant usage monitor.
                Adjust thresholds via <code>ALERT_USER_THRESHOLD</code> and <code>ALERT_LEADS_PER_USER</code> in your Vercel environment variables.
            </p>
        </div>
    </div>
</body>
</html>`;

        await resend.emails.send({
            from: "AI Inbox Assistant <alerts@yourdomain.com>",
            to: adminEmail,
            subject: `⚠️ Usage Alert — ${alerts.length} threshold(s) breached`,
            html,
        });
    }

    // ─── 5. Return summary ────────────────────────────────────────────────────
    return NextResponse.json({
        success: true,
        checked_at: now.toISOString(),
        summary: {
            total_users: userCount,
            user_threshold: userThreshold,
            user_threshold_breached: userCount >= userThreshold,
            total_monthly_leads: totalMonthlyLeads,
            leads_per_user_threshold: leadsPerUserThreshold,
            heavy_users_count: heavyUsers.length,
            estimated_monthly_ai_cost_usd: parseFloat(estimatedMonthlyCost),
        },
        alerts_sent: alerts.length > 0 && !!adminEmail,
    });
}
