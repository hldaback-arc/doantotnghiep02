create table if not exists public.user_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  file_type text not null check (file_type in ('pdf', 'docx', 'txt')),
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  extraction_status text not null default 'pending' check (extraction_status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists user_files_user_created_idx on public.user_files (user_id, created_at desc);
alter table public.user_files enable row level security;
drop policy if exists "Users can view their own files" on public.user_files;
drop policy if exists "Users can create their own files" on public.user_files;
drop policy if exists "Users can delete their own files" on public.user_files;
create policy "Users can view their own files" on public.user_files for select using ((select auth.uid()) = user_id);
create policy "Users can create their own files" on public.user_files for insert with check ((select auth.uid()) = user_id);
create policy "Users can delete their own files" on public.user_files for delete using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Users can upload their own documents" on storage.objects;
drop policy if exists "Users can read their own documents" on storage.objects;
drop policy if exists "Users can delete their own documents" on storage.objects;
create policy "Users can upload their own documents" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users can read their own documents" on storage.objects for select to authenticated using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users can delete their own documents" on storage.objects for delete to authenticated using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);