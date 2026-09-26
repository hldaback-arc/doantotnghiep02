create table if not exists public.salary_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.salary_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null check (char_length(content) between 1 and 20000),
  sequence integer not null check (sequence >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists salary_messages_session_sequence_idx on public.salary_messages (session_id, sequence);
alter table public.salary_messages enable row level security;
drop policy if exists "Users can view their own salary messages" on public.salary_messages;
drop policy if exists "Users can create their own salary messages" on public.salary_messages;
drop policy if exists "Users can delete their own salary messages" on public.salary_messages;
create policy "Users can view their own salary messages" on public.salary_messages for select using ((select auth.uid()) = user_id);
create policy "Users can create their own salary messages" on public.salary_messages for insert with check ((select auth.uid()) = user_id);
create policy "Users can delete their own salary messages" on public.salary_messages for delete using ((select auth.uid()) = user_id);