"use client";

import { useState, useEffect, useCallback } from "react";
import { DraftRevision } from "@/types";
import { X, Clock, RotateCcw, Cpu, User, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface DraftHistoryProps {
    draftId: string;
    isOpen: boolean;
    onClose: () => void;
    onRestore: (revision: DraftRevision) => void;
    currentBody: string;
}

const SOURCE_LABELS: Record<DraftRevision["edit_source"], { label: string; color: string; icon: React.ReactNode }> = {
    ai_generated: {
        label: "AI Generated",
        color: "bg-blue-50 text-blue-700 border-blue-100",
        icon: <Cpu className="w-3 h-3" />,
    },
    user_edit: {
        label: "Your Edit",
        color: "bg-violet-50 text-violet-700 border-violet-100",
        icon: <User className="w-3 h-3" />,
    },
    regenerated: {
        label: "Regenerated",
        color: "bg-amber-50 text-amber-700 border-amber-100",
        icon: <RefreshCw className="w-3 h-3" />,
    },
};

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
}

function truncateBody(text: string, maxLen = 200): string {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + "…";
}

export default function DraftHistory({ draftId, isOpen, onClose, onRestore, currentBody }: DraftHistoryProps) {
    const [revisions, setRevisions] = useState<DraftRevision[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    const fetchRevisions = useCallback(async () => {
        if (!draftId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/drafts/${draftId}/revisions`);
            const data = await res.json();
            if (Array.isArray(data)) setRevisions(data);
        } catch (err) {
            console.error("Failed to load revisions:", err);
        } finally {
            setIsLoading(false);
        }
    }, [draftId]);

    useEffect(() => {
        if (isOpen) fetchRevisions();
    }, [isOpen, fetchRevisions]);

    const handleRestore = async (revision: DraftRevision) => {
        setRestoringId(revision.id);
        // Small delay so the user sees the confirm state
        await new Promise((r) => setTimeout(r, 300));
        onRestore(revision);
        setRestoringId(null);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-[400px] max-w-[95vw] z-50
                    bg-brand-card shadow-2xl border-l border-brand-border
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-brand-dark/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-orange/10 rounded-lg flex items-center justify-center border border-brand-orange/20">
                            <Clock className="w-4 h-4 text-brand-orange" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white">Edit History</h2>
                            <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                                {revisions.length} version{revisions.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-dark text-slate-500 hover:text-white transition"
                        aria-label="Close history"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-slate-500">Loading history…</p>
                        </div>
                    ) : revisions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
                            <div className="w-12 h-12 bg-brand-dark border border-brand-border rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-brand-card" />
                            </div>
                            <p className="text-sm text-slate-400">No revisions yet.</p>
                            <p className="text-xs text-slate-600">
                                Edit and save the draft to start tracking versions.
                            </p>
                        </div>
                    ) : (
                        revisions.map((rev, idx) => {
                            const src = SOURCE_LABELS[rev.edit_source] ?? SOURCE_LABELS.user_edit;
                            const isExpanded = expandedId === rev.id;
                            const isLatest = idx === 0;
                            const isCurrent = rev.body.trim() === currentBody.trim();
                            const isRestoring = restoringId === rev.id;

                            return (
                                <div
                                    key={rev.id}
                                    className={`
                                        rounded-xl border transition-all duration-200
                                        ${isLatest ? "border-brand-yellow/30 bg-brand-yellow/5" : "border-brand-border bg-brand-dark"}
                                    `}
                                >
                                    {/* Revision Header Row */}
                                    <div className="flex items-center justify-between px-4 py-3 gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-xs font-bold text-slate-500 shrink-0">
                                                v{rev.version_number}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${src.color} shrink-0`}
                                            >
                                                {src.icon}
                                                {src.label}
                                            </span>
                                            {isLatest && (
                                                <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-wide shrink-0">
                                                    Latest
                                                </span>
                                            )}
                                            {isCurrent && !isLatest && (
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide shrink-0">
                                                    Active
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-500 ml-auto shrink-0">
                                                {formatRelativeTime(rev.created_at)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : rev.id)}
                                            className="ml-1 text-slate-500 hover:text-white transition shrink-0"
                                            aria-label={isExpanded ? "Collapse" : "Expand"}
                                        >
                                            {isExpanded
                                                ? <ChevronUp className="w-3.5 h-3.5" />
                                                : <ChevronDown className="w-3.5 h-3.5" />
                                            }
                                        </button>
                                    </div>

                                    {/* Subject Line */}
                                    {rev.suggested_subject && (
                                        <div className="px-4 pb-2">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Subject</p>
                                            <p className="text-xs text-slate-300 font-medium">{rev.suggested_subject}</p>
                                        </div>
                                    )}

                                    {/* Body Preview / Expanded */}
                                    <div className="px-4 pb-3">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Body</p>
                                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                                            {isExpanded ? rev.body : truncateBody(rev.body)}
                                        </p>
                                    </div>

                                    {/* Restore Action */}
                                    {!isCurrent && (
                                        <div className="px-4 pb-3">
                                            <button
                                                onClick={() => handleRestore(rev)}
                                                disabled={isRestoring}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark border border-brand-border text-slate-300 text-xs font-bold rounded-lg hover:bg-brand-card hover:text-white transition disabled:opacity-50"
                                            >
                                                {isRestoring ? (
                                                    <div className="w-3 h-3 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-3 h-3" />
                                                )}
                                                {isRestoring ? "Restoring…" : "Restore this version"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-brand-border bg-brand-dark/50">
                    <p className="text-[10px] text-slate-500 text-center">
                        Versions are saved automatically when you save a draft edit.
                    </p>
                </div>
            </div>
        </>
    );
}
