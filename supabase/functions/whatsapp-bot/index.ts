import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.104.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Environment variables from Supabase Secrets
const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN') || ''
const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') || ''
const WHATSAPP_VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'zhenbot_wa_verify_2026'
const SENDBYTE_API_KEY = Deno.env.get('SENDBYTE_API_KEY') || ''
const ADMIN_ALERT_EMAIL = Deno.env.get('ADMIN_ALERT_EMAIL') || 'ibngahd01@gmail.com'
const SENDBYTE_ENDPOINT = 'https://api.sendbyte.africa/v1/emails'
const SENDER_EMAIL = 'Zhenbot WhatsApp Assistant <automate@zhenibot.com>'
const WEBSITE_URL = 'https://zhenibot.com'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Send Plain Text WhatsApp Message
async function sendWhatsAppText(to: string, text: string) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error('WhatsApp credentials missing in environment')
    return null
  }

  const url = `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: text },
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    console.log('WhatsApp sendText result:', JSON.stringify(data))
    return data
  } catch (err) {
    console.error('Error sending WhatsApp message:', err)
    return null
  }
}

// Send Interactive Button Message (Max 3 buttons, button title <= 20 chars)
async function sendWhatsAppButtons(
  to: string,
  bodyText: string,
  buttons: Array<{ id: string; title: string }>,
  headerText?: string
) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return null

  const url = `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`
  const formattedButtons = buttons.slice(0, 3).map((b) => ({
    type: 'reply',
    reply: {
      id: b.id,
      title: b.title.substring(0, 20),
    },
  }))

  const interactivePayload: any = {
    type: 'button',
    body: { text: bodyText },
    footer: { text: 'Zhenbot Automation • zhenibot.com' },
    action: { buttons: formattedButtons },
  }

  if (headerText) {
    interactivePayload.header = {
      type: 'text',
      text: headerText.substring(0, 60),
    }
  }

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive: interactivePayload,
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    console.log('WhatsApp sendButtons result:', JSON.stringify(data))
    return data
  } catch (err) {
    console.error('Error sending WhatsApp buttons:', err)
    return null
  }
}

// Send Email Alert via SendByte
async function sendAdminEmailAlert(subject: string, htmlContent: string) {
  if (!SENDBYTE_API_KEY) return

  try {
    await fetch(SENDBYTE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDBYTE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: ADMIN_ALERT_EMAIL,
        subject,
        html: htmlContent,
      }),
    })
  } catch (err) {
    console.error('Error sending SendByte email:', err)
  }
}

// Telegram Alert to Admin if Chat ID registered
async function sendAdminTelegramAlert(text: string) {
  try {
    const { data } = await supabase
      .from('zhenbot_settings')
      .select('value')
      .eq('key', 'admin_telegram_chat_id')
      .single()

    const token = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const chatId = data?.value?.chat_id

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      })
    }
  } catch {
    // Non-blocking
  }
}

// User Conversational State
async function getUserState(phone: string) {
  try {
    const { data } = await supabase
      .from('zhenbot_settings')
      .select('value')
      .eq('key', `wa_state_${phone}`)
      .single()

    return data?.value || { step: 'idle', data: {} }
  } catch {
    return { step: 'idle', data: {} }
  }
}

async function setUserState(phone: string, state: any) {
  try {
    await supabase.from('zhenbot_settings').upsert({
      key: `wa_state_${phone}`,
      value: state,
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Error saving state:', err)
  }
}

// Knowledge Base Matcher
function matchKnowledgeQuery(text: string): string | null {
  const lower = text.toLowerCase()

  if (lower.includes('cost') || lower.includes('price') || lower.includes('pricing') || lower.includes('how much') || lower.includes('charge')) {
    return (
      `💰 *Zhenbot Pricing & Investment*\n\n` +
      `Our systems are custom-engineered around your exact operations:\n\n` +
      `• *Starter Automations:* Single workflow (e.g. WhatsApp FAQ + order qualification or instant Paystack receipt generation).\n` +
      `• *Operations Suite:* Multi-platform conversation bots + automatic rider dispatch + CRM/Google Sheets sync.\n` +
      `• *Enterprise Suite:* End-to-end bespoke operations software, ad lead routing & priority maintenance.\n\n` +
      `Reply *"Request"* to start a custom quote or *"Rep"* to speak directly with our team.`
    )
  }

  if (lower.includes('time') || lower.includes('how long') || lower.includes('turnaround') || lower.includes('timeline')) {
    return (
      `⏱️ *Deployment Timelines*\n\n` +
      `• *Quick Workflows:* 3 to 5 business days.\n` +
      `• *Full Operations Systems:* 7 to 14 business days including testing, staff handover, and live monitoring.\n\n` +
      `Every system undergoes staging and stress testing before connecting to your live customer channels.`
    )
  }

  if (lower.includes('nigeria') || lower.includes('country') || lower.includes('location') || lower.includes('uk') || lower.includes('usa') || lower.includes('global')) {
    return (
      `🌍 *Global Service Reach*\n\n` +
      `Zhenbot serves businesses across the globe! We build and deploy automation infrastructure for clients in Nigeria, the UK, the United States, Canada, Europe, and the Middle East.\n\n` +
      `All cloud infrastructure, webhooks, and AI assistants operate 24/7/365 across all time zones.`
    )
  }

  if (lower.includes('paystack') || lower.includes('payment') || lower.includes('receipt') || lower.includes('bank') || lower.includes('transfer')) {
    return (
      `💳 *Payment & Receipt Automation*\n\n` +
      `Never waste time manually verifying bank transfers or screenshots again:\n\n` +
      `• Instant Paystack, card, and bank webhook verification.\n` +
      `• Auto-generates branded digital PDF receipts sent instantly to the customer.\n` +
      `• Automatically updates your accounting ledger and database with zero human delay.`
    )
  }

  return null
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // 1. Meta Webhook Verification Handshake (GET)
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    console.log('Meta Webhook Handshake check:', { mode, token, challenge: challenge?.slice(0, 8) })

    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('✅ Webhook verified successfully by Meta!')
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    console.warn('❌ Verification failed. Verify token did not match.')
    return new Response('Forbidden', { status: 403 })
  }

  // 2. Incoming Messages Webhook (POST)
  try {
    const body = await req.json()
    console.log('Incoming WhatsApp Webhook:', JSON.stringify(body))

    // Check if this is an incoming message notification
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (value?.messages && value.messages.length > 0) {
      const message = value.messages[0]
      const from = message.from // e.g., "2348012345678"
      const contactName = value.contacts?.[0]?.profile?.name || 'Customer'
      let incomingText = ''
      let buttonId = ''

      if (message.type === 'text') {
        incomingText = message.text?.body?.trim() || ''
      } else if (message.type === 'interactive') {
        if (message.interactive?.button_reply) {
          buttonId = message.interactive.button_reply.id
          incomingText = message.interactive.button_reply.title
        } else if (message.interactive?.list_reply) {
          buttonId = message.interactive.list_reply.id
          incomingText = message.interactive.list_reply.title
        }
      }

      console.log(`Received from ${from} (${contactName}): text="${incomingText}", buttonId="${buttonId}"`)

      // A. Handle Button: What We Automate
      if (buttonId === 'btn_services') {
        const servicesText =
          `⚡ *What We Automate at Zhenbot*\n\n` +
          `1️⃣ *Autonomous Conversations:* 24/7 intelligent replies on WhatsApp, Telegram, IG & Facebook that qualify buyers, answer inquiries, and collect orders.\n\n` +
          `2️⃣ *Payment & Receipt Verification:* Instant Paystack & bank webhook verification that auto-generates branded receipts and updates ledgers.\n\n` +
          `3️⃣ *Order & Delivery Routing:* Direct routing from storefront to delivery riders with real-time waypoint tracking links.\n\n` +
          `4️⃣ *Spreadsheets & CRM Sync:* 2-way sync across Google Sheets, Airtable, Notion, and databases.\n\n` +
          `5️⃣ *Marketing & Ad Workflows:* Automated Meta ad lead capture straight to your sales pipeline.`

        await sendWhatsAppButtons(
          from,
          servicesText,
          [
            { id: 'btn_intake', title: '🚀 Request System' },
            { id: 'btn_rep', title: '👤 Speak with Rep' },
            { id: 'btn_menu', title: '« Main Menu' },
          ],
          'Zhenbot Services'
        )
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // B. Handle Button: Speak with Rep
      if (
        buttonId === 'btn_rep' ||
        incomingText.toLowerCase() === 'rep' ||
        incomingText.toLowerCase().includes('speak to human') ||
        incomingText.toLowerCase().includes('talk to someone')
      ) {
        await setUserState(from, {
          step: 'awaiting_rep_note',
          data: { name: contactName, phone: from },
        })

        const repPrompt =
          `👤 *Connect with a Zhenbot Lead Engineer*\n\n` +
          `Please reply with a brief note describing what you need help with.\n\n` +
          `Our lead automation architect will be notified immediately and will message you back on this chat!`

        await sendWhatsAppText(from, repPrompt)
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // C. Handle Button: Start Intake
      if (buttonId === 'btn_intake' || incomingText.toLowerCase() === 'request') {
        await setUserState(from, {
          step: 'awaiting_business_name',
          data: { name: contactName, phone: from },
        })

        const intakePrompt =
          `🚀 *Custom Automation Intake — Step 1/4*\n\n` +
          `Great! Let's get your automation system designed.\n\n` +
          `*What is your company or business name?*`

        await sendWhatsAppText(from, intakePrompt)
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // D. Handle Conversational State Machine
      const state = await getUserState(from)

      // Step 1: Business Name
      if (state.step === 'awaiting_business_name') {
        const updated = { ...state.data, business_name: incomingText }
        await setUserState(from, { step: 'awaiting_bottleneck', data: updated })

        const nextMsg =
          `💼 *Got it, ${incomingText}! — Step 2/4*\n\n` +
          `What is the biggest operational bottleneck you want to eliminate?\n\n` +
          `*(e.g., "Manual WhatsApp chats", "Verifying bank transfer alerts", "Dispatching riders", "Updating Google Sheets manually")*`

        await sendWhatsAppText(from, nextMsg)
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Step 2: Bottleneck
      if (state.step === 'awaiting_bottleneck') {
        const updated = { ...state.data, bottleneck: incomingText }
        await setUserState(from, { step: 'awaiting_tools', data: updated })

        const nextMsg =
          `⚙️ *Understood! — Step 3/4*\n\n` +
          `What software or tools are you currently using?\n\n` +
          `*(e.g., WhatsApp, Instagram, Excel, Paystack, Shopify, QuickBooks, custom database)*`

        await sendWhatsAppText(from, nextMsg)
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Step 3: Current Tools
      if (state.step === 'awaiting_tools') {
        const updated = { ...state.data, tools: incomingText }
        await setUserState(from, { step: 'awaiting_contact', data: updated })

        const nextMsg =
          `📞 *Final Step — Step 4/4*\n\n` +
          `What is the best email address or alternate phone number for our lead architect to send your tailored proposal?`

        await sendWhatsAppText(from, nextMsg)
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Step 4: Contact & Complete Intake
      if (state.step === 'awaiting_contact') {
        const finalData = { ...state.data, contact: incomingText }
        await setUserState(from, { step: 'completed', data: finalData })

        const enquiryId = `lead_wa_${from}_${Date.now()}`

        // 1. Insert into Supabase zhenbot_enquiries
        try {
          await supabase.from('zhenbot_enquiries').insert({
            id: enquiryId,
            name: finalData.name || contactName,
            business_name: finalData.business_name || 'Unspecified',
            phone: from,
            email: finalData.contact?.includes('@') ? finalData.contact : null,
            service_of_interest: 'Custom WhatsApp Business Automation',
            details:
              `Operational Bottleneck: ${finalData.bottleneck}\n` +
              `Current Tools: ${finalData.tools}\n` +
              `Alternative Contact: ${finalData.contact}\n` +
              `WhatsApp Phone: +${from}`,
            source: 'WhatsApp Bot (Official Cloud API)',
            status: 'new',
            created_at: new Date().toISOString(),
          })

          await supabase.from('zhenbot_notifications').insert({
            id: `notif_wa_${Date.now()}`,
            type: 'lead',
            title: `New WhatsApp Lead: ${finalData.business_name}`,
            message: `${finalData.name} (+${from}) submitted automation requirements: ${finalData.bottleneck}`,
            link_tab: 'leads',
            is_read: false,
            created_at: new Date().toISOString(),
          })
        } catch (dbErr) {
          console.error('Error recording WhatsApp lead in DB:', dbErr)
        }

        // 2. Send Email Alert via SendByte
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #00B82E; padding: 24px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🎉 New WhatsApp Automation Lead</h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Received via Official WhatsApp Cloud API</p>
            </div>
            <div style="padding: 24px; color: #111827; font-size: 14px; line-height: 1.6;">
              <p><strong>Business Name:</strong> ${finalData.business_name}</p>
              <p><strong>Contact Person:</strong> ${finalData.name} (+${from})</p>
              <p><strong>Provided Contact:</strong> ${finalData.contact}</p>
              <div style="background-color: #F8FAFC; border-left: 4px solid #00B82E; padding: 14px; margin: 16px 0; border-radius: 8px;">
                <p style="margin: 0 0 6px 0; font-weight: 700; color: #111827;">What They Want Automated:</p>
                <p style="margin: 0; color: #4B5563;">${finalData.bottleneck}</p>
              </div>
              <p><strong>Current Tools:</strong> ${finalData.tools}</p>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${WEBSITE_URL}/admin" style="display: inline-block; background-color: #00B82E; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Open in Zhenbot Dashboard</a>
              </div>
            </div>
          </div>
        `

        await sendAdminEmailAlert(
          `🚀 New WhatsApp Lead: ${finalData.business_name} (${finalData.name})`,
          emailHtml
        )

        // 3. Telegram Alert to Admin
        await sendAdminTelegramAlert(
          `🚨 <b>NEW WHATSAPP LEAD INTAKE</b>\n\n` +
          `🏢 <b>Company:</b> ${finalData.business_name}\n` +
          `👤 <b>Name:</b> ${finalData.name} (+${from})\n` +
          `📞 <b>Contact:</b> ${finalData.contact}\n\n` +
          `🎯 <b>Bottleneck:</b> ${finalData.bottleneck}\n\n` +
          `🛠️ <b>Tools:</b> ${finalData.tools}`
        )

        // 4. Send Confirmation to User
        const successMsg =
          `🎉 *Requirements Received!*\n\n` +
          `Thank you, *${finalData.name}*. Your requirements for *${finalData.business_name}* have been submitted directly to our lead engineering team.\n\n` +
          `Our team will review your workflow and contact you at *${finalData.contact}* shortly with a tailored system architecture and quote.\n\n` +
          `Visit our website at *${WEBSITE_URL}* to learn more.`

        await sendWhatsAppButtons(
          from,
          successMsg,
          [
            { id: 'btn_services', title: '⚡ What We Automate' },
            { id: 'btn_rep', title: '👤 Speak with Rep' },
          ],
          'Zhenbot Automation'
        )
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Step: Awaiting Rep Note
      if (state.step === 'awaiting_rep_note') {
        await setUserState(from, { step: 'idle', data: {} })

        try {
          await supabase.from('zhenbot_enquiries').insert({
            id: `rep_wa_${from}_${Date.now()}`,
            name: contactName,
            business_name: 'Direct WhatsApp Rep Request',
            phone: `+${from}`,
            details: `Customer requested direct WhatsApp rep: "${incomingText}"`,
            source: 'WhatsApp Bot Direct Support',
            status: 'new',
            created_at: new Date().toISOString(),
          })

          await supabase.from('zhenbot_notifications').insert({
            id: `notif_rep_wa_${Date.now()}`,
            type: 'urgent',
            title: `Urgent WhatsApp Rep Request: ${contactName}`,
            message: `+${from} requested assistance: "${incomingText.substring(0, 80)}"`,
            link_tab: 'leads',
            is_read: false,
            created_at: new Date().toISOString(),
          })
        } catch (e) {
          console.error(e)
        }

        const repEmailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #111827; padding: 24px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #00B82E;">⚡ Urgent WhatsApp Representative Request</h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #9CA3AF;">A client on WhatsApp requested direct contact</p>
            </div>
            <div style="padding: 24px; color: #111827; font-size: 14px; line-height: 1.6;">
              <p><strong>Name:</strong> ${contactName}</p>
              <p><strong>Phone:</strong> +${from}</p>
              <div style="background-color: #F8FAFC; border-left: 4px solid #00B82E; padding: 14px; margin: 16px 0; border-radius: 8px;">
                <p style="margin: 0 0 6px 0; font-weight: 700;">Customer Message:</p>
                <p style="margin: 0; color: #4B5563;">"${incomingText}"</p>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${WEBSITE_URL}/admin" style="display: inline-block; background-color: #00B82E; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Open Zhenbot Dashboard</a>
              </div>
            </div>
          </div>
        `

        await sendAdminEmailAlert(
          `⚡ Urgent WhatsApp Rep Request: ${contactName} (+${from})`,
          repEmailHtml
        )

        await sendAdminTelegramAlert(
          `⚡ <b>URGENT WHATSAPP REP REQUEST</b>\n\n` +
          `👤 <b>Client:</b> ${contactName} (+${from})\n` +
          `💬 <b>Message:</b> "${incomingText}"`
        )

        await sendWhatsAppText(
          from,
          `✅ *Request Received!*\n\n` +
          `We have alerted our lead engineer directly. Someone from our team will reply to you on this WhatsApp chat shortly!`
        )
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Check Knowledge Base Match
      const kbAnswer = matchKnowledgeQuery(incomingText)
      if (kbAnswer) {
        await sendWhatsAppButtons(
          from,
          kbAnswer,
          [
            { id: 'btn_intake', title: '🚀 Request System' },
            { id: 'btn_rep', title: '👤 Speak with Rep' },
          ],
          'Zhenbot Assistant'
        )
        return new Response('EVENT_RECEIVED', { status: 200 })
      }

      // Default Greeting & Main Menu
      const welcomeText =
        `👋 *Welcome to Zhenbot Automation!*\n\n` +
        `I am your 24/7 AI operations assistant. We build custom business automations that eliminate manual work:\n\n` +
        `• *Messaging:* WhatsApp, Telegram, IG & Facebook AI auto-replies\n` +
        `• *Finances:* Instant payment verification & digital receipts\n` +
        `• *Fulfillment:* Automatic dispatch routing & live tracking\n` +
        `• *Records:* 2-way Google Sheets, CRM & database sync\n\n` +
        `How can we help scale your business today?`

      await sendWhatsAppButtons(
        from,
        welcomeText,
        [
          { id: 'btn_services', title: '⚡ What We Automate' },
          { id: 'btn_intake', title: '🚀 Request System' },
          { id: 'btn_rep', title: '👤 Speak with Rep' },
        ],
        'Zhenbot Automation'
      )
      return new Response('EVENT_RECEIVED', { status: 200 })
    }

    return new Response('EVENT_RECEIVED', { status: 200 })
  } catch (err: any) {
    console.error('WhatsApp webhook error:', err)
    return new Response('EVENT_RECEIVED', { status: 200 })
  }
})
