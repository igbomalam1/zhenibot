-- Update daily dividend calculation from 1.2% to 1.6%
CREATE OR REPLACE FUNCTION public.zhenbot_credit_daily_dividends()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer := 0;
  v_row record;
  v_amount numeric;
BEGIN
  FOR v_row IN
    SELECT user_id, active_deposit, profit_balance
    FROM public.zhenbot_balances
    WHERE active_deposit > 0
  LOOP
    v_amount := round(v_row.active_deposit * 0.016, 2);
    IF v_amount > 0 THEN
      UPDATE public.zhenbot_balances
      SET profit_balance = profit_balance + v_amount,
          updated_at = now()
      WHERE user_id = v_row.user_id;

      INSERT INTO public.zhenbot_transactions (user_id, type, amount, status, note)
      VALUES (v_row.user_id, 'dividend', v_amount, 'completed', '1.6% daily dividend');

      v_count := v_count + 1;
    END IF;
  END LOOP;
  RETURN json_build_object('success', true, 'credited_users', v_count);
END;
$$;
