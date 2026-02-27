"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    BarChart3,
    TrendingUp,
    Clock,
    Mail,
    ShieldBan,
    Zap,
    CalendarCheck,
    AlertTriangle,
    Loader2,
    ArrowLeft,
    Sparkles,
} from "lucide-react";

interface Analytics {
    totalLeads: number;
    draftsSent: number;
    pendingDrafts: number;
    totalDrafts: number;
    spamBlocked: number;
    hoursSaved: number;
    avgResponseMinutes: number | null;
    leadsByType: Record<string, number>;
    recentActivity: { date: string; leads: number; drafts: number }[];
    pendingTasks: number;
    overdueTasks: number;
}

const CLASSIFICATION_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    new_lead: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500" },
    existing_client: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500" },
    spam: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-500" },
    other: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
    unclassified: { bg: "bg-brand-yellow/10", text: "text-brand-yellow", dot: "bg-brand-yellow" },
};

function formatClassification(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AnalyticsPage() {
    const router = useRouter();

    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                const res = await fetch("/api/analytics");
                const analytics: Analytics = await res.json();
                setData(analytics);
            } catch (err) {
                console.error("Failed to load analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-darker">
                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-darker">
                <p className="text-slate-500">Failed to load analytics.</p>
            </div>
        );
    }

    // Find the max value for the activity chart scale
    const maxActivity = Math.max(
        ...data.recentActivity.map((d) => Math.max(d.leads, d.drafts)),
        1
    );

    return (
        <div className="min-h-screen bg-brand-darker">
            <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="p-2 rounded-xl hover:bg-brand-card text-slate-400 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="p-2.5 bg-brand-orange rounded-xl text-white shadow-lg shadow-brand-orange/20">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                Analytics
                            </h1>
                            <p className="text-sm text-slate-400">
                                Your inbox performance at a glance.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ====== Stat Cards ====== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<Mail className="w-5 h-5" />}
                        iconBg="bg-blue-500/10 text-blue-400"
                        label="Total Leads"
                        value={data.totalLeads}
                    />
                    <StatCard
                        icon={<Sparkles className="w-5 h-5" />}
                        iconBg="bg-emerald-500/10 text-emerald-400"
                        label="Drafts Generated"
                        value={data.totalDrafts}
                    />
                    <StatCard
                        icon={<Zap className="w-5 h-5" />}
                        iconBg="bg-brand-orange/10 text-brand-orange"
                        label="Emails Sent"
                        value={data.draftsSent}
                    />
                    <StatCard
                        icon={<Clock className="w-5 h-5" />}
                        iconBg="bg-purple-500/10 text-purple-400"
                        label="Hours Saved"
                        value={`${data.hoursSaved}h`}
                    />
                </div>

                {/* ====== Secondary Stats Row ====== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<ShieldBan className="w-5 h-5" />}
                        iconBg="bg-red-500/10 text-red-400"
                        label="Spam Blocked"
                        value={data.spamBlocked}
                    />
                    <StatCard
                        icon={<TrendingUp className="w-5 h-5" />}
                        iconBg="bg-sky-500/10 text-sky-400"
                        label="Avg Response"
                        value={
                            data.avgResponseMinutes !== null
                                ? `${data.avgResponseMinutes}m`
                                : "—"
                        }
                        subtitle="lead → AI draft"
                    />
                    <StatCard
                        icon={<CalendarCheck className="w-5 h-5" />}
                        iconBg="bg-indigo-500/10 text-indigo-400"
                        label="Pending Tasks"
                        value={data.pendingTasks}
                    />
                    <StatCard
                        icon={<AlertTriangle className="w-5 h-5" />}
                        iconBg="bg-brand-orange/10 text-brand-orange"
                        label="Overdue Tasks"
                        value={data.overdueTasks}
                        highlight={data.overdueTasks > 0}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ====== 7-Day Activity Chart ====== */}
                    <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-border shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-brand-border bg-brand-dark/30">
                            <h2 className="text-base font-bold text-white">
                                7-Day Activity
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Leads received vs. AI drafts generated.
                            </p>
                        </div>
                        <div className="p-8">
                            <div className="flex items-end gap-3 h-48">
                                {data.recentActivity.map((day) => {
                                    const leadHeight =
                                        maxActivity > 0
                                            ? (day.leads / maxActivity) * 100
                                            : 0;
                                    const draftHeight =
                                        maxActivity > 0
                                            ? (day.drafts / maxActivity) * 100
                                            : 0;
                                    const dayLabel = new Date(
                                        day.date + "T12:00:00"
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                    });

                                    return (
                                        <div
                                            key={day.date}
                                            className="flex-1 flex flex-col items-center gap-1"
                                        >
                                            <div className="flex items-end gap-1 h-36 w-full justify-center">
                                                <div
                                                    className="w-5 bg-gradient-to-t from-brand-orange to-brand-yellow rounded-t-lg transition-all duration-500 ease-out"
                                                    style={{
                                                        height: `${Math.max(leadHeight, 4)}%`,
                                                    }}
                                                    title={`${day.leads} leads`}
                                                />
                                                <div
                                                    className="w-5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 ease-out"
                                                    style={{
                                                        height: `${Math.max(draftHeight, 4)}%`,
                                                    }}
                                                    title={`${day.drafts} drafts`}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">
                                                {dayLabel}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-brand-border/30">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-brand-orange" />
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        Leads
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                        AI Drafts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ====== Lead Classification Breakdown ====== */}
                    <div className="bg-brand-card rounded-3xl border border-brand-border shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-brand-border bg-brand-dark/30">
                            <h2 className="text-base font-bold text-white">
                                Lead Breakdown
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Classification by AI.
                            </p>
                        </div>
                        <div className="p-6 space-y-3">
                            {Object.entries(data.leadsByType).length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    No classified leads yet.
                                </p>
                            ) : (
                                Object.entries(data.leadsByType)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([type, count]) => {
                                        const colors =
                                            CLASSIFICATION_COLORS[type] ||
                                            CLASSIFICATION_COLORS.other;
                                        const percentage =
                                            data.totalLeads > 0
                                                ? Math.round(
                                                    (count / data.totalLeads) * 100
                                                )
                                                : 0;

                                        return (
                                            <div
                                                key={type}
                                                className={`flex items-center justify-between px-4 py-3 rounded-2xl ${colors.bg} transition-all hover:scale-[1.01]`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
                                                    />
                                                    <span
                                                        className={`text-sm font-bold ${colors.text}`}
                                                    >
                                                        {formatClassification(type)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`text-sm font-black ${colors.text}`}
                                                    >
                                                        {count}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-600 w-8 text-right">
                                                        {percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Stat Card Component ─── */
function StatCard({
    icon,
    iconBg,
    label,
    value,
    subtitle,
    highlight,
}: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string | number;
    subtitle?: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`bg-brand-card rounded-2xl border p-5 shadow-sm transition-all hover:shadow-xl hover:scale-[1.01] ${highlight
                ? "border-brand-orange/50 shadow-brand-orange/5"
                : "border-brand-border shadow-black/5"
                }`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-white/5 ${iconBg}`}>
                {icon}
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
                {value}
            </div>
            <div className="text-[10px] font-black text-slate-500 mt-0.5 uppercase tracking-widest">
                {label}
            </div>
            {subtitle && (
                <div className="text-[10px] text-slate-600 font-bold mt-0.5">{subtitle}</div>
            )}
        </div>
    );
}
