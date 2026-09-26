create table if not exists public.interview_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null unique references public.interview_messages(id) on delete cascade,
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score numeric not null check (score between 0 and 10),
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  better_answer text not null,
  skill_scores jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists interview_feedback_session_created_idx on public.interview_feedback (session_id, created_at desc);
alter table public.interview_feedback enable row level security;

drop policy if exists "Users can view their own interview feedback" on public.interview_feedback;
drop policy if exists "Users can create their own interview feedback" on public.interview_feedback;
drop policy if exists "Users can delete their own interview feedback" on public.interview_feedback;
create policy "Users can view their own interview feedback" on public.interview_feedback for select using ((select auth.uid()) = user_id);
create policy "Users can create their own interview feedback" on public.interview_feedback for insert with check ((select auth.uid()) = user_id);
create policy "Users can delete their own interview feedback" on public.interview_feedback for delete using ((select auth.uid()) = user_id);