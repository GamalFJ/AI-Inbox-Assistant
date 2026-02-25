"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number; // ms, default 4500
}

export interface Notification {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextValue {
    /** Fire a toast (also logged to the bell history). */
    notify: (toast: Omit<Toast, "id">) => void;
    /** Mark all bell notifications as read. */
    markAllRead: () => void;
    /** Unread bell count. */
    unreadCount: number;
    /** All historical notifications (for the bell dropdown). */
    notifications: Notification[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
    return ctx;
}

// ─── Toast config ─────────────────────────────────────────────────────────────

const TOAST_CONFIG: Record<
    ToastType,
    { Icon: React.ElementType; bg: string; border: string; iconColor: string; titleColor: string }
> = {
    success: {
        Icon: CheckCircle,
        bg: "bg-white",
        border: "border-emerald-200",
        iconColor: "text-emerald-500",
        titleColor: "text-slate-900",
    },
    error: {
        Icon: XCircle,
        bg: "bg-white",
        border: "border-red-200",
        iconColor: "text-red-500",
        titleColor: "text-slate-900",
    },
    warning: {
        Icon: AlertTriangle,
        bg: "bg-white",
        border: "border-amber-200",
        iconColor: "text-amber-500",
        titleColor: "text-slate-900",
    },
    info: {
        Icon: Info,
        bg: "bg-white",
        border: "border-blue-200",
        iconColor: "text-blue-500",
        titleColor: "text-slate-900",
    },
};

// ─── Individual Toast ─────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast & { visible: boolean }; onDismiss: (id: string) => void }) {
    const cfg = TOAST_CONFIG[toast.type];
    const Icon = cfg.Icon;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`
                flex items-start gap-3 w-full max-w-sm p-4 rounded-2xl border shadow-xl
                ${cfg.bg} ${cfg.border}
                transition-all duration-300 ease-out
                ${toast.visible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }
            `}
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)" }}
        >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug ${cfg.titleColor}`}>{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 p-0.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                aria-label="Dismiss notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Toast Container ──────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: (Toast & { visible: boolean })[]; onDismiss: (id: string) => void }) {
    return (
        <div
            aria-label="Notifications"
            className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end w-full max-w-sm pointer-events-none"
        >
            {toasts.map((t) => (
                <div key={t.id} className="pointer-events-auto w-full">
                    <ToastItem toast={t} onDismiss={onDismiss} />
                </div>
            ))}
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

let idCounter = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<(Toast & { visible: boolean })[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        // Start exit animation
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
        // Remove after animation
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 350);
    }, []);

    const notify = useCallback((payload: Omit<Toast, "id">) => {
        const id = `toast-${++idCounter}-${Date.now()}`;
        const duration = payload.duration ?? 4500;

        // Add to toast queue (invisible first for enter animation)
        setToasts((prev) => [...prev, { ...payload, id, visible: false }]);

        // Trigger enter animation on next frame
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
            });
        });

        // Add to notification history
        setNotifications((prev) => [
            {
                id,
                type: payload.type,
                title: payload.title,
                message: payload.message,
                timestamp: new Date(),
                read: false,
            },
            ...prev.slice(0, 49), // keep last 50
        ]);

        // Auto-dismiss
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
    }, [dismiss]);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Cleanup timers on unmount
    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach((t) => clearTimeout(t));
    }, []);

    return (
        <NotificationContext.Provider value={{ notify, markAllRead, unreadCount, notifications }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </NotificationContext.Provider>
    );
}
