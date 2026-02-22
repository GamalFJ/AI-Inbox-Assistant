import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { MessageSquare, Settings, BarChart } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user.email}</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    New Reply
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: "Replies Drafted", value: "124", icon: <MessageSquare className="text-blue-600" /> },
                    { label: "Hours Saved", value: "12.5", icon: <BarChart className="text-green-600" /> },
                    { label: "Business Type", value: "Set in Onboarding", icon: <Settings className="text-gray-600" /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">Recent Drafts</h2>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex flex-col md:flex-row justify-between border-b border-gray-50 pb-6 last:border-0 last:pb-0 gap-4">
                                <div className="max-w-xl">
                                    <h4 className="font-semibold text-gray-900">Reply to: Inquiry about pricing</h4>
                                    <p className="text-sm text-gray-500 mt-1">Generated 2 hours ago • Context: Standard SaaS</p>
                                    <p className="text-gray-600 mt-3 line-clamp-2">
                                        "Hi there, thanks for reaching out. Our standard pricing starts at $19/mo. We also have a custom plan for larger teams..."
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button className="text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Copy</button>
                                    <button className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition">Email</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
