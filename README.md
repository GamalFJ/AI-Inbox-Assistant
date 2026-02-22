# 📔 AI Inbox Assistant

## 🌟 Project Overview

### **What is AI Inbox Assistant?**
AI Inbox Assistant is a smart, AI-powered companion designed to transform how business professionals handle their email. It acts as an intelligent layer over your inbox, automatically analyzing incoming messages and generating high-quality, context-aware reply drafts.

### **What is it for?**
The primary goal is to **reclaim time**. By automating the cognitive load of drafting repetitive replies and prioritizing leads, it allows users to focus on high-value work rather than getting bogged down in inbox management.

### **Who is it for?**
- **Entrepreneurs & Small Business Owners**: Who need to stay responsive but are overwhelmed by inquiries.
- **Freelancers**: Looking to maintain a professional brand voice while automating their sales pipeline.
- **Sales & Support Teams**: Who want to speed up their response times without sacrificing personalization.

### **Core Features**
- **🧠 AI Smart Replies**: Generates tailored email drafts based on your specific business context and preferred tone.
- **⚡ Automated Lead Ingestion**: Automatically detects and processes new inquiries from your inbox (via API).
- **📋 Onboarding & Persona**: Customizes responses using your business type, booking links, and example "gold standard" replies.
- **📊 Performance Dashboard**: Track hours saved and manage recent drafts in one centralized hub.
- **🔒 Secure Authentication**: Robust user management and session security powered by Supabase.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Deployment**: Vercel

## ⚙️ Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GamalFJ/AI-Inbox-Assistant.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
