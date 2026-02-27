import { SupabaseClient } from "@supabase/supabase-js";

export const MONTHLY_CAP = 200;

export type UsageLevel = "ok" | "warning" | "critical" | "limit";

export interface UsageData {
    used: number;
    cap: number;
    remaining: number;
    percentage: number;
    level: UsageLevel;
    resetDate: string;
}

/**
 * Returns the number of leads created for a given user in the current calendar month.
 */
export async function getMonthlyLeadCount(supabase: SupabaseClient, userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { count } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth)
        .lt("created_at", endOfMonth);

    return count ?? 0;
}

/**
 * Returns the first day of next month as an ISO string (the reset date).
 */
export function getResetDate(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
}

/**
 * Returns true if the user has reached or exceeded their monthly cap.
 */
export async function isAtCap(supabase: SupabaseClient, userId: string): Promise<boolean> {
    const count = await getMonthlyLeadCount(supabase, userId);
    return count >= MONTHLY_CAP;
}
