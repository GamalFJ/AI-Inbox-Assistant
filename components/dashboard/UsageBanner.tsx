"use client";

import { useEffect, useState, useCallback } from "react";
import { X, AlertTriangle, AlertCircle, Info, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { UsageData } from "@/utils/usage";


export default function UsageBanner() {
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [dismissed, setDismissed] = useState<string | null>(null);

    const fetchUsage = useCallback(async () => {
        try {
            const res = await fetch("/api/usage");
            const data = await res.json();
            if (!data.error) setUsage(data);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        fetchUsage();
        // Refresh every 5 minutes
        const interval = setInterval(fetchUsage, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchUsage]);

    if (!usage || usage.level === "ok") return null;

    const { level, used, cap, percentage, resetDate } = usage;
    const resetFormatted = new Date(resetDate).toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const bannerKey = `usage-banner-${level}-${new Date().toISOString().slice(0, 7)}`; // per level per month

    if (dismissed === bannerKey) return null;

    type Config = {
        bg: string;
        border: string;
        icon: React.ReactNode;
        text: string;
        title: string;
        showUpgrade: boolean;
    };

    const configs: Record<string, Config> = {
        warning: {
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            icon: <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
            title: "Heads up on your lead volume",
            text: `You've used ${used} of ${cap} leads this month (${percentage}%). Your limit resets on ${resetFormatted}.`,
            showUpgrade: false,
        },
        critical: {
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            icon: <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />,
            title: "You're close to your monthly limit",
            text: `You've used ${used} of ${cap} leads (${percentage}%). Consider upgrading before you hit your limit, or your leads will pause on ${resetFormatted}.`,
            showUpgrade: true,
        },
        limit: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            icon: <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
            title: "Monthly lead limit reached",
            text: `You've processed all ${cap} leads for this month. New leads are saved but AI processing is paused. Everything resumes on ${resetFormatted} — no data is lost.`,
            showUpgrade: true,
        },
    };

    const config = configs[level];
    if (!config) return null;

    return (
        <div className={`${config.bg} border-b ${config.border} px-6 py-3`}>
            <div className="flex items-start gap-3 max-w-6xl mx-auto">
                {config.icon}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{config.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{config.text}</p>
                    {config.showUpgrade && (
                        <div className="flex items-center gap-3 mt-2">
                            <Link
                                href="/roadmap"
                                className="text-xs font-bold text-brand-orange hover:text-brand-yellow underline underline-offset-2"
                            >
                                View upgrade options →
                            </Link>
                            <span className="text-xs text-slate-600">or wait for the {resetFormatted} reset</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {/* Usage badge */}
                    <div className="flex items-center gap-1 bg-brand-dark/50 rounded-lg px-2 py-1 border border-brand-border">
                        <TrendingUp className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-300">{used}/{cap}</span>
                    </div>
                    {/* Only allow dismissing warning/critical, not the limit banner */}
                    {level !== "limit" && (
                        <button
                            onClick={() => setDismissed(bannerKey)}
                            className="p-1 hover:bg-white/10 rounded-lg transition"
                        >
                            <X className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
