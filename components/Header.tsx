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
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    AI Inbox Assistant
                </Link>

                <nav className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                                Analytics
                            </Link>
                            <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                                Settings
                            </Link>
                            <NotificationBell />
                            <button
                                onClick={handleLogout}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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

