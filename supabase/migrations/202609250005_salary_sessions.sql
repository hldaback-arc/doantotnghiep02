create table if not exists public.salary_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text not null,
  industry text,
  current_salary numeric check (current_salary >= 0),
  desired_salary numeric check (desired_salary >= 0),
  minimum_salary numeric check (minimum_salary >= 0),
  location text,
  target_salary numeric check (target_salary >= 0),
  opening_ask numeric check (opening_ask >= 0),
  walk_away numeric check (walk_away >= 0),
  strategy text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists salary_sessions_user_created_idx on public.salary_sessions (user_id, created_at desc);
alter table public.salary_sessions enable row level security;
drop policy if exists "Users can view their own salary sessions" on public.salary_sessions;
drop policy if exists "Users can create their own salary sessions" on public.salary_sessions;
drop policy if exists "Users can update their own salary sessions" on public.salary_sessions;
drop policy if exists "Users can delete their own salary sessions" on public.salary_sessions;
create policy "Users can view their own salary sessions" on public.salary_sessions for select using ((select auth.uid()) = user_id);
create policy "Users can create their own salary sessions" on public.salary_sessions for insert with check ((select auth.uid()) = user_id);
create policy "Users can update their own salary sessions" on public.salary_sessions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own salary sessions" on public.salary_sessions for delete using ((select auth.uid()) = user_id);
drop trigger if exists salary_sessions_set_updated_at on public.salary_sessions;
create trigger salary_sessions_set_updated_at before update on public.salary_sessions for each row execute function public.set_updated_at();