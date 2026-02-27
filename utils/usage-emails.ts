import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

interface UsageEmailOptions {
    toEmail: string;
    userName?: string;
    used: number;
    cap: number;
    resetDate: string; // ISO string
}

function formatResetDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

// ─── 75% Warning Email ────────────────────────────────────────────────────────
export async function sendUsageWarningEmail({ toEmail, userName, used, cap, resetDate }: UsageEmailOptions) {
    const remaining = cap - used;
    const resetFormatted = formatResetDate(resetDate);

    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: `📬 You're doing great — a heads up on your lead volume`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 4px rgba(0,0,0,0.07);">
    <div style="font-size: 28px; margin-bottom: 8px;">📬</div>
    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">You're processing a lot of leads — nice work.</h1>
    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Hey${userName ? ` ${userName}` : ""}, you've processed <strong>${used} of your ${cap} monthly leads</strong> so far this month. You have <strong>${remaining} leads remaining</strong> before your Founding Member monthly limit.
    </p>

    <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 8px;">
        <span>Used this month</span>
        <span><strong>${used} / ${cap}</strong></span>
      </div>
      <div style="background: #e2e8f0; border-radius: 99px; height: 8px; overflow: hidden;">
        <div style="background: #f59e0b; height: 100%; width: ${Math.round((used / cap) * 100)}%; border-radius: 99px;"></div>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 8px 0 0;">Resets on ${resetFormatted}</p>
    </div>

    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
      If you're growing fast, now is a good time to know: when you hit your limit, your leads are <strong>never dropped</strong>. They'll automatically resume processing on ${resetFormatted}. Or, if you'd rather keep the momentum going, you can upgrade to remove the cap.
    </p>

    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">Go to Dashboard</a>

    <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">
      You're a Founding Member of AI Inbox Assistant. This is your usage heads-up — we never want to surprise you with a limit.
    </p>
  </div>
</body>
</html>`,
    });
}

// ─── 100% Limit Reached Email ─────────────────────────────────────────────────
export async function sendUsageLimitEmail({ toEmail, userName, used, cap, resetDate }: UsageEmailOptions) {
    const resetFormatted = formatResetDate(resetDate);

    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: `⚠️ You've hit your monthly lead limit — here's what happens next`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 4px rgba(0,0,0,0.07);">
    <div style="font-size: 28px; margin-bottom: 8px;">⚠️</div>
    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">You've reached your ${cap} leads/month limit</h1>
    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Hey${userName ? ` ${userName}` : ""}, you've processed all <strong>${used} leads</strong> included in your Founding Member plan this month. Here's the important part:
    </p>

    <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="font-size: 14px; color: #9a3412; font-weight: 600; margin: 0 0 8px;">What happens now:</p>
      <ul style="font-size: 14px; color: #9a3412; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Any lead currently being processed will <strong>finish normally</strong> — nothing is dropped.</li>
        <li>New leads arriving via webhook will be <strong>saved but not AI-processed</strong> until next month.</li>
        <li>Your leads and all your data are <strong>completely safe</strong>.</li>
        <li>Processing automatically resumes on <strong>${resetFormatted}</strong>.</li>
      </ul>
    </div>

    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
      You don't have to do anything if you're okay waiting. Or if your business is growing and you need more capacity now, you can upgrade to a plan with no monthly cap.
    </p>

    <div style="display: flex; gap: 12px;">
      <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">View Dashboard</a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">
      As a Founding Member, your $19.99 lifetime access is locked in forever. This limit is part of the fair-use policy we outlined when you signed up.
    </p>
  </div>
</body>
</html>`,
    });
}

// ─── Monthly Reset Email ──────────────────────────────────────────────────────
export async function sendUsageResetEmail({ toEmail, userName, cap }: { toEmail: string; userName?: string; cap: number }) {
    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: `🎉 Your lead limit has reset — you're good to go`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 4px rgba(0,0,0,0.07);">
    <div style="font-size: 28px; margin-bottom: 8px;">🎉</div>
    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Your leads are flowing again</h1>
    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Hey${userName ? ` ${userName}` : ""}! Your monthly lead counter has reset. You have a fresh <strong>${cap} leads</strong> available this month. Any leads that were saved-but-paused last month have been queued for processing.
    </p>

    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">Open Dashboard →</a>

    <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">
      This is your monthly reset notification from AI Inbox Assistant.
    </p>
  </div>
</body>
</html>`,
    });
}

// ─── 3-Day Follow-up After Limit ─────────────────────────────────────────────
export async function sendUpgradeFollowupEmail({ toEmail, userName, resetDate }: { toEmail: string; userName?: string; resetDate: string }) {
    const resetFormatted = formatResetDate(resetDate);

    await resend.emails.send({
        from: FROM_EMAIL,
        to: toEmail,
        subject: `💡 Still hitting limits? Here's your Founding Member upgrade offer`,
        html: `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 4px rgba(0,0,0,0.07);">
    <div style="font-size: 28px; margin-bottom: 8px;">💡</div>
    <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">You're growing — and that's great news.</h1>
    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Hey${userName ? ` ${userName}` : ""}, you hit your monthly lead limit recently. Your processing resumes on <strong>${resetFormatted}</strong>, so you're covered regardless.
    </p>
    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      But if your business is consistently generating this many leads, you've outgrown the Founding Member tier — which honestly is a great problem to have.
    </p>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="font-size: 14px; color: #166534; font-weight: 600; margin: 0 0 8px;">Your Founding Member upgrade offer:</p>
      <ul style="font-size: 14px; color: #166534; margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>No monthly lead cap</li>
        <li>Priority AI processing</li>
        <li>Early access to Pro features (teams, calendar, CRM)</li>
        <li><strong>Exclusive Founding Member rate</strong> — discounted vs. public pricing</li>
      </ul>
    </div>

    <p style="color: #64748b; font-size: 13px; margin: 0 0 24px; font-style: italic;">
      This offer is only available to Founding Members. New users joining after the founding window closes will pay our standard public rate — you'll always pay less.
    </p>

    <a href="${APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">Learn More →</a>

    <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">
      AI Inbox Assistant — built for people who mean business.
    </p>
  </div>
</body>
</html>`,
    });
}
