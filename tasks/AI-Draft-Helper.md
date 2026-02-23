# Task: AI Draft Helper

## 🎯 Objective
Integrate a real AI model (OpenAI) to generate high-quality, personalized email drafts based on user profiles and lead data.

## 📋 Sub-tasks
- [ ] **Setup AI Infrastructure**
    - Install `openai` library.
    - Add `OPENAI_API_KEY` to `.env.local`.
- [ ] **Implement AI Generation Logic**
    - Update `utils/ai.ts` to call OpenAI's Chat Completions API.
    - Design a robust system prompt that incorporates `business_type`, `example_replies`, and `booking_link`.
    - Handle edge cases (e.g., missing profile data, very long lead bodies).
- [ ] **API Endpoint Refinement**
    - Ensure `app/api/process-lead/route.ts` correctly handles the response from the new AI logic.
    - Add logging for AI usage and costs (optional but recommended).
- [ ] **UI Integration**
    - Add a "Magic Draft" or "Generate AI Reply" button to the Dashboard leads list.
    - Show a loading state while the AI is thinking.
- [ ] **Testing & Polish**
    - Test with various lead scenarios.
    - Refine prompt based on output quality.

## 🛠️ Tech Stack
- OpenAI API (GPT-4o or GPT-3.5)
- Next.js API Routes
- Supabase (to store generated drafts)
