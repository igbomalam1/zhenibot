// Zhenbot — Daily dividend cron blueprint.
// Calls the DB function zhenbot_credit_daily_dividends() which credits 1.6% of every
// active deposit at 00:00 UTC. Invoke via pg_cron or the Supabase Edge Schedule
// every day at 00:00 UTC:
//
//   supabase functions deploy process-daily-dividends --no-verify-jwt

import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data: count, error } = await client.rpc('zhenbot_credit_daily_dividends')
    if (error) throw error

    return new Response(JSON.stringify({ ok: true, accounts_credited: count }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})