// Zhenbot — Send deposit notification emails (user confirmation + admin ping).
// Triggered from the Deposit page after a deposit submission is recorded.

import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const FROM_EMAIL = Deno.env.get('VITE_FROM_EMAIL') ?? 'Zhenbot <notifications@zhenbot.io>'
const ADMIN_EMAIL = Deno.env.get('VITE_ADMIN_EMAIL') ?? 'admin@zhenbot.io'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface NotificationBody {
  user_id?: string
  amount?: number
  network?: string
  tx_hash?: string
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
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
  return res.json()
}

function layout(title: string, body: string) {
  return `<!doctype html>
  <html><body style="margin:0;padding:0;background:#0a1128;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:24px auto;background:#0b132b;border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#007BFF,#00D2FF);padding:24px;">
        <span style="font-size:22px;font-weight:800;color:#fff;">Zhen<span style="color:#0a1128;">bot</span></span>
      </div>
      <div style="padding:28px;color:#cbd5e1;">
        <h1 style="color:#fff;font-size:20px;margin:0 0 12px;">${title}</h1>
        ${body}
      </div>
      <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#64748b;">
        © ${new Date().getFullYear()} Zhenbot Technologies · Automated multi-asset trading
      </div>
    </div>
  </body></html>`
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = (await req.json()) as NotificationBody
    const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data: user } = await client
      .from('zhenbot_users')
      .select('id, full_name, email')
      .eq('id', body.user_id)
      .single()

    const email = user?.email
    const name = user?.full_name ?? 'Investor'
    const amount = Number(body.amount ?? 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    if (email) {
      await sendEmail(
        email,
        'Deposit received — Zhenbot confirmation',
        layout(
          'Deposit Submission Received',
          `<p>Hi ${name},</p>
          <p>We received your deposit request:</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#94a3b8;">Amount</td><td style="padding:8px 0;color:#34d399;font-weight:700;">${amount}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Network</td><td style="padding:8px 0;color:#fff;">${body.network ?? '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Transaction hash</td><td style="padding:8px 0;color:#fff;word-break:break-all;">${body.tx_hash ?? '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Status</td><td style="padding:8px 0;"><span style="background:rgba(245,158,11,.15);color:#fbbf24;padding:2px 10px;border-radius:999px;font-size:12px;">Pending verification</span></td></tr>
          </table>
          <p style="margin-top:12px;">Once the transaction is confirmed on-chain your deposit will be credited and your 1.2% daily dividend will begin.</p>`,
        ),
      )
    }

    // Admin ping
    await sendEmail(
      ADMIN_EMAIL,
      `[Zhenbot] New deposit submitted — ${amount}`,
      layout(
        'New Deposit Submission',
        `<p><b>User:</b> ${name} (${email ?? body.user_id ?? '—'})</p>
        <p><b>Amount:</b> <span style="color:#34d399;font-weight:700;">${amount}</span></p>
        <p><b>Network:</b> ${body.network ?? '—'}</p>
        <p><b>TxID:</b> <span style="word-break:break-all;">${body.tx_hash ?? '—'}</span></p>`,
      ),
    )

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