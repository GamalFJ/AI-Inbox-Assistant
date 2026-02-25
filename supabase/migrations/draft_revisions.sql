-- ============================================================
-- Draft Edit History — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create the draft_revisions table
create table if not exists public.draft_revisions (
    id               uuid            default gen_random_uuid() primary key,
    created_at       timestamptz     default now() not null,
    draft_id         uuid            not null references public.drafts(id) on delete cascade,
    user_id          uuid            not null references auth.users(id) on delete cascade,
    body             text            not null,
    suggested_subject text           not null default '',
    edit_source      text            not null default 'user_edit'
                     check (edit_source in ('ai_generated', 'user_edit', 'regenerated')),
    version_number   integer         not null default 1
);

-- 2. Index for fast lookup by draft_id (ordered by version)
create index if not exists idx_draft_revisions_draft_id
    on public.draft_revisions (draft_id, version_number desc);

-- 3. Enable Row Level Security
alter table public.draft_revisions enable row level security;

-- 4. RLS policy — users can only read their own revisions
create policy "Users can read own revisions"
    on public.draft_revisions
    for select
    using (auth.uid() = user_id);

-- 5. RLS policy — users can only insert their own revisions
create policy "Users can insert own revisions"
    on public.draft_revisions
    for insert
    with check (auth.uid() = user_id);

-- ✅ Done! The draft_revisions table is ready.
