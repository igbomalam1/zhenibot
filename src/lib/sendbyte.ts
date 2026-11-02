import { supabase } from '@/lib/supabase'

export const SENDBYTE_ENDPOINT = 'https://api.sendbyte.africa/v1/emails'
export const DEFAULT_SENDBYTE_API_KEY =
  (import.meta.env.VITE_SENDBYTE_API_KEY as string) || ''
export const DEFAULT_SENDBYTE_SENDER = 'Zhenbot Automation <automate@zhenibot.com>'
export const OFFICIAL_SUPPORT_EMAIL = 'automate@zhenibot.com'
export const OFFICIAL_WEBSITE_URL = 'https://zhenibot.com'

// High-resolution hosted illustration and PNG icons matching SendMe / fairly-used infrastructure
export const BANNER_ILLUS =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/illustrations/device-banner-illus.png'
export const ICON_SYNC =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-swap.png'
export const ICON_VERIFY =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-verify.png'
export const ICON_LEDGER =
  'https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-vault.png'

export interface EmailHeaderConfig {
  title: string
  subtitle: string
}

export const DEFAULT_HEADER_CONFIG: EmailHeaderConfig = {
  title: 'Automate Your Business Operations',
  subtitle: 'Custom software that eliminates repetitive manual work so your business keeps moving.',
}

const STORAGE_KEY_HEADER = 'zhenbot_email_header_config'

/**
 * Retrieves the current dynamic header configuration
 */
export function getEmailHeaderConfig(): EmailHeaderConfig {
  if (typeof window === 'undefined') return DEFAULT_HEADER_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HEADER)
    if (raw) {
      return { ...DEFAULT_HEADER_CONFIG, ...JSON.parse(raw) }
    }
  } catch {
    // fallback
  }
  return DEFAULT_HEADER_CONFIG
}

/**
 * Updates the header configuration in local storage and Supabase zhenbot_settings
 */
export async function saveEmailHeaderConfig(config: EmailHeaderConfig): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(config))
      window.dispatchEvent(new CustomEvent('zhenbot_email_config_update', { detail: config }))
    } catch {
      //
    }
  }

  try {
    await supabase.from('zhenbot_settings').upsert({
      key: 'email_header',
      value: config,
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('Could not save email header config to Supabase:', err)
  }
}

/**
 * Initializes header configuration from Supabase on app start
 */
export async function initEmailHeaderConfig(): Promise<EmailHeaderConfig> {
  try {
    const { data } = await supabase
      .from('zhenbot_settings')
      .select('value')
      .eq('key', 'email_header')
      .maybeSingle()

    if (data?.value) {
      const merged: EmailHeaderConfig = {
        ...DEFAULT_HEADER_CONFIG,
        ...(data.value as Partial<EmailHeaderConfig>),
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(merged))
        window.dispatchEvent(new CustomEvent('zhenbot_email_config_update', { detail: merged }))
      }
      return merged
    }
  } catch {
    //
  }
  return getEmailHeaderConfig()
}

export interface EmailTemplateRenderOptions {
  recipientName?: string
  subject?: string
  heading?: string
  preheader?: string
  messageHtml?: string
  actionText?: string
  actionUrl?: string
  highlightCard?: {
    badge: string
    title: string
    description: string
    amount?: string
  }
  customHeader?: Partial<EmailHeaderConfig>
}

/**
 * Renders the responsive HTML email template matching fairly-used layout exactly,
 * styled for Zhenbot Automation (color palette #00B82E, #111827, #FFFFFF, #F7F7F8).
 */
