import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { Lead, Draft } from "@/types"

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/login")
    }

    // Fetch leads
    const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    // Fetch drafts
    const { data: drafts } = await supabase
        .from("drafts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    return <DashboardClient initialLeads={(leads || []) as Lead[]} initialDrafts={(drafts || []) as Draft[]} />
}
