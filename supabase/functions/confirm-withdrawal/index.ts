// Zhenbot — Confirm a withdrawal after email-code verification.
// Validates the 6-digit code, approves the withdrawal, and emails the user.

import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''
const FROM_EMAIL = Deno.env.get('VITE_FROM_EMAIL') ?? 'Zhenbot <notifications@zhenbot.io>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ConfirmBody {
  user_id?: string
  transaction_id?: string
  code?: string
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) throw new Error(`Resend error ${res.status}`)
  return res.json()
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as ConfirmBody
    if (!body.user_id || !body.transaction_id || !body.code) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data: codeRow, error: codeError } = await client
      .from('zhenbot_verification_codes')
      .select('id, code, used, expires_at, user_id')
      .eq('transaction_id', body.transaction_id)
      .eq('purpose', 'withdrawal')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (codeError || !codeRow) {
      return new Response(JSON.stringify({ ok: false, error: 'No verification code found.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (codeRow.used) {
      return new Response(JSON.stringify({ ok: false, error: 'Verification code already used.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (new Date(codeRow.expires_at).getTime() < Date.now()) {
      return new Response(JSON.stringify({ ok: false, error: 'Verification code expired.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (codeRow.code !== body.code.trim()) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid verification code.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await client
      .from('zhenbot_verification_codes')
      .update({ used: true })
      .eq('id', codeRow.id)

    const { data: result, error: rpcError } = await client.rpc('zhenbot_approve_withdrawal', {
      p_transaction_id: body.transaction_id,
    })
    if (rpcError) throw rpcError

    if (result !== 'approved') {
      return new Response(
        JSON.stringify({ ok: false, error: `Withdrawal could not be approved (${result}).` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { data: user } = await client
      .from('zhenbot_users')
      .select('full_name, email')
      .eq('id', body.user_id)
      .single()

    if (user?.email) {
      await sendEmail(
        user.email,
        'Withdrawal approved — Zhenbot',
        `<!doctype html>
        <html><body style="margin:0;padding:0;background:#0a1128;font-family:Inter,Arial,sans-serif;">
          <div style="max-width:560px;margin:24px auto;background:#0b132b;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#007BFF,#00D2FF);padding:24px;">
              <span style="font-size:22px;font-weight:800;color:#fff;">Zhen<span style="color:#0a1128;">bot</span></span>
            </div>
            <div style="padding:28px;color:#cbd5e1;">
              <h1 style="color:#fff;font-size:20px;margin:0 0 12px;">Withdrawal Approved ✔</h1>
              <p>Hi ${user.full_name ?? 'Investor'},</p>
              <p>Your withdrawal request has been verified and <b style="color:#34d399;">approved</b>. Funds are on their way to your destination wallet and will be dispatched shortly.</p>
              <p style="font-size:13px;color:#64748b;">Questions? Reply to this email for support.</p>
            </div>
          </div>
        </body></html>`,
      )
    }

    return new Response(JSON.stringify({ ok: true, status: result }), {
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