import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.104.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Environment variables configured in Supabase Vault / Edge Secrets
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
const SENDBYTE_API_KEY = Deno.env.get('SENDBYTE_API_KEY') || ''
const ADMIN_ALERT_EMAIL = Deno.env.get('ADMIN_ALERT_EMAIL') || 'ibngahd01@gmail.com'
const SENDBYTE_ENDPOINT = 'https://api.sendbyte.africa/v1/emails'
const SENDER_EMAIL = 'Zhenbot Assistant <automate@zhenibot.com>'
const WEBSITE_URL = 'https://zhenibot.com'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Send Telegram Message Helper
async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: any
) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set')
    return null
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  }

  if (replyMarkup) {
    body.reply_markup = replyMarkup
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch (err) {
    console.error('Error sending telegram message:', err)
    return null
  }
}

// Answer Callback Query Helper (dismiss loading spinner on button click)
async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  if (!TELEGRAM_BOT_TOKEN) return
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || '',
      }),
    })
  } catch (err) {
    console.error('Error answering callback query:', err)
  }
}

// Send Email Alert to Admin via SendByte
async function sendAdminEmailAlert(subject: string, htmlContent: string) {
  if (!SENDBYTE_API_KEY) {
    console.warn('SENDBYTE_API_KEY not set, skipping email alert')
    return
  }

  try {
    const payload = {
      from: SENDER_EMAIL,
      to: ADMIN_ALERT_EMAIL,
      subject,
      html: htmlContent,
    }

    const res = await fetch(SENDBYTE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDBYTE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('SendByte Admin Alert Status:', res.status)
  } catch (err) {
    console.error('Error sending email alert via SendByte:', err)
  }
}

// Get or Set Conversation State for User
async function getUserState(chatId: number | string) {
  try {
    const { data } = await supabase
      .from('zhenbot_settings')
      .select('value')
      .eq('key', `tg_state_${chatId}`)
      .single()

    return data?.value || { step: 'idle', data: {} }
  } catch {
    return { step: 'idle', data: {} }
  }
}

async function setUserState(chatId: number | string, state: any) {
  try {
    await supabase.from('zhenbot_settings').upsert({
      key: `tg_state_${chatId}`,
      value: state,
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Error saving state:', err)
  }
}

async function getAdminTelegramChatId(): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('zhenbot_settings')
      .select('value')
      .eq('key', 'admin_telegram_chat_id')
      .single()

    return data?.value?.chat_id || null
  } catch {
    return null
  }
}

async function setAdminTelegramChatId(chatId: number | string, adminUser: any) {
  try {
    await supabase.from('zhenbot_settings').upsert({
      key: 'admin_telegram_chat_id',
      value: { chat_id: String(chatId), user: adminUser, updated_at: new Date().toISOString() },
      updated_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Error saving admin chat ID:', err)
  }
}

// Standard Bot Main Menu Keyboards
function getMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '⚡ What We Automate', callback_data: 'cb_services' },
        { text: '💬 Request Automation', callback_data: 'cb_start_intake' },
      ],
      [
        { text: '👤 Speak with a Rep', callback_data: 'cb_human_rep' },
        { text: '❓ FAQ & Timelines', callback_data: 'cb_faq' },
      ],
      [
        { text: '🌐 Visit Website', url: WEBSITE_URL },
      ],
    ],
  }
}

function getServicesKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '🚀 Start My Automation', callback_data: 'cb_start_intake' },
        { text: '👤 Speak with a Rep', callback_data: 'cb_human_rep' },
      ],
      [
        { text: '« Back to Main Menu', callback_data: 'cb_main_menu' },
      ],
    ],
  }
}

