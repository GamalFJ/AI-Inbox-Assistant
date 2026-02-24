import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("business_type, business_email, example_replies, booking_link, onboarded")
        .eq("id", user.id)
        .single();

    if (error) {
        // If no profile row yet, return nulls
        return NextResponse.json({
            business_type: null,
            business_email: null,
            example_replies: null,
            booking_link: null,
            onboarded: false,
        });
    }

    return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Settings update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
