import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.104.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, sendbyte-signature',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

const SENDBYTE_ENDPOINT = 'https://api.sendbyte.africa/v1/emails'
const SENDBYTE_KEY = Deno.env.get('SENDBYTE_API_KEY') || ''
const SENDER_EMAIL = 'Zhenbot Inbound <automate@zhenibot.com>'
const FORWARD_PRIMARY_EMAIL = 'ibngahd01@gmail.com'
const WEBSITE_URL = 'https://zhenibot.com'

function parseEmailAddress(raw: any): { name: string; email: string } {
  if (!raw) return { name: 'Client', email: 'unknown@client.com' }
  if (typeof raw === 'object' && raw.email) {
    return { name: raw.name || raw.email.split('@')[0], email: raw.email }
  }
  const str = String(raw).trim()
  const match = str.match(/(.*?)\s*<([^>]+)>/)
  if (match) {
    return { name: match[1].trim() || match[2].split('@')[0], email: match[2].trim() }
  }
  return { name: str.split('@')[0], email: str }
}

function renderForwardTemplate(params: {
  fromName: string
  fromEmail: string
  toEmail: string
  subject: string
  bodyContent: string
  dateStr: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${params.subject}</title>
  <style type="text/css">
    body { margin: 0; padding: 0; background-color: #F7F7F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F7F8;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F7F7F8; padding: 24px 12px;">
    <tr>
      <td align="center">

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          
          <!-- TOP BRAND ROW -->
          <tr>
            <td style="padding: 18px 24px 14px 24px; border-bottom: 1px solid #F3F4F6;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 9px; font-weight: 800; color: #00B82E; letter-spacing: 0.9px; text-transform: uppercase;">
                      INBOUND EMAIL FORWARD
                    </div>
                    <div style="font-size: 20px; font-weight: 800; color: #111827; margin-top: 2px;">
                      Zhen<span style="color: #00B82E;">bot</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-weight: 700; color: #00B82E; background-color: #F0FDF4; border: 1px solid #D1FAE5; padding: 4px 10px; border-radius: 9999px;">
                      Direct to ibngahd01@gmail.com
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NOTIFICATION HEADER BANNER -->
          <tr>
            <td style="padding: 16px 20px 10px 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111827; border-radius: 14px; border: 1px solid #1F2937;">
                <tr>
                  <td style="padding: 18px 20px; color: #FFFFFF;">
                    <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; line-height: 22px;">
                      New Incoming Client Email
                    </div>
                    <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">
                      Received on ${params.toEmail} &bull; Forwarded instantly to your primary inbox
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INBOUND DETAILS CARD -->
          <tr>
            <td style="padding: 16px 22px 24px 22px;">
              
              <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-left: 4px solid #00B82E; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12.5px; line-height: 1.6;">
                  <tr>
                    <td width="70" style="color: #6B7280; font-weight: 700;">From:</td>
                    <td style="color: #111827; font-weight: 700;">${params.fromName} &lt;<a href="mailto:${params.fromEmail}" style="color: #00B82E; text-decoration: none;">${params.fromEmail}</a>&gt;</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 700;">To:</td>
                    <td style="color: #111827;">${params.toEmail}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 700;">Subject:</td>
                    <td style="color: #111827; font-weight: 600;">${params.subject}</td>
                  </tr>
                  <tr>
                    <td style="color: #6B7280; font-weight: 700;">Received:</td>
                    <td style="color: #6B7280;">${params.dateStr}</td>
                  </tr>
                </table>
              </div>

              <!-- MESSAGE BODY -->
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.7px; color: #6B7280; margin-bottom: 8px;">
                CLIENT MESSAGE CONTENT
              </div>
              <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px 18px; font-size: 13.5px; line-height: 1.6; color: #374151; min-height: 80px;">
                ${params.bodyContent}
              </div>

              <!-- CTA BUTTON -->
              <div style="text-align: center; padding-top: 24px;">
                <a href="${WEBSITE_URL}/admin" style="display: inline-block; background-color: #00B82E; color: #FFFFFF; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 12px 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,184,46,0.25);">
                  Open Admin Dashboard &amp; Reply &rarr;
                </a>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 18px 24px; text-align: center; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280;">
              ZHENBOT (ZHEN AUTOMATION) &bull; Official Inbound Forwarder<br>
              Direct contact: <a href="mailto:automate@zhenibot.com" style="color: #00B82E; text-decoration: none;">automate@zhenibot.com</a>
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://cxbevwccenradkjxoooh.supabase.co'
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, serviceKey)

    const rawPayload = await req.json()
    console.log('SendByte Inbound Webhook Received:', JSON.stringify(rawPayload).substring(0, 300))

    // Support both wrapped event payload: { event: "email.received", data: {...} } and direct payload: {...}
    const emailData = rawPayload.data || rawPayload
    const { name: fromName, email: fromEmail } = parseEmailAddress(emailData.from || emailData.sender)

    let toEmail = 'automate@zhenibot.com'
    if (emailData.to) {
      if (Array.isArray(emailData.to) && emailData.to.length > 0) {
        toEmail = String(emailData.to[0])
      } else {
        toEmail = String(emailData.to)
      }
    }

    const subject = emailData.subject || '(No Subject)'
    const bodyHtml = emailData.html || ''
    const bodyText = emailData.text || emailData.stripped_text || ''
    const bodyToDisplay = bodyHtml || (bodyText ? `<p style="white-space: pre-line;">${bodyText}</p>` : '<p><i>(Empty message body)</i></p>')
    const preview = (bodyText || subject).substring(0, 120)
    const nowIso = new Date().toISOString()
    const emailId = 'em-in-' + Date.now().toString(36)

    // 1. Insert into zhenbot_emails in Supabase (Folder: 'inbox')
    const { error: dbError } = await supabase.from('zhenbot_emails').insert([
      {
        id: emailId,
        folder: 'inbox',
        from_name: fromName,
        from_email: fromEmail,
        to_email: toEmail,
        to_name: 'Zhenbot Operations',
        subject: subject,
        preview: preview,
        body: bodyToDisplay,
        is_read: false,
        is_starred: false,
        requires_followup: true,
        followup_due: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        followup_status: 'due_today',
        created_at: nowIso,
      },
    ])

    if (dbError) {
      console.warn('DB insert notice:', dbError.message)
    }

    // 2. Trigger notification for admin dashboard
    void supabase.from('zhenbot_notifications').insert([
      {
        id: 'notif-' + Date.now().toString(36),
        type: 'enquiry',
        title: `New Email: ${fromName}`,
        message: `${subject} — ${preview}`,
        link_tab: 'emails',
        is_read: false,
        created_at: nowIso,
      },
    ])

    // 3. Log audit activity
    void supabase.from('zhenbot_activity_logs').insert([
      {
        id: 'log-' + Date.now().toString(36),
        admin_name: 'SendByte Inbound Gateway',
        action: 'Inbound Email Ingested',
        target_type: 'Email',
        target_id: emailId,
        details: `From: ${fromName} (${fromEmail}) to ${toEmail}. Subject: "${subject}". Forwarded to ${FORWARD_PRIMARY_EMAIL}`,
        created_at: nowIso,
      },
    ])

    // 4. FORWARD IMMEDIATELY TO ibngahd01@gmail.com VIA SENDBYTE
    const forwardSubject = `[Client Email on ${toEmail}] ${subject} — from ${fromName}`
    const forwardHtml = renderForwardTemplate({
      fromName,
      fromEmail,
      toEmail,
      subject,
      bodyContent: bodyToDisplay,
      dateStr: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }),
    })

    const forwardPayload = {
      from: SENDER_EMAIL,
      to: [FORWARD_PRIMARY_EMAIL],
      subject: forwardSubject,
      html: forwardHtml,
    }

    const forwardRes = await fetch(SENDBYTE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDBYTE_KEY}`,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(forwardPayload),
    })

    const forwardResult = await forwardRes.json()
    console.log(`Forwarded inbound email to ${FORWARD_PRIMARY_EMAIL}. SendByte status:`, forwardRes.status, forwardResult)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inbound email received, stored in dashboard, and forwarded to ibngahd01@gmail.com',
        email_id: emailId,
        forwarded_to: FORWARD_PRIMARY_EMAIL,
        sendbyte_forward_result: forwardResult,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Inbound webhook error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
