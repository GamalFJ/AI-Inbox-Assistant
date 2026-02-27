# 🗺️ Product Roadmap — AI Inbox Assistant

> **Last Updated:** February 26, 2026
> **Strategy basis:** See `Growth Economics.md` for the full economic rationale behind this roadmap.
> **Principle:** Ship fast, be transparent, never surprise paying users.

---

## The Combined Strategy at a Glance

```
NOW                        ~6 MONTHS              ~12 MONTHS+
|--------------------------|----------------------|-------------------->
  FOUNDING MEMBER PHASE      GROWTH PHASE           SCALE PHASE
  $19.99 lifetime            $24–29/mo new users    Pro tier features
  200 leads/month (soft)     Founders: lifetime     Teams, Calendar, CRM
  Full transparency UI       Transparent migration  Fully sustainable MRR
  4-level warning system     Usage nudge emails     Founders get Pro discount
```

All three strategies from `Growth Economics.md` run simultaneously:
- **Strategy 1** (Founding Member Window) → Public pricing narrative + urgency
- **Strategy 2** (Lifetime + Pro Hybrid) → Future monetization for lifetime users
- **Strategy 3** (Transparent Meter + Nudge) → Operational safety net in-app

---

## Phase 1 — Foundation Transparency *(Active — Feb 2026)*

> Goal: Build and ship the transparency infrastructure before acquiring any significant user base. Every new user sees exactly what they're getting.

### Milestone 1.1 — Usage Tracking Backend ✅ In Progress
- [ ] `GET /api/usage` — returns current month lead count, cap (200), percentage, level
- [ ] Cap enforcement in `POST /api/process-lead` — finish the current lead, then soft-pause
- [ ] Cap enforcement in `POST /api/webhook/ingest` — same behavior
- [ ] Monthly reset logic (auto-resume on 1st of month)

### Milestone 1.2 — 4-Level Warning System (UI) ✅ In Progress
- [ ] `UsageMeter` component — progress bar with lead count (e.g., "142 / 200 leads")
- [ ] Level 1 banner (50% used) — informational blue
- [ ] Level 2 banner (75% used) — awareness amber
- [ ] Level 3 banner (90% used) — warning orange + upgrade CTA
- [ ] Level 4 banner (100% used) — limit orange-red + reset date + upgrade CTA
- [ ] Banners never block UI or interrupt editing

### Milestone 1.3 — Email Notification Sequences ✅ In Progress
- [ ] Usage at 75% → automated heads-up email via Resend
- [ ] Usage at 100% → immediate limit email with reset date
- [ ] Monthly reset → confirmation email ("Your leads are flowing again")
- [ ] 3-day follow-up after hitting limit → Founding Member upgrade offer

### Milestone 1.4 — Public Roadmap Page ✅ In Progress
- [ ] `/roadmap` page — public, no auth required
- [ ] Shows shipped features, active development, planned features
- [ ] Users can see exactly what is being built and when
- [ ] Founding Member badge/callout explaining the pricing model

### Milestone 1.5 — Founding Member Messaging ✅ In Progress
- [ ] Landing page updated with Founding Member copy + counter
- [ ] Post-purchase email updated with full transparency language
- [ ] In-app onboarding updated to reference Founding Member benefits

---

## Phase 2 — Product Stickiness *(Target: Mar–Apr 2026)*

> Goal: Add features that make users come back daily, reduce churn, and increase the value delivered by the core product.

### Milestone 2.1 — Lead Stages (Lightweight CRM)
- [ ] Add `stage` column to `leads` table: `new | contacted | negotiating | closed | lost`
- [ ] Stage pill selector in the `LeadDetails` view
- [ ] Stage filter in the `LeadList` sidebar
- [ ] Stage shown on lead cards for instant triage

### Milestone 2.2 — Thread Summarization
- [ ] "Catch me up" button in `LeadDetails` — condenses full thread into 3–5 bullets
- [ ] Reuses AI utility with a summarize prompt
- [ ] Works on the original lead body (no thread fetching needed at this stage)

