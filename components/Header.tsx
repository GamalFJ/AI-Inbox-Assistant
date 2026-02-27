"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import NotificationBell from "./NotificationBell"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
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
                        <Image
                            src="/images/icon.png"
                            alt="AI Inbox Assistant Icon"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter group-hover:text-brand-orange transition-colors">
                        AI INBOX <span className="text-brand-orange">ASSISTANT</span>
                    </span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-white p-2 hover:bg-brand-card rounded-lg transition-colors"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4">
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

            {/* Mobile Nav Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-brand-border bg-brand-dark px-4 py-6 space-y-4 animate-slide-down">
                    {user ? (
                        <>
                            <Link onClick={() => setIsMenuOpen(false)} href="/dashboard" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Dashboard
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/analytics" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Analytics
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/roadmap" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Roadmap
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/guide" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Guide
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/settings" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Settings
                            </Link>
                            <div className="pt-4 flex items-center justify-between border-t border-brand-border">
                                <NotificationBell />
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="bg-brand-card border border-brand-border text-white px-6 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-widest"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link onClick={() => setIsMenuOpen(false)} href="/login" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Login
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/roadmap" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Roadmap
                            </Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/guide" className="block text-slate-300 hover:text-white transition-colors text-lg font-medium">
                                Guide
                            </Link>
                            <Link
                                onClick={() => setIsMenuOpen(false)}
                                href="/signup"
                                className="block w-full bg-brand-orange text-white px-5 py-4 rounded-xl text-center font-black uppercase tracking-widest shadow-lg"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

