"use client";

import { useEffect, useState } from "react";
import { Zap, TrendingUp } from "lucide-react";
import type { UsageData } from "@/utils/usage";


export default function UsageMeter() {
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/usage")
            .then((r) => r.json())
            .then((data) => {
                if (!data.error) setUsage(data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading || !usage) return null;

    const { used, cap, percentage, level, resetDate } = usage;

    const resetFormatted = new Date(resetDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const barColor =
        level === "limit"
            ? "bg-red-500"
            : level === "critical"
                ? "bg-orange-500"
                : level === "warning"
                    ? "bg-amber-400"
                    : "bg-emerald-500";

    const textColor =
        level === "limit"
            ? "text-red-600"
            : level === "critical"
                ? "text-orange-600"
                : level === "warning"
                    ? "text-amber-600"
                    : "text-emerald-600";

    return (
        <div className="px-4 pb-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Monthly Usage
                        </span>
                    </div>
                    <span className={`text-[11px] font-bold ${textColor}`}>
                        {used}&nbsp;/&nbsp;{cap}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-400">
                        Resets {resetFormatted}
                    </span>
                    {level !== "ok" && (
                        <div className="flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                            <span className="text-[10px] font-semibold text-amber-600">
                                {level === "limit" ? "At limit" : `${percentage}% used`}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
