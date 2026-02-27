"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface NewLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (lead: { email_from: string; subject: string; body: string }) => void;
}

export default function NewLeadModal({ isOpen, onClose, onSave }: NewLeadModalProps) {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({ email_from: email, subject, body: message });
            setEmail("");
            setSubject("");
            setMessage("");
            onClose();
        } catch (error) {
            console.error("Failed to save lead:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-brand-card border border-brand-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-dark/30">
                    <h2 className="text-xl font-bold text-white">Create New Lead</h2>
                    <button onClick={onClose} className="p-2 hover:bg-brand-dark rounded-full transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">From (Email)</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="potential_client@example.com"
                            className="w-full px-4 py-2 bg-brand-dark border border-brand-border text-white rounded-xl placeholder:text-slate-600 focus:ring-2 focus:ring-brand-orange/20 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Subject</label>
                        <input
                            required
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Inquiry about services"
                            className="w-full px-4 py-2 bg-brand-dark border border-brand-border text-white rounded-xl placeholder:text-slate-600 focus:ring-2 focus:ring-brand-orange/20 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Message</label>
                        <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Paste the email body here..."
                            className="w-full px-4 py-2 bg-brand-dark border border-brand-border text-white rounded-xl placeholder:text-slate-600 focus:ring-2 focus:ring-brand-orange/20 outline-none transition resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-brand-dark border border-brand-border text-slate-400 font-bold rounded-xl hover:bg-brand-card hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-brand-orange text-white font-bold rounded-xl hover:bg-brand-orange/90 transition shadow-lg shadow-brand-orange/10 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Lead"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
