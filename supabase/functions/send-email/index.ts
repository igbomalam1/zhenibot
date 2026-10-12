// Zhenbot — Universal Transactional Email Engine (Powered by Resend)
// Dispatches emails for:
// 1. Welcome / Successful Registration
// 2. Deposit Submission (Pending)
// 3. Deposit Confirmed / Approved (Funds credited to active deposit)
// 4. Withdrawal Approved
// 5. Withdrawal Cancelled / Rejected
// 6. Referral Commission Credited (Tier 1 & Tier 2)

import { createClient } from 'npm:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY') ?? ''

// Verified Resend sending identity
const FROM_EMAIL = Deno.env.get('VITE_FROM_EMAIL') ?? 'Zhenbot <notifications@devicodes.xyz>'

// Official Production Domain
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://zhenibot.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export type EmailType =
  | 'welcome'
  | 'deposit_received'
  | 'deposit_approved'
  | 'withdrawal_approved'
  | 'withdrawal_rejected'
  | 'referral_reward'

interface SendEmailPayload {
  type: EmailType
  user_id?: string
  to?: string
  data?: {
    name?: string
    amount?: number
    network?: string
    tx_hash?: string
    wallet_address?: string
    referral_code?: string
    tier?: number
    downline_name?: string
    reason?: string
    [key: string]: unknown
  }
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Resend API error (${res.status}): ${errorText}`)
  }

  return res.json()
}

function emailLayout(preheader: string, title: string, bodyContent: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #94a3b8;">
  <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #08090e; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #0c0f18; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d1424 0%, #111a30 100%); padding: 28px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                      ZHEN<span style="color: #00e599;">BOT</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 10px; font-weight: 700; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; color: #00e599; background: rgba(0, 229, 153, 0.12); border: 1px solid rgba(0, 229, 153, 0.25); border-radius: 6px;">
                      ALGO TRADING
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                ${title}
              </h1>
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #080a11; border-top: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #64748b; line-height: 1.6;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0;">© ${new Date().getFullYear()} Zhenbot Quantitative Fund. Automated multi-asset trading.</p>
                    <p style="margin: 4px 0 0; color: #475569;">You received this automated security notification regarding your registered Zhenbot account.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildTemplate(type: EmailType, name: string, data: Record<string, unknown> = {}) {
  const formatUSD = (val: unknown) =>
    Number(val ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  switch (type) {
    case 'welcome': {
      const code = String(data.referral_code ?? 'ACTIVE')
      return {
        subject: 'Welcome to Zhenbot — Account Activated',
        preheader: 'Your quantitative trading account is ready. Start earning daily dividends.',
        html: emailLayout(
          'Welcome to Zhenbot. Your account has been initialized.',
          `Welcome to Zhenbot, ${name}! 👋`,
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Your account has been successfully initialized. You now have full access to our automated high-frequency quantitative trading fund earning up to <b>1.2% daily dividends</b>.
          </p>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #64748b; margin: 0 0 6px;">Your Personal Referral Code</p>
            <p style="font-size: 20px; font-weight: 700; font-family: monospace; color: #00e599; margin: 0 0 10px;">${code}</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Share your link to earn <b>15% Tier-1</b> and <b>2% Tier-2</b> instant commissions on every downline deposit.</p>
          </div>
          <div style="margin-top: 24px;">
            <a href="${SITE_URL}/dashboard" style="display: inline-block; background-color: #00e599; color: #08090e; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
              Access Investor Dashboard →
            </a>
          </div>`,
        ),
      }
    }

    case 'deposit_received': {
      const amount = formatUSD(data.amount)
      const network = String(data.network ?? 'Crypto')
      const txHash = String(data.tx_hash ?? '—')
      return {
        subject: `Deposit Pending (${amount}) — Zhenbot Confirmation`,
        preheader: `We received your deposit submission of ${amount}. Pending confirmation.`,
        html: emailLayout(
          `Deposit request of ${amount} received and currently awaiting confirmation.`,
          'Deposit Submission Received ⏳',
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Hi ${name}, we have logged your deposit request. Our automated blockchain listener and audit team are verifying the transaction.
          </p>
          <table role="presentation" width="100%" style="border-collapse: collapse; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; margin-bottom: 24px; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #64748b;">Amount</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-weight: 700; color: #00e599; text-align: right;">${amount}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #64748b;">Network</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff; text-align: right;">${network}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #64748b;">Tx Hash</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-family: monospace; font-size: 11px; color: #94a3b8; text-align: right; word-break: break-all;">${txHash}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748b;">Status</td>
              <td style="padding: 12px 16px; text-align: right;">
                <span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 700; color: #fbbf24; background: rgba(251, 191, 36, 0.15); border-radius: 4px;">PENDING CONFIRMATION</span>
              </td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            As soon as the transaction is confirmed, the funds will be deployed directly to your <b>Active Deposit</b> to begin generating daily returns.
          </p>`,
        ),
      }
    }

    case 'deposit_approved': {
      const amount = formatUSD(data.amount)
      const network = String(data.network ?? 'Crypto')
      return {
        subject: `Deposit Confirmed (${amount}) — Capital Now Active! 🚀`,
        preheader: `Your deposit of ${amount} has been verified and deployed into trading.`,
        html: emailLayout(
          `Your deposit of ${amount} has been credited to your active trading balance.`,
          'Deposit Confirmed & Capital Deployed! 🚀',
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Great news, ${name}! Your deposit has been confirmed on-chain and added to your <b>Active Investment Deposit</b>.
          </p>
          <div style="background: linear-gradient(135deg, rgba(0, 229, 153, 0.08) 0%, rgba(0, 229, 153, 0.02) 100%); border: 1px solid rgba(0, 229, 153, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #94a3b8; margin: 0 0 6px;">Total Credited to Trading</p>
            <p style="font-size: 28px; font-weight: 800; color: #00e599; margin: 0 0 8px;">${amount}</p>
            <p style="font-size: 12px; color: #38bdf8; margin: 0;">⚡ 1.2% Daily Quantitative Dividends Activated</p>
          </div>
          <table role="presentation" width="100%" style="border-collapse: collapse; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; margin-bottom: 24px; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #64748b;">Method</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #ffffff; text-align: right;">${network}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748b;">Dividend Cycle</td>
              <td style="padding: 12px 16px; color: #00e599; font-weight: 700; text-align: right;">Every 24 Hours at 00:00 UTC</td>
            </tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="${SITE_URL}/dashboard" style="display: inline-block; background-color: #00e599; color: #08090e; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
              View Live Portfolio →
            </a>
          </div>`,
        ),
      }
    }

    case 'withdrawal_approved': {
      const amount = formatUSD(data.amount)
      const wallet = String(data.wallet_address ?? '—')
      return {
        subject: `Withdrawal Approved (${amount}) — Funds Dispatched ✔`,
        preheader: `Your withdrawal of ${amount} has been approved and dispatched.`,
        html: emailLayout(
          `Your withdrawal request of ${amount} has been approved and processed.`,
          'Withdrawal Approved & Sent ✔',
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Hi ${name}, your withdrawal request has been verified, approved by administrative risk controls, and dispatched to your recipient address.
          </p>
          <table role="presentation" width="100%" style="border-collapse: collapse; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; margin-bottom: 24px; font-size: 13px;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #64748b;">Amount Paid</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-weight: 700; color: #00e599; text-align: right;">${amount}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #64748b;">Destination Wallet</td>
              <td style="padding: 12px 16px; font-family: monospace; font-size: 11px; color: #ffffff; text-align: right; word-break: break-all;">${wallet}</td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            Depending on network congestion, the transaction should arrive in your private wallet within minutes.
          </p>`,
        ),
      }
    }

    case 'withdrawal_rejected': {
      const amount = formatUSD(data.amount)
      const reason = String(data.reason ?? 'Compliance verification or invalid wallet address details.')
      return {
        subject: `Withdrawal Update (${amount}) — Request Cancelled`,
        preheader: `Your withdrawal request of ${amount} could not be processed.`,
        html: emailLayout(
          `Notice regarding your withdrawal request of ${amount}.`,
          'Withdrawal Request Notice ⚠️',
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Hi ${name}, your withdrawal request of <b>${amount}</b> could not be approved at this time.
          </p>
          <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <p style="font-size: 11px; text-transform: uppercase; font-family: monospace; color: #f87171; margin: 0 0 6px;">Reason for Cancellation</p>
            <p style="font-size: 13px; color: #fca5a5; margin: 0; line-height: 1.5;">${reason}</p>
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">
            <b>Your funds have remained safely in your available wallet balance.</b> Please review your destination address or reach out to our 24/7 in-site support chat for instant assistance.
          </p>
          <div>
            <a href="${SITE_URL}/dashboard/withdraw" style="display: inline-block; background-color: rgba(255, 255, 255, 0.08); color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.15);">
              Review Withdrawal →
            </a>
          </div>`,
        ),
      }
    }

    case 'referral_reward': {
      const amount = formatUSD(data.amount)
      const tier = Number(data.tier ?? 1)
      const downline = String(data.downline_name ?? 'A member of your downline')
      return {
        subject: `Referral Bonus Credited (${amount})! 🎁`,
        preheader: `You just received a ${amount} Tier-${tier} commission!`,
        html: emailLayout(
          `You earned a referral commission of ${amount}!`,
          `Referral Commission Credited! 🎁`,
          `<p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
            Congratulations ${name}! <b>${downline}</b> has successfully funded their account, earning you an instant referral commission.
          </p>
          <div style="background: linear-gradient(135deg, rgba(0, 229, 153, 0.1) 0%, rgba(56, 189, 248, 0.05) 100%); border: 1px solid rgba(0, 229, 153, 0.25); border-radius: 12px; padding: 22px; margin-bottom: 24px; text-align: center;">
            <span style="display: inline-block; padding: 3px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; color: #00e599; background: rgba(0, 229, 153, 0.15); border-radius: 6px; margin-bottom: 8px;">
              TIER ${tier} COMMISSION (${tier === 1 ? '15%' : '2%'})
            </span>
            <p style="font-size: 26px; font-weight: 800; color: #00e599; margin: 0 0 6px;">+${amount}</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Credited immediately to your withdrawable wallet balance.</p>
          </div>
          <div style="margin-top: 24px;">
            <a href="${SITE_URL}/dashboard/referrals" style="display: inline-block; background-color: #00e599; color: #08090e; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
              View Referral Downline →
            </a>
          </div>`,
        ),
      }
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = (await req.json()) as SendEmailPayload
    const { type, user_id, to, data = {} } = payload

    if (!type) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing email type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let recipientEmail = to
    let recipientName = String(data.name ?? 'Investor')

    // Look up user in database if user_id was provided
    if (user_id) {
      const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
      const { data: userProfile } = await client
        .from('zhenbot_users')
        .select('email, full_name, referral_code')
        .eq('id', user_id)
        .single()

      if (userProfile) {
        if (!recipientEmail && userProfile.email) {
          recipientEmail = userProfile.email
        }
        if (userProfile.full_name) {
          recipientName = userProfile.full_name
        }
        if (!data.referral_code && userProfile.referral_code) {
          data.referral_code = userProfile.referral_code
        }
      }
    }

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ ok: false, error: 'No recipient email address could be resolved' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { subject, html } = buildTemplate(type, recipientName, data)
    const result = await sendResendEmail(recipientEmail, subject, html)

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = (err as Error).message
    console.error('send-email error:', msg)
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
