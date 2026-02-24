"use client";

import { useState } from "react";
import { Search, Mail, Clock } from "lucide-react";
import { Lead, LeadStatus } from "@/types";

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
            new: "bg-blue-50 text-blue-600 border-blue-100",
            qualified: "bg-emerald-50 text-emerald-600 border-emerald-100",
            spam: "bg-rose-50 text-rose-600 border-rose-100",
            done: "bg-slate-50 text-slate-600 border-slate-100"
        };
        return (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-100 min-w-[280px] max-w-[360px]">
            {/* Filters */}
            <div className="p-4 space-y-4">
                <div className="flex p-1 bg-slate-50 rounded-xl">
                    {["all", "new", "qualified", "spam"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === f
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search leads by subject or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center">
                        <Mail className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No leads found</p>
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <button
                            key={lead.id}
                            onClick={() => onSelectLead(lead)}
                            className={`w-full text-left p-4 border-b border-slate-50 transition-all hover:bg-slate-50/50 ${selectedLeadId === lead.id ? "bg-blue-50/50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold truncate max-w-[180px] ${selectedLeadId === lead.id ? "text-blue-900" : "text-slate-900"}`}>
                                    {lead.email_from}
                                </span>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(lead.created_at)}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mb-2">{lead.subject || "(No Subject)"}</p>
                            <StatusPill status={lead.status} />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
