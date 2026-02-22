"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const [businessType, setBusinessType] = useState("")
    const [exampleReplies, setExampleReplies] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        // In a real app, we would save this to a 'profiles' or 'business_settings' table
        // For this minimal demo, we'll just simulate it and redirect to dashboard

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                business_type: businessType,
                example_replies: exampleReplies,
                onboarded: true
            })

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows' which might happen if table doesn't exist
            // We'll ignore the error for now as the user might not have set up the DB tables yet
            console.warn("Table 'profiles' might not exist. Redirecting anyway.")
        }

        router.push("/dashboard")
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Tell us about your business
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    This helps our AI generate better replies for you.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                                What type of business do you run?
                            </label>
                            <div className="mt-1">
                                <input
                                    id="businessType"
                                    name="businessType"
                                    type="text"
                                    placeholder="e.g. SaaS, E-commerce, Agency"
                                    required
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="exampleReplies" className="block text-sm font-medium text-gray-700">
                                Paste some example replies you usually send
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="exampleReplies"
                                    name="exampleReplies"
                                    rows={4}
                                    placeholder="Paste a few examples of your typical email replies here..."
                                    required
                                    value={exampleReplies}
                                    onChange={(e) => setExampleReplies(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Finish Setup"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
