# 🔬 R&D Log — AI Inbox Assistant

> **Purpose:** A living document that captures all research, competitive analysis, strategic decisions, and development insights for the AI Inbox Assistant project.
> **Last Updated:** February 26, 2026

---

## 📋 Table of Contents

1. [Market Research — February 26, 2026](#1-market-research--february-26-2026)
   - [Competitive Landscape](#11-competitive-landscape)
   - [User Pain Points](#12-user-pain-points)
   - [Gap Analysis — Where We Fit](#13-gap-analysis--where-we-fit)
   - [MVP Assessment](#14-mvp-assessment)
   - [Feature Prioritization](#15-feature-prioritization)
   - [Pricing Benchmarks](#16-pricing-benchmarks)
2. [Strategic Insights — Why Competitors Stay in Their Lane](#2-strategic-insights--why-competitors-stay-in-their-lane)
   - [The Real Answer: It's Not Just Cost](#21-the-real-answer-its-not-just-cost)
   - [Barrier #1 — Gmail API & Google's Compliance Wall](#22-barrier-1--gmail-api--googles-compliance-wall)
   - [Barrier #2 — Product Scope Creep Trap](#23-barrier-2--product-scope-creep-trap)
   - [Barrier #3 — AI Infrastructure Cost](#24-barrier-3--ai-infrastructure-cost)
   - [Barrier #4 — The VC/Investor Incentive Problem](#25-barrier-4--the-vcinvestor-incentive-problem)
   - [Why Your Approach Avoids Most of These Problems](#26-why-your-approach-avoids-most-of-these-problems)
3. [Feature Decision — Multiple Draft Variants — February 26, 2026](#3-feature-decision--multiple-draft-variants--february-26-2026)
4. [Pricing Economics — $19.99 Lifetime Analysis — February 26, 2026](#4-pricing-economics--1999-lifetime-analysis--february-26-2026)

---

## 1. Market Research — February 26, 2026

### 1.1 Competitive Landscape

#### Tier 1 — Full Email Clients (Direct Competitors)

| Tool | Core Value Prop | Target User | Pricing | Key Weakness |
|---|---|---|---|---|
| **Superhuman** | Blazing-fast, keyboard-first inbox with AI triage & writing | Power users / executives | $30/user/mo | Expensive, no automation, Gmail+Outlook only |
| **Shortwave** | Gmail-native AI search, summarization, "Ghostwriter" replies | Gmail users / small teams | $14–$18/user/mo | Gmail-only, steep learning curve |
| **Missive** | Shared inboxes + AI drafting for teams | Customer-facing teams | ~$18/user/mo | Heavy, team-oriented, not solo-focused |

#### Tier 2 — Inbox Organization & Filtering

| Tool | Core Value Prop | Target User | Pricing | Key Weakness |
|---|---|---|---|---|
| **SaneBox** | AI-powered email sorting/prioritization | Any email user | $7–$36/mo | No generative AI, just organization |
| **Clean Email** | Bulk cleanup, smart filters | Inbox-overwhelmed users | ~$10/mo | No AI drafting at all |

#### Tier 3 — AI Writing & Workflow Assistants

| Tool | Core Value Prop | Target User | Pricing | Key Weakness |
|---|---|---|---|---|
| **Flowrite** | AI email/message writing from bullet points | Freelancers, marketers | $5–$30/mo | No lead management, no pipeline |
| **Lindy AI** | Custom AI agents (email, scheduling, lead qual) | Ops-heavy teams | $20–$50/mo | Complex setup, credit system opaque |
| **SalesBlink** | Cold email campaigns + BlinkGPT AI outreach | Sales teams | $25–$199/mo | Outbound-only, no inbound pipeline |
| **Lavender** | AI coaching for sales email reply rates | Sales reps | ~$29/mo | Sales-only, no inbound lead management |

#### Tier 4 — Big Tech / Native AI

| Tool | Core Value Prop | Target User | Pricing |
|---|---|---|---|
| **Gemini for Gmail** | Deep Gmail integration, contextual drafts | Google Workspace users | $19.99/mo (Workspace) |
| **Microsoft Copilot (Outlook)** | AI writing inside Outlook | Microsoft 365 users | $9.99/mo add-on |

---

### 1.2 User Pain Points

Collected from Reddit, G2, Capterra, ProductHunt, and user reviews across all above tools.

#### 🔴 Critical (drives churn)

1. **Setup is too complex** — Non-technical users abandon at webhook/API config.
2. **AI doesn't understand MY business** — Generic drafts. No brand voice learning.
3. **Locked to one email provider** — Shortwave is Gmail-only. Outlook users left out.
4. **Unpredictable pricing** — Credit-based systems (Lindy) cause surprise bills.
5. **No lead context in drafts** — Can't tell if it's a new lead, client, or spam.
6. **No follow-up automation** — Drafts fire and disappear. Nothing reminds you to follow up.
7. **AI drafts are generic** — Users rewrite everything. Defeats the purpose.

#### 🟡 Moderate (causes frustration)

8. **Can't send from the tool** — Must go back to Gmail/Outlook to send.
9. **No AI explainability** — Users don't know *why* an email was classified a certain way.
10. **No analytics** — Can't justify subscription cost without data ("am I saving time?").
11. **Spam/noise still floods the inbox** — Real leads get buried.
12. **No mobile experience** — Desktop-only tools feel incomplete.

#### 🟢 Feature Requests ("I wish it could...")

13. **Auto-insert booking link** — Detect scheduling intent, insert Calendly link.
14. **Thread summarization** — "Catch me up on this thread in 3 bullets."
15. **CRM sync** — Push leads to HubSpot, Airtable, Notion.
16. **Multiple draft options** — Show 2-3 tones (Formal / Casual / Short).
17. **Multi-language support** — Especially for global freelancers.
18. **Attachment parsing** — Understand what's in a PDF attached to an email.

---

### 1.3 Gap Analysis — Where We Fit

Most competitors specialize in **one** of three things:

```
SaneBox, Clean Email     →  Organize only (no AI drafts)
Flowrite, Grammarly      →  Write only (no lead pipeline)
SalesBlink, Lavender     →  Outbound only (not inbound leads)
Superhuman, Shortwave    →  Full email client (high switching cost)
```

**We are one of the very few tools that do all three:**
> **Inbound lead capture → AI classification → Tone-matched draft generation → Approve & Send + follow-up tasks**

#### Our Unfair Advantages Today
- ✅ **Provider-agnostic ingestion** — Webhook works with Postmark, Mailgun, Resend, Zapier
- ✅ **Lead classification** — AI labels New Lead / Client / Spam automatically
- ✅ **Follow-up task scheduling** — Auto-creates 2-day / 7-day touchpoints
- ✅ **Approve & Send** — Full loop in one screen (draft → edit → send)
- ✅ **Draft history + versioning** — Something even Superhuman doesn't offer
- ✅ **Analytics with "hours saved"** — Competitors mostly ignore this
- ✅ **Tone training** — 3-5 example replies teach the AI brand voice

#### Our Current Gaps vs. Competitors
- ❌ **No Gmail/Outlook OAuth** — Webhook setup is a friction barrier for non-technical users
- ❌ **No thread summarization** — Can't catch up on back-and-forth threads
- ❌ **Single draft only** — No multi-tone options
- ❌ **No CRM export** — Leads are siloed in the app
- ❌ **No "snooze" / lead stages** — No lightweight CRM pipeline
- ❌ **No spam/noise suppression UI** — Spam classified but not cleanly separated

---

### 1.4 MVP Assessment

| Category | Feature | Status | MVP Priority |
|---|---|---|---|
| **Core AI** | AI draft generation | ✅ Built | Critical |
| **Core AI** | Lead classification (New/Client/Spam) | ✅ Built | Critical |
| **Core AI** | Tone training via example replies | ✅ Built | High |
| **Ingestion** | Webhook ingest (universal) | ✅ Built | Critical |
| **Ingestion** | Polling cron fallback | ✅ Built | High |
| **Sending** | Approve & Send (Resend) | ✅ Built | Critical |
| **UX** | Single-screen inbox dashboard | ✅ Built | Critical |
| **UX** | Task list / follow-up reminders | ✅ Built | High |
| **UX** | Draft edit history & versioning | ✅ Built | Medium |
| **Analytics** | Hours saved, leads processed, 7-day chart | ✅ Built | Medium |
| **Settings** | AI profile, webhook config, domain setup | ✅ Built | High |
| **Auth** | Supabase Auth + protected routes | ✅ Built | Critical |
| **Payments** | PayPal one-time purchase | ✅ Built | Critical |
| **Admin** | Usage monitoring & alerts | ✅ Built | Medium |

> **Verdict: Fully functional MVP. The critical loop works end-to-end. This is more than most SaaS products launch with.**

---

### 1.5 Feature Prioritization

Ranked by **impact vs. effort**:

#### 🔥 High Impact, Low Effort (Do First)

| # | Feature | Effort | Why |
|---|---|---|---|
| 1 | ~~**Multiple Draft Options** (Formal/Casual/Short)~~ | ✅ **SHIPPED — Feb 26, 2026** | Was #1 complaint about all AI email tools |
| 2 | **Lead Stages** (New → Contacted → Negotiating → Closed) | ~1 day | Lightweight CRM, massive stickiness boost |
| 3 | **Thread Summarization** ("3-bullet catch-up") | ~0.5 day | Shortwave charges $14/mo just for this |
| 4 | **Booking Link Auto-Insert** (detect scheduling intent) | ~0.5 day | Uses data we already store from onboarding |
| 5 | **Lead "Hot Score"** (urgency indicator 1–5🔥) | ~1 day | Instant triage, Superhuman charges $30/mo for this |
| 6 | **Email Preview on Hover** | ~0.5 day | Reduces clicks, feels premium |

#### 📈 High Impact, Medium Effort (Do Next)

| # | Feature | Effort | Why |
|---|---|---|---|
| 7 | **Gmail OAuth** ("Connect My Inbox" button) | 2–4 days + Google verification | Removes #1 setup barrier |
| 8 | **CSV Export / Airtable sync** | 0.5–2 days | Reduces churn anxiety |
| 9 | **Snooze / Lead Archiving** | ~1.5 days | Prevents inbox blindness |
| 10 | **Spam/Noise Quarantine View** | ~1 day | SaneBox charges $7-36/mo for this alone |

#### 🔮 Future / Upsell (Correctly Shelved)

- **Team / Multi-user shared inbox** — Pro plan upsell
- **Fine-tuned / Custom AI models** — Enterprise upsell
- **Calendar integration (Calendly, Google Cal)** — Pro plan upsell
- **Outlook / Microsoft 365 OAuth** — After Gmail OAuth is stable
- **Zapier / n8n native integration** — Could be a free distribution channel

---

### 1.6 Pricing Benchmarks

| Tool | Monthly Price | What You Get |
|---|---|---|
| SaneBox | $7–$36/mo | Just sorting. No AI drafts. |
| Flowrite | $5–$30/mo | Just AI writing. No lead pipeline. |
| Shortwave | $14–$18/mo | Gmail-only. No follow-up tasks. |
| Superhuman | $30/mo | Speed + AI. No automation/pipeline. |
| Lindy | $20–$50/mo | Complex. Opaque credit billing. |
| **Our App** | (One-time currently) | Lead capture + AI drafts + classification + tasks + send |

> **Recommendation:** A **$29–$49/mo subscription** is well-justified by the market. Consider a hybrid model: a higher-priced lifetime deal for early adopters + monthly subscription for ongoing users.

---

## 2. Strategic Insights — Why Competitors Stay in Their Lane

*Research Date: February 26, 2026*

### 2.1 The Real Answer: It's Not Just Cost

The short answer is: **yes, cost is a factor — but it's one of at least four compounding barriers** that together make building what we're building much harder than it looks from the outside. Here's a breakdown of each.

---

### 2.2 Barrier #1 — Gmail API & Google's Compliance Wall 🧱

This is the single biggest structural reason most email tools stay narrow.

To read a user's Gmail inbox in a public-facing app, Google requires you to pass a formal verification process for **"restricted scopes"** (`gmail.readonly`, `gmail.modify`, etc.). This is not optional for a public SaaS.

**What the verification actually involves:**
- Completing a **Cloud Application Security Assessment (CASA)** — a mandatory third-party security audit
- Submitting detailed documentation and a YouTube demo video showing exactly how you use each scope
- Annual **re-verification** once approved
- Total timeline: typically **4–12 weeks**, sometimes more

**What it costs:**
| App Size | Estimated CASA Cost |
|---|---|
| Small / Early-stage | $5,000 – $15,000 |
| Medium | $15,000 – $30,000 |
| Large/Complex | $30,000 – $75,000+ |

> One developer in a June 2025 Reddit thread reported read/write Gmail scopes triggering a CASA audit costing **$900–$4,500** plus **3–4 weeks** of back-and-forth with Google. Smaller estimates can apply at the lower end for basic implementations, but legal, security testing, and insurance layer on top.

**The result:** Most indie developers and small SaaS teams hit this wall and make one of two choices:
- Build a **Chrome extension** instead (avoids the Gmail API entirely by running in the browser)
- Stay **outbound-only** (SalesBlink, Lavender) or **writing-only** (Flowrite) so they never need to *read* the inbox

**Our advantage:** Because we use a webhook-based ingestion model (emails are *forwarded* to us rather than us *reading* Gmail), we completely bypass this compliance wall. We don't touch Gmail's API at all until a user specifically asks for the OAuth connection.

---

### 2.3 Barrier #2 — Product Scope Creep Trap 🪤

Building a full-loop product (inbox → classify → draft → send → follow-up) means touching five distinct engineering domains at once:

1. **Email protocol** (IMAP/SMTP or provider-specific APIs)
2. **AI/NLP** (classification, generation, tone matching)
3. **Pipeline/CRM logic** (stages, tasks, reminders)
4. **Email delivery** (SPF/DKIM/DMARC, deliverability, bounces)
5. **Analytics** (aggregation, charting, usage metrics)

For a well-funded company, building all five is feasible but **slow**. For most indie teams, it means spending 12–18 months before having anything to show users, which drains runway and kills momentum.

The typical startup playbook says: **pick one domain, do it exceptionally, and expand later.** That's why:
- SaneBox became the best email sorting tool (just domain 1)
- Flowrite became the best email writing tool (just domain 2)
- Superhuman became the best email client UX (focused entirely on speed + UX)

None of them tried to be all five at once. You're doing all five because you built it systematically over 9 phases — which is actually a strength as long as the core loop is tight.

---

### 2.4 Barrier #3 — AI Infrastructure Cost 💸

Every AI-generated draft has a cost. The economics look like this:

| Model | Cost per 1M tokens (approx.) | Cost per ~500-word email draft |
|---|---|---|
| GPT-4o | ~$5 input / $15 output | ~$0.01–$0.03 per draft |
| Claude Sonnet 3.5 | ~$3 input / $15 output | ~$0.01–$0.02 per draft |
| GPT-3.5 Turbo | ~$0.50 / $1.50 | ~$0.001 per draft |

At scale (say, 10,000 users, 5 emails/day each):
- **GPT-4o:** ~$500–$1,500/day in AI costs alone
- **GPT-3.5:** ~$25–$50/day

This is why competitors often:
- Use weaker models by default (faster, cheaper, but generic output)
- Charge per-email or per-credit (Lindy's model)
- Gate advanced AI behind high-priced plans ($30–$50/mo)

**Our situation now:** We're using whatever model is configured, and at MVP scale (a few hundred users), costs are trivial. This is the right stage to be experimenting freely. As we grow, switching to a tiered model (cheaper model by default, GPT-4o/Claude for premium) is a clean upgrade path.

---

### 2.5 Barrier #4 — The VC/Investor Incentive Problem 🏦

This is less obvious but affects the competitive landscape significantly.

Most funded email AI startups (Superhuman raised $75M+, Shortwave raised significant VC rounds) are pushed by investors to pursue **enterprise contracts** — big B2B deals at $30+/user/mo with hundreds or thousands of seats.

This means their product roadmaps systematically **ignore solo entrepreneurs, freelancers, and small business owners** — exactly our target market. The math doesn't work for them: acquiring 1,000 solo users at $10/mo = $10K MRR. One enterprise contract = $15K MRR. They chase the enterprise deal every time.

This is actually an enormous market opportunity for a bootstrapped or small-team product. The solo service provider market (freelancers, consultants, coaches, agencies under 5 people) is huge, underserved, and willing to pay for tools that make them look more professional.

---

### 2.6 Why Our Approach Avoids Most of These Problems

| Barrier | Industry's Problem | Our Approach |
|---|---|---|
| Gmail Compliance Wall | Must pass CASA audit ($5K–$75K) to read Gmail | Webhook-based ingestion bypasses Gmail API entirely. No audit needed today. |
| Scope Creep | Trying to build all 5 domains at once stalls teams | Built 9 phases systematically. Core loop is tight before expanding. |
| AI Cost | At scale, AI costs become significant | MVP volume is low. Built-in cost controls (cron limits, usage monitor). Ready to tier later. |
| VC Incentives | Investors push toward enterprise, ignoring solopreneurs | Bootstrapped / small team. Can own the solo market without investor pressure. |

> **Bottom line:** The barriers that keep competitors from building this are mostly rooted in Google's compliance requirements, the cognitive overhead of managing five engineering domains at once, and the investor pressure to chase enterprise. We've cleverly bypassed the first two by design. Our webhook approach is not just a workaround — it's a genuine architectural advantage for an MVP.

---

*— End of R&D Log Entry #1, February 26, 2026*

---

## 3. Feature Decision — Multiple Draft Variants — February 26, 2026

### Decision
Implement 3-tone parallel draft generation (Formal / Casual / Short) as the first user-facing feature addition post-MVP.

### Rationale
- **#1 user complaint** across all AI email tools: "the draft is too generic and I end up rewriting it anyway"
- Directly battles that complaint by giving users *choice* rather than a single output
- Reuses all existing infrastructure (AI utility, drafts table, DraftPanel) — no new services or database tables beyond a single column addition
- Parallel calls mean no extra latency vs. sequential — all 3 arrive in roughly the same time as 1

### Cost Impact
| Scenario | AI Calls/Month | Est. Monthly AI Cost (GPT-4o) | Break-even from $19.99 |
|---|---|---|---|
| Light user (20 leads) | 60 | ~$0.42 | ~4 years |
| Average user (60 leads) | 180 | ~$1.26 | ~16 months |
| Heavy user (200 leads) | 600 | ~$4.20 | ~5 months |
| Capped user (300 leads) | 900 | ~$6.30 | ~3 months |

> **Verdict:** Fine for light and average users. Heavy users at or near the 300-lead cap need to be migrated to a subscription tier within ~3 months of becoming active. The Usage Monitor already flags these users.

### Implementation Summary
- `generateDraftVariants()` in `utils/ai.ts` — 3 parallel GPT-4o calls
- `POST /api/process-lead` — deletes old drafts, inserts 3 variants with `tone_variant` column
- `DraftPanel.tsx` — 3-tab selector, per-variant edit + auto-save + history
- DB Migration: `supabase/migrations/add_tone_variant.sql`

---

## 4. Pricing Economics — $19.99 Lifetime Analysis — February 26, 2026

### Context
Current pricing: USD 19.99 one-time lifetime payment. Detailed growth strategies documented separately in `Growth Economics.md`.

### Per-User Cost Structure
All costs are **usage-triggered** — zero cost for inactive users.

| Service | Trigger | Free Tier | Paid Tier |
|---|---|---|---|
| OpenAI GPT-4o | Per AI call (on lead processing only) | None | ~$0.007/call |
| Supabase | Per row / storage | 50K rows, 500MB | $25/mo (at scale) |
| Resend | Per email sent | 100/day | $20/mo for 50K |
| Vercel | Per serverless invocation | Hobby covers MVP | Pro ~$20/mo |

### Safe Operating Window
At current pricing, the app is cost-safe for:
- Users receiving **up to ~200 leads/month** for up to **~2 years** (GPT-4o, 3 drafts per lead)
- Users receiving **up to ~100 leads/month** indefinitely on cheaper models (GPT-4o-mini, Claude Haiku)

### Key Risk
The $19.99 one-time model is **not sustainable indefinitely** for heavy users. A documented transition to subscription pricing is required. See `Growth Economics.md` for full strategy.

### Recommendation Logged
- Hold $19.99 lifetime for early-adopter window (first 100–200 users or 6 months, whichever comes first)
- Enforce 200–300 lead/month cap in-app with graceful warnings (not hard stops)
- Transition to $19–$29/mo subscription with grandfathered lifetime users getting a permanently discounted or locked rate

---

> **How to use this file:** Add a new numbered section for each R&D session. Include the date, the decision or finding, the rationale, and any implementation notes. Think of it as a lab notebook for the product.

