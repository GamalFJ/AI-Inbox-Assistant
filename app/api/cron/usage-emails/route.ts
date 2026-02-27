import { createServiceClient } from "@/utils/supabase/service";
import { getMonthlyLeadCount, MONTHLY_CAP, getResetDate } from "@/utils/usage";
import {
    sendUsageWarningEmail,
    sendUsageLimitEmail,
    sendUpgradeFollowupEmail,
    sendUsageResetEmail,
} from "@/utils/usage-emails";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cron/usage-emails
 *
 * Called daily by Vercel Cron at 9 AM UTC.
 * Checks all users' monthly usage and sends the appropriate email:
 *
 * - At 75%: heads-up warning
 * - At 100%: limit reached notification
 * - 3 days after hitting limit: upgrade follow-up
 * - On the 1st of the month: reset confirmation (for users who hit limit last month)
 */
export async function GET(req: NextRequest) {
    const cronSecret = req.headers.get("authorization");
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Forbidden" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const now = new Date();
    const isFirstOfMonth = now.getDate() === 1;

    // Fetch all users with their emails
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
        return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    const results = {
        checked: 0,
        warning75Sent: 0,
        limitSent: 0,
        followupSent: 0,
        resetSent: 0,
        errors: 0,
    };

    for (const user of users.users) {
        if (!user.email) continue;
        results.checked++;

        try {
            const count = await getMonthlyLeadCount(supabase as any, user.id);
            const percentage = Math.round((count / MONTHLY_CAP) * 100);
            const userName = user.user_metadata?.full_name || user.user_metadata?.name;
            const resetDate = getResetDate();

            // ── 1st of month: send reset email to users who were at limit ──
            if (isFirstOfMonth) {
                // Check if they had hit limit last month (we track via a flag in user metadata or just check count was 0 now)
                // Simple heuristic: send to anyone who received a limit email (we'll use a metadata flag set elsewhere)
                const hadLimit = user.user_metadata?.last_limit_month === `${now.getFullYear()}-${now.getMonth()}`; // previous month
                if (hadLimit) {
                    await sendUsageResetEmail({ toEmail: user.email, userName, cap: MONTHLY_CAP });
                    results.resetSent++;
                }
            }

            // ── 75% warning — only send once (track via metadata) ──
            const warningMonth = user.user_metadata?.warned_75_month;
            const thisMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

            if (percentage >= 75 && percentage < 100 && warningMonth !== thisMonth) {
                await sendUsageWarningEmail({
                    toEmail: user.email,
                    userName,
                    used: count,
                    cap: MONTHLY_CAP,
                    resetDate,
                });
                // Mark this month as warned
                await supabase.auth.admin.updateUserById(user.id, {
                    user_metadata: { ...user.user_metadata, warned_75_month: thisMonth },
                });
                results.warning75Sent++;
            }

            // ── 100% limit reached — only send once per month ──
            const limitMonth = user.user_metadata?.limit_email_month;
            if (percentage >= 100 && limitMonth !== thisMonth) {
                await sendUsageLimitEmail({
                    toEmail: user.email,
                    userName,
                    used: count,
                    cap: MONTHLY_CAP,
                    resetDate,
                });
                await supabase.auth.admin.updateUserById(user.id, {
                    user_metadata: {
                        ...user.user_metadata,
                        limit_email_month: thisMonth,
                        limit_hit_date: now.toISOString(),
                        last_limit_month: `${now.getFullYear()}-${now.getMonth() + 1}`,
                    },
                });
                results.limitSent++;
            }

            // ── 3-day follow-up after limit hit ──
            const limitHitDate = user.user_metadata?.limit_hit_date;
            const followupSentMonth = user.user_metadata?.followup_sent_month;
            if (limitHitDate && followupSentMonth !== thisMonth) {
                const daysSinceLimit = (now.getTime() - new Date(limitHitDate).getTime()) / (1000 * 60 * 60 * 24);
                if (daysSinceLimit >= 3 && percentage >= 100) {
                    await sendUpgradeFollowupEmail({ toEmail: user.email, userName, resetDate });
                    await supabase.auth.admin.updateUserById(user.id, {
                        user_metadata: { ...user.user_metadata, followup_sent_month: thisMonth },
                    });
                    results.followupSent++;
                }
            }
        } catch (err) {
            console.error(`Usage email error for user ${user.id}:`, err);
            results.errors++;
        }
    }

    return NextResponse.json({ success: true, ...results });
}
