create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('session_completed', 'weekly_progress', 'practice_reminder')),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
drop policy if exists "Users can view their own notifications" on public.notifications;
drop policy if exists "Users can update their own notifications" on public.notifications;
drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can view their own notifications" on public.notifications for select using ((select auth.uid()) = user_id);
create policy "Users can update their own notifications" on public.notifications for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own notifications" on public.notifications for delete using ((select auth.uid()) = user_id);