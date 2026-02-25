"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, CheckCheck } from "lucide-react";
import { useNotification, Notification, ToastType } from "./NotificationContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const TYPE_ICON: Record<ToastType, { Icon: React.ElementType; color: string; bg: string }> = {
    success: { Icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    error: { Icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
    warning: { Icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
    info: { Icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
};

// ─── Notification Row ─────────────────────────────────────────────────────────

function NotificationRow({ n }: { n: Notification }) {
    const { Icon, color, bg } = TYPE_ICON[n.type];
    return (
        <div className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${!n.read ? "bg-blue-50/40" : ""}`}>
            <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${n.read ? "text-slate-600 font-medium" : "text-slate-900 font-semibold"}`}>
                    {n.title}
                </p>
                {n.message && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{n.message}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{timeAgo(n.timestamp)}</p>
            </div>
            {!n.read && (
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            )}
        </div>
    );
}

// ─── Bell ─────────────────────────────────────────────────────────────────────

export default function NotificationBell() {
    const { notifications, unreadCount, markAllRead } = useNotification();
    const [open, setOpen] = useState(false);
    const [animateBell, setAnimateBell] = useState(false);
    const prevUnread = useRef(unreadCount);
    const panelRef = useRef<HTMLDivElement>(null);

    // Wiggle bell when new notifications arrive
    useEffect(() => {
        if (unreadCount > prevUnread.current) {
            setAnimateBell(true);
            setTimeout(() => setAnimateBell(false), 700);
        }
        prevUnread.current = unreadCount;
    }, [unreadCount]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const handleOpen = () => {
        setOpen((o) => !o);
        if (!open) markAllRead();
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                id="notification-bell-btn"
                onClick={handleOpen}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                className={`
                    relative flex items-center justify-center w-9 h-9 rounded-xl
                    text-gray-500 hover:text-blue-600 hover:bg-blue-50
                    transition-all duration-200
                    ${animateBell ? "animate-bell-ring" : ""}
                `}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none animate-pop-in shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {open && (
                <div
                    id="notification-panel"
                    className="absolute right-0 top-12 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-slide-down"
                    style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                        <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                    <Bell className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">All caught up!</p>
                                <p className="text-xs text-slate-400 mt-1">Notifications will appear here.</p>
                            </div>
                        ) : (
                            notifications.map((n) => <NotificationRow key={n.id} n={n} />)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
