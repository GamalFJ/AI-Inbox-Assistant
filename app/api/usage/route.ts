import { createClient } from "@/utils/supabase/server";
import { MONTHLY_CAP, getResetDate } from "@/utils/usage";
import type { UsageData, UsageLevel } from "@/utils/usage";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count leads created this calendar month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { count, error } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const used = count ?? 0;
    const percentage = Math.min(Math.round((used / MONTHLY_CAP) * 100), 100);

    let level: UsageLevel = "ok";
    if (percentage >= 100) level = "limit";
    else if (percentage >= 90) level = "critical";
    else if (percentage >= 75) level = "warning";

    const usageData: UsageData = {
        used,
        cap: MONTHLY_CAP,
        remaining: Math.max(MONTHLY_CAP - used, 0),
        percentage,
        level,
        resetDate: getResetDate(),
    };

    return NextResponse.json(usageData);
}
