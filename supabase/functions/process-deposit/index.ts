// Zhenbot — Process a confirmed deposit.
// Marks a pending deposit as completed. The zhenbot_deposit_completed trigger then
// credits active_deposit and distributes the 2-tier referral commission in real time.
// This is the "referral attribution webhook" endpoint.

import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ProcessBody {
  deposit_id?: string
  admin_token?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as ProcessBody
    if (!body.deposit_id) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing deposit_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Authorize: admin token from env, or rely on service-role invocation (server-side).
    const adminToken = Deno.env.get('PROCESS_DEPOSIT_ADMIN_TOKEN')
    const authHeader = req.headers.get('authorization') ?? ''
    if (adminToken && authHeader !== `Bearer ${adminToken}`) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data: deposit } = await client
      .from('zhenbot_transactions')
      .select('*')
      .eq('id', body.deposit_id)
      .eq('type', 'deposit')
      .single()

    if (!deposit) {
      return new Response(JSON.stringify({ ok: false, error: 'Deposit not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (deposit.status === 'completed') {
      return new Response(JSON.stringify({ ok: true, already: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error } = await client
      .from('zhenbot_transactions')
      .update({ status: 'completed' })
      .eq('id', deposit.id)
      .eq('type', 'deposit')
    if (error) throw error

    return new Response(JSON.stringify({ ok: true, deposit_id: deposit.id }), {
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