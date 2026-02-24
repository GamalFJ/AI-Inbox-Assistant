import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { business_type, business_email, example_replies, booking_link } = await req.json();

        const { data, error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                business_type,
                business_email,
                example_replies,
                booking_link,
                onboarded: true,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
