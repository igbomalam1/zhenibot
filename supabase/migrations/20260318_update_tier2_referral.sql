-- ============================================================
-- Migration: Update Indirect (Tier 2) Referral Commission from 5% to 2%
-- ============================================================

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
    -- Tier 1: 15% direct commission
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
      -- Tier 2: 2% indirect team commission
      v_t2comm := round(p_amount * 0.02, 2);
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
