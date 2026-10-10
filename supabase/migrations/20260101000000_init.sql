-- ============================================================
-- Zhenbot — Initial Schema
-- Tables are prefixed with the project name (zhenbot_).
-- Applied against project ref: cxbevwccenradkjxoooh
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Users / profiles
-- ------------------------------------------------------------
create table if not exists public.zhenbot_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  wallet_balance numeric(18,2) not null default 0,
  active_deposit numeric(18,2) not null default 0,
  total_earned numeric(18,2) not null default 0,
  total_withdrawn numeric(18,2) not null default 0,
  referral_code text unique,
  referrer_id uuid references public.zhenbot_users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zhenbot_users_referral_code_idx
  on public.zhenbot_users (referral_code);
create index if not exists zhenbot_users_referrer_id_idx
  on public.zhenbot_users (referrer_id);

-- ------------------------------------------------------------
-- 2. Transactions ledger
-- ------------------------------------------------------------
create table if not exists public.zhenbot_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.zhenbot_users (id) on delete cascade,
  type text not null check (type in ('deposit','withdrawal','dividend','referral_bonus')),
  amount numeric(18,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending','approved','completed','failed','rejected')),
  network text,
  wallet_address text,
  tx_hash text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists zhenbot_transactions_user_idx
  on public.zhenbot_transactions (user_id, created_at desc);
create index if not exists zhenbot_transactions_type_idx
  on public.zhenbot_transactions (user_id, type);

-- ------------------------------------------------------------
-- 3. Referral relationships + commissions
-- ------------------------------------------------------------
create table if not exists public.zhenbot_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.zhenbot_users (id) on delete cascade,
  referee_id uuid not null references public.zhenbot_users (id) on delete cascade,
  tier integer not null check (tier in (1, 2)),
  commission_amount numeric(18,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','credited','paid')),
  created_at timestamptz not null default now(),
  unique (referrer_id, referee_id, tier)
);

create index if not exists zhenbot_referrals_referrer_idx
  on public.zhenbot_referrals (referrer_id, created_at desc);

-- ------------------------------------------------------------
-- 4. One-time verification codes (withdrawal 2FA)
-- ------------------------------------------------------------
create table if not exists public.zhenbot_verification_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.zhenbot_users (id) on delete cascade,
  transaction_id uuid references public.zhenbot_transactions (id) on delete set null,
  purpose text not null default 'withdrawal',
  code text not null,
  used boolean not null default false,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists zhenbot_verification_codes_txn_idx
  on public.zhenbot_verification_codes (transaction_id);

-- ------------------------------------------------------------
-- 5. Deposit network config (address vault)
-- ------------------------------------------------------------
create table if not exists public.zhenbot_deposit_networks (
  id serial primary key,
  asset text not null,
  network text not null,
  label text not null,
  address text not null,
  min_amount numeric(18,2) not null default 10,
  confirmations integer not null default 12,
  active boolean not null default true,
  sort_order integer not null default 0
);

insert into public.zhenbot_deposit_networks (asset, network, label, address, min_amount, confirmations, sort_order)
values
  ('USDT', 'TRC20',   'USDT · Tron (TRC20)',        'TN9ZhenBot9TresorW4llet8Xq7R2pLk3D1', 10, 19, 1),
  ('USDT', 'ERC20',   'USDT · Ethereum (ERC20)',    '0x7C3a9bZhenbotERC20Vault4F51c8A2eD90bE', 20, 12, 2),
  ('USDT', 'BEP20',   'USDT · BNB Chain (BEP20)',   '0x9F1dZhenbotBEP20Vault7B4c3A8eD1f2C6aB5', 10, 15, 3),
  ('BTC',  'Bitcoin', 'BTC · Bitcoin Network',      'bc1qzhenbotbtcvault8k3m2n4p6q8r0s5t7u9v2w4x', 50, 2, 4)
on conflict do nothing;

-- ============================================================
-- Functions
-- ============================================================

-- Auto-create profile + referrer link when a user signs up
create or replace function public.zhenbot_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_referrer_id uuid;
begin
  v_code := 'ZBTR-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));

  v_referrer_id := (
    select id
    from public.zhenbot_users
    where referral_code = upper(btrim(coalesce(new.raw_user_meta_data->>'referral_code', '')))
      and id <> new.id
    limit 1
  );

  insert into public.zhenbot_users (
    id, full_name, email, referral_code, referrer_id
  ) values (
    new.id,
    nullif(coalesce(new.raw_user_meta_data->>'full_name', ''), ''),
    new.email,
    v_code,
    v_referrer_id
  );

  if v_referrer_id is not null then
    insert into public.zhenbot_referrals (referrer_id, referee_id, tier, commission_amount, status)
    values (v_referrer_id, new.id, 1, 0, 'pending')
    on conflict (referrer_id, referee_id, tier) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.zhenbot_handle_new_user();

-- Keep updated_at fresh
create or replace function public.zhenbot_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists zhenbot_users_touch_updated on public.zhenbot_users;
create trigger zhenbot_users_touch_updated
  before update on public.zhenbot_users
  for each row execute function public.zhenbot_touch_updated_at();

-- Distribute 2-tier referral commission for a confirmed deposit
create or replace function public.zhenbot_distribute_referral(
  p_user_id uuid,
  p_amount numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier1 uuid;
  v_tier2 uuid;
  v_t1comm numeric;
  v_t2comm numeric;
begin
  select referrer_id into v_tier1 from public.zhenbot_users where id = p_user_id;

  if v_tier1 is not null then
    v_t1comm := round(p_amount * 0.15, 2);
    update public.zhenbot_users
       set wallet_balance = wallet_balance + v_t1comm,
           total_earned   = total_earned + v_t1comm
     where id = v_tier1;

    insert into public.zhenbot_referrals (referrer_id, referee_id, tier, commission_amount, status)
    values (v_tier1, p_user_id, 1, v_t1comm, 'credited')
    on conflict (referrer_id, referee_id, tier)
    do update set commission_amount = public.zhenbot_referrals.commission_amount + excluded.commission_amount,
                  status = 'credited';

    insert into public.zhenbot_transactions (user_id, type, amount, status, note)
    values (v_tier1, 'referral_bonus', v_t1comm, 'completed', 'Tier 1 referral bonus');

    select referrer_id into v_tier2 from public.zhenbot_users where id = v_tier1;

    if v_tier2 is not null then
      v_t2comm := round(p_amount * 0.05, 2);
      update public.zhenbot_users
         set wallet_balance = wallet_balance + v_t2comm,
             total_earned   = total_earned + v_t2comm
       where id = v_tier2;

      insert into public.zhenbot_referrals (referrer_id, referee_id, tier, commission_amount, status)
      values (v_tier2, p_user_id, 2, v_t2comm, 'credited')
      on conflict (referrer_id, referee_id, tier)
      do update set commission_amount = public.zhenbot_referrals.commission_amount + excluded.commission_amount,
                    status = 'credited';

      insert into public.zhenbot_transactions (user_id, type, amount, status, note)
      values (v_tier2, 'referral_bonus', v_t2comm, 'completed', 'Tier 2 referral bonus');
    end if;
  end if;
end;
$$;

-- Trigger: when a deposit becomes 'completed', credit active_deposit and pay referrals
create or replace function public.zhenbot_on_deposit_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.zhenbot_users
     set active_deposit = active_deposit + new.amount
   where id = new.user_id;

  perform public.zhenbot_distribute_referral(new.user_id, new.amount);
  return new;
end;
$$;

drop trigger if exists zhenbot_deposit_completed on public.zhenbot_transactions;
create trigger zhenbot_deposit_completed
  after update of status on public.zhenbot_transactions
  for each row
  when (new.type = 'deposit' and new.status = 'completed' and old.status <> 'completed')
  execute function public.zhenbot_on_deposit_completed();

-- Approve a withdrawal: validate balance, debit wallet, mark approved
create or replace function public.zhenbot_approve_withdrawal(p_transaction_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_txn record;
  v_balance numeric;
begin
  select * into v_txn from public.zhenbot_transactions where id = p_transaction_id;
  if not found then
    return 'not_found';
  end if;

  if v_txn.type <> 'withdrawal' then
    return 'invalid_type';
  end if;

  if v_txn.status in ('approved', 'completed', 'failed', 'rejected') then
    return 'already_settled';
  end if;

  select wallet_balance into v_balance from public.zhenbot_users where id = v_txn.user_id;
  if v_balance < v_txn.amount then
    update public.zhenbot_transactions set status = 'rejected', note = 'Insufficient wallet balance'
     where id = p_transaction_id;
    return 'insufficient_funds';
  end if;

  update public.zhenbot_users
     set wallet_balance  = wallet_balance - v_txn.amount,
         total_withdrawn = total_withdrawn + v_txn.amount
   where id = v_txn.user_id;

  update public.zhenbot_transactions set status = 'approved' where id = p_transaction_id;
  return 'approved';
end;
$$;

-- Credit the 1.2% daily dividend to every active deposit (cron blueprint)
create or replace function public.zhenbot_credit_daily_dividends()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row record;
  v_amount numeric;
  v_count integer := 0;
begin
  for v_row in
    select id, active_deposit from public.zhenbot_users
    where active_deposit > 0
  loop
    v_amount := round(v_row.active_deposit * 0.012, 2);

    update public.zhenbot_users
       set wallet_balance = wallet_balance + v_amount,
           total_earned   = total_earned + v_amount
     where id = v_row.id;

    insert into public.zhenbot_transactions (user_id, type, amount, status, note)
    values (v_row.id, 'dividend', v_amount, 'completed', '1.2% daily dividend');

    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.zhenbot_users enable row level security;
alter table public.zhenbot_transactions enable row level security;
alter table public.zhenbot_referrals enable row level security;
alter table public.zhenbot_verification_codes enable row level security;
alter table public.zhenbot_deposit_networks enable row level security;

-- zhenbot_users: owner + downline visibility
drop policy if exists zhenbot_users_select_own on public.zhenbot_users;
create policy zhenbot_users_select_own on public.zhenbot_users
  for select using (auth.uid() = id);

drop policy if exists zhenbot_users_select_downline on public.zhenbot_users;
create policy zhenbot_users_select_downline on public.zhenbot_users
  for select using (
    exists (
      select 1 from public.zhenbot_referrals r
      where r.referrer_id = auth.uid() and r.referee_id = public.zhenbot_users.id
    )
  );

drop policy if exists zhenbot_users_update_own on public.zhenbot_users;
create policy zhenbot_users_update_own on public.zhenbot_users
  for update using (auth.uid() = id);

-- zhenbot_transactions
drop policy if exists zhenbot_transactions_select_own on public.zhenbot_transactions;
create policy zhenbot_transactions_select_own on public.zhenbot_transactions
  for select using (auth.uid() = user_id);

drop policy if exists zhenbot_transactions_insert_own on public.zhenbot_transactions;
create policy zhenbot_transactions_insert_own on public.zhenbot_transactions
  for insert with check (
    auth.uid() = user_id
    and type in ('deposit', 'withdrawal')
    and status = 'pending'
  );

-- zhenbot_referrals
drop policy if exists zhenbot_referrals_select_own on public.zhenbot_referrals;
create policy zhenbot_referrals_select_own on public.zhenbot_referrals
  for select using (auth.uid() = referrer_id);

-- zhenbot_verification_codes: service role only (no client access; keeps 2FA intact)

-- zhenbot_deposit_networks: authenticated users may read addresses
drop policy if exists zhenbot_deposit_networks_select on public.zhenbot_deposit_networks;
create policy zhenbot_deposit_networks_select on public.zhenbot_deposit_networks
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- Function grants (service_role operates bypassing RLS)
-- ============================================================
revoke execute on function public.zhenbot_credit_daily_dividends() from public, anon, authenticated;
grant execute on function public.zhenbot_credit_daily_dividends() to service_role;

revoke execute on function public.zhenbot_approve_withdrawal(uuid) from public, anon, authenticated;
grant execute on function public.zhenbot_approve_withdrawal(uuid) to service_role;

revoke execute on function public.zhenbot_distribute_referral(uuid, numeric) from public, anon, authenticated;
grant execute on function public.zhenbot_distribute_referral(uuid, numeric) to service_role;