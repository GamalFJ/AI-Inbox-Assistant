"use client";

import { Plus } from "lucide-react";

interface TopBarProps {
    onNewLead: () => void;
}

export default function TopBar({ onNewLead }: TopBarProps) {
    return (
        <div className="h-20 border-b border-slate-100 bg-white px-8 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Inbox Assistant</h1>
                <p className="text-sm text-slate-500">Review leads, generate drafts, never miss a follow-up.</p>
            </div>

            <button
                onClick={onNewLead}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
                <Plus className="w-5 h-5" />
                <span>New Lead</span>
            </button>
        </div>
    );
}
