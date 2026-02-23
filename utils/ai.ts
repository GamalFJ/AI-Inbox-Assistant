import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDraftForLead(lead: any, profile: any): Promise<{ lead_type: string; suggested_subject: string; draft_body: string; followup_plan: string[] }> {
    try {
        const systemPrompt = "You are an AI assistant for a solo service business owner. You help them respond to leads in their inbox. You must reply in clear, friendly, concise language and always move the conversation toward a concrete next step (e.g., booking a call, filling a form, or replying with specific information).";

        const userPrompt = `Business type: ${profile.business_type || "General Service"}
Booking link: ${profile.booking_link || "Not provided"}
Owner’s example replies:
${profile.example_replies || "Be friendly and helpful."}

Incoming email:
From: ${lead.email_from || "Unknown"}
Subject: ${lead.subject || "No Subject"}
Body:
${lead.body || "No Body"}

1. Classify this as one of: ‘new_lead’, ‘existing_client’, ‘spam’, or ‘other’.
2. Propose a short, friendly subject line for the reply.
3. Draft a reply email that:
    ◦ Matches the owner’s tone and style.
    ◦ Asks 1–2 clarifying or qualifying questions if appropriate.
    ◦ Points to the booking link or a clear next step.
4. Suggest a follow‑up plan as a list of time offsets (e.g., ["2 days", "7 days"]).

Respond ONLY in JSON with the shape:
{
"lead_type": "new_lead" | "existing_client" | "spam" | "other",
"suggested_subject": string,
"draft_body": string,
"followup_plan": string[]
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content received from AI");
        }

        const parsed = JSON.parse(content);

        // Basic validation of the shape
        return {
            lead_type: parsed.lead_type || "other",
            suggested_subject: parsed.suggested_subject || `Re: ${lead.subject}`,
            draft_body: parsed.draft_body || "Thanks for your message. I'll get back to you soon.",
            followup_plan: Array.isArray(parsed.followup_plan) ? parsed.followup_plan : ["2 days"]
        };

    } catch (error) {
        console.error("Error generating draft:", error);
        // Fallback to a simple generic reply
        return {
            lead_type: "other",
            suggested_subject: lead.subject ? `Re: ${lead.subject}` : "Follow up on your inquiry",
            draft_body: "Hi there, thank you for reaching out! I've received your email and will get back to you as soon as possible. In the meantime, feel free to check my booking link if you'd like to schedule a time to talk.",
            followup_plan: ["2 days"]
        };
    }
}

