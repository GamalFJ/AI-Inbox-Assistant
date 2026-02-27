import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type ToneVariant = "formal" | "casual" | "short";

export interface DraftVariant {
    tone_variant: ToneVariant;
    suggested_subject: string;
    draft_body: string;
}

const TONE_DIRECTIVES: Record<ToneVariant, string> = {
    formal: "Write in a polished, professional tone. Use complete sentences, proper salutations, and a structured closing. This should feel like a reply from a seasoned consultant.",
    casual: "Write in a warm, friendly, conversational tone. Keep it natural and approachable — like a reply from someone who genuinely enjoys talking to clients.",
    short: "Write a concise reply in 3–5 sentences maximum. Get straight to the point. No filler. Every sentence must earn its place.",
};

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

export async function generateDraftVariants(
    lead: any,
    profile: any
): Promise<{ variants: DraftVariant[]; lead_type: string; followup_plan: string[] }> {
    const buildMessages = (tone: ToneVariant, includeClassification: boolean) => ({
        system: `You are an AI assistant for a solo service business owner. You help them respond to leads in their inbox. Tone directive: ${TONE_DIRECTIVES[tone]}`,
        user: `Business type: ${profile.business_type || "General Service"}
Booking link: ${profile.booking_link || "Not provided"}
Owner's example replies:
${profile.example_replies || "Be friendly and helpful."}

Incoming email:
From: ${lead.email_from || "Unknown"}
Subject: ${lead.subject || "No Subject"}
Body:
${lead.body || "No Body"}

${includeClassification
                ? `1. Classify as: 'new_lead', 'existing_client', 'spam', or 'other'.
2. Propose a subject line for the reply.
3. Draft a reply matching the FORMAL tone directive.
4. Suggest a follow-up plan as time offsets e.g. ["2 days", "7 days"].

Respond ONLY in JSON: { "lead_type": string, "suggested_subject": string, "draft_body": string, "followup_plan": string[] }`
                : `Propose a subject line and draft a reply matching the ${tone.toUpperCase()} tone.

Respond ONLY in JSON: { "suggested_subject": string, "draft_body": string }`}`,
    });

    const [formalRes, casualRes, shortRes] = await Promise.allSettled([
        openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: buildMessages("formal", true).system },
                { role: "user", content: buildMessages("formal", true).user },
            ],
            response_format: { type: "json_object" },
        }),
        openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: buildMessages("casual", false).system },
                { role: "user", content: buildMessages("casual", false).user },
            ],
            response_format: { type: "json_object" },
        }),
        openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: buildMessages("short", false).system },
                { role: "user", content: buildMessages("short", false).user },
            ],
            response_format: { type: "json_object" },
        }),
    ]);

    let lead_type = "other";
    let followup_plan: string[] = ["2 days"];
    const variants: DraftVariant[] = [];
    const tones: ToneVariant[] = ["formal", "casual", "short"];
    const results = [formalRes, casualRes, shortRes];

    results.forEach((result, i) => {
        const tone = tones[i];
        if (result.status === "fulfilled") {
            try {
                const parsed = JSON.parse(result.value.choices[0].message.content || "{}");
                if (i === 0) {
                    lead_type = parsed.lead_type || "other";
                    followup_plan = Array.isArray(parsed.followup_plan) ? parsed.followup_plan : ["2 days"];
                }
                variants.push({
                    tone_variant: tone,
                    suggested_subject: parsed.suggested_subject || `Re: ${lead.subject}`,
                    draft_body: parsed.draft_body || "Thanks for reaching out — I'll be in touch shortly.",
                });
            } catch {
                variants.push({
                    tone_variant: tone,
                    suggested_subject: `Re: ${lead.subject || "Your Inquiry"}`,
                    draft_body: "Thanks for reaching out — I'll be in touch shortly.",
                });
            }
        } else {
            variants.push({
                tone_variant: tone,
                suggested_subject: `Re: ${lead.subject || "Your Inquiry"}`,
                draft_body: "Thanks for reaching out — I'll be in touch shortly.",
            });
        }
    });

    return { variants, lead_type, followup_plan };
}
