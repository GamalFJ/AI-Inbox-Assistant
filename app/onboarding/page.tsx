"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Briefcase, MessageSquare, Link as LinkIcon, CheckCircle, Sparkles, Mail as MailIcon } from "lucide-react"

const BUSINESS_TYPES = ["Coach", "Consultant", "Agency", "Freelancer"]

export default function OnboardingPage() {
    const [businessType, setBusinessType] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const [exampleReplies, setExampleReplies] = useState("")
    const [bookingLink, setBookingLink] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/login")
            } else {
                setIsCheckingAuth(false)
            }
        }
        checkUser()
    }, [router, supabase.auth])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    business_type: businessType,
                    business_email: businessEmail,
                    example_replies: exampleReplies,
                    booking_link: bookingLink,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to save profile")
            }

            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-darker">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mb-4"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-darker py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-brand-orange rounded-2xl mb-6 shadow-lg shadow-brand-orange/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl mb-4">
                        Personalize your AI
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
                        Teach the assistant about your business and tone so it can handle your leads perfectly.
                    </p>
                </div>

                <div className="bg-brand-card rounded-[2.5rem] shadow-2xl border border-brand-border overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
                                    <span className="font-bold mr-2">Error:</span>
                                    {error}
                                </div>
                            )}

                            {/* Business Type */}
                            <div>
                                <label className="flex items-center text-sm font-black text-white uppercase tracking-widest mb-4">
                                    <Briefcase className="w-4 h-4 mr-3 text-brand-orange" />
                                    What best describes your business?
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {BUSINESS_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBusinessType(type)}
                                            className={`
                                                px-2 py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300
                                                ${businessType === type
                                                    ? "bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/20"
                                                    : "bg-brand-dark border-brand-border text-slate-500 hover:border-brand-orange/30 hover:text-slate-300"
                                                }
                                            `}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Business Email */}
                            <div>
                                <label htmlFor="businessEmail" className="flex items-center text-sm font-black text-white uppercase tracking-widest mb-4">
                                    <MailIcon className="w-4 h-4 mr-3 text-brand-orange" />
                                    Business email (where leads come in)
                                </label>
                                <input
                                    id="businessEmail"
                                    type="email"
                                    required
                                    placeholder="hello@yourbusiness.com"
                                    value={businessEmail}
                                    onChange={(e) => setBusinessEmail(e.target.value)}
                                    className="block w-full rounded-2xl border-brand-border shadow-sm focus:border-brand-orange focus:ring-brand-orange text-white placeholder:text-slate-600 p-4 bg-brand-dark/50"
                                />
                            </div>

                            {/* Example Replies */}
                            <div>
                                <label htmlFor="exampleReplies" className="flex items-center text-sm font-black text-white uppercase tracking-widest mb-4">
                                    <MessageSquare className="w-4 h-4 mr-3 text-brand-orange" />
                                    Paste 3–5 example replies you&apos;ve sent
                                </label>
                                <textarea
                                    id="exampleReplies"
                                    required
                                    rows={5}
                                    placeholder="e.g. 'Hey [Name], thanks for reaching out! I'd love to jump on a call to see how I can help...'"
                                    value={exampleReplies}
                                    onChange={(e) => setExampleReplies(e.target.value)}
                                    className="block w-full rounded-2xl border-brand-border shadow-sm focus:border-brand-orange focus:ring-brand-orange text-white placeholder:text-slate-600 p-4 bg-brand-dark/50"
                                />
                                <p className="mt-3 text-xs text-slate-500 font-medium">
                                    The AI uses these to match your unique brand voice and formatting.
                                </p>
                            </div>

                            {/* Booking Link */}
                            <div>
                                <label htmlFor="bookingLink" className="flex items-center text-sm font-black text-white uppercase tracking-widest mb-4">
                                    <LinkIcon className="w-4 h-4 mr-3 text-brand-orange" />
                                    Booking or contact link
                                </label>
                                <div className="relative">
                                    <input
                                        id="bookingLink"
                                        type="url"
                                        required
                                        placeholder="https://calendly.com/your-name"
                                        value={bookingLink}
                                        onChange={(e) => setBookingLink(e.target.value)}
                                        className="block w-full rounded-2xl border-brand-border shadow-sm focus:border-brand-orange focus:ring-brand-orange text-white placeholder:text-slate-600 p-4 bg-brand-dark/50"
                                    />
                                </div>
                                <p className="mt-3 text-xs text-slate-500 font-medium">
                                    Calendly, contact page, etc. where you want leads to go.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !businessType}
                                className={`
                                    w-full flex justify-center items-center py-5 px-6 rounded-2xl text-lg font-black text-white transition-all duration-500
                                    ${loading || !businessType
                                        ? "bg-brand-dark border border-brand-border text-slate-600 cursor-not-allowed"
                                        : "bg-brand-orange hover:bg-brand-orange/90 shadow-2xl shadow-brand-orange/20 group"
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center uppercase tracking-widest text-xs">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Saving Profile...
                                    </div>
                                ) : (
                                    <>
                                        Finish Setup
                                        <CheckCircle className="ml-3 w-6 h-6 transition-transform group-hover:scale-110" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    You can update these later in your dashboard
                </p>
            </div>
        </div>
    )
}
