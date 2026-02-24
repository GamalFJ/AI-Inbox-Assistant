"use client";

import { useState, useEffect } from "react";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";
import { Draft } from "@/types";

interface DraftPanelProps {
    leadId: string;
    existingDraft?: Draft;
    onStatusChange: (status: string) => void;
}

export default function DraftPanel({ leadId, existingDraft, onStatusChange }: DraftPanelProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState<Partial<Draft> | null>(existingDraft || null);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (existingDraft) {
            setDraft(existingDraft);
            setSubject(existingDraft.suggested_subject || "");
            setBody(existingDraft.body || "");
        } else {
            setDraft(null);
            setSubject("");
            setBody("");
        }
    }, [existingDraft]);

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
            setSubject(data.suggested_subject || `Re: Inqury`);
            setBody(data.body || "");
        } catch (error) {
            console.error("Failed to generate draft:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">AI Draft Reply</h3>
                        {draft && <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Draft Ready</p>}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
                >
                    {isGenerating ? (
                        "Generatng..."
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

            {draft ? (
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Reply Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Reply Body</label>
                        <textarea
                            rows={8}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-slate-400 italic">Paste this into your normal email app to send.</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onStatusChange("done")}
                                className="px-4 py-2 text-slate-600 text-xs font-bold hover:text-slate-900 transition"
                            >
                                Mark as done
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition shadow-lg shadow-slate-200"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Reply"}
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
                        className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                    >
                        {isGenerating ? "Generating draft..." : "Generate AI Draft"}
                    </button>
                </div>
            )}
        </div>
    );
}
