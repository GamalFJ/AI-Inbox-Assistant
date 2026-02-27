"use client";

import { useEffect, useState, useRef } from "react";
import { Users } from "lucide-react";

const CAP = 200;

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(value);
    const prev = useRef(value);

    useEffect(() => {
        if (prev.current === value) return;
        const start = prev.current;
        const end = value;
        const diff = end - start;
        const duration = 800;
        const startTime = performance.now();

        function step(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + diff * eased));
            if (progress < 1) requestAnimationFrame(step);
            else prev.current = end;
        }
        requestAnimationFrame(step);
    }, [value]);

    return <>{display}</>;
}

export default function FoundingMemberCounter() {
    const [taken, setTaken] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchCount() {
            try {
                const res = await fetch("/api/user-count");
                if (!res.ok) throw new Error("Failed");
                const data = await res.json();
                if (!cancelled) {
                    setTaken(data.taken ?? 0);
                    setRemaining(data.remaining ?? CAP);
                }
            } catch {
                if (!cancelled) setError(true);
            }
        }

        fetchCount();
        // Refresh every 60 seconds so the count stays live
        const interval = setInterval(fetchCount, 60_000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    const pct = taken !== null ? Math.round((taken / CAP) * 100) : 0;
    const isLoading = taken === null && !error;
    const urgencyLevel =
        remaining !== null && remaining <= 20
            ? "critical"
            : remaining !== null && remaining <= 50
                ? "high"
                : "normal";

    return (
        <div className="w-full max-w-md mx-auto mt-8">
            {/* Seat counter card */}
            <div
                className={`rounded-2xl border px-5 py-4 text-left transition-all duration-500 ${urgencyLevel === "critical"
                        ? "bg-[#FF8559]/20 border-[#FF8559]/40"
                        : urgencyLevel === "high"
                            ? "bg-[#FAE588]/10 border-[#FAE588]/20"
                            : "bg-[#1C2023] border-[#353C40]"
                    }`}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Users
                            className={`w-4 h-4 ${urgencyLevel === "critical"
                                    ? "text-[#FF8559]"
                                    : urgencyLevel === "high"
                                        ? "text-[#FAE588]"
                                        : "text-slate-300"
                                }`}
                        />
                        <span
                            className={`text-xs font-bold uppercase tracking-wider ${urgencyLevel === "critical"
                                    ? "text-[#FF8559]"
                                    : urgencyLevel === "high"
                                        ? "text-[#FAE588]"
                                        : "text-white"
                                }`}
                        >
                            Founding Member Seats
                        </span>
                    </div>

                    {/* Live badge */}
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        Live
                    </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-[#1C2023] rounded-full overflow-hidden mb-3 border border-[#353C40]">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${urgencyLevel === "critical"
                                ? "bg-gradient-to-r from-[#FF8559] to-[#E66A3D]"
                                : urgencyLevel === "high"
                                    ? "bg-gradient-to-r from-[#FAE588] to-[#FF8559]"
                                    : "bg-[#353C40]"
                            }`}
                        style={{ width: isLoading ? "0%" : `${pct}%` }}
                    />
                </div>

                {/* Count text */}
                <div className="flex items-baseline justify-between">
                    {isLoading ? (
                        <p className="text-sm text-slate-400 font-medium">Loading seats…</p>
                    ) : error ? (
                        <p className="text-sm text-slate-400 font-medium">Seats limited to 200 total</p>
                    ) : (
                        <>
                            <p
                                className={`text-sm font-bold ${urgencyLevel === "critical"
                                        ? "text-[#FF8559]"
                                        : urgencyLevel === "high"
                                            ? "text-[#FAE588]"
                                            : "text-white"
                                    }`}
                            >
                                <AnimatedNumber value={taken!} />
                                <span className="font-normal text-slate-400"> / {CAP} seats taken</span>
                            </p>
                            <p
                                className={`text-sm font-black ${urgencyLevel === "critical"
                                        ? "text-[#FF8559]"
                                        : urgencyLevel === "high"
                                            ? "text-[#FAE588]"
                                            : "text-slate-300"
                                    }`}
                            >
                                <AnimatedNumber value={remaining!} /> left
                            </p>
                        </>
                    )}
                </div>

                {/* Urgency message */}
                {!isLoading && !error && urgencyLevel !== "normal" && (
                    <p
                        className={`mt-2 text-[11px] font-semibold ${urgencyLevel === "critical" ? "text-[#FF8559]" : "text-[#FAE588]"
                            }`}
                    >
                        {urgencyLevel === "critical"
                            ? "🔥 Almost gone — fewer than 20 seats remain at this price."
                            : "⚠️ Filling fast — fewer than 50 seats left at $19.99."}
                    </p>
                )}
            </div>
        </div>
    );
}
