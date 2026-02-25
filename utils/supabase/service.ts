import { createClient } from "@supabase/supabase-js";

/**
 * createServiceClient
 *
 * Returns a Supabase client that uses the SERVICE_ROLE_KEY.
 * This bypasses Row Level Security and can see ALL rows across ALL users.
 *
 * ⚠️  ONLY use this in server-side code (API routes, cron jobs).
 *     NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Usage:
 *   const supabase = createServiceClient();
 *   const { data } = await supabase.from("profiles").select("*");
 */
export function createServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
            "Add SUPABASE_SERVICE_ROLE_KEY to your .env.local (from Supabase Dashboard → Settings → API)."
        );
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
