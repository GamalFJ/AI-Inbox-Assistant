import { createClient } from "@/utils/supabase/server";
import { generateDraftForLead } from "@/utils/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { lead_id } = await req.json();

        // 1. Fetch the lead
        const { data: lead, error: leadError } = await supabase
            .from("leads")
            .select("*")
            .eq("id", lead_id)
            .eq("user_id", user.id)
            .single();

        if (leadError) throw new Error("Lead not found or access denied");

        // 2. Fetch the user's profile
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("business_type, example_replies, booking_link")
            .eq("id", user.id)
            .single();

        if (profileError) throw new Error("User profile not found");

        // 3. Call server-side AI helper
        const draftResult = await generateDraftForLead(lead, profile);

        // 4. Save to drafts table
        const { data: draft, error: draftError } = await supabase
            .from("drafts")
            .insert({
                lead_id: lead.id,
                user_id: user.id,
                suggested_subject: draftResult.suggested_subject,
                body: draftResult.draft_body,
                status: "pending"
            })
            .select()
            .single();


        if (draftError) throw draftError;

        return NextResponse.json(draft);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
