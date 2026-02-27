"use client";

import { useState } from "react";
import { Search, Mail, Clock } from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import UsageMeter from "./UsageMeter";


interface LeadListProps {
    leads: Lead[];
    selectedLeadId?: string;
    onSelectLead: (lead: Lead) => void;
}

export default function LeadList({ leads, selectedLeadId, onSelectLead }: LeadListProps) {
    const [filter, setFilter] = useState<LeadStatus | "all">("all");
    const [search, setSearch] = useState("");

    const filteredLeads = (leads || []).filter(lead => {
        const matchesStatus = filter === "all" || lead.status === filter;
        const matchesSearch =
            lead.email_from.toLowerCase().includes(search.toLowerCase()) ||
            lead.subject.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const StatusPill = ({ status }: { status: LeadStatus }) => {
        const colors = {
            new: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
            qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            spam: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            done: "bg-slate-500/10 text-slate-400 border-slate-500/20"
        };
        return (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div id="tour-lead-list" className="flex flex-col h-full bg-brand-dark border-r border-brand-border min-w-[280px] max-w-[360px]">
            {/* Filters */}
            <div className="p-4 space-y-4">
                <div className="flex p-1 bg-brand-darker rounded-xl border border-brand-border">
                    {["all", "new", "qualified", "spam"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === f
                                ? "bg-brand-card text-brand-yellow shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-brand-darker border border-brand-border rounded-xl text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-orange/20 outline-none transition"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center">
                        <Mail className="w-10 h-10 text-brand-card mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No leads found</p>
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <button
                            key={lead.id}
                            onClick={() => onSelectLead(lead)}
                            className={`w-full text-left p-4 border-b border-brand-border transition-all hover:bg-brand-card/50 ${selectedLeadId === lead.id ? "bg-brand-orange/5 border-l-4 border-l-brand-orange" : "border-l-4 border-l-transparent"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold truncate max-w-[180px] ${selectedLeadId === lead.id ? "text-brand-orange" : "text-white"}`}>
                                    {lead.email_from}
                                </span>
                                <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(lead.created_at)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mb-2">{lead.subject || "(No Subject)"}</p>
                            <StatusPill status={lead.status} />
                        </button>
                    ))
                )}
            </div>

            {/* Usage Meter */}
            <UsageMeter />
        </div>
    );
}