export function renderZhenbotEmailHtml(options: EmailTemplateRenderOptions): string {
  const currentHeader = {
    ...getEmailHeaderConfig(),
    ...(options.customHeader || {}),
  }

  const name = options.recipientName || 'Valued Partner'
  const actionText = options.actionText || 'Open Dashboard &rarr;'
  const actionUrl = options.actionUrl || `${OFFICIAL_WEBSITE_URL}/portal`
  const preheader = options.preheader || 'Zhenbot Automation: Intelligent software automations for your business operations.'

  const messageContent =
    options.messageHtml ||
    `<p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 20px 0;">
      Welcome to <strong>Zhenbot (Zhen Automation)</strong>. We build custom software automations that eliminate repetitive manual tasks across your business—from customer enquiries and WhatsApp conversations to instant payment reconciliation, delivery dispatch, and record-keeping.
    </p>`

  const highlightCardHtml = options.highlightCard
    ? `<!-- HIGHLIGHT CARD WITH BRAND GREEN ACCENT -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-left: 4px solid #00B82E; border-radius: 10px; margin-bottom: 22px;">
        <tr>
          <td style="padding: 16px 18px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="vertical-align: middle;">
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #00B82E; letter-spacing: 0.6px;">
                    ${options.highlightCard.badge}
                  </div>
                  <div style="font-size: 16px; font-weight: 800; color: #111827; margin-top: 2px;">
                    ${options.highlightCard.title} ${
        options.highlightCard.amount
          ? `<span style="color: #00B82E; margin-left: 4px;">${options.highlightCard.amount}</span>`
          : ''
      }
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 8px;">
                  <div style="font-size: 12.5px; line-height: 1.5; color: #6B7280;">
                    ${options.highlightCard.description}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
    : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${options.subject || 'Zhenbot Automation'}</title>
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

  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #F7F7F8; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <!-- Outer background container matching fairly-used -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="outer-wrap" style="background-color: #F7F7F8; padding: 24px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card (Max 580px, white surface, subtle border, rounded-2xl) -->
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

          <!-- HEADER BANNER: Exact SendMe App Dashboard Banner Style (Green #00B82E, 16px Radius, Text Left, Real Illustration Image Right) -->
          <tr>
            <td class="header-wrap" style="padding: 16px 20px 8px 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #00B82E; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 184, 46, 0.2);">
                <tr>
                  <!-- Left Text Column: Clean, high-impact eye-catching headline -->
                  <td class="banner-text-cell" style="padding: 24px 16px 24px 22px; vertical-align: middle;">
                    <div class="banner-title" style="font-size: 19px; font-weight: 800; line-height: 25px; color: #FFFFFF; letter-spacing: -0.3px; margin: 0 0 5px 0;">
                      ${currentHeader.title || 'Automate Your Business Operations'}
                    </div>
                    ${currentHeader.subtitle ? `
                    <div class="banner-sub" style="font-size: 13px; font-weight: 400; line-height: 18px; color: rgba(255, 255, 255, 0.95); margin: 0;">
                      ${currentHeader.subtitle}
                    </div>` : ''}
                  </td>

                  <!-- Right Illustration Image Column (94x94 PNG) -->
                  <td width="108" align="center" class="banner-img-cell" style="padding: 12px 16px 12px 0; vertical-align: middle;">
                    <img src="${BANNER_ILLUS}" alt="Zhenbot Automation" width="94" height="94" class="banner-img" style="display: block; width: 94px; height: 94px; max-width: 94px; object-fit: contain; border: 0;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY SECTION -->
          <tr>
            <td class="body-cell" style="padding: 18px 22px 28px 22px;">

              <!-- Personal Greeting -->
              <div style="font-size: 17px; font-weight: 700; color: #101828; margin: 4px 0 10px 0; letter-spacing: -0.2px;">
                Hi ${name},
              </div>

              <!-- Main Body Text -->
              ${messageContent}

              <!-- Highlight Card -->
              ${highlightCardHtml}

              <!-- SECTION 1: WHAT WE AUTOMATE -->
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #667085; margin: 18px 0 12px 0;">
                WHAT WE AUTOMATE
              </div>

              <!-- Feature 1: Multi-Platform Messaging (Real Hosted PNG Icon, Visible Across All Email Clients) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #EAECF0; border-left: 4px solid #00B82E; border-radius: 12px; margin-bottom: 12px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_SYNC}" alt="Messaging" width="28" height="28" style="display: block; width: 28px; height: 28px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #101828; margin-bottom: 3px;">
                            Autonomous Customer Conversations
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #475467;">
                            24/7 intelligent replies across WhatsApp, Telegram, and social DMs that qualify buyers, answer inquiries, and collect orders automatically.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Feature 2: Payments & Verification (Real Hosted PNG Icon) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #EAECF0; border-left: 4px solid #00B82E; border-radius: 12px; margin-bottom: 12px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_VERIFY}" alt="Payments" width="28" height="28" style="display: block; width: 28px; height: 28px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #101828; margin-bottom: 3px;">
                            Payment Verification &amp; Digital Receipts
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #475467;">
                            Instant Paystack, card, and bank webhook verification that auto-generates branded PDF receipts and syncs your financial ledger with zero human delay.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Feature 3: Order & Dispatch Routing (Real Hosted PNG Icon) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #EAECF0; border-left: 4px solid #00B82E; border-radius: 12px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; padding-right: 12px;">
                          <img src="${ICON_LEDGER}" alt="Orders" width="28" height="28" style="display: block; width: 28px; height: 28px; border: 0;" />
                        </td>
                        <td style="vertical-align: top;">
                          <div style="font-size: 14px; font-weight: 700; color: #101828; margin-bottom: 3px;">
                            Order Fulfillment &amp; Dispatch Automation
                          </div>
                          <div style="font-size: 12.5px; line-height: 1.5; color: #475467;">
                            Automatic order routing from your storefront directly to delivery riders, waypoint generators, and real-time customer tracking links.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              </table>

              <!-- SECTION 2: HOW TO GET STARTED (1-2-3 Sequence) -->
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #6B7280; margin: 0 0 12px 0;">
                OUR AUTOMATION PROCESS
              </div>

              <!-- Steps List -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    
                    <!-- Step 1 -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                      <tr>
                        <td width="28" style="vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 11px; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; line-height: 22px; text-align: center;">1</div>
                        </td>
                        <td style="vertical-align: top; padding-left: 8px;">
                          <div style="font-size: 13px; font-weight: 700; color: #111827;">Identify Bottlenecks</div>
                          <div style="font-size: 11.5px; line-height: 1.45; color: #6B7280; margin-top: 1px;">
                            We review where your team spends repetitive hours and pinpoint high-leverage workflows.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Step 2 -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                      <tr>
                        <td width="28" style="vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 11px; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; line-height: 22px; text-align: center;">2</div>
                        </td>
                        <td style="vertical-align: top; padding-left: 8px;">
                          <div style="font-size: 13px; font-weight: 700; color: #111827;">Custom Build &amp; Verification</div>
                          <div style="font-size: 11.5px; line-height: 1.45; color: #6B7280; margin-top: 1px;">
                            We build and connect software without disrupting your existing team habits or customer channels.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Step 3 -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="28" style="vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 11px; background-color: #111827; color: #FFFFFF; font-size: 11px; font-weight: 700; line-height: 22px; text-align: center;">3</div>
                        </td>
                        <td style="vertical-align: top; padding-left: 8px;">
                          <div style="font-size: 13px; font-weight: 700; color: #111827;">Deploy &amp; Monitor 24/7</div>
                          <div style="font-size: 11.5px; line-height: 1.45; color: #6B7280; margin-top: 1px;">
                            Go live with continuous uptime SLA tracking, automated failover, and dedicated support.
                          </div>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- PRIMARY ACTION BUTTON (Clean, High Contrast, Brand Green) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 4px; padding-bottom: 12px;">
                    <a href="${actionUrl}" style="display: inline-block; background-color: #00B82E; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 32px; border-radius: 10px; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(0, 184, 46, 0.25);">
                      ${actionText}
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
                Questions or technical support? Contact us at <a href="mailto:${OFFICIAL_SUPPORT_EMAIL}" style="color: #00B82E; text-decoration: none; font-weight: 600;">${OFFICIAL_SUPPORT_EMAIL}</a>
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

export interface SendbyteDispatchPayload {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  type?: string
  data?: Record<string, any>
  recipientName?: string
}

/**
 * Universal dispatcher powered by SendByte Africa API
 */
export async function sendSendbyteEmail(payload: SendbyteDispatchPayload): Promise<{
  success: boolean
  data?: any
  error?: any
}> {
  const apiKey =
    import.meta.env.VITE_SENDBYTE_API_KEY ||
    DEFAULT_SENDBYTE_API_KEY

  const fromSender =
    payload.from ||
    import.meta.env.VITE_SENDBYTE_SENDER ||
    DEFAULT_SENDBYTE_SENDER

  const recipients = Array.isArray(payload.to) ? payload.to : [payload.to]

  // Render HTML body if not explicitly provided
  const finalHtml =
    payload.html ||
    renderZhenbotEmailHtml({
      recipientName: payload.recipientName,
      subject: payload.subject,
      messageHtml: payload.text ? `<p style="font-size:14px; line-height:1.6; color:#4B5563;">${payload.text.replace(/\n/g, '<br/>')}</p>` : undefined,
    })

  // 1. Log asynchronously into Supabase zhenbot_emails table
  try {
    for (const rec of recipients) {
      void supabase.from('zhenbot_emails').insert([
        {
          folder: 'sent',
          from_name: 'Zhenbot Automation',
          from_email: OFFICIAL_SUPPORT_EMAIL,
          to_email: rec,
          subject: payload.subject,
          preview: (payload.text || payload.subject).substring(0, 120),
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

  // 2. Dispatch via SendByte Edge Function or Direct API
  try {
    const edgeRes = await supabase.functions.invoke('send-email', {
      body: {
        to: recipients,
        subject: payload.subject,
        html: finalHtml,
        type: payload.type || 'direct_message',
        data: payload.data || {},
      },
    })

    if (!edgeRes.error && edgeRes.data?.success) {
      return { success: true, data: edgeRes.data }
    }
  } catch (err) {
    console.debug('Edge function proxy attempt finished:', err)
  }

  // 3. Direct SendByte REST API call
  try {
    const response = await fetch(SENDBYTE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        from: fromSender,
        to: recipients,
        subject: payload.subject,
        html: finalHtml,
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      console.warn('SendByte direct response status not ok:', response.status, result)
      return { success: false, error: result }
    }

    return { success: true, data: result }
  } catch (err) {
    console.warn('SendByte direct fetch notice:', err)
    return { success: false, error: err }
  }
}
