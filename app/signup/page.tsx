"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

/* ─────────────────────────────────────────────────────────────────────────────
   Inner component — contains useSearchParams() so it must live inside
   a <Suspense> boundary (Next.js App Router requirement).
───────────────────────────────────────────────────────────────────────────── */
function SignupContent() {
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


    const isTrial = searchParams.get("trial") === "true"

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const callbackUrl = new URL(`${window.location.origin}/auth/callback`)
        if (isTrial) {
            callbackUrl.searchParams.set("trial", "true")
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: callbackUrl.toString(),
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


    /* ── Step 2: Account created — now activate/pay ─────────────────── */
    if (accountCreated) {
        return (
            <div className="signup-bg min-h-[90vh] flex items-center justify-center px-4 py-16">
                <div className="signup-orb signup-orb-1" aria-hidden="true" />
                <div className="signup-orb signup-orb-2" aria-hidden="true" />

                <div className="signup-card relative z-10 w-full max-w-md animate-slide-up">
                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="signup-step signup-step--done bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 h-px bg-brand-orange/30" />
                        <div className="signup-step signup-step--active bg-brand-orange text-white">2</div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8 flex flex-col items-center">
                        <Link href="/">
                            <Image
                                src="/images/icon.png"
                                alt="AI Inbox Assistant Icon"
                                width={64}
                                height={64}
                                className="h-16 w-16 object-contain mb-6 hover:scale-110 transition-transform duration-300"
                            />
                        </Link>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6 border border-emerald-500/20">
                            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {isTrial ? "Trial Reserved" : "Account secured"}
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
                            {isTrial ? "Check Email" : "Unlock Access"}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            {isTrial
                                ? "We've sent an activation link to your email. Click it to start your 3-day free trial instantly."
                                : "Join our founding members and secure lifetime access before the price increases."}
                        </p>
                    </div>

                    {!isTrial ? (
                        <>
                            {/* Price summary */}
                            <div className="bg-brand-dark/50 border border-brand-border rounded-2xl p-6 mb-8 shadow-inner text-left">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Product</span>
                                    <span className="text-slate-500 text-xs font-bold line-through mr-2 leading-none">$99 VALUE</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-bold text-sm">Lifetime Pro Access</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white">$19.99</span>
                                        <p className="text-[10px] text-brand-orange font-bold uppercase tracking-tighter">Limited Time Offer</p>
                                    </div>
                                </div>
                            </div>

                            {/* PayPal checkout button */}
                            <a
                                href="https://www.paypal.com/ncp/payment/5PUTY67JAYFMU"
                                id="signup-paypal-button"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-brand-orange hover:bg-brand-orange/90 text-white block w-full text-center py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20 transition-all active:scale-[0.98] mb-6"
                            >
                                Pay $19.99 &nbsp;→&nbsp; Secure Seat
                            </a>

                            <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                Secure checkout via PayPal. Instant activation.
                            </p>
                        </>
                    ) : (
                        <div className="bg-brand-dark/50 border border-brand-border rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-white font-bold mb-2">Awaiting Verification</p>
                            <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-black">
                                Check your inbox (and spam folder) for the confirmation link.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }


    /* ── Step 1: Create account ─────────────────────────────── */
    return (
        <div className="signup-bg min-h-[90vh] flex items-center justify-center px-4 py-16">
            <div className="signup-orb signup-orb-1" aria-hidden="true" />
            <div className="signup-orb signup-orb-2" aria-hidden="true" />

            <div className="signup-card relative z-10 w-full max-w-md">
                {/* Progress indicator */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="signup-step signup-step--active bg-brand-orange text-white">1</div>
                    <div className="flex-1 h-px bg-brand-border" />
                    <div className="signup-step signup-step--idle bg-brand-dark border border-brand-border text-slate-600">2</div>
                </div>

                {/* Heading */}
                <div className="text-center mb-10 animate-slide-up flex flex-col items-center">
                    <Link href="/">
                        <Image
                            src="/images/icon.png"
                            alt="AI Inbox Assistant Icon"
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain mb-8 hover:scale-110 transition-transform duration-300"
                        />
                    </Link>
                    <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
                        {isTrial ? "Start Your Trial" : "Get Started"}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">
                        {isTrial ? "Create your free account to begin." : "Already have an account?"}
                        {isTrial ? "" : (
                            <>
                                {" "}
                                <Link href="/login" className="text-brand-orange font-bold underline hover:text-brand-yellow transition-colors">
                                    Sign in
                                </Link>
                            </>
                        )}
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6 animate-slide-up-delay" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-500/10 text-red-400 px-5 py-4 rounded-xl text-xs font-bold border border-red-500/20 uppercase tracking-widest leading-relaxed">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
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
                            className="w-full px-4 py-4 bg-brand-dark border border-brand-border text-white rounded-xl text-sm font-medium placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
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
                            className="w-full px-4 py-4 bg-brand-dark border border-brand-border text-white rounded-xl text-sm font-medium placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
                        />
                    </div>

                    <button
                        id="signup-submit-button"
                        type="submit"
                        disabled={loading}
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-brand-orange/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            isTrial ? "Start 3-Day Free Trial →" : "Continue to Payment →"
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Step 1 of 2: Create Secure Account
                    </p>
                </form>

                <p className="mt-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                    By continuing you agree to our{" "}
                    <a href="#" className="text-brand-orange hover:underline">Terms</a> and{" "}
                    <a href="#" className="text-brand-orange hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Default export — wraps the content in a Suspense boundary so that
   useSearchParams() doesn't cause a prerender failure in Next.js App Router.
───────────────────────────────────────────────────────────────────────────── */
export default function SignupPage() {
    return (
        <Suspense
            fallback={
                <div className="signup-bg min-h-[88vh] flex items-center justify-center px-4 py-16">
                    <div className="signup-orb signup-orb-1" aria-hidden="true" />
                    <div className="signup-orb signup-orb-2" aria-hidden="true" />
                </div>
            }
        >
            <SignupContent />
        </Suspense>
    )
}
