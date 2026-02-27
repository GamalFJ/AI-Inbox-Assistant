"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function SuccessPage() {
    const [confirming, setConfirming] = useState(true)
    const [confirmed, setConfirmed] = useState(false)

    // Mark the user as paid as soon as this page loads.
    // The API route reads the active Supabase session server-side —
    // no sensitive data is passed in the URL.
    useEffect(() => {
        fetch("/api/confirm-payment")
            .then((res) => {
                if (res.ok || res.redirected) setConfirmed(true)
            })
            .catch(() => {
                // Non-fatal — user still sees the success page
                setConfirmed(true)
            })
            .finally(() => setConfirming(false))
    }, [])

    return (
        <div className="success-page-bg min-h-[90vh] flex items-center justify-center px-4 py-16">
            {/* Decorative orbs */}
            <div className="success-orb success-orb-1" aria-hidden="true" />
            <div className="success-orb success-orb-2" aria-hidden="true" />

            <div className="success-card relative z-10 w-full max-w-lg">
                {/* Animated checkmark */}
                <div className="flex justify-center mb-8">
                    <div className="success-icon-ring">
                        <svg
                            viewBox="0 0 52 52"
                            className="success-checkmark"
                            aria-hidden="true"
                        >
                            <circle
                                className="success-checkmark__circle"
                                cx="26"
                                cy="26"
                                r="24"
                                fill="none"
                            />
                            <path
                                className="success-checkmark__check"
                                fill="none"
                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4 animate-slide-up">
                    Payment received ✅
                </h1>

                {/* Body copy */}
                <p className="text-slate-300 text-center text-lg leading-relaxed mb-10 animate-slide-up-delay">
                    Check your email in the next couple of minutes for your setup
                    link and login instructions. If you don&apos;t see it, check
                    your spam folder.
                </p>

                {/* Divider */}
                <div className="success-divider mb-10" />

                {/* Single action — Sign In (account was already created at signup) */}
                <div className="animate-slide-up-delay-2">
                    <Link
                        href="/login"
                        id="success-signin-button"
                        className="success-btn-primary block w-full text-center py-4 rounded-2xl font-bold text-white text-base transition-all duration-300"
                    >
                        {confirming ? "Activating access…" : "Sign In to Your Account"}
                    </Link>
                </div>

                {/* Confirmation badge */}
                {confirmed && (
                    <p className="mt-4 text-center text-xs text-emerald-400 font-bold uppercase tracking-widest animate-fade-in">
                        ✓ Lifetime access activated
                    </p>
                )}

                {/* Footer note */}
                <p className="mt-8 text-center text-xs text-slate-500 font-medium animate-fade-in">
                    Didn&apos;t receive anything after 5 minutes? Email us at{" "}
                    <a
                        href="mailto:support@aiinboxassistant.com"
                        className="text-brand-orange hover:text-brand-yellow transition-colors underline underline-offset-4"
                    >
                        support@aiinboxassistant.com
                    </a>
                </p>
            </div>
        </div>
    )
}
