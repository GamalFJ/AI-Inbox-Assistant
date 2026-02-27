import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

const FOUNDING_MEMBER_CAP = 200;

/**
 * GET /api/user-count
 *
 * Returns the number of paid (founding member) users.
 * This is publicly accessible — the number is shown on the landing page
 * to create real, honest urgency around the 200-seat cap.
 *
 * Uses service client to count profiles regardless of RLS.
 * Cache: 60 seconds — fresh enough for live urgency, cheap enough to run.
 */
export async function GET() {
    try {
        const supabase = createServiceClient();

        const { count, error } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("has_paid", true);

        if (error) {
            console.error("[user-count] Supabase error:", error);
            return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
        }

        const taken = count ?? 0;
        const remaining = Math.max(0, FOUNDING_MEMBER_CAP - taken);

        return NextResponse.json(
            { taken, remaining, cap: FOUNDING_MEMBER_CAP },
            {
                headers: {
                    // Cache for 60s on CDN, revalidate in background
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
                },
            }
        );
    } catch (err) {
        console.error("[user-count] Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
