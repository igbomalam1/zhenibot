export const BRAND = {
  name: 'Zhen Automation',
  shortName: 'Zhen',
  tagline: 'Autonomous AI Workflows & Business Operations',
  description:
    'Zhen Automation turns everyday business operations into autonomous workflows. From smart email triage and auto-replies to instant delivery dispatching and 24/7 AI customer care reps.',
  dailyRate: 0.016, // backwards compatibility if referenced
  cycleTarget: 0.02,
  riskStop: 0.05,
  tier1Rate: 0.20, // 20% partner referral commission
  tier2Rate: 0.05,
  minDeposit: 25,
  maxDeposit: 100000,
  minWithdrawal: 10,
  uptime: '99.98%',
  avgLatency: '1.4s',
  totalTasksAutomated: '4,842,910+',
  avgHoursSavedPerWeek: '18.5 hrs',
}

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Zhen Automation'
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'support@zhenautomation.io'
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? 'ops@zhenautomation.io'
export const REFERRAL_BASE_URL =
  import.meta.env.VITE_REFERRAL_BASE_URL ??
  (typeof window !== 'undefined' ? window.location.origin : 'https://zhenautomation.io')

export type NetworkId = 'bep20' | 'trc20' | 'erc20'

export interface DepositNetwork {
  id: NetworkId
  asset: string
  network: string
  shortName: string
  label: string
  chainFamily: 'evm' | 'trc20'
  min: number
  accent: string
  badgeBg: string
  confirmations: number
  popular?: boolean
  feeNote: string
}

export const DEPOSIT_NETWORKS: DepositNetwork[] = [
  {
    id: 'bep20',
    asset: 'USDT',
    network: 'BNB Smart Chain (BEP20)',
    shortName: 'BSC / BEP20',
    label: 'USDT · BNB Smart Chain (Instant Credit)',
    chainFamily: 'evm',
    min: 25,
    accent: '#6366F1',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    confirmations: 15,
    popular: true,
    feeNote: 'Lowest Network Fees · Instant Credit Provisioning (~15s)',
  },
  {
    id: 'trc20',
    asset: 'USDT',
    network: 'Tron (TRC20)',
    shortName: 'TRON / TRC20',
    label: 'USDT · Tron (TRC20)',
    chainFamily: 'trc20',
    min: 25,
    accent: '#06B6D4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    confirmations: 19,
    popular: true,
    feeNote: 'Global Enterprise Standard · Zero Delay',
  },
  {
    id: 'erc20',
    asset: 'USDT',
    network: 'Ethereum (ERC20)',
    shortName: 'ETH / ERC20',
    label: 'USDT · Ethereum (ERC20)',
    chainFamily: 'evm',
    min: 50,
    accent: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    confirmations: 12,
    popular: false,
    feeNote: 'High Security Multi-Sig Institutional Rail',
  },
]

export const AUTOMATION_CLUSTERS = [
  { name: 'Cluster Lagos-01 (NG)', latency: '14ms', uptime: '99.99%', region: 'West Africa' },
  { name: 'Cluster Frankfurt-02 (EU)', latency: '19ms', uptime: '99.98%', region: 'Europe' },
  { name: 'Cluster Virginia-01 (US)', latency: '22ms', uptime: '99.99%', region: 'North America' },
  { name: 'Cluster Singapore-03 (APAC)', latency: '18ms', uptime: '99.97%', region: 'Asia Pacific' },
]

export const EXCHANGES = AUTOMATION_CLUSTERS // backwards compatibility

export function getNetwork(id: string): DepositNetwork | undefined {
  return DEPOSIT_NETWORKS.find((n) => n.id === id)
}

export interface AutomationModule {
  id: string
  title: string
  badge: string
  tagline: string
  description: string
  highlights: string[]
  icon: string
  color: string
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: 'email-concierge',
    title: 'Autonomous Email Concierge & Smart Responder',
    badge: 'INBOX AUTOPILOT',
    tagline: 'Zero unread emails. Zero delayed customer inquiries.',
    description:
      'Zhen AI reads incoming sales inquiries, support questions, and vendor emails, identifies customer sentiment and intent, extracts attached quotes/invoices, drafts context-aware replies or responds immediately based on your business rules.',
    highlights: [
      'Smart intent classification & priority routing',
      'Auto-extracts PDF quotes, receipts & order forms',
      'Context-aware AI replies sent in < 2 seconds',
      'Human-in-the-loop review mode for VIP contracts',
    ],
    icon: 'Mail',
    color: '#6366F1',
  },
  {
    id: 'delivery-dispatch',
    title: 'On-Demand Delivery & Okada Courier Booking',
    badge: 'LOGISTICS AUTOMATION',
    tagline: 'Direct-to-courier dispatch without phone calls or manual data entry.',
    description:
      'The moment an order drops via WhatsApp, Shopify, or POS, Zhen instantly matches the delivery with local bike riders or logistics partners (SendMe, GIGL, Bolt, DHL). Calculates delivery fees, optimizes pickup routes, and sends WhatsApp live tracking to customers.',
    highlights: [
      'Auto-dispatch to nearest available dispatch rider',
      'Instant delivery cost calculation & customer address validation',
      'Automated WhatsApp/SMS tracking link with live map updates',
      'Automated failed-attempt retries and rider reassignment',
    ],
    icon: 'Bike',
    color: '#06B6D4',
  },
  {
    id: 'customer-care',
    title: '24/7 AI Customer Care Representative',
    badge: 'MULTI-CHANNEL SUPPORT',
    tagline: 'Your top-performing support rep that never sleeps or takes a break.',
    description:
      'Omni-channel customer support across WhatsApp Business, Web Chat, Instagram DMs, and Email. Resolves order tracking, returns, inquiries, and pricing questions with human-like warmth in seconds.',
    highlights: [
      'Handles 88%+ of customer conversations autonomously',
      'Native WhatsApp Business API, Instagram & Web Live Chat',
      'Seamless hot-handoff to human agents for complex escalations',
      'Multi-language support (English, Pidgin, French, Hausa, Yoruba, Spanish)',
    ],
    icon: 'Headphones',
    color: '#10B981',
  },
  {
    id: 'invoicing-finance',
    title: 'Autonomous Invoicing & Payment Reconciliation',
    badge: 'FINANCIAL OPS',
    tagline: 'Eliminate manual ledger entry and chasing unpaid customer tabs.',
    description:
      'Autonomously generates branded invoices upon deal closing, syncs Paystack/Stripe webhooks, reconciles bank transfers in real time, and sends polite automated payment reminders before accounts turn overdue.',
    highlights: [
      'Instant invoice generation from orders or CRM deals',
      'Live Paystack, Flutterwave, Moniepoint & Stripe webhooks',
      'Automated WhatsApp payment links & PDF receipts',
      'Daily autonomous revenue reconciliation & bookkeeping sync',
    ],
    icon: 'Receipt',
    color: '#F59E0B',
  },
]
