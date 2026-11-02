import {
  sendSendbyteEmail,
  renderZhenbotEmailHtml,
  OFFICIAL_SUPPORT_EMAIL,
  OFFICIAL_WEBSITE_URL,
} from '@/lib/sendbyte'

export const ADMIN_ALERT_EMAIL = 'automate@zhenibot.com'
export const SENDER_TEAM_EMAIL = 'automate@zhenibot.com'

/**
 * Dispatches a welcome email to new business clients or portal accounts
 */
export async function sendWelcomeEmail(params: {
  userId?: string
  to?: string
  name?: string
  businessName?: string
  referralCode?: string
}) {
  const recipient = params.to || OFFICIAL_SUPPORT_EMAIL
  const recipientName = params.name || 'Valued Partner'

  const messageHtml = `
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 16px 0;">
      Thank you for connecting with <strong>Zhenbot (Zhen Automation)</strong>. We are thrilled to partner with ${
        params.businessName ? `<strong>${params.businessName}</strong>` : 'your business'
      } to eliminate repetitive manual workflows through custom software automation.
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 20px 0;">
      Your dashboard is active. You can log in at any time to monitor your live automation pipelines, view execution logs, download invoices, and coordinate directly with our engineering team.
    </p>
  `

  const html = renderZhenbotEmailHtml({
    recipientName,
    subject: 'Welcome to Zhenbot (Zhen Automation)',
    messageHtml,
    actionText: 'Access Client Workspace &rarr;',
    actionUrl: `${OFFICIAL_WEBSITE_URL}/portal`,
    highlightCard: {
      badge: 'ACCOUNT PROVISIONED',
      title: 'Private Client Workspace Active',
      description: 'Real-time pipeline monitoring, automated reconciliation, and 24/7 engineering support.',
    },
  })

  return sendSendbyteEmail({
    to: recipient,
    subject: 'Welcome to Zhenbot (Zhen Automation)',
    html,
    type: 'welcome',
    data: params,
    recipientName,
  })
}

/**
 * Dispatches a live chat alert to the admin team via SendByte
 */
export async function sendChatAlertToAdmin(params: {
  userName?: string
  userEmail?: string
  message: string
  threadId?: string
}) {
  const visitorName = params.userName || 'Website Visitor'

  const messageHtml = `
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 14px 0;">
      A business visitor just started an enquiry on the Zhenbot live website chat widget:
    </p>
    <div style="background-color: #F8FAFC; border: 1px solid #E5E7EB; border-left: 4px solid #00B82E; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
      <div style="font-size: 13.5px; font-weight: 700; color: #111827;">${visitorName} &lt;${params.userEmail || 'No email provided'}&gt;</div>
      <div style="font-size: 13px; color: #4B5563; margin-top: 6px; line-height: 1.5;">"${params.message}"</div>
    </div>
  `

  const html = renderZhenbotEmailHtml({
    recipientName: 'Zhenbot Admin Team',
    subject: `[New Lead Chat] Inquiry from ${visitorName}`,
    messageHtml,
    actionText: 'Open Admin Chat Management &rarr;',
    actionUrl: `${OFFICIAL_WEBSITE_URL}/admin`,
    highlightCard: {
      badge: 'LIVE CHAT ENQUIRY',
      title: `Message from ${visitorName}`,
      description: 'Reply instantly from the admin operations panel or via WhatsApp.',
    },
  })

  return sendSendbyteEmail({
    to: ADMIN_ALERT_EMAIL,
    subject: `[New Lead Chat] Inquiry from ${visitorName}`,
    html,
    type: 'admin_chat_alert',
    data: params,
  })
}

/**
 * Dispatches an invoice notification with payment link to client
 */
export async function sendInvoiceEmail(params: {
  to: string
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  itemsSummary?: string
}) {
  const messageHtml = `
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 16px 0;">
      An official invoice (<strong>${params.invoiceNumber}</strong>) has been generated for your automation project.
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4B5563; margin: 0 0 20px 0;">
      ${params.itemsSummary || 'Payment covers system setup, API bridge configuration, and production SLA monitoring.'}
    </p>
  `

  const html = renderZhenbotEmailHtml({
    recipientName: params.clientName,
    subject: `Invoice ${params.invoiceNumber} from Zhenbot Automation`,
    messageHtml,
    actionText: 'View & Pay Invoice in Portal &rarr;',
    actionUrl: `${OFFICIAL_WEBSITE_URL}/portal`,
    highlightCard: {
      badge: 'INVOICE DUE',
      title: `Total Payable: ₦${params.amount.toLocaleString()}`,
      description: `Due date: ${params.dueDate}. Pay securely via Paystack or direct corporate bank transfer.`,
      amount: `₦${params.amount.toLocaleString()}`,
    },
  })

  return sendSendbyteEmail({
    to: params.to,
    subject: `Invoice ${params.invoiceNumber} from Zhenbot Automation`,
    html,
    type: 'invoice_generated',
    data: params,
    recipientName: params.clientName,
  })
}

/**
 * Dispatches direct client email message composed from the Admin Dashboard
 */
export async function sendDirectClientMessageEmail(params: {
  userId?: string
  to?: string
  name?: string
  subject?: string
  message: string
}) {
  const recipient = params.to || OFFICIAL_SUPPORT_EMAIL
  const subject = params.subject || 'Message from Zhenbot Automation'
  const recipientName = params.name || 'Valued Client'

  const messageHtml = `
    <div style="font-size: 14px; line-height: 1.6; color: #374151; margin: 0 0 20px 0; white-space: pre-line;">
      ${params.message}
    </div>
  `

  const html = renderZhenbotEmailHtml({
    recipientName,
    subject,
    messageHtml,
    actionText: 'Open Dashboard &rarr;',
    actionUrl: `${OFFICIAL_WEBSITE_URL}/portal`,
  })

  return sendSendbyteEmail({
    to: recipient,
    subject,
    html,
    type: 'direct_message',
    data: params,
    recipientName,
  })
}

// Legacy wrappers maintained for compatibility
export async function sendDepositReceivedEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Deposit Receipt Confirmation',
    text: `Deposit of ${params.amount} received on network ${params.network}.`,
  })
}

export async function sendDepositApprovedEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Payment Approved & Verified',
    text: `Payment of ${params.amount} has been verified and confirmed.`,
  })
}

export async function sendDepositRejectedEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Payment Verification Notice',
    text: `Payment of ${params.amount} could not be verified. Reason: ${params.reason || 'Verification check failed'}.`,
  })
}

export async function sendWithdrawalApprovedEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Payout Processed Successfully',
    text: `Payout of ${params.amount} has been disbursed to your account.`,
  })
}

export async function sendWithdrawalRejectedEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Payout Request Notice',
    text: `Payout request for ${params.amount} was not approved: ${params.reason || 'Account review'}.`,
  })
}

export async function sendReferralRewardEmail(params: any) {
  return sendSendbyteEmail({
    to: params.to || OFFICIAL_SUPPORT_EMAIL,
    subject: 'Referral Bonus Credited',
    text: `You have received a referral bonus of ${params.amount} from ${params.downlineName || 'a new client'}.`,
  })
}
