"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-darker">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <Link href="/">
                    <Image
                        src="/images/icon.png"
                        alt="AI Inbox Assistant Icon"
                        width={80}
                        height={80}
                        className="h-20 w-20 object-contain mb-8 hover:scale-110 transition-transform duration-300"
                    />
                </Link>
                <h2 className="text-center text-4xl font-black text-white uppercase tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-4 text-center text-sm text-slate-400 font-medium">
                    Or{' '}
                    <Link href="/signup" className="text-brand-orange hover:text-brand-yellow font-bold underline transition-colors">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-brand-card py-10 px-6 shadow-2xl border border-brand-border sm:rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold border border-red-500/20 uppercase tracking-widest leading-relaxed">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl shadow-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all sm:text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-xl shadow-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl text-sm font-black uppercase tracking-widest text-white bg-brand-orange hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange/50 disabled:opacity-50 transition-all active:scale-95 shadow-brand-orange/20"
                            >
                                {loading ? "Authenticating..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
