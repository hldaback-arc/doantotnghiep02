create table if not exists public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text,
  raw_content text not null check (char_length(raw_content) between 20 and 50000),
  extraction_status text not null default 'pending' check (extraction_status in ('pending', 'processing', 'completed', 'failed')),
  extracted_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists job_descriptions_user_created_idx on public.job_descriptions (user_id, created_at desc);
alter table public.job_descriptions enable row level security;
drop policy if exists "Users can view their own job descriptions" on public.job_descriptions;
drop policy if exists "Users can create their own job descriptions" on public.job_descriptions;
drop policy if exists "Users can update their own job descriptions" on public.job_descriptions;
drop policy if exists "Users can delete their own job descriptions" on public.job_descriptions;
create policy "Users can view their own job descriptions" on public.job_descriptions for select using ((select auth.uid()) = user_id);
create policy "Users can create their own job descriptions" on public.job_descriptions for insert with check ((select auth.uid()) = user_id);
create policy "Users can update their own job descriptions" on public.job_descriptions for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own job descriptions" on public.job_descriptions for delete using ((select auth.uid()) = user_id);
drop trigger if exists job_descriptions_set_updated_at on public.job_descriptions;
create trigger job_descriptions_set_updated_at before update on public.job_descriptions for each row execute function public.set_updated_at();