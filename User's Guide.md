# AI Inbox Assistant: User's Guide

Welcome to AI Inbox Assistant! This guide will walk you through setting up your AI-powered email companion and using it to reclaim your time.

---

## 🚀 1. Setting Up Your AI Profile
Your AI Profile is the "brain" of your assistant. It learns how you speak and what your business is about to generate drafts that sound just like you.

1.  **Business Details**: Navigate to **Settings > AI Profile**.
2.  **Define Your Business**: Enter your business type (e.g., "Freelance Graphic Designer" or "SaaS Founder"). This gives the AI context on the services you provide.
3.  **Tone Training**: This is the most critical step. Upload **3–5 "Gold Standard" examples** of previous email replies. The AI analyzes these to mimic your personality and professional tone.
4.  **Booking Link**: Add your Calendly or booking URL. The AI will weave this into drafts when it detects a lead is ready to take the next step.
5.  **Save Updates**: Click "Update Profile" to commit your changes.

## 📥 2. Lead Ingestion: Connecting Your Inbox
To have the AI draft replies automatically, you need to route your incoming inquiries to our ingestion engine.

1.  **Find Your Webhook**: Go to **Settings > Lead Ingestion**.
2.  **Copy Your URL**: You will see a unique **Webhook URL** and a **Secret Key**.
3.  **Connect Your Provider**:
    *   **Zapier**: Use "Webhooks by Zapier" to catch an email and POST it to our URL.
    *   **Postmark/Mailgun**: Set these as an inbound destination for your support/sales email.
4.  **Verification**: Once connected, every incoming email will trigger the AI pipeline: Classify → Draft → Schedule.

## 🌐 3. Email Domain: Sending from Your Brand
To send replies directly from the dashboard using your own email address, you must verify your domain.

1.  **Access DNS Settings**: Go to **Settings > Email Domain**.
2.  **Add Records**: You will see a list of DNS records (MX, TXT, CNAME) provided by our delivery partner, Resend.
3.  **Update Registrar**: Log in to your domain provider (GoDaddy, Namecheap, etc.) and add these records.
4.  **Verify**: Click the "Verify" button in the app. Status will update to **Verified** once the DNS changes propagate.

## 🛠️ 4. Daily Workflow: Reclaiming Your Time
Here is how to use the app every day for maximum efficiency:

*   **Review the Inbox**: Open your **Dashboard**. New leads are automatically categorized (New Lead, Client, Spam).
*   **Pick Your Tone**: Click a lead to see **3 parallel AI drafts**:
    *   **Formal**: Professional and structured.
    *   **Casual**: Friendly and approachable.
    *   **Short**: Brief and to the point.
*   **Quick Edits**: Make any necessary tweaks in the editor. Changes are **auto-saved** every 3 seconds, and you can view **Draft History** to restore previous versions.
*   **Approve & Send**: Click the "Approve & Send" button to deliver the email instantly.
*   **Track Tasks**: Look at the **Task List** for each lead to see AI-scheduled follow-ups. Never miss a 2-day or 7-day touchpoint again.
*   **Monitor Growth**: Check the **Analytics** page to see your hours saved and lead breakdown.

---

**Need Help?**
If you run into any issues, check the [Help Center](#) or contact support. Happy automating!
