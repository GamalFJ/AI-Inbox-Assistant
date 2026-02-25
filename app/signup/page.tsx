"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function SignupPage() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Start on Step 2 if middleware redirected here with ?step=pay
    const [accountCreated, setAccountCreated] = useState(
        searchParams.get("step") === "pay"
    )

    const supabase = createClient()

    // If ?step=pay, also make sure we really have a session (safety check)
    useEffect(() => {
        if (searchParams.get("step") === "pay") {
            setAccountCreated(true)
        }
    }, [searchParams])


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setAccountCreated(true)
            setLoading(false)
        }
    }

    /* ── Step 2: Account created — now pay ─────────────────── */
    if (accountCreated) {
        return (
            <div className="signup-bg min-h-[88vh] flex items-center justify-center px-4 py-16">
                <div className="signup-orb signup-orb-1" aria-hidden="true" />
                <div className="signup-orb signup-orb-2" aria-hidden="true" />

                <div className="signup-card relative z-10 w-full max-w-md animate-slide-up">
                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="signup-step signup-step--done">
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-300 to-blue-200" />
                        <div className="signup-step signup-step--active">2</div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Account created!
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            One last step
                        </h1>
                        <p className="text-gray-500 text-base leading-relaxed">
                            Complete your purchase to unlock lifetime access.
                        </p>
                    </div>

                    {/* Price summary */}
                    <div className="signup-price-box mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">AI Inbox Assistant</span>
                            <span className="text-gray-400 text-sm line-through mr-2">$29.99</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-500">Lifetime access · one-time payment</span>
                            <span className="text-2xl font-extrabold text-gray-900">$19.99</span>
                        </div>
                    </div>

                    {/* PayPal checkout button */}
                    <a
                        href="https://www.paypal.com/ncp/payment/5PUTY67JAYFMU"
                        id="signup-paypal-button"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="signup-btn-primary block w-full text-center py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 mb-4"
                    >
                        Pay $19.99 &nbsp;→&nbsp; Lifetime Access
                    </a>

                    <p className="text-center text-xs text-gray-400 leading-relaxed">
                        Secure checkout via PayPal. After payment you&apos;ll receive a confirmation email with your setup link.
                    </p>
                </div>
            </div>
        )
    }

    /* ── Step 1: Create account ─────────────────────────────── */
    return (
        <div className="signup-bg min-h-[88vh] flex items-center justify-center px-4 py-16">
            <div className="signup-orb signup-orb-1" aria-hidden="true" />
            <div className="signup-orb signup-orb-2" aria-hidden="true" />

            <div className="signup-card relative z-10 w-full max-w-md">
                {/* Progress indicator */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="signup-step signup-step--active">1</div>
                    <div className="flex-1 h-px bg-gray-200" />
                    <div className="signup-step signup-step--idle">2</div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8 animate-slide-up">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Create your account
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Already have one?{" "}
                        <Link href="/login" className="text-blue-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5 animate-slide-up-delay" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="signup-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="signup-input w-full px-4 py-3 rounded-xl text-sm"
                        />
                    </div>

                    <button
                        id="signup-submit-button"
                        type="submit"
                        disabled={loading}
                        className="signup-btn-primary w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Creating account…
                            </span>
                        ) : (
                            "Continue to Payment →"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                    By continuing you agree to our{" "}
                    <a href="#" className="text-blue-500 hover:underline">Terms</a> and{" "}
                    <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}
