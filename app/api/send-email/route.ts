import { Resend } from 'resend';
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { lead_id, draft_id, subject, body } = await req.json();

        // 1. Fetch the lead to get the recipient email
        const { data: lead, error: leadError } = await supabase
            .from("leads")
            .select("email_from")
            .eq("id", lead_id)
            .eq("user_id", user.id)
            .single();

        if (leadError || !lead) throw new Error("Lead not found");

        // 2. Fetch the user's profile for the "From" name
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("business_type")
            .eq("id", user.id)
            .single();

        const senderName = profile?.business_type || "Assistant";

        // 3. Send the email via Resend
        // NOTE: In production, you'd use a verified domain. 
        // For testing with Resend's free tier, you can only send to your own email if using 'onboarding@resend.dev'
        const { data, error } = await resend.emails.send({
            from: `${senderName} Assistant <onboarding@resend.dev>`,
            to: [lead.email_from],
            subject: subject,
            text: body,
            // react: EmailTemplate({ firstName: 'John' }), // You can use React templates too
        });

        if (error) {
            console.error("Resend Error:", error);
            throw new Error(error.message);
        }

        // 4. Update draft status
        if (draft_id) {
            await supabase
                .from("drafts")
                .update({ status: "sent" })
                .eq("id", draft_id);
        }

        // 5. Update lead status if it was 'new'
        await supabase
            .from("leads")
            .update({ status: "qualified" })
            .eq("id", lead_id)
            .eq("status", "new");

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error: any) {
        console.error("Send email error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
