import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.104.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SENDBYTE_ENDPOINT = 'https://api.sendbyte.africa/v1/emails'
const DEFAULT_SENDBYTE_KEY = Deno.env.get('SENDBYTE_API_KEY') || ''
const DEFAULT_SENDER = 'Zhenbot Automation <automate@zhenibot.com>'
const SUPPORT_EMAIL = 'automate@zhenibot.com'
const WEBSITE_URL = 'https://zhenibot.com'

const BANNER_ILLUS =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/illustrations/device-banner-illus.png'
const ICON_SYNC =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-swap.png'
const ICON_VERIFY =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-verify.png'
const ICON_LEDGER =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-vault.png'

interface HeaderConfig {
  title: string
  subtitle: string
}

const DEFAULT_HEADER: HeaderConfig = {
  title: 'Automate Your Business Operations',
  subtitle: 'Custom software that eliminates repetitive manual operations so your business keeps moving.',
}

function renderZhenbotEmail(name: string, contentHtml: string, header: HeaderConfig, subject: string, actionText?: string, actionUrl?: string): string {
  const ctaText = actionText || 'Visit Client Portal &rarr;'
  const ctaUrl = actionUrl || `${WEBSITE_URL}/portal`

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #F7F7F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; }
    @media only screen and (max-width: 540px) {
      .outer-wrap { padding: 10px 0 !important; }
      .main-card { border-radius: 0 !important; border-left: none !important; border-right: none !important; }
      .body-cell { padding: 20px 16px 28px 16px !important; }
      .header-wrap { padding: 14px 14px 8px 14px !important; }
      .banner-text-cell { padding: 18px 12px !important; }
      .banner-title { font-size: 15px !important; line-height: 20px !important; }
      .banner-sub { font-size: 11px !important; line-height: 15px !important; }
      .nav-cell { padding: 16px 16px 12px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F8;">

  <div style="display: none; font-size: 1px; color: #F7F7F8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${subject} — Zhenbot Automation: Eliminating repetitive manual business operations.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-wrap" style="background-color: #F7F7F8; padding: 24px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card (Max 580px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">

          <!-- TOP NAVIGATION / BRANDING (Clean SendMe Style: No Eyebrow, No Live Cloud Sync badge) -->
          <tr>
            <td class="nav-cell" style="padding: 20px 24px 16px 24px; border-bottom: 1px solid #EAECF0;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; line-height: 1;">
                    <div style="font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #101828; line-height: 24px;">
                      Zhen<span style="color: #00B82E;">bot</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #00B82E; letter-spacing: 0.2px; line-height: 14px; margin-top: 3px;">
                      Custom Business Automation
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MODERN HEADER BANNER: Exact SendMe App Dashboard Banner Style (Green #00B82E, 16px Radius, Text Left, Illustration Image Right) -->
          <tr>
            <td class="header-wrap" style="padding: 16px 20px 8px 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #00B82E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 184, 46, 0.2);">
                <tr>
                  <td class="banner-text-cell" style="padding: 24px 16px 24px 22px; vertical-align: middle;">
                    <div class="banner-title" style="font-size: 19px; font-weight: 800; line-height: 25px; color: #FFFFFF; letter-spacing: -0.3px; margin: 0 0 5px 0;">
                      ${header.title || 'Automate Your Business Operations'}
                    </div>
                    ${header.subtitle ? `
                    <div class="banner-sub" style="font-size: 13px; font-weight: 400; line-height: 18px; color: rgba(255, 255, 255, 0.95); margin: 0;">
                      ${header.subtitle}
                    </div>` : ''}
                  </td>
                  <td width="108" align="center" class="banner-img-cell" style="padding: 12px 16px 12px 0; vertical-align: middle;">
                    <img src="${BANNER_ILLUS}" alt="Zhenbot Automation" width="94" height="94" class="banner-img" style="display: block; width: 94px; height: 94px; max-width: 94px; object-fit: contain; border: 0;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY SECTION -->
          <tr>
            <td class="body-cell" style="padding: 16px 22px 28px 22px;">

              <div style="font-size: 17px; font-weight: 700; color: #111827; margin: 6px 0 10px 0; letter-spacing: -0.2px;">
                Hi ${name},
              </div>

              ${contentHtml}

              <!-- SECTION 1: WHAT WE AUTOMATE -->
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6B7280; margin: 20px 0 12px 0;">
                WHAT WE AUTOMATE
              </div>

              <!-- Feature 1 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 4px solid #00B82E; border-top: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 10px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_SYNC}" alt="Conversations" width="30" height="30" style="display: block; width: 30px; height: 30px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;">
                            Autonomous Customer Conversations
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #64748B;">
                            24/7 intelligent replies across WhatsApp, Telegram, and social DMs that qualify buyers, answer inquiries, and collect orders automatically.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 4px solid #00B82E; border-top: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 10px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_VERIFY}" alt="Payments" width="30" height="30" style="display: block; width: 30px; height: 30px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;">
                            Payment Verification &amp; Digital Receipts
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #64748B;">
                            Instant Paystack, card, and bank webhook verification that auto-generates branded PDF receipts and syncs your financial ledger with zero human delay.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Feature 3 -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; border-left: 4px solid #00B82E; border-top: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_LEDGER}" alt="Fulfillment" width="30" height="30" style="display: block; width: 30px; height: 30px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 3px;">
                            Order Fulfillment &amp; Operations Sync
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #64748B;">
                            Automatic order routing from your storefront directly to delivery riders, waypoint generators, and real-time customer tracking links.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 4px; padding-bottom: 12px;">
                    <a href="${ctaUrl}" style="display: inline-block; background-color: #00B82E; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 32px; border-radius: 10px; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(0, 184, 46, 0.25);">
                      ${ctaText}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 22px 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <div style="font-size: 12px; font-weight: 800; color: #111827; margin-bottom: 4px; letter-spacing: 0.5px;">
                ZHENBOT (ZHEN AUTOMATION)
              </div>
              <div style="font-size: 11.5px; line-height: 1.6; color: #6B7280; margin-bottom: 8px;">
                Custom Software &amp; Business Workflow Automations.<br>
                Questions or technical support? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #00B82E; text-decoration: none; font-weight: 600;">${SUPPORT_EMAIL}</a>
              </div>
              <div style="font-size: 11px; color: #9CA3AF;">
                &copy; 2026 Zhenbot Automation. All rights reserved. &bull; Serving businesses worldwide
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const sendbyteKey = Deno.env.get('SENDBYTE_API_KEY') || DEFAULT_SENDBYTE_KEY
    const sender = Deno.env.get('SENDBYTE_SENDER') || DEFAULT_SENDER

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://cxbevwccenradkjxoooh.supabase.co'
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, serviceKey)

    // Fetch dynamic header configuration from zhenbot_settings
    let headerConfig: HeaderConfig = DEFAULT_HEADER
    try {
      const { data } = await supabase.from('zhenbot_settings').select('value').eq('key', 'email_header').maybeSingle()
      if (data?.value) {
        headerConfig = { ...DEFAULT_HEADER, ...data.value }
      }
    } catch {
      //
    }

    const body = await req.json()
    const { type = 'direct_message', to, subject: customSubject, html: customHtml, data = {} } = body

    let recipients: string[] = []
    if (to) {
      recipients = Array.isArray(to) ? to : [to]
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ warning: 'No recipients resolved' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const name = data.name || 'Valued Client'
    let subject = customSubject || 'Update from Zhenbot Automation'
    let finalHtml = customHtml || ''

    if (!finalHtml) {
      if (type === 'welcome') {
        subject = subject || 'Welcome to Zhenbot Automation'
        finalHtml = renderZhenbotEmail(
          name,
          `<p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 16px 0;">
            Thank you for connecting with <strong>Zhenbot (Zhen Automation)</strong>. We are thrilled to partner with you to automate your business operations and eliminate repetitive manual workflows.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 20px 0;">
            You can access your dedicated client portal at any time to monitor your live automation pipelines, view audit logs, download invoices, and coordinate with our engineering team.
          </p>`,
          headerConfig,
          subject,
          'Access Your Workspace &rarr;',
          `${WEBSITE_URL}/portal`
        )
      } else if (type === 'admin_chat_alert') {
        subject = `[New Chat Lead] From ${data.user_name || 'Website Visitor'}`
        finalHtml = renderZhenbotEmail(
          'Admin Team',
          `<p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 14px 0;">
            A visitor just submitted an inquiry on the Zhenbot live website chat widget:
          </p>
          <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-left: 4px solid #00B82E; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <div style="font-size: 13px; font-weight: 700; color: #111827;">${data.user_name} (${data.user_email || 'No email'})</div>
            <div style="font-size: 13px; color: #4B5563; margin-top: 6px;">"${data.message}"</div>
          </div>`,
          headerConfig,
          subject,
          'Open Admin Dashboard &rarr;',
          `${WEBSITE_URL}/admin`
        )
      } else {
        subject = subject || 'Notification from Zhenbot Automation'
        finalHtml = renderZhenbotEmail(
          name,
          `<p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 16px 0;">
            ${(data.message || data.details || 'Here is an update regarding your automation account.').replace(/\n/g, '<br/>')}
          </p>`,
          headerConfig,
          subject
        )
      }
    }

    // Call SendByte Africa REST API
    const sendbytePayload = {
      from: sender,
      to: recipients,
      subject,
      html: finalHtml,
    }

    const sendbyteRes = await fetch(SENDBYTE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendbyteKey}`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(sendbytePayload),
    })

    const result = await sendbyteRes.json()

    // Log to zhenbot_emails
    try {
      for (const rec of recipients) {
        await supabase.from('zhenbot_emails').insert([
          {
            folder: 'sent',
            from_name: 'Zhenbot Automation',
            from_email: SUPPORT_EMAIL,
            to_email: rec,
            subject,
            preview: subject,
            body: finalHtml,
            is_read: true,
            is_starred: false,
            requires_followup: false,
            created_at: new Date().toISOString(),
          },
        ])
      }
    } catch {
      //
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Sendbyte error in Edge Function:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