// Knowledge Base Q&A Check
function matchKnowledgeQuery(text: string): string | null {
  const lower = text.toLowerCase()

  if (lower.includes('cost') || lower.includes('price') || lower.includes('pricing') || lower.includes('how much') || lower.includes('charge')) {
    return (
      `💰 <b>Zhenbot Pricing & Investment</b>\n\n` +
      `Our systems are custom-engineered around your exact operational workflows. Pricing is tiered based on scope:\n\n` +
      `• <b>Starter Automations:</b> Single workflow (e.g., WhatsApp FAQ + order qualification or instant Paystack receipt generation).\n` +
      `• <b>Operations Engine:</b> Multi-channel conversation bots + automated dispatch + CRM/Google Sheets sync.\n` +
      `• <b>Enterprise Custom Suite:</b> End-to-end bespoke software, tailored integrations, ad lead routing & priority maintenance.\n\n` +
      `Tap <b>Request Automation</b> below for a tailored quotation, or tap <b>Speak with a Rep</b> to discuss your business setup.`
    )
  }

  if (lower.includes('time') || lower.includes('how long') || lower.includes('turnaround') || lower.includes('timeline')) {
    return (
      `⏱️ <b>Deployment Timelines</b>\n\n` +
      `We build and deploy quickly so your business starts saving hours immediately:\n\n` +
      `• <b>Quick Workflows:</b> 3 to 5 business days.\n` +
      `• <b>Full Operations Suites:</b> 7 to 14 business days including testing, staff handover, and live monitoring.\n\n` +
      `Every system undergoes staging and stress testing before going live on your actual customer channels.`
    )
  }

  if (lower.includes('nigeria') || lower.includes('country') || lower.includes('location') || lower.includes('international') || lower.includes('uk') || lower.includes('usa') || lower.includes('global')) {
    return (
      `🌍 <b>Global Service Reach</b>\n\n` +
      `Zhenbot serves businesses across the globe! We build and deploy automation infrastructure for clients in Nigeria, the UK, the United States, Canada, Europe, and the Middle East.\n\n` +
      `All cloud infrastructure, webhooks, and AI assistants operate 24/7/365 regardless of your time zone.`
    )
  }

  if (lower.includes('whatsapp') || lower.includes('instagram') || lower.includes('facebook') || lower.includes('ads') || lower.includes('social')) {
    return (
      `📲 <b>Social & Messaging Automations</b>\n\n` +
      `We automate interactions across all major business communication platforms:\n\n` +
      `• <b>WhatsApp Business Cloud API:</b> Instant smart replies, interactive catalogs, order collection & payment links.\n` +
      `• <b>Instagram & Facebook:</b> DM auto-responses, ad campaign lead capture, comment-to-DM triggers.\n` +
      `• <b>Telegram:</b> Customer concierge, broadcast alerts, internal staff operations bots.\n` +
      `• <b>Twitter / X:</b> Real-time enquiry triage and routing.`
    )
  }

  if (lower.includes('paystack') || lower.includes('payment') || lower.includes('receipt') || lower.includes('bank') || lower.includes('transfer')) {
    return (
      `💳 <b>Payment & Receipt Automation</b>\n\n` +
      `Never waste time manually confirming bank transfers or screenshots again:\n\n` +
      `• Instant Paystack, Flutterwave, and bank webhook verification.\n` +
      `• Auto-generates branded digital PDF receipts sent instantly to the buyer via WhatsApp/Email.\n` +
      `• Automatically updates your accounting ledger, database, and inventory in real time.`
    )
  }

  return null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Health check / webhook verification
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'online',
        service: 'Zhenbot Telegram Bot Webhook Engine',
        bot: '@zhenautomation_bot',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const update = await req.json()
    console.log('Incoming Telegram Update:', JSON.stringify(update))

    // Handle Callback Queries (Button Clicks)
    if (update.callback_query) {
      const cq = update.callback_query
      const chatId = cq.message?.chat?.id
      const data = cq.data
      const user = cq.from
      await answerCallbackQuery(cq.id)

      if (data === 'cb_main_menu') {
        await setUserState(chatId, { step: 'idle', data: {} })
        const text =
          `👋 <b>Welcome back to Zhenbot Automation!</b>\n\n` +
          `We engineer custom business software and AI automations that handle customer enquiries, payments, receipts, orders, deliveries, and record-keeping 24/7.\n\n` +
          `How can we assist your business today?`
        await sendTelegramMessage(chatId, text, getMainMenuKeyboard())
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      if (data === 'cb_services') {
        const text =
          `⚡ <b>What We Automate at Zhenbot</b>\n\n` +
          `<b>1. Autonomous Customer Conversations</b>\n` +
          `24/7 intelligent replies on WhatsApp, Telegram, Instagram & Facebook that qualify buyers, answer inquiries, and collect orders.\n\n` +
          `<b>2. Payment Verification & Digital Receipts</b>\n` +
          `Instant Paystack & bank webhook verification that auto-generates branded receipts and updates your financial ledger with zero human delay.\n\n` +
          `<b>3. Order Fulfillment & Delivery Routing</b>\n` +
          `Automatic order dispatch from storefronts straight to delivery riders with real-time waypoint tracking links for customers.\n\n` +
          `<b>4. Spreadsheets & CRM Sync</b>\n` +
          `Two-way synchronization across Google Sheets, Airtable, Notion, and SQL databases.\n\n` +
          `<b>5. Advertising & Marketing Workflows</b>\n` +
          `Automated ad campaign lead routing from Meta directly to your sales reps.`
        await sendTelegramMessage(chatId, text, getServicesKeyboard())
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      if (data === 'cb_faq') {
        const text =
          `❓ <b>Frequently Asked Questions</b>\n\n` +
          `• <b>How fast is deployment?</b> Most workflows are live within 3–7 business days.\n` +
          `• <b>Where are you based?</b> We serve clients globally (Nigeria, UK, US, Canada, Europe).\n` +
          `• <b>Can you connect to my existing software?</b> Yes! We integrate with WhatsApp Cloud, Paystack, Google Sheets, Shopify, WooCommerce, and custom databases.\n` +
          `• <b>Do you provide support?</b> Yes, all systems come with continuous monitoring and engineering support.`
        await sendTelegramMessage(chatId, text, getServicesKeyboard())
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      if (data === 'cb_start_intake') {
        await setUserState(chatId, {
          step: 'awaiting_business_name',
          data: {
            telegram_user_id: user.id,
            telegram_username: user.username || '',
            telegram_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          },
        })

        const text =
          `🚀 <b>Custom Automation Intake — Step 1/4</b>\n\n` +
          `Great! Let's understand your business requirements so our engineers can design your system.\n\n` +
          `<b>What is your business or company name?</b>`

        await sendTelegramMessage(chatId, text, {
          inline_keyboard: [[{ text: '« Cancel', callback_data: 'cb_main_menu' }]],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      if (data === 'cb_human_rep') {
        await setUserState(chatId, {
          step: 'awaiting_rep_message',
          data: {
            telegram_user_id: user.id,
            telegram_username: user.username || '',
            telegram_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          },
        })

        const text =
          `👤 <b>Connect with a Zhenbot Lead Engineer</b>\n\n` +
          `Please reply with a brief note on what you need help with, along with your preferred contact number or email.\n\n` +
          `<i>Our team will receive your alert instantly and reach out!</i>`

        await sendTelegramMessage(chatId, text, {
          inline_keyboard: [
            [{ text: '« Back to Menu', callback_data: 'cb_main_menu' }],
          ],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }
    }

    // Handle Text Messages
    if (update.message && update.message.text) {
      const msg = update.message
      const chatId = msg.chat.id
      const text = msg.text.trim()
      const user = msg.from

      // 1. Admin Registration Command
      if (text.startsWith('/admin_register') || text.startsWith('/admin_connect')) {
        await setAdminTelegramChatId(chatId, user)
        await sendTelegramMessage(
          chatId,
          `✅ <b>Admin Channel Connected!</b>\n\n` +
          `Your Telegram account (ID: <code>${chatId}</code>) is now registered to receive instant alerts whenever a prospective client reaches out or completes an automation intake.`
        )
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // 2. Start Command
      if (text === '/start' || text.toLowerCase() === 'menu') {
        await setUserState(chatId, { step: 'idle', data: {} })
        const welcomeText =
          `👋 <b>Welcome to Zhenbot Automation!</b>\n\n` +
          `I am your 24/7 AI operations assistant. We build custom business automations that eliminate manual work:\n\n` +
          `• <b>Messaging:</b> WhatsApp, Telegram, Instagram & Facebook AI auto-replies\n` +
          `• <b>Finances:</b> Instant payment verification & digital branded PDF receipts\n` +
          `• <b>Fulfillment:</b> Automated dispatch routing & order waypoint tracking\n` +
          `• <b>Records:</b> 2-way Google Sheets, CRM & database synchronizations\n\n` +
          `How can we help scale your operations today?`

        await sendTelegramMessage(chatId, welcomeText, getMainMenuKeyboard())
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Check user conversational state
      const state = await getUserState(chatId)

      // Step 1: Business Name
      if (state.step === 'awaiting_business_name') {
        const updatedData = { ...state.data, business_name: text }
        await setUserState(chatId, { step: 'awaiting_bottleneck', data: updatedData })

        const promptText =
          `💼 <b>Got it, ${text}! — Step 2/4</b>\n\n` +
          `What is the biggest operational bottleneck you want to eliminate?\n\n` +
          `<i>(e.g., "Answering repeated customer questions on WhatsApp", "Manually verifying bank transfers", "Booking delivery riders", "Updating Google Sheets by hand", "Running ad leads")</i>`

        await sendTelegramMessage(chatId, promptText, {
          inline_keyboard: [[{ text: '« Cancel', callback_data: 'cb_main_menu' }]],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Step 2: Bottleneck / Operations to Automate
      if (state.step === 'awaiting_bottleneck') {
        const updatedData = { ...state.data, bottleneck: text }
        await setUserState(chatId, { step: 'awaiting_tools', data: updatedData })

        const promptText =
          `⚙️ <b>Understood! — Step 3/4</b>\n\n` +
          `What software, platforms, or tools are you currently using?\n\n` +
          `<i>(e.g. WhatsApp, Instagram, Excel, Paystack, Shopify, QuickBooks, custom database, etc.)</i>`

        await sendTelegramMessage(chatId, promptText, {
          inline_keyboard: [[{ text: '« Cancel', callback_data: 'cb_main_menu' }]],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Step 3: Current Tools
      if (state.step === 'awaiting_tools') {
        const updatedData = { ...state.data, tools: text }
        await setUserState(chatId, { step: 'awaiting_contact', data: updatedData })

        const promptText =
          `📞 <b>Final Step — Step 4/4</b>\n\n` +
          `What is your best <b>Phone / WhatsApp number</b> or <b>Email address</b>?\n\n` +
          `Our lead automation architect will review your workflow and send over your custom system design and quote.`

        await sendTelegramMessage(chatId, promptText, {
          inline_keyboard: [[{ text: '« Cancel', callback_data: 'cb_main_menu' }]],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Step 4: Contact Info (Complete Intake)
      if (state.step === 'awaiting_contact') {
        const finalData = { ...state.data, contact: text }
        await setUserState(chatId, { step: 'completed', data: finalData })

        // 1. Record in Supabase zhenbot_enquiries
        const enquiryId = `lead_tg_${chatId}_${Date.now()}`
        const clientName = finalData.telegram_name || user.first_name || 'Telegram Lead'
        const handle = finalData.telegram_username ? `@${finalData.telegram_username}` : `TG Chat: ${chatId}`

        try {
          await supabase.from('zhenbot_enquiries').insert({
            id: enquiryId,
            name: clientName,
            business_name: finalData.business_name || 'Unspecified',
            phone: finalData.contact || handle,
            email: finalData.contact?.includes('@') ? finalData.contact : null,
            service_of_interest: 'Custom Business Automation',
            details:
              `Operational Bottleneck: ${finalData.bottleneck}\n` +
              `Current Tools: ${finalData.tools}\n` +
              `Contact: ${finalData.contact}\n` +
              `Telegram Handle: ${handle} (ID: ${chatId})`,
            source: 'Telegram Bot (@zhenautomation_bot)',
            status: 'new',
            created_at: new Date().toISOString(),
          })

          // 2. Add in-app Notification for Admin Dashboard
          await supabase.from('zhenbot_notifications').insert({
            id: `notif_tg_${Date.now()}`,
            type: 'lead',
            title: `New Telegram Lead: ${finalData.business_name}`,
            message: `${clientName} (${handle}) requested custom automation for: ${finalData.bottleneck}`,
            link_tab: 'leads',
            is_read: false,
            created_at: new Date().toISOString(),
          })
        } catch (dbErr) {
          console.error('Error recording enquiry in DB:', dbErr)
        }

        // 3. Send Email Alert via SendByte to Admin
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #00B82E; padding: 24px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800;">🎉 New Telegram Automation Lead</h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Received from @zhenautomation_bot</p>
            </div>
            <div style="padding: 24px; color: #111827; font-size: 14px; line-height: 1.6;">
              <p><strong>Business Name:</strong> ${finalData.business_name}</p>
              <p><strong>Contact Person:</strong> ${clientName} (${handle})</p>
              <p><strong>Contact Detail:</strong> ${finalData.contact}</p>
              <div style="background-color: #F8FAFC; border-left: 4px solid #00B82E; padding: 14px; margin: 16px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; font-weight: 700; color: #111827;">What They Want Automated:</p>
                <p style="margin: 0; color: #4B5563;">${finalData.bottleneck}</p>
              </div>
              <p><strong>Current Tools / Platforms:</strong> ${finalData.tools}</p>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${WEBSITE_URL}/admin" style="display: inline-block; background-color: #00B82E; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Open in Zhenbot Dashboard</a>
              </div>
            </div>
          </div>
        `

        await sendAdminEmailAlert(
          `🚀 New Telegram Lead: ${finalData.business_name} (${clientName})`,
          emailHtml
        )

        // 4. Send Instant Telegram Alert to Admin if Chat ID is configured
        const adminChatId = await getAdminTelegramChatId()
        if (adminChatId) {
          const adminAlertText =
            `🚨 <b>NEW TELEGRAM LEAD INTAKE</b>\n\n` +
            `🏢 <b>Company:</b> ${finalData.business_name}\n` +
            `👤 <b>Name:</b> ${clientName} (${handle})\n` +
            `📞 <b>Contact:</b> ${finalData.contact}\n\n` +
            `🎯 <b>Bottleneck to Automate:</b>\n${finalData.bottleneck}\n\n` +
            `🛠️ <b>Current Tools:</b>\n${finalData.tools}\n\n` +
            `<i>Logged into Zhenbot Dashboard database automatically.</i>`

          await sendTelegramMessage(adminChatId, adminAlertText)
        }

        // 5. Reply to User with Success Confirmation
        const successMsg =
          `🎉 <b>Requirements Received!</b>\n\n` +
          `Thank you, <b>${clientName}</b>. Your details for <b>${finalData.business_name}</b> have been submitted directly to our lead engineering team.\n\n` +
          `Our team will review your workflow and contact you at <code>${finalData.contact}</code> with a tailored automation plan and timeline.`

        await sendTelegramMessage(chatId, successMsg, {
          inline_keyboard: [
            [{ text: '🌐 Explore Website', url: WEBSITE_URL }],
            [{ text: '« Main Menu', callback_data: 'cb_main_menu' }],
          ],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Step: Awaiting Rep Message
      if (state.step === 'awaiting_rep_message') {
        const clientName = state.data?.telegram_name || user.first_name || 'Client'
        const handle = user.username ? `@${user.username}` : `TG ID: ${chatId}`
        await setUserState(chatId, { step: 'idle', data: {} })

        // 1. Record enquiry
        try {
          await supabase.from('zhenbot_enquiries').insert({
            id: `rep_req_${chatId}_${Date.now()}`,
            name: clientName,
            business_name: 'Direct Assistance Request',
            phone: handle,
            details: `Customer requested direct representative via Telegram: "${text}"`,
            source: 'Telegram Bot Support Request',
            status: 'new',
            created_at: new Date().toISOString(),
          })

          await supabase.from('zhenbot_notifications').insert({
            id: `notif_rep_${Date.now()}`,
            type: 'urgent',
            title: `Urgent Rep Request: ${clientName}`,
            message: `${handle} wants to speak to a rep: "${text.substring(0, 80)}"`,
            link_tab: 'leads',
            is_read: false,
            created_at: new Date().toISOString(),
          })
        } catch (e) {
          console.error(e)
        }

        // 2. Alert via Email
        const repEmailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #111827; padding: 24px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #00B82E;">⚡ Urgent Representative Request</h2>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #9CA3AF;">A client on Telegram requested direct contact</p>
            </div>
            <div style="padding: 24px; color: #111827; font-size: 14px; line-height: 1.6;">
              <p><strong>Name:</strong> ${clientName}</p>
              <p><strong>Telegram Handle:</strong> ${handle} (Chat ID: ${chatId})</p>
              <div style="background-color: #F8FAFC; border-left: 4px solid #00B82E; padding: 14px; margin: 16px 0; border-radius: 8px;">
                <p style="margin: 0 0 6px 0; font-weight: 700;">Customer Message:</p>
                <p style="margin: 0; color: #4B5563;">"${text}"</p>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="${WEBSITE_URL}/admin" style="display: inline-block; background-color: #00B82E; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Open Zhenbot Dashboard</a>
              </div>
            </div>
          </div>
        `

        await sendAdminEmailAlert(
          `⚡ Urgent Telegram Rep Request: ${clientName} (${handle})`,
          repEmailHtml
        )

        // 3. Telegram Admin Alert
        const adminChatId = await getAdminTelegramChatId()
        if (adminChatId) {
          const alertMsg =
            `⚡ <b>URGENT REP REQUEST</b>\n\n` +
            `👤 <b>Client:</b> ${clientName} (${handle})\n` +
            `💬 <b>Message:</b> "${text}"\n\n` +
            `<i>Please reach out to the customer or reply.</i>`
          await sendTelegramMessage(adminChatId, alertMsg)
        }

        // 4. Confirm to user
        const ackText =
          `✅ <b>Request Received!</b>\n\n` +
          `We have alerted our lead engineer directly. Someone from our team will reach out to you shortly.`

        await sendTelegramMessage(chatId, ackText, {
          inline_keyboard: [
            [{ text: '« Main Menu', callback_data: 'cb_main_menu' }],
          ],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Check for keywords like "human", "rep", "speak to someone", "call"
      const lowerText = text.toLowerCase()
      if (
        lowerText.includes('rep') ||
        lowerText.includes('human') ||
        lowerText.includes('talk to someone') ||
        lowerText.includes('call') ||
        lowerText.includes('speak with')
      ) {
        await setUserState(chatId, {
          step: 'awaiting_rep_message',
          data: {
            telegram_user_id: user.id,
            telegram_username: user.username || '',
            telegram_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          },
        })

        const repPrompt =
          `👤 <b>Connect with a Zhenbot Lead Engineer</b>\n\n` +
          `Please reply with a brief note describing what you need, plus your preferred phone number or email address.\n\n` +
          `Our team will receive your message immediately!`

        await sendTelegramMessage(chatId, repPrompt, {
          inline_keyboard: [
            [{ text: '« Main Menu', callback_data: 'cb_main_menu' }],
          ],
        })
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Knowledge Base Query Match
      const kbAnswer = matchKnowledgeQuery(text)
      if (kbAnswer) {
        await sendTelegramMessage(chatId, kbAnswer, getServicesKeyboard())
        return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
      }

      // Default Intelligent Fallback
      const fallbackText =
        `👋 <b>I'm Zhenbot's AI Operations Rep</b>\n\n` +
        `I can answer questions about custom software, automated customer conversations, payment verification, order fulfillment, and spreadsheet/CRM sync.\n\n` +
        `Choose an option below to get started or request a custom system for your business:`

      await sendTelegramMessage(chatId, fallbackText, getMainMenuKeyboard())
      return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })
  } catch (err: any) {
    console.error('Telegram bot webhook error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 200, // Return 200 to Telegram so it doesn't repeatedly retry failing updates
      headers: corsHeaders,
    })
  }
})