### Milestone 2.3 — Booking Link Auto-Detect
- [ ] Scan lead body for scheduling-intent keywords ("when are you free", "book a call", etc.)
- [ ] Badge on lead card: "📅 Scheduling intent detected"
- [ ] Auto-suggest inserting `booking_link` into the active draft

### Milestone 2.4 — Lead Hot Score
- [ ] Compute urgency score (1–5) based on: keywords, tone, lead classification, response time
- [ ] Fire icon indicator on lead cards
- [ ] Sort by hot score option in the lead list

---

## Phase 3 — General Availability & Subscription Launch *(Target: ~6 months from now)*

> Goal: Close the Founding Member window. Open to the public on a monthly subscription. Migrate heaviest users to subscription proactively and with full notice.

### Milestone 3.1 — Subscription Infrastructure
- [ ] Integrate Stripe (or upgrade PayPal) for recurring billing
- [ ] Create subscription plans: Standard ($24/mo), Pro ($29/mo)
- [ ] Founding Member rate protection: grandfathered at $0/mo for core, $9–14/mo for Pro add-on
- [ ] Billing portal: users can view/manage/cancel subscription
- [ ] Webhook handler for subscription events (created, cancelled, past_due)

### Milestone 3.2 — Founding Member Sunset
- [ ] Remove $19.99 lifetime option from public landing page
- [ ] Existing Founding Members: no change, ever
- [ ] New users see monthly pricing
- [ ] Email to all Founding Members: "Thank you — here is a summary of your lifetime benefits"

### Milestone 3.3 — Usage Cap Migration
- [ ] Remove hard 200-lead cap for subscribers (no cap on paid plans)
- [ ] Retain cap for Founding Members: 200/mo (or raise to 300/mo as thank-you)
- [ ] Admin dashboard shows cap usage across all users

---

## Phase 4 — Pro Tier Features *(Target: ~12 months from now)*

> Goal: Build premium features that justify the Pro tier and give Founding Members an exclusive upgrade path.

### Milestone 4.1 — Team Inbox (Pro)
- [ ] `teams` + `team_members` tables
- [ ] Shared inbox view for all team members
- [ ] Lead assignment with assignee avatars
- [ ] Team settings: invite by email, roles (owner/admin/member)

### Milestone 4.2 — Calendar Integration (Pro)
- [ ] Calendly / Cal.com embed in AI draft replies
- [ ] Auto-detect scheduling intent + one-click insert
- [ ] Google Calendar OAuth (create events from leads)

### Milestone 4.3 — CRM Sync (Pro)
- [ ] CSV export (available to all)
- [ ] Airtable native integration
- [ ] HubSpot integration
- [ ] Zapier / Make.com webhook connector

### Milestone 4.4 — Gmail OAuth (Pro / All after verification)
- [ ] Google OAuth verification (budget $5K–$15K, 4–12 week timeline)
- [ ] "Connect My Inbox" button — reads Gmail directly, no webhook setup needed
- [ ] Reduces onboarding friction to near-zero for Gmail users

---

## Pricing Evolution Summary

| Period | New User Price | Founding Member | Cap | Notes |
|---|---|---|---|---|
| Now → ~6 months | $19.99 lifetime | — (is the offer) | 200/mo | Founding window open |
| ~6 months | $24/mo Standard | Lifetime locked | 200/mo (or 300 as thank-you) | Window closes |
| ~12 months | $29/mo Pro | Add-on: $9–14/mo | Uncapped on paid | Pro tier features ship |

---

## Transparency Commitments (Public Promises)

These are written here as a record of what has been publicly promised to users. **Never break these.**

1. **$19.99 Founding Members keep lifetime access to the core product** — forever, no exceptions.
2. **No lead is ever silently dropped.** If a user hits their cap, the current lead finishes processing. New leads queue until the next month or an upgrade.
3. **Users always see their usage.** The dashboard shows the usage meter at all times.
4. **Users are warned at 50%, 75%, 90%, and 100% of their cap** — never surprised at a wall.
5. **The reset date is always visible.** Users can always choose to wait instead of upgrading.
6. **Pro features are optional upgrades, not feature removals.** The existing product never gets worse for Founding Members.

---

*— Roadmap v1.0, February 26, 2026*
