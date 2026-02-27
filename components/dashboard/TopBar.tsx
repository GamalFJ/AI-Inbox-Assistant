"use client";

import { Plus, Settings, BarChart3, Map, HelpCircle } from "lucide-react";
import Link from "next/link";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";


interface TopBarProps {
    onNewLead: () => void;
}

export default function TopBar({ onNewLead }: TopBarProps) {
    const startTutorial = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                { element: '#tour-topbar', popover: { title: 'Welcome!', description: 'This is the AI Inbox Assistant. I will guide you through the main features.' } },
                { element: '#tour-lead-list', popover: { title: 'Lead List', description: 'Here are all your incoming leads. You can search or filter them by status.' } },
                { element: '#tour-lead-details', popover: { title: 'Lead Details', description: 'Select a lead to see its details, update its status, and manage tasks.' } },
                { element: '#tour-draft-panel', popover: { title: 'Drafts', description: 'Once a lead is selected, AI will generate suggested replies. You can edit and send them here.' } },
                { element: '#tour-new-lead', popover: { title: 'New Lead', description: 'Click here to manually add a new lead anytime.' } }
            ]
        });
        driverObj.drive();
    };

    return (
        <div id="tour-topbar" className="h-20 border-b border-brand-border bg-brand-dark/50 backdrop-blur-md px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img
                    src="/images/icon.png"
                    alt="AI Inbox Assistant Icon"
                    className="h-12 w-12 object-contain hover:scale-110 transition-transform duration-300"
                />
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">Inbox Assistant</h1>
                    <p className="text-sm text-slate-400">Review leads, generate drafts, never miss a follow-up.</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/roadmap"
                    title="Roadmap"
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border bg-brand-card text-slate-400 hover:text-brand-yellow hover:border-brand-yellow/30 transition-all"
                >
                    <Map className="w-5 h-5" />
                </Link>
                <Link
                    href="/analytics"
                    title="Analytics"
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border bg-brand-card text-slate-400 hover:text-brand-orange hover:border-brand-orange/30 transition-all"
                >
                    <BarChart3 className="w-5 h-5" />
                </Link>
                <Link
                    href="/settings"
                    title="Settings"
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border bg-brand-card text-slate-400 hover:text-white hover:border-white/30 transition-all"
                >
                    <Settings className="w-5 h-5" />
                </Link>
                <button
                    onClick={startTutorial}
                    title="Start Tutorial"
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border bg-brand-card text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 transition-all"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button
                    id="tour-new-lead"
                    onClick={onNewLead}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white font-semibold rounded-xl hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/10 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Lead</span>
                </button>
            </div>
        </div>
    );
}
