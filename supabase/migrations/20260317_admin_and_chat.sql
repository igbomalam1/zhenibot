-- ============================================================
-- Migration: Add Admin Role & Live Chat System
-- Project: cxbevwccenradkjxoooh
-- ============================================================

-- 1. Add is_admin flag and status to zhenbot_users
alter table public.zhenbot_users
  add column if not exists is_admin boolean not null default false,
  add column if not exists is_blocked boolean not null default false,
  add column if not exists last_sign_in_at timestamptz;

-- 2. Chat conversations table
create table if not exists public.zhenbot_chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.zhenbot_users (id) on delete cascade,
  user_name text not null default 'Anonymous User',
  user_email text,
  status text not null default 'open' check (status in ('open', 'resolved', 'closed')),
  last_message text,
  last_message_at timestamptz not null default now(),
  unread_by_admin boolean not null default true,
  unread_by_user boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists zhenbot_chat_threads_user_idx
  on public.zhenbot_chat_threads (user_id);
create index if not exists zhenbot_chat_threads_status_idx
  on public.zhenbot_chat_threads (status, last_message_at desc);

-- 3. Chat messages table
create table if not exists public.zhenbot_chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.zhenbot_chat_threads (id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'admin')),
  sender_id uuid references public.zhenbot_users (id) on delete set null,
  sender_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists zhenbot_chat_messages_thread_idx
  on public.zhenbot_chat_messages (thread_id, created_at asc);

-- Enable RLS
alter table public.zhenbot_chat_threads enable row level security;
alter table public.zhenbot_chat_messages enable row level security;

-- Policies for threads
drop policy if exists zhenbot_chat_threads_public_all on public.zhenbot_chat_threads;
create policy zhenbot_chat_threads_public_all on public.zhenbot_chat_threads
  for all using (true) with check (true);

-- Policies for messages
drop policy if exists zhenbot_chat_messages_public_all on public.zhenbot_chat_messages;
create policy zhenbot_chat_messages_public_all on public.zhenbot_chat_messages
  for all using (true) with check (true);

-- Realtime replication enable
alter publication supabase_realtime add table public.zhenbot_chat_threads;
alter publication supabase_realtime add table public.zhenbot_chat_messages;
