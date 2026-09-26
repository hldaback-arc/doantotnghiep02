create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null check (event_name in ('user_registered', 'interview_started', 'interview_completed', 'voice_started', 'voice_completed', 'salary_started', 'salary_completed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists analytics_events_name_created_idx on public.analytics_events (event_name, created_at desc);
create index if not exists analytics_events_user_created_idx on public.analytics_events (user_id, created_at desc);
alter table public.analytics_events enable row level security;
drop policy if exists "Users can create their own analytics events" on public.analytics_events;
drop policy if exists "Users can view their own analytics events" on public.analytics_events;
create policy "Users can create their own analytics events" on public.analytics_events for insert with check ((select auth.uid()) = user_id);
create policy "Users can view their own analytics events" on public.analytics_events for select using ((select auth.uid()) = user_id);