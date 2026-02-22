import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse as Res } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return Res.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email_from, subject, body } = await req.json();

        const { data, error } = await supabase
            .from("leads")
            .insert({
                user_id: user.id,
                email_from,
                subject,
                body,
                status: "new"
            })
            .select()
            .single();

        if (error) throw error;

        return Res.json(data);
    } catch (error: any) {
        return Res.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return Res.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return Res.json(data);
    } catch (error: any) {
        return Res.json({ error: error.message }, { status: 500 });
    }
}
