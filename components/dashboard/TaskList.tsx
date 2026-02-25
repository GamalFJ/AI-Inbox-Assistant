"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Task } from "@/types";

interface TaskListProps {
    leadId: string;
}

export default function TaskList({ leadId }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tasks?lead_id=${leadId}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [leadId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const toggleTask = async (task: Task) => {
        const newStatus = task.status === "completed" ? "pending" : "completed";

        // Optimistic update
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

        try {
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: task.id, status: newStatus }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
        } catch (error) {
            console.error("Failed to update task:", error);
            // Revert on error
            fetchTasks();
        }
    };

    if (loading && tasks.length === 0) {
        return <div className="animate-pulse flex space-y-2 flex-col">
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
        </div>;
    }

    if (tasks.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Follow-up Schedule
                <div className="h-[1px] flex-1 bg-slate-100"></div>
            </h4>
            <div className="space-y-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${task.status === "completed"
                            ? "bg-slate-50 border-slate-100 opacity-60"
                            : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {task.status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-slate-300" />
                            )}
                            <span className={`text-sm font-medium ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-700"}`}>
                                {task.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {new Date(task.due_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
