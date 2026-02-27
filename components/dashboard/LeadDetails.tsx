"use client";

import { Calendar, User, Mail, ChevronRight } from "lucide-react";
import { Lead, Draft, LeadStatus } from "@/types";
import DraftPanel from "./DraftPanel";
import TaskList from "./TaskList";

interface LeadDetailsProps {
    lead: Lead | null;
    drafts: Draft[];
    onUpdateLeadStatus: (status: LeadStatus) => void;
    onNewLead: () => void;
}

export default function LeadDetails({ lead, drafts, onUpdateLeadStatus, onNewLead }: LeadDetailsProps) {
    if (!lead) {
        return (
            <div id="tour-lead-details" className="flex-1 flex flex-col items-center justify-center p-12 bg-brand-darker">
                <div className="w-20 h-20 bg-brand-card shadow-2xl border border-brand-border rounded-3xl flex items-center justify-center mb-6">
                    <Mail className="w-10 h-10 text-brand-orange/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No lead selected</h3>
                <p className="text-slate-400 text-center max-w-xs mb-8">
                    Select a lead from the list on the left to review details and generate AI drafts.
                </p>
                <button
                    onClick={onNewLead}
                    className="px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange/90 transition shadow-lg shadow-brand-orange/10"
                >
                    Create New Lead
                </button>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div id="tour-lead-details" className="flex-1 overflow-y-auto bg-brand-darker p-8 space-y-8">
            {/* Header & Original Message */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-brand-yellow font-black">Lead Details</span>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                            <span className="text-emerald-400">{lead.status}</span>
                            {lead.classification && (
                                <>
                                    <ChevronRight className="w-3 h-3 text-slate-600" />
                                    <span className="bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full lowercase border border-brand-orange/20">{lead.classification.replace('_', ' ')}</span>
                                </>
                            )}
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">{lead.subject || "(No Subject)"}</h2>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-brand-darker px-3 py-1.5 rounded-lg border border-brand-border">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="font-semibold text-slate-200">{lead.email_from}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400 bg-brand-darker px-3 py-1.5 rounded-lg border border-brand-border">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span>{formatDate(lead.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Update Status</label>
                        <div className="flex p-1 bg-brand-darker rounded-xl border border-brand-border">
                            {["new", "qualified", "spam"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => onUpdateLeadStatus(s as LeadStatus)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${lead.status === s
                                        ? "bg-brand-card text-brand-yellow shadow-sm border border-brand-border"
                                        : "text-slate-500 hover:text-slate-300"
                                        }`}
                                >
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Original Message
                        <div className="h-[1px] flex-1 bg-brand-border"></div>
                    </h4>
                    <div className="bg-brand-darker border border-brand-border rounded-2xl p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {lead.body}
                    </div>
                </div>
            </div>

            {/* Follow-up Tasks */}
            <TaskList leadId={lead.id} />

            <div id="tour-draft-panel">
                <DraftPanel
                    leadId={lead.id}
                    existingDrafts={drafts}
                    onStatusChange={(status) => onUpdateLeadStatus(status as LeadStatus)}
                />
            </div>
        </div>
    );
}
