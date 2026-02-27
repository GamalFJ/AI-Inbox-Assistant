"use client";

import { useState } from "react";
import {
    CheckCircle2,
    Circle,
    Clock,
    Sparkles,
    Star,
    Users,
    Zap,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    Rocket,
    Shield,
    TrendingUp,
    GitMerge,
    Package,
} from "lucide-react";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

type MilestoneStatus = "shipped" | "active" | "planned" | "future";

interface Feature {
    text: string;
    done: boolean;
}

interface Milestone {
    id: string;
    title: string;
    description: string;
    status: MilestoneStatus;
    date: string;
    icon: React.ReactNode;
    features: Feature[];
}

interface Phase {
    id: string;
    number: string;
    label: string;
    accent: string;       // tailwind color name
    milestones: Milestone[];
}

const PHASES: Phase[] = [
    {
        id: "foundation",
        number: "Phase 1",
        label: "Foundation & Transparency",
        accent: "blue",
        milestones: [
            {
                id: "core-loop",
                title: "Core Product Loop",
                description: "The full inbound email → AI classify → draft → approve & send pipeline. The entire reason this product exists.",
                status: "shipped",
                date: "Feb 2026",
                icon: <Rocket className="w-5 h-5" />,
                features: [
                    { text: "Webhook-based lead ingest (works with any email provider)", done: true },
                    { text: "AI lead classification — New Lead / Existing Client / Spam", done: true },
                    { text: "AI draft generation aligned to your business tone", done: true },
                    { text: "Approve & Send via Resend (one-click email delivery)", done: true },
                    { text: "Follow-up task scheduling with due-date reminders", done: true },
                    { text: "Draft edit history & version control", done: true },
                    { text: "Analytics dashboard — leads, time saved, weekly chart", done: true },
                    { text: "Paywall & PayPal one-time checkout", done: true },
                ],
            },
            {
                id: "3-tone-drafts",
                title: "3-Tone AI Draft System",
                description: "Instead of one generic draft, get three options — Formal, Casual, and Short — generated simultaneously. Pick whichever fits the moment.",
                status: "shipped",
                date: "Feb 2026",
                icon: <Sparkles className="w-5 h-5" />,
                features: [
                    { text: "3 parallel GPT-4o calls — Formal, Casual, Short tones", done: true },
                    { text: "Tab-based tone selector in the draft panel", done: true },
                    { text: "Each tab independently editable with auto-save", done: true },
                    { text: "History & revision tracking per tone variant", done: true },
                    { text: "Unsaved-edits indicator per tab (amber dot)", done: true },
                ],
            },
            {
                id: "transparency",
                title: "Founding Member Transparency System",
                description: "Every user sees their usage clearly — cap, reset date, and upgrade path. No surprises, no walls you didn't see coming.",
                status: "active",
                date: "Feb–Mar 2026",
                icon: <Shield className="w-5 h-5" />,
                features: [
                    { text: "Live usage meter in the sidebar (X / 200 leads this month)", done: true },
                    { text: "4-level warning banner (50% → 75% → 90% → 100%)", done: true },
                    { text: "Automated email at 75% — heads-up notification", done: true },
                    { text: "Automated email at 100% — limit reached + reset date", done: true },
                    { text: "Monthly reset confirmation email", done: true },
                    { text: "3-day follow-up upgrade offer for heavy users", done: true },
                    { text: "This roadmap page (you're looking at it 👋)", done: true },
                    { text: "Founding Member callout in post-purchase onboarding", done: false },
                ],
            },
        ],
    },
    {
        id: "stickiness",
        number: "Phase 2",
        label: "Stickiness & Daily Value",
        accent: "violet",
        milestones: [
            {
                id: "lead-stages",
                title: "Lead Stages & Pipeline View",
                description: "Transform your inbox into a lightweight CRM. Move leads through a pipeline without leaving the app or paying for another tool.",
                status: "planned",
                date: "Mar–Apr 2026",
                icon: <GitMerge className="w-5 h-5" />,
                features: [
                    { text: "Stages: New → Contacted → Negotiating → Closed / Lost", done: false },
                    { text: "Stage pill on every lead card in the sidebar", done: false },
                    { text: "Filter leads by stage", done: false },
                    { text: "Visual stage selector in the lead detail view", done: false },
                ],
            },
            {
                id: "thread-summary",
                title: "Thread Summarization",
                description: "'Catch me up' — instantly condense any conversation into 3–5 key bullets. Never re-read a whole thread again.",
                status: "planned",
                date: "Mar–Apr 2026",
                icon: <Package className="w-5 h-5" />,
                features: [
                    { text: "One-click 'Summarize' button in lead details", done: false },
                    { text: "3–5 bullet summary generated by GPT-4o", done: false },
                    { text: "Shown inline alongside the original message", done: false },
                ],
            },
            {
                id: "booking-link",
                title: "Booking Link Auto-Detection",
                description: "The app detects when someone wants to schedule a meeting and suggests inserting your booking link into the draft — automatically.",
                status: "planned",
                date: "Apr 2026",
                icon: <TrendingUp className="w-5 h-5" />,
                features: [
                    { text: "Scheduling-intent keyword detection on inbound leads", done: false },
                    { text: "'📅 Scheduling intent detected' badge on lead cards", done: false },
                    { text: "One-click insert booking link into active draft", done: false },
                ],
            },
        ],
    },
    {
        id: "ga",
        number: "Phase 3",
        label: "General Availability & Subscriptions",
        accent: "emerald",
        milestones: [
            {
                id: "subscriptions",
                title: "Subscription Plans Launch",
                description: "The Founding Member window closes. New users pay monthly. Your access is locked in — forever, no exceptions.",
                status: "future",
                date: "~Mid 2026",
                icon: <Star className="w-5 h-5" />,
                features: [
                    { text: "Standard plan for new users (~$24/mo)", done: false },
                    { text: "Founding Members: lifetime access, locked in, untouched", done: false },
                    { text: "Stripe billing portal for plan management", done: false },
                    { text: "Subscription webhook handler (created/cancelled/failed)", done: false },
                ],
            },
            {
                id: "cap-increase",
                title: "Founding Member Cap Increase",
                description: "As a thank-you for believing early, Founding Members get a cap upgrade from 200 → 300 leads/month.",
                status: "future",
                date: "~Mid 2026",
                icon: <Zap className="w-5 h-5" />,
                features: [
                    { text: "Founding Member cap raised: 200 → 300 leads/month", done: false },
                    { text: "Paid subscribers: no monthly cap", done: false },
                    { text: "Usage dashboard updated to reflect new limits", done: false },
                ],
            },
        ],
    },
    {
        id: "pro",
        number: "Phase 4",
        label: "Pro Tier Features",
        accent: "amber",
        milestones: [
            {
                id: "pro-features",
                title: "Pro Bundle",
                description: "Premium features that open up the platform for teams, calendars, and integrations. Founding Members get these first at a permanently discounted rate.",
                status: "future",
                date: "~Late 2026",
                icon: <Users className="w-5 h-5" />,
                features: [
                    { text: "Team inbox — shared leads with role-based access", done: false },
                    { text: "Calendar integration (Calendly, Google Calendar)", done: false },
                    { text: "CRM sync — Airtable, HubSpot, CSV export", done: false },
                    { text: "Gmail OAuth — connect your inbox directly (no webhook setup)", done: false },
                    { text: "Custom AI tone fine-tuning with your own examples", done: false },
                    { text: "Founding Member exclusive: Pro access at discounted rate", done: false },
                ],
            },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCENT: Record<string, { badge: string; timeline: string; glow: string; ring: string; text: string; iconBg: string }> = {
    blue: { badge: "bg-blue-100 text-blue-700", timeline: "bg-blue-500", glow: "shadow-blue-100", ring: "ring-blue-200", text: "text-blue-600", iconBg: "bg-blue-100 text-blue-600" },
    violet: { badge: "bg-violet-100 text-violet-700", timeline: "bg-violet-500", glow: "shadow-violet-100", ring: "ring-violet-200", text: "text-violet-600", iconBg: "bg-violet-100 text-violet-600" },
    emerald: { badge: "bg-emerald-100 text-emerald-700", timeline: "bg-emerald-500", glow: "shadow-emerald-100", ring: "ring-emerald-200", text: "text-emerald-600", iconBg: "bg-emerald-100 text-emerald-600" },
    amber: { badge: "bg-amber-100 text-amber-700", timeline: "bg-amber-500", glow: "shadow-amber-100", ring: "ring-amber-200", text: "text-amber-600", iconBg: "bg-amber-100 text-amber-600" },
};

const STATUS_META: Record<MilestoneStatus, { label: string; chip: string; dot: string }> = {
    shipped: { label: "Shipped ✓", chip: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    active: { label: "In Progress", chip: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500 animate-pulse" },
    planned: { label: "Planned", chip: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-400" },
    future: { label: "Coming Soon", chip: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-300" },
};

function computePhaseProgress(phase: Phase): number {
    const all = phase.milestones.flatMap(m => m.features);
    const done = all.filter(f => f.done).length;
    return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
}

function computeOverallProgress(phases: Phase[]): number {
    const all = phases.flatMap(p => p.milestones.flatMap(m => m.features));
    const done = all.filter(f => f.done).length;
    return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MilestoneCard({ milestone, accent }: { milestone: Milestone; accent: string }) {
    const [expanded, setExpanded] = useState(milestone.status === "active");
    const meta = STATUS_META[milestone.status];
    const ac = ACCENT[accent];
    const doneCount = milestone.features.filter(f => f.done).length;
    const pct = Math.round((doneCount / milestone.features.length) * 100);

    const isActive = milestone.status === "active";
    const isShipped = milestone.status === "shipped";

    return (
        <div
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isActive ? `ring-2 ${ac.ring} border-transparent shadow-lg ${ac.glow}` : "border-slate-100 shadow-sm hover:shadow-md"}`}
        >
            {/* Card header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left p-6 flex items-start gap-4"
            >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ac.iconBg}`}>
                    {milestone.icon}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">{milestone.title}</h3>
                            {isActive && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.chip}`}>
                                {meta.label}
                            </span>
                            {expanded
                                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                                : <ChevronDown className="w-4 h-4 text-slate-400" />
                            }
                        </div>
                    </div>

                    {/* Date + description */}
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">{milestone.date}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{milestone.description}</p>

                    {/* Mini progress bar — always visible */}
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${isShipped ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-300"}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">{doneCount}/{milestone.features.length}</span>
                    </div>
                </div>
            </button>

            {/* Expandable feature list */}
            {expanded && (
                <div className="px-6 pb-6 border-t border-slate-50 pt-4">
                    <ul className="space-y-2.5">
                        {milestone.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${feat.done ? "bg-emerald-500 border-emerald-500" : "border-slate-200 bg-white"}`}>
                                    {feat.done && (
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm leading-relaxed ${feat.done ? "text-slate-700" : "text-slate-400"}`}>
                                    {feat.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RoadmapClient() {
    const overall = computeOverallProgress(PHASES);

    // Count shipped milestones
    const allMilestones = PHASES.flatMap(p => p.milestones);
    const shippedCount = allMilestones.filter(m => m.status === "shipped").length;
    const activeCount = allMilestones.filter(m => m.status === "active").length;

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%)" }}>

            {/* ── Nav ── */}
            <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm">AI Inbox Assistant</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition px-4 py-2 rounded-xl hover:bg-slate-100"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Dashboard
                </Link>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

                {/* ── Hero ── */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-100 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        Live Roadmap — Updated February 2026
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
                        Follow us as we build
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                        Every feature, every phase — tracked transparently. We update this page every time something ships.
                    </p>
                </div>

                {/* ── Overall Progress Bar ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-10">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Overall Progress</p>
                            <p className="text-xs text-slate-400">{shippedCount} milestones shipped · {activeCount} in progress</p>
                        </div>
                        <span className="text-3xl font-black text-slate-900">{overall}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${overall}%` }}
                        />
                    </div>
                    {/* Phase segment labels */}
                    <div className="flex mt-2 text-[10px] text-slate-400 font-semibold">
                        {PHASES.map((p) => (
                            <div key={p.id} className="flex-1 text-center">{p.number}</div>
                        ))}
                    </div>
                </div>

                {/* ── Founding Member callout ── */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-12 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-base font-bold text-slate-900 mb-1">You&apos;re a Founding Member — what that means</h2>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Your <strong>$19.99 lifetime access is locked in forever</strong>. When we open to the public (Phase 3), new users will pay a monthly subscription. You&apos;ll never pay that rate — ever. When Pro features ship (Phase 4), you get them at an exclusive Founding Member discount.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "Lifetime core access — locked in" },
                                    { icon: <Users className="w-3.5 h-3.5" />, color: "text-blue-700 bg-blue-50 border-blue-200", label: "200 leads/month (→ 300 at Phase 3)" },
                                    { icon: <Star className="w-3.5 h-3.5" />, color: "text-amber-700 bg-amber-50 border-amber-200", label: "Pro tier discount when it ships" },
                                ].map(({ icon, color, label }) => (
                                    <div key={label} className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${color}`}>
                                        {icon}
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Phases Timeline ── */}
                <div className="space-y-14">
                    {PHASES.map((phase, phaseIdx) => {
                        const ac = ACCENT[phase.accent];
                        const phasePct = computePhaseProgress(phase);
                        const allShipped = phase.milestones.every(m => m.status === "shipped");
                        const hasActive = phase.milestones.some(m => m.status === "active");

                        return (
                            <div key={phase.id} className="relative">
                                {/* Vertical connector line between phases */}
                                {phaseIdx < PHASES.length - 1 && (
                                    <div className="absolute left-5 top-full w-0.5 h-14 bg-slate-200 z-0" />
                                )}

                                {/* Phase header row */}
                                <div className="flex items-center gap-4 mb-6">
                                    {/* Phase dot */}
                                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black shadow-md ${allShipped ? "bg-emerald-500" : hasActive ? "bg-blue-600" : "bg-slate-300"}`}>
                                        {allShipped ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            <span>{phaseIdx + 1}</span>
                                        )}
                                        {hasActive && (
                                            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${ac.badge}`}>{phase.number}</span>
                                            <h2 className="text-lg font-bold text-slate-900">{phase.label}</h2>
                                        </div>
                                        {/* Phase mini-bar */}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${ac.timeline}`}
                                                    style={{ width: `${phasePct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 font-semibold">{phasePct}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Milestone cards with left indent line */}
                                <div className="ml-14 space-y-4 relative">
                                    {/* Vertical line connecting milestones inside phase */}
                                    <div className="absolute -left-9 top-4 bottom-4 w-0.5 bg-slate-100 rounded-full" />

                                    {phase.milestones.map((milestone) => (
                                        <div key={milestone.id} className="relative">
                                            {/* Dot on the connecting line */}
                                            <div className={`absolute -left-11 top-6 w-3 h-3 rounded-full border-2 border-white shadow ${STATUS_META[milestone.status].dot}`} />
                                            <MilestoneCard milestone={milestone} accent={phase.accent} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Transparency Pledge ── */}
                <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8">
                    <h2 className="text-lg font-bold mb-4">Our Transparency Commitments</h2>
                    <ul className="space-y-3">
                        {[
                            "Founding Members keep lifetime access to the core product — forever, no exceptions.",
                            "No lead is ever silently dropped. If you hit your cap, the current lead finishes. New ones queue until next month.",
                            "Your usage is always visible. The dashboard shows your meter at all times.",
                            "You're warned at 50%, 75%, 90%, and 100% of your cap — never surprised at a wall.",
                            "Your reset date is always shown. You can always choose to wait instead of upgrading.",
                            "Pro features are optional upgrades, not feature removals. The existing product never gets worse for you.",
                        ].map((pledge) => (
                            <li key={pledge} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                {pledge}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-200 py-10 text-center bg-white mt-4">
                <p className="text-sm text-slate-400">
                    Roadmap updated with every feature release · Last updated February 26, 2026
                </p>
                <p className="text-xs text-slate-300 mt-1">
                    AI Inbox Assistant — built transparently, for people who mean business.
                </p>
            </footer>
        </div>
    );
}
