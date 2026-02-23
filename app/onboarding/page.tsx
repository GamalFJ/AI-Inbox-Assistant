"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Briefcase, MessageSquare, Link as LinkIcon, CheckCircle, Sparkles } from "lucide-react"

const BUSINESS_TYPES = ["Coach", "Consultant", "Agency", "Freelancer"]

export default function OnboardingPage() {
    const [businessType, setBusinessType] = useState("")
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Loading your profile...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                        Personalize your AI
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto">
                        Teach the assistant about your business and tone so it can handle your leads perfectly.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
                                    <span className="font-bold mr-2">Error:</span>
                                    {error}
                                </div>
                            )}

                            {/* Business Type */}
                            <div className="transition-all duration-300">
                                <label className="flex items-center text-base font-bold text-slate-800 mb-4">
                                    <Briefcase className="w-5 h-5 mr-3 text-blue-600" />
                                    What best describes your business?
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {BUSINESS_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setBusinessType(type)}
                                            className={`
                                                px-2 py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-200
                                                ${businessType === type
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 ring-4 ring-blue-50"
                                                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Example Replies */}
                            <div className="transition-all duration-300">
                                <label htmlFor="exampleReplies" className="flex items-center text-base font-bold text-slate-800 mb-4">
                                    <MessageSquare className="w-5 h-5 mr-3 text-blue-600" />
                                    Paste 2–3 example replies you&apos;ve sent
                                </label>
                                <textarea
                                    id="exampleReplies"
                                    required
                                    rows={5}
                                    placeholder="e.g. 'Hey [Name], thanks for reaching out! I'd love to jump on a call to see how I can help...'"
                                    value={exampleReplies}
                                    onChange={(e) => setExampleReplies(e.target.value)}
                                    className="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-600 placeholder:text-slate-400 p-4 bg-slate-50/50"
                                />
                                <p className="mt-3 text-sm text-slate-500">
                                    The AI uses these to match your unique brand voice and formatting.
                                </p>
                            </div>

                            {/* Booking Link */}
                            <div className="transition-all duration-300">
                                <label htmlFor="bookingLink" className="flex items-center text-base font-bold text-slate-800 mb-4">
                                    <LinkIcon className="w-5 h-5 mr-3 text-blue-600" />
                                    Your booking or contact link
                                </label>
                                <div className="relative">
                                    <input
                                        id="bookingLink"
                                        type="url"
                                        required
                                        placeholder="https://calendly.com/your-name"
                                        value={bookingLink}
                                        onChange={(e) => setBookingLink(e.target.value)}
                                        className="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-600 placeholder:text-slate-400 pl-4 pr-4 py-4 bg-slate-50/50"
                                    />
                                </div>
                                <p className="mt-3 text-sm text-slate-500">
                                    Calendly, contact page, etc. where you want leads to go.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !businessType}
                                className={`
                                    w-full flex justify-center items-center py-5 px-6 rounded-2xl text-lg font-bold text-white transition-all duration-500
                                    ${loading || !businessType
                                        ? "bg-slate-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 hover:shadow-blue-400 group"
                                    }
                                `}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                        Saving your settings...
                                    </div>
                                ) : (
                                    <>
                                        Save & Continue
                                        <CheckCircle className="ml-3 w-6 h-6 transition-transform group-hover:scale-110" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-slate-400 text-sm">
                    You can always update these settings later in your dashboard.
                </p>
            </div>
        </div>
    )
}
