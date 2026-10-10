// Zhenbot — Send withdrawal verification code (email 2FA).
// Called when a user requests a withdrawal.

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

interface VerifyBody {
  user_id?: string
  transaction_id?: string
  amount?: number
  network?: string
  wallet_address?: string
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

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as VerifyBody
    if (!body.user_id || !body.transaction_id) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing user_id or transaction_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const { error: insertError } = await client.from('zhenbot_verification_codes').insert({
      user_id: body.user_id,
      transaction_id: body.transaction_id,
      purpose: 'withdrawal',
      code,
      expires_at: expiresAt,
    })
    if (insertError) throw insertError

    const { data: user } = await client
      .from('zhenbot_users')
      .select('full_name, email')
      .eq('id', body.user_id)
      .single()

    const amount = Number(body.amount ?? 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    const html = `<!doctype html>
    <html><body style="margin:0;padding:0;background:#0a1128;font-family:Inter,Arial,sans-serif;">
      <div style="max-width:560px;margin:24px auto;background:#0b132b;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#007BFF,#00D2FF);padding:24px;">
          <span style="font-size:22px;font-weight:800;color:#fff;">Zhen<span style="color:#0a1128;">bot</span></span>
        </div>
        <div style="padding:28px;color:#cbd5e1;">
          <h1 style="color:#fff;font-size:20px;margin:0 0 12px;">Withdrawal Verification Code</h1>
          <p>Hi ${user?.full_name ?? 'Investor'},</p>
          <p>Use the code below to confirm your withdrawal of <b style="color:#34d399;">${amount}</b> (${body.network ?? '—'}). This code expires in <b>15 minutes</b>.</p>
          <div style="margin:24px 0;text-align:center;background:#0a1128;border:1px dashed rgba(0,210,255,.4);border-radius:12px;padding:20px;">
            <span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#00d2ff;">${code}</span>
          </div>
          <p style="font-size:13px;color:#64748b;">If you did not request this withdrawal, please contact support immediately.</p>
        </div>
      </div>
    </body></html>`

    await sendEmail(user?.email ?? '', 'Confirm your withdrawal — Zhenbot', html)

    return new Response(JSON.stringify({ ok: true }), {
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