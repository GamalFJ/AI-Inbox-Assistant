"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Copy, Check, RotateCcw, Send, History, Save, Loader2, Briefcase, Coffee, Zap } from "lucide-react";
import { Draft, ToneVariant } from "@/types";
import { useNotification } from "@/components/NotificationContext";
import DraftHistory from "./DraftHistory";
import { DraftRevision } from "@/types";

interface DraftPanelProps {
    leadId: string;
    existingDrafts?: Draft[];
    /** @deprecated Pass existingDrafts instead. Kept for backward compatibility. */
    existingDraft?: Draft;
    onStatusChange: (status: string) => void;
}

const TONE_TABS: { key: ToneVariant; label: string; icon: React.ReactNode; description: string }[] = [
    {
        key: "formal",
        label: "Formal",
        icon: <Briefcase className="w-3.5 h-3.5" />,
        description: "Polished & professional",
    },
    {
        key: "casual",
        label: "Casual",
        icon: <Coffee className="w-3.5 h-3.5" />,
        description: "Warm & conversational",
    },
    {
        key: "short",
        label: "Short",
        icon: <Zap className="w-3.5 h-3.5" />,
        description: "Concise & direct",
    },
];

export default function DraftPanel({ leadId, existingDrafts, existingDraft, onStatusChange }: DraftPanelProps) {
    const { notify } = useNotification();

    // ── Tone selection ────────────────────────────────────────────────────
    const [activeTone, setActiveTone] = useState<ToneVariant>("formal");

    // ── All 3 draft variants ──────────────────────────────────────────────
    // Normalise: if only a single legacy draft is passed, wrap it
    const normaliseDrafts = useCallback((drafts?: Draft[], single?: Draft): Draft[] => {
        if (drafts && drafts.length > 0) return drafts;
        if (single) return [{ ...single, tone_variant: "formal" }];
        return [];
    }, []);

    const [allDrafts, setAllDrafts] = useState<Draft[]>(() => normaliseDrafts(existingDrafts, existingDraft));

    // ── Derived: currently active draft ──────────────────────────────────
    const activeDraft = allDrafts.find((d) => d.tone_variant === activeTone) ?? allDrafts[0] ?? null;

    // ── Per-variant edit state ────────────────────────────────────────────
    const [subjects, setSubjects] = useState<Record<ToneVariant, string>>({ formal: "", casual: "", short: "" });
    const [bodies, setBodies] = useState<Record<ToneVariant, string>>({ formal: "", casual: "", short: "" });
    const [dirtyTones, setDirtyTones] = useState<Record<ToneVariant, boolean>>({ formal: false, casual: false, short: false });
    const [lastSavedBodies, setLastSavedBodies] = useState<Record<ToneVariant, string>>({ formal: "", casual: "", short: "" });

    // ── Send state ───────────────────────────────────────────────────────
    const [copied, setCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    // ── Save / generate state ─────────────────────────────────────────────
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Sync when props change ────────────────────────────────────────────
    useEffect(() => {
        const normalised = normaliseDrafts(existingDrafts, existingDraft);
        setAllDrafts(normalised);
        setSent(false);

        const newSubjects: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };
        const newBodies: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };
        const newSaved: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };

        normalised.forEach((d) => {
            const t = (d.tone_variant ?? "formal") as ToneVariant;
            newSubjects[t] = d.suggested_subject || "";
            newBodies[t] = d.body || "";
            newSaved[t] = d.body || "";
        });

        setSubjects(newSubjects);
        setBodies(newBodies);
        setLastSavedBodies(newSaved);
        setDirtyTones({ formal: false, casual: false, short: false });
    }, [existingDrafts, existingDraft, normaliseDrafts]);

    // Shorthands for the active tone
    const subject = subjects[activeTone];
    const body = bodies[activeTone];
    const isDirty = dirtyTones[activeTone];
    const lastSavedBody = lastSavedBodies[activeTone];

    const handleSubjectChange = (val: string) => {
        setSubjects((prev) => ({ ...prev, [activeTone]: val }));
        setDirtyTones((prev) => ({ ...prev, [activeTone]: true }));
    };

    const handleBodyChange = (val: string) => {
        setBodies((prev) => ({ ...prev, [activeTone]: val }));
        setDirtyTones((prev) => ({ ...prev, [activeTone]: true }));
    };

    // ── Save draft ────────────────────────────────────────────────────────
    const saveDraft = useCallback(async (opts?: { edit_source?: DraftRevision["edit_source"] }) => {
        if (!activeDraft?.id) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/drafts/${activeDraft.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    body: bodies[activeTone],
                    suggested_subject: subjects[activeTone],
                    edit_source: opts?.edit_source ?? "user_edit",
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setLastSavedBodies((prev) => ({ ...prev, [activeTone]: bodies[activeTone] }));
            setDirtyTones((prev) => ({ ...prev, [activeTone]: false }));

            notify({
                type: "success",
                title: "Draft saved",
                message: `Version ${data.version} saved to history.`,
                duration: 2500,
            });
        } catch (err) {
            notify({
                type: "error",
                title: "Save failed",
                message: err instanceof Error ? err.message : "Could not save the draft.",
            });
        } finally {
            setIsSaving(false);
        }
    }, [activeDraft?.id, bodies, subjects, activeTone, notify]);

    // ── Auto-save 3 s after stopped typing ───────────────────────────────
    useEffect(() => {
        if (!isDirty || !activeDraft?.id) return;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            saveDraft({ edit_source: "user_edit" });
        }, 3000);
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [isDirty, bodies, subjects, activeDraft?.id, saveDraft]);

    // ── Generate / Regenerate ─────────────────────────────────────────────
    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/process-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: leadId }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const newDrafts: Draft[] = data.drafts ?? [];
            setAllDrafts(newDrafts);

            const newSubjects: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };
            const newBodies: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };
            const newSaved: Record<ToneVariant, string> = { formal: "", casual: "", short: "" };

            newDrafts.forEach((d: Draft) => {
                const t = (d.tone_variant ?? "formal") as ToneVariant;
                newSubjects[t] = d.suggested_subject || "";
                newBodies[t] = d.body || "";
                newSaved[t] = d.body || "";
            });

            setSubjects(newSubjects);
            setBodies(newBodies);
            setLastSavedBodies(newSaved);
            setDirtyTones({ formal: false, casual: false, short: false });
            setSent(false);

            notify({
                type: "success",
                title: "3 drafts generated",
                message: "Formal, Casual, and Short versions are ready. Pick your tone!",
                duration: 3500,
            });
        } catch (error) {
            notify({
                type: "error",
                title: "Draft generation failed",
                message: error instanceof Error ? error.message : "Could not generate AI drafts. Check your API key configuration.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // ── Restore a revision ────────────────────────────────────────────────
    const handleRestore = (revision: DraftRevision) => {
        setSubjects((prev) => ({ ...prev, [activeTone]: revision.suggested_subject }));
        setBodies((prev) => ({ ...prev, [activeTone]: revision.body }));
        setDirtyTones((prev) => ({ ...prev, [activeTone]: true }));
        setIsHistoryOpen(false);
        notify({
            type: "success",
            title: `Version ${revision.version_number} restored`,
            message: "The draft has been restored. Save to confirm.",
            duration: 3000,
        });
    };

    // ── Copy to clipboard ────────────────────────────────────────────────
    const handleCopy = () => {
        navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Send email ───────────────────────────────────────────────────────
    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: leadId, draft_id: activeDraft?.id, subject, body }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSent(true);
            onStatusChange("done");
            notify({
                type: "success",
                title: "Email sent!",
                message: `Your ${activeTone} reply has been delivered successfully.`,
            });
        } catch (error) {
            notify({
                type: "error",
                title: "Email send failed",
                message: "Make sure your RESEND_API_KEY is configured and your domain is verified.",
                duration: 7000,
            });
        } finally {
            setIsSending(false);
        }
    };

    const hasDrafts = allDrafts.length > 0;

    // ────────────────────────────────────────────────────────────────────
    return (
        <>
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {/* ── Header ── */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">AI Draft Reply</h3>
                            {hasDrafts && (
                                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                                    {isDirty ? "Unsaved edits" : "3 Drafts Ready"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* History button */}
                        {activeDraft?.id && (
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                title="View edit history"
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition shadow-sm"
                            >
                                <History className="w-3.5 h-3.5" />
                                History
                            </button>
                        )}

                        {/* Generate / Regenerate */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Generating…
                                </>
                            ) : hasDrafts ? (
                                <>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Regenerate All
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Generate Drafts
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Tone Tab Selector ── */}
                {hasDrafts && (
                    <div className="flex border-b border-slate-100 bg-white">
                        {TONE_TABS.map((tab) => {
                            const isActive = activeTone === tab.key;
                            const hasDraft = allDrafts.some((d) => d.tone_variant === tab.key);
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTone(tab.key)}
                                    className={`flex-1 flex flex-col items-center gap-1 px-3 py-3 text-xs font-semibold transition border-b-2 ${isActive
                                            ? "border-blue-500 text-blue-600 bg-blue-50/50"
                                            : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                        {dirtyTones[tab.key] && hasDraft && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved edits" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-normal ${isActive ? "text-blue-400" : "text-slate-300"}`}>
                                        {tab.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Draft Editing Area ── */}
                {hasDrafts && activeDraft ? (
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                Reply Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                Reply Body
                            </label>
                            <textarea
                                rows={8}
                                value={body}
                                onChange={(e) => handleBodyChange(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none leading-relaxed"
                            />
                        </div>

                        {/* Auto-save notice */}
                        {isDirty && (
                            <p className="text-[10px] text-slate-400 italic ml-1 -mt-2">
                                Auto-saving in 3 s…
                            </p>
                        )}

                        {/* ── Action Row ── */}
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-slate-400 italic">
                                {sent
                                    ? "Email sent successfully!"
                                    : lastSavedBody && !isDirty
                                        ? "All changes saved."
                                        : "Review and approve this draft to send."}
                            </p>

                            <div className="flex gap-2 items-center">
                                {/* Manual Save */}
                                {isDirty && activeDraft?.id && (
                                    <button
                                        onClick={() => saveDraft()}
                                        disabled={isSaving}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition shadow-sm disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Save className="w-3.5 h-3.5" />
                                        )}
                                        {isSaving ? "Saving…" : "Save"}
                                    </button>
                                )}

                                {/* Copy */}
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 text-xs font-bold hover:text-slate-900 transition"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>

                                {/* Approve & Send */}
                                <button
                                    onClick={handleSendEmail}
                                    disabled={isSending || sent}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50 disabled:bg-slate-400"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending…
                                        </>
                                    ) : sent ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Sent
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Approve &amp; Send
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-sm text-slate-500 mb-2">No drafts generated yet.</p>
                        <p className="text-xs text-slate-400 mb-6">
                            Generate 3 tone variants — Formal, Casual, and Short — and pick the one that fits.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            {isGenerating ? "Generating 3 drafts…" : "Generate AI Drafts"}
                        </button>
                    </div>
                )}
            </div>

            {/* ── History Drawer ── */}
            {activeDraft?.id && (
                <DraftHistory
                    draftId={activeDraft.id}
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    onRestore={handleRestore}
                    currentBody={body}
                />
            )}
        </>
    );
}
