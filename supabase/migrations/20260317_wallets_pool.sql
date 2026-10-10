-- ============================================================
-- Migration: Dynamic Deposit Wallets Pool & Per-User Assignment
-- Project: cxbevwccenradkjxoooh
-- ============================================================

-- 1. Create Wallets Pool Table
create table if not exists public.zhenbot_wallets (
  id uuid primary key default gen_random_uuid(),
  wallet_type text not null check (wallet_type in ('evm', 'btc', 'trc20')),
  address text not null unique,
  chains text[] not null default '{}', -- e.g. ['ETH', 'BSC', 'BASE', 'ARBITRUM', 'POLYGON'] or ['BTC'] or ['TRC20']
  assigned_to_user_id uuid references public.zhenbot_users(id) on delete set null,
  assigned_at timestamptz,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists zhenbot_wallets_type_assigned_idx
  on public.zhenbot_wallets (wallet_type, assigned_to_user_id);
create index if not exists zhenbot_wallets_address_idx
  on public.zhenbot_wallets (address);

-- 2. Add direct wallet references to zhenbot_users for fast lookup
alter table public.zhenbot_users
  add column if not exists assigned_evm_wallet text,
  add column if not exists assigned_btc_wallet text,
  add column if not exists assigned_trc20_wallet text;

-- 3. Enable RLS on wallets
alter table public.zhenbot_wallets enable row level security;

-- Public/Authenticated users can view wallets assigned to them or unassigned
drop policy if exists zhenbot_wallets_read_all on public.zhenbot_wallets;
create policy zhenbot_wallets_read_all on public.zhenbot_wallets
  for select using (true);

drop policy if exists zhenbot_wallets_modify_all on public.zhenbot_wallets;
create policy zhenbot_wallets_modify_all on public.zhenbot_wallets
  for all using (true) with check (true);

-- 4. Function: Auto-assign wallets to user if not already assigned
create or replace function public.zhenbot_get_or_assign_user_wallets(p_user_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user record;
  v_evm_wallet text;
  v_btc_wallet text;
  v_trc_wallet text;
  v_avail_evm record;
  v_avail_btc record;
  v_avail_trc record;
begin
  select * into v_user from public.zhenbot_users where id = p_user_id;
  if not found then
    return json_build_object('error', 'User not found');
  end if;

  v_evm_wallet := v_user.assigned_evm_wallet;
  v_btc_wallet := v_user.assigned_btc_wallet;
  v_trc_wallet := v_user.assigned_trc20_wallet;

  -- 1. EVM (0x) Wallet Assignment
  if v_evm_wallet is null or v_evm_wallet = '' then
    -- Find unassigned active EVM wallet
    select * into v_avail_evm
      from public.zhenbot_wallets
     where wallet_type = 'evm'
       and is_active = true
       and (assigned_to_user_id is null or assigned_to_user_id = p_user_id)
     order by created_at asc
     limit 1;

    if found then
      v_evm_wallet := v_avail_evm.address;
      update public.zhenbot_wallets
         set assigned_to_user_id = p_user_id,
             assigned_at = now()
       where id = v_avail_evm.id;

      update public.zhenbot_users
         set assigned_evm_wallet = v_evm_wallet
       where id = p_user_id;
    end if;
  end if;

  -- 2. BTC Wallet Assignment
  if v_btc_wallet is null or v_btc_wallet = '' then
    select * into v_avail_btc
      from public.zhenbot_wallets
     where wallet_type = 'btc'
       and is_active = true
       and (assigned_to_user_id is null or assigned_to_user_id = p_user_id)
     order by created_at asc
     limit 1;

    if found then
      v_btc_wallet := v_avail_btc.address;
      update public.zhenbot_wallets
         set assigned_to_user_id = p_user_id,
             assigned_at = now()
       where id = v_avail_btc.id;

      update public.zhenbot_users
         set assigned_btc_wallet = v_btc_wallet
       where id = p_user_id;
    end if;
  end if;

  -- 3. TRC20 Wallet Assignment (if available)
  if v_trc_wallet is null or v_trc_wallet = '' then
    select * into v_avail_trc
      from public.zhenbot_wallets
     where wallet_type = 'trc20'
       and is_active = true
       and (assigned_to_user_id is null or assigned_to_user_id = p_user_id)
     order by created_at asc
     limit 1;

    if found then
      v_trc_wallet := v_avail_trc.address;
      update public.zhenbot_wallets
         set assigned_to_user_id = p_user_id,
             assigned_at = now()
       where id = v_avail_trc.id;

      update public.zhenbot_users
         set assigned_trc20_wallet = v_trc_wallet
       where id = p_user_id;
    end if;
  end if;

  return json_build_object(
    'evm', v_evm_wallet,
    'btc', v_btc_wallet,
    'trc20', v_trc_wallet
  );
end;
$$;
