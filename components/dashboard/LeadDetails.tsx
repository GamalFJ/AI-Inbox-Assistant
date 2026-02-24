"use client";

import { Calendar, User, Mail, ChevronRight } from "lucide-react";
import { Lead, Draft, LeadStatus } from "@/types";
import DraftPanel from "./DraftPanel";
import TaskList from "./TaskList";

interface LeadDetailsProps {
    lead: Lead | null;
    draft: Draft | undefined;
    onUpdateLeadStatus: (status: LeadStatus) => void;
    onNewLead: () => void;
}

export default function LeadDetails({ lead, draft, onUpdateLeadStatus, onNewLead }: LeadDetailsProps) {
    if (!lead) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/30">
                <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200/50 rounded-3xl flex items-center justify-center mb-6">
                    <Mail className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No lead selected</h3>
                <p className="text-slate-500 text-center max-w-xs mb-8">
                    Select a lead from the list on the left to review details and generate AI drafts.
                </p>
                <button
                    onClick={onNewLead}
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
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
        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8 space-y-8">
            {/* Header & Original Message */}
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-blue-600">Lead Details</span>
                            <ChevronRight className="w-3 h-3 text-slate-300" />
                            <span className="text-slate-500">{lead.status}</span>
                            {lead.classification && (
                                <>
                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full lowercase">{lead.classification.replace('_', ' ')}</span>
                                </>
                            )}
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">{lead.subject || "(No Subject)"}</h2>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="font-semibold text-slate-700">{lead.email_from}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{formatDate(lead.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Update Status</label>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {["new", "qualified", "spam"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => onUpdateLeadStatus(s as LeadStatus)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${lead.status === s
                                        ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                                        : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        Original Message
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                    </h4>
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {lead.body}
                    </div>
                </div>
            </div>

            {/* Follow-up Tasks */}
            <TaskList leadId={lead.id} />

            {/* AI Draft Panel */}
            <DraftPanel
                leadId={lead.id}
                existingDraft={draft}
                onStatusChange={(status) => onUpdateLeadStatus(status as LeadStatus)}
            />
        </div>
    );
}
