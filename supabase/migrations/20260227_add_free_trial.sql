-- Migration to add free trial columns to profiles
alter table public.profiles 
add column if not exists trial_ends_at timestamp with time zone,
add column if not exists is_trial boolean default false;

-- Index for performance when checking expired trials
create index if not exists idx_profiles_trial_ends_at on public.profiles(trial_ends_at);
