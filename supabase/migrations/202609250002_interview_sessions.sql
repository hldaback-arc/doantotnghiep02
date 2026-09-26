create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Interview session',
  job_title text,
  company text,
  interview_type text not null default 'general',
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  mode text not null default 'text' check (mode in ('text', 'voice')),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz not null default timezone('utc', now()),
  ended_at timestamptz,
  overall_score numeric check (overall_score between 0 and 10),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists interview_sessions_user_created_idx on public.interview_sessions (user_id, created_at desc);
alter table public.interview_sessions enable row level security;

drop policy if exists "Users can view their own interview sessions" on public.interview_sessions;
drop policy if exists "Users can create their own interview sessions" on public.interview_sessions;
drop policy if exists "Users can update their own interview sessions" on public.interview_sessions;
drop policy if exists "Users can delete their own interview sessions" on public.interview_sessions;
create policy "Users can view their own interview sessions" on public.interview_sessions for select using ((select auth.uid()) = user_id);
create policy "Users can create their own interview sessions" on public.interview_sessions for insert with check ((select auth.uid()) = user_id);
create policy "Users can update their own interview sessions" on public.interview_sessions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own interview sessions" on public.interview_sessions for delete using ((select auth.uid()) = user_id);

drop trigger if exists interview_sessions_set_updated_at on public.interview_sessions;
create trigger interview_sessions_set_updated_at before update on public.interview_sessions for each row execute function public.set_updated_at();