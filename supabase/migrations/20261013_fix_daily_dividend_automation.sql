-- Migration: Fix 24-hour daily dividend payout automation on public.zhenbot_users
CREATE EXTENSION IF NOT EXISTS pg_cron;

DROP FUNCTION IF EXISTS public.zhenbot_credit_daily_dividends();

CREATE OR REPLACE FUNCTION public.zhenbot_credit_daily_dividends()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user record;
  v_baseline timestamptz;
  v_last_dividend timestamptz;
  v_first_deposit timestamptz;
  v_elapsed_seconds numeric;
  v_cycles_due integer;
  v_amount numeric;
  v_total_user_credit numeric;
  v_user_count integer := 0;
  v_cycles_count integer := 0;
  v_total_credited numeric := 0;
  v_cycle_time timestamptz;
  i integer;
BEGIN
  -- Loop through all users with an active deposit
  FOR v_user IN
    SELECT id, email, full_name, active_deposit, wallet_balance, total_earned, created_at
    FROM public.zhenbot_users
    WHERE active_deposit > 0
  LOOP
    -- 1. Check the latest completed dividend transaction
    SELECT MAX(created_at) INTO v_last_dividend
    FROM public.zhenbot_transactions
    WHERE user_id = v_user.id
      AND type = 'dividend'
      AND status = 'completed';

    IF v_last_dividend IS NOT NULL THEN
      v_baseline := v_last_dividend;
    ELSE
      -- 2. If no dividend yet, baseline is the earliest completed deposit
      SELECT MIN(created_at) INTO v_first_deposit
      FROM public.zhenbot_transactions
      WHERE user_id = v_user.id
        AND type = 'deposit'
        AND status = 'completed';

      IF v_first_deposit IS NOT NULL THEN
        v_baseline := v_first_deposit;
      ELSE
        v_baseline := v_user.created_at;
      END IF;
    END IF;

    -- 3. Calculate how many full 24-hour periods (86400 seconds) have elapsed
    v_elapsed_seconds := EXTRACT(EPOCH FROM (now() - v_baseline));
    v_cycles_due := FLOOR(v_elapsed_seconds / 86400)::integer;

    -- Safety cap at 30 cycles max in a single run
    IF v_cycles_due > 30 THEN
      v_cycles_due := 30;
    END IF;

    -- 4. Credit user if at least 1 cycle (24 hours) has elapsed
    IF v_cycles_due >= 1 THEN
      v_amount := round(v_user.active_deposit * 0.016, 2);

      IF v_amount > 0 THEN
        v_total_user_credit := 0;

        FOR i IN 1..v_cycles_due LOOP
          v_cycle_time := v_baseline + (i * interval '24 hours');

          INSERT INTO public.zhenbot_transactions (
            user_id,
            type,
            amount,
            status,
            note,
            created_at
          )
          VALUES (
            v_user.id,
            'dividend',
            v_amount,
            'completed',
            '1.6% daily dividend',
            v_cycle_time
          );

          v_total_user_credit := v_total_user_credit + v_amount;
        END LOOP;

        UPDATE public.zhenbot_users
        SET wallet_balance = COALESCE(wallet_balance, 0) + v_total_user_credit,
            total_earned = COALESCE(total_earned, 0) + v_total_user_credit
        WHERE id = v_user.id;

        v_user_count := v_user_count + 1;
        v_cycles_count := v_cycles_count + v_cycles_due;
        v_total_credited := v_total_credited + v_total_user_credit;
      END IF;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'credited_users', v_user_count,
    'cycles_credited', v_cycles_count,
    'total_amount', v_total_credited
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.zhenbot_credit_daily_dividends() TO authenticated;
GRANT EXECUTE ON FUNCTION public.zhenbot_credit_daily_dividends() TO service_role;
GRANT EXECUTE ON FUNCTION public.zhenbot_credit_daily_dividends() TO anon;

-- Setup hourly background cron scheduler
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobid) FROM cron.job WHERE jobname = 'zhenbot-daily-dividends';
    PERFORM cron.schedule('zhenbot-daily-dividends', '0 * * * *', 'SELECT public.zhenbot_credit_daily_dividends()');
  END IF;
END $$;
