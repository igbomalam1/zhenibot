import type { Trade } from '@/types/database'

export interface AutomationEvent {
  id: string
  type: 'email' | 'dispatch' | 'support' | 'invoice' | 'crm'
  title: string
  channel: string
  latency: string
  status: 'completed' | 'running' | 'routed'
  summary: string
  savingsMinutes: number
  timestamp: number
}

export const LIVE_AUTOMATION_EVENTS: AutomationEvent[] = [
  {
    id: 'evt-101',
    type: 'email',
    title: 'Autonomous Email Responder',
    channel: 'Gmail Enterprise',
    latency: '1.2s',
    status: 'completed',
    summary: 'Parsed wholesale RFP from sales@apexventures.co, generated custom PDF quote, sent personalized reply.',
    savingsMinutes: 24,
    timestamp: Date.now() - 4000,
  },
  {
    id: 'evt-102',
    type: 'dispatch',
    title: 'Okada & Bike Courier Dispatch',
    channel: 'SendMe & Bolt Fleet',
    latency: '1.8s',
    status: 'completed',
    summary: 'Order #ZH-9921 from Shopify: Assigned Rider #42 (Wuse 2, Abuja), generated waybill & SMS tracking link.',
    savingsMinutes: 35,
    timestamp: Date.now() - 14000,
  },
  {
    id: 'evt-103',
    type: 'support',
    title: '24/7 AI Customer Care Rep',
    channel: 'WhatsApp Business API',
    latency: '0.9s',
    status: 'completed',
    summary: 'Resolved delivery address change request for customer +234 803 ••• 4192 in fluent Nigerian English.',
    savingsMinutes: 18,
    timestamp: Date.now() - 28000,
  },
  {
    id: 'evt-104',
    type: 'invoice',
    title: 'Payment Reconciler & Invoicing',
    channel: 'Paystack Webhook',
    latency: '1.4s',
    status: 'completed',
    summary: 'Reconciled ₦185,000 bank transfer for Invoice #INV-882, marked order fulfilled and updated ledger.',
    savingsMinutes: 15,
    timestamp: Date.now() - 45000,
  },
  {
    id: 'evt-105',
    type: 'email',
    title: 'Smart Meeting Scheduler',
    channel: 'Outlook 365 + Cal.com',
    latency: '1.5s',
    status: 'completed',
    summary: 'Negotiated prospective client demo slot across 3 timezones and sent Google Meet invite.',
    savingsMinutes: 20,
    timestamp: Date.now() - 72000,
  },
  {
    id: 'evt-106',
    type: 'dispatch',
    title: 'Express Delivery Auto-Booking',
    channel: 'GIGL Logistics API',
    latency: '2.1s',
    status: 'completed',
    summary: 'WooCommerce Order #WC-3012: Dispatched interstate parcel from Ikeja Lagos to Port Harcourt.',
    savingsMinutes: 40,
    timestamp: Date.now() - 98000,
  },
]

const AUTOMATION_TYPES = [
  { symbol: 'EMAIL', pair: 'Email Triage', exchange: 'Gmail API' },
  { symbol: 'DISPATCH', pair: 'Bike Courier Dispatch', exchange: 'SendMe Fleet' },
  { symbol: 'SUPPORT', pair: 'WhatsApp AI Agent', exchange: 'WhatsApp Cloud' },
  { symbol: 'INVOICE', pair: 'Paystack Auto-Reconcile', exchange: 'Paystack' },
  { symbol: 'CRM', pair: 'HubSpot Lead Sync', exchange: 'HubSpot' },
  { symbol: 'DOCS', pair: 'PDF Invoice OCR', exchange: 'Zhen Vision' },
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildAutomationFeed(): Trade[] {
  const rand = seededRandom(20260201)
  const now = Date.now()
  const trades: Trade[] = []
  for (let i = 0; i < 48; i++) {
    const p = AUTOMATION_TYPES[Math.floor(rand() * AUTOMATION_TYPES.length)]
    const latencySec = (0.8 + rand() * 1.5).toFixed(2)
    const successRate = 98 + rand() * 1.9
    trades.push({
      id: `task-${now - i}`,
      symbol: p.symbol,
      pair: p.pair,
      exchange: p.exchange,
      side: 'LONG', // 'COMPLETED'
      entry: Number(latencySec),
      exit: Number((Number(latencySec) + 0.1).toFixed(2)),
      profitPct: Number(successRate.toFixed(1)),
      at: now - i * (1000 * 60 * 3),
    })
  }
  return trades
}

const seed = buildAutomationFeed()

export function getTrades(count = 12): Trade[] {
  return seed.slice(0, count)
}

export function getEquitySeries(days = 30) {
  const rand = seededRandom(20260202)
  const out: { day: string; value: number }[] = []
  let tasksCount = 12400
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let i = days; i >= 0; i--) {
    tasksCount += Math.floor(450 + rand() * 600)
    const d = new Date(Date.now() - i * 86400000)
    out.push({ day: `${labels[d.getDay()]} ${d.getDate()}`, value: tasksCount })
  }
  return out
}

export const FUND_METRICS = {
  aum: 4_842_910, // Tasks Automated
  activeInvestors: 1_420, // Active Businesses
  avgDailyVolume: 184_600, // Daily Task Throughput
  winRate: 99.8, // Execution Success Rate %
  totalPayout: 420_000, // Hours Saved in total
  executions: 4_842_910,
  running: 4_210, // Running Automation Workflows
}

export function maskReferralCode(code: string): string {
  if (code.length <= 2) return code
  return code.slice(0, 2) + '•'.repeat(Math.max(code.length - 2, 4))
}
