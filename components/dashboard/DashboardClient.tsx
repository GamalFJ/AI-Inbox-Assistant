"use client";

import { useState, useEffect, useCallback } from "react";
import { Lead, Draft, LeadStatus, Task } from "@/types";
import TopBar from "./TopBar";
import LeadList from "./LeadList";
import LeadDetails from "./LeadDetails";
import NewLeadModal from "./NewLeadModal";
import { Menu, X } from "lucide-react";
import { useNotification } from "@/components/NotificationContext";

interface DashboardClientProps {
    initialLeads: Lead[];
    initialDrafts: Draft[];
}

export default function DashboardClient({ initialLeads, initialDrafts }: DashboardClientProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
    const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // For mobile toggle

    const { notify } = useNotification();

    const selectedLead = (leads || []).find(l => l.id === selectedLeadId) || null;
    const selectedDraft = (drafts || []).find(d => d.lead_id === selectedLeadId);

    // ── Overdue task check on mount ──────────────────────────────────────
    const checkOverdueTasks = useCallback(async () => {
        try {
            const res = await fetch("/api/tasks");
            if (!res.ok) return;
            const tasks: Task[] = await res.json();
            const now = new Date();
            const overdue = tasks.filter(
                (t) => t.status === "pending" && new Date(t.due_at) < now
            );
            if (overdue.length > 0) {
                notify({
                    type: "warning",
                    title: `${overdue.length} overdue follow-up${overdue.length > 1 ? "s" : ""}`,
                    message: `You have tasks that are past their due date. Check your leads for details.`,
                    duration: 7000,
                });
            }
        } catch {
            // silent — task polling is best-effort
        }
    }, [notify]);

    useEffect(() => {
        checkOverdueTasks();
    }, [checkOverdueTasks]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleNewLead = async (newLeadData: { email_from: string; subject: string; body: string }) => {
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLeadData),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setLeads([data, ...leads]);
            setSelectedLeadId(data.id);
            // On mobile, close sidebar when selecting a lead
            if (window.innerWidth < 768) setIsSidebarOpen(false);

            notify({
                type: "success",
                title: "New lead added",
                message: `"${newLeadData.subject}" from ${newLeadData.email_from}`,
            });
        } catch (error) {
            console.error("Failed to create lead:", error);
            notify({
                type: "error",
                title: "Failed to add lead",
                message: error instanceof Error ? error.message : "An unexpected error occurred.",
            });
        }
    };

    const handleUpdateStatus = async (status: LeadStatus) => {
        if (!selectedLeadId) return;
        const prevLeads = leads;
        try {
            // Optimistic update
            setLeads(leads.map(l => l.id === selectedLeadId ? { ...l, status } : l));

            const res = await fetch("/api/leads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedLeadId, status }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            notify({
                type: "success",
                title: "Status updated",
                message: `Lead marked as "${status}".`,
                duration: 2500,
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            setLeads(prevLeads); // Revert optimistic update
            notify({
                type: "error",
                title: "Status update failed",
                message: error instanceof Error ? error.message : "Could not save the new status.",
            });
        }
    };

    const handleSelectLead = (lead: Lead) => {
        setSelectedLeadId(lead.id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden">
            <TopBar onNewLead={() => setIsModalOpen(true)} />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <div className={`
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 transition-transform duration-300 ease-in-out
                    fixed md:relative z-40 h-full w-[300px] md:w-auto shrink-0
                    bg-white
                `}>
                    <LeadList
                        leads={leads}
                        selectedLeadId={selectedLeadId}
                        onSelectLead={handleSelectLead}
                    />
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                    />
                )}

                <LeadDetails
                    lead={selectedLead}
                    draft={selectedDraft}
                    onUpdateLeadStatus={handleUpdateStatus}
                    onNewLead={() => setIsModalOpen(true)}
                />
            </div>

            <NewLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleNewLead}
            />
        </div>
    );
}
