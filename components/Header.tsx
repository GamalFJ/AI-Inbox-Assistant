"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import NotificationBell from "./NotificationBell"

export default function Header() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <header className="border-b border-[#353C40] bg-[#1C2023]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-10 w-10 transition-transform group-hover:scale-110 duration-300">
                        <img
                            src="/images/icon.png"
                            alt="AI Inbox Assistant Icon"
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter group-hover:text-brand-orange transition-colors">
                        AI INBOX <span className="text-brand-orange">ASSISTANT</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link href="/analytics" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Analytics
                            </Link>
                            <Link href="/roadmap" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Roadmap
                            </Link>
                            <Link href="/guide" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Guide
                            </Link>
                            <Link href="/settings" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Settings
                            </Link>
                            <NotificationBell />
                            <button
                                onClick={handleLogout}
                                className="bg-brand-dark border border-brand-border text-white px-4 py-2 rounded-xl hover:bg-brand-card transition-all text-xs font-black uppercase tracking-widest"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Login
                            </Link>
                            <Link href="/roadmap" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Roadmap
                            </Link>
                            <Link href="/guide" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                                Guide
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-brand-orange text-white px-5 py-2 rounded-xl hover:bg-brand-orange/90 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-orange/20"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

