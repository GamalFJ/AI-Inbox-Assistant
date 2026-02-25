"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Copy, Check, RotateCcw, Send, History, Save, Loader2 } from "lucide-react";
import { Draft } from "@/types";
import { useNotification } from "@/components/NotificationContext";
import DraftHistory from "./DraftHistory";
import { DraftRevision } from "@/types";

interface DraftPanelProps {
    leadId: string;
    existingDraft?: Draft;
    onStatusChange: (status: string) => void;
}

export default function DraftPanel({ leadId, existingDraft, onStatusChange }: DraftPanelProps) {
    const { notify } = useNotification();

    // ── Core draft state ─────────────────────────────────────────────────
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState<Partial<Draft> | null>(existingDraft || null);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    // ── Send state ───────────────────────────────────────────────────────
    const [copied, setCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    // ── Save / edit history state ────────────────────────────────────────
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);           // has user unsaved edits?
    const [lastSavedBody, setLastSavedBody] = useState("");  // snapshot of last-saved body
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Sync when a new draft prop arrives ───────────────────────────────
    useEffect(() => {
        if (existingDraft) {
            setDraft(existingDraft);
            setSubject(existingDraft.suggested_subject || "");
            setBody(existingDraft.body || "");
            setLastSavedBody(existingDraft.body || "");
            setIsDirty(false);
        } else {
            setDraft(null);
            setSubject("");
            setBody("");
            setLastSavedBody("");
            setIsDirty(false);
        }
        setSent(false);
    }, [existingDraft]);

    // ── Mark dirty when fields change ────────────────────────────────────
    const handleSubjectChange = (val: string) => {
        setSubject(val);
        setIsDirty(true);
    };

    const handleBodyChange = (val: string) => {
        setBody(val);
        setIsDirty(true);
    };

    // ── Save draft edits + create revision ───────────────────────────────
    const saveDraft = useCallback(async (opts?: { edit_source?: DraftRevision["edit_source"] }) => {
        if (!draft?.id) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/drafts/${draft.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    body,
                    suggested_subject: subject,
                    edit_source: opts?.edit_source ?? "user_edit",
                }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setLastSavedBody(body);
            setIsDirty(false);

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
    }, [draft?.id, body, subject, notify]);

    // ── Auto-save 3 s after stopped typing ───────────────────────────────
    useEffect(() => {
        if (!isDirty || !draft?.id) return;
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            saveDraft({ edit_source: "user_edit" });
        }, 3000);
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [isDirty, body, subject, draft?.id, saveDraft]);

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

            setDraft(data);
            const newSubject = data.suggested_subject || `Re: Inquiry`;
            const newBody = data.body || "";
            setSubject(newSubject);
            setBody(newBody);
            setLastSavedBody(newBody);
            setIsDirty(false);

            // Snapshot a revision for the AI output
            if (data.id) {
                await fetch(`/api/drafts/${data.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        body: newBody,
                        suggested_subject: newSubject,
                        edit_source: draft ? "regenerated" : "ai_generated",
                    }),
                });
            }
        } catch (error) {
            notify({
                type: "error",
                title: "Draft generation failed",
                message: error instanceof Error ? error.message : "Could not generate an AI draft. Check your API key configuration.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // ── Restore a revision ────────────────────────────────────────────────
    const handleRestore = (revision: DraftRevision) => {
        setSubject(revision.suggested_subject);
        setBody(revision.body);
        setIsDirty(true);
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
                body: JSON.stringify({ lead_id: leadId, draft_id: draft?.id, subject, body }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSent(true);
            onStatusChange("done");
            notify({
                type: "success",
                title: "Email sent!",
                message: `Your reply has been delivered successfully.`,
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

    // ────────────────────────────────────────────────────────────────────
    return (
        <>
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {/* ── Header ── */}
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">AI Draft Reply</h3>
                            {draft && (
                                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                                    {isDirty ? "Unsaved edits" : "Draft Ready"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* History button — only when there's a real saved draft */}
                        {draft?.id && (
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
                            ) : draft ? (
                                <>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Regenerate
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Generate Draft
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Draft Editing Area ── */}
                {draft ? (
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
                                {isDirty && draft?.id && (
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
                        <p className="text-sm text-slate-500 mb-6">No draft generated for this lead yet.</p>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            {isGenerating ? "Generating draft…" : "Generate AI Draft"}
                        </button>
                    </div>
                )}
            </div>

            {/* ── History Drawer ── */}
            {draft?.id && (
                <DraftHistory
                    draftId={draft.id}
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    onRestore={handleRestore}
                    currentBody={body}
                />
            )}
        </>
    );
}
