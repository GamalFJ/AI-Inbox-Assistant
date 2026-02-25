import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { Resend } from "resend";

/**
 * GET /api/cron/overdue-task-alerts
 *
 * Runs once per day (scheduled in vercel.json).
 * Targeted at users who have overdue follow-up tasks.
 *
 * This fills the gap where a user might not login to the dashboard
 * for a few days and misses their follow-up window.
 */

export async function GET(req: NextRequest) {
    // ─── Auth ────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const now = new Date();

    try {
        // 1. Fetch ALL pending tasks that are past their due date
        // Join with leads to get the subject/context
        const { data: overdueTasks, error: tasksError } = await supabase
            .from("tasks")
            .select(`
                *,
                leads (
                    email_from,
                    subject
                )
            `)
            .eq("status", "pending")
            .lt("due_at", now.toISOString());

        if (tasksError) throw tasksError;

        if (!overdueTasks || overdueTasks.length === 0) {
            return NextResponse.json({ success: true, message: "No overdue tasks found." });
        }

        // 2. Group tasks by user_id
        const tasksByUser: Record<string, any[]> = {};
        for (const task of overdueTasks) {
            if (!tasksByUser[task.user_id]) tasksByUser[task.user_id] = [];
            tasksByUser[task.user_id].push(task);
        }

        const emailResults: { user_id: string; status: string; error?: string }[] = [];

        // 3. For each user with overdue tasks, send one summary email
        for (const [userId, tasks] of Object.entries(tasksByUser)) {
            try {
                // Get user business email from profile
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("business_email")
                    .eq("id", userId)
                    .single();

                const targetEmail = profile?.business_email;

                if (!targetEmail) {
                    emailResults.push({ user_id: userId, status: "skipped", error: "No business email found" });
                    continue;
                }

                const taskListHtml = tasks.map(t => `
                    <li style="margin-bottom: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; list-style: none; background: #fff">
                        <div style="font-weight: 600; color: #1e293b; font-size: 14px">${t.title}</div>
                        <div style="color: #64748b; font-size: 13px; margin-top: 4px">
                            Lead: <strong>${t.leads?.subject || "No Subject"}</strong> (${t.leads?.email_from})
                        </div>
                        <div style="color: #ef4444; font-size: 12px; margin-top: 4px; font-weight: 500">
                            Due: ${new Date(t.due_at).toLocaleDateString()}
                        </div>
                    </li>
                `).join("");

                const html = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px">
                        <div style="background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)">
                            <h2 style="color: #0f172a; margin-top: 0">Don't lose your leads! 🕒</h2>
                            <p style="color: #475569; line-height: 1.6">You have <strong>${tasks.length} overdue follow-up tasks</strong> that need your attention. Responding quickly increases your chances of closing the deal.</p>
                            
                            <ul style="padding: 0; margin: 24px 0">
                                ${taskListHtml}
                            </ul>

                            <div style="margin-top: 32px; text-align: center">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.com'}/dashboard" 
                                   style="background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block">
                                   Open Dashboard
                                </a>
                            </div>
                        </div>
                        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px">
                            Sent by AI Inbox Assistant · Managed by you
                        </p>
                    </div>
                `;

                await resend.emails.send({
                    from: "AI Assistant <reminders@yourdomain.com>",
                    to: targetEmail,
                    subject: `🕒 You have ${tasks.length} overdue follow-ups`,
                    html,
                });

                emailResults.push({ user_id: userId, status: "sent" });

            } catch (err: any) {
                emailResults.push({ user_id: userId, status: "error", error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            processed_users: Object.keys(tasksByUser).length,
            details: emailResults
        });

    } catch (error: any) {
        console.error("Overdue tasks cron error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
