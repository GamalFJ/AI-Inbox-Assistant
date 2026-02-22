export async function generateDraftForLead(lead: any, profile: any) {
    // This is a placeholder for actual AI logic.
    // In a real implementation, you would call OpenAI or another LLM here.

    const { business_type, example_replies, booking_link } = profile;
    const { email_from, subject, body } = lead;

    const draftBody = `Hi there,

Thanks for reaching out! 

As a ${business_type || 'business'}, I'd love to help with your inquiry about "${subject}". 

Based on our usual approach:
${example_replies ? example_replies.split('\n')[0] : 'We will get back to you with more details soon.'}

You can also book a time to chat here: ${booking_link || 'our website'}.

Best regards,
Your AI Assistant`;

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        body: draftBody
    };
}
