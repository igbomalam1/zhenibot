import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'

interface Integration {
  name: string
  category: 'Communication' | 'Commerce' | 'Logistics' | 'Financial'
  detail: string
  status: string
}

const INTEGRATIONS: Integration[] = [
  { name: 'Gmail Workspace', category: 'Communication', detail: 'Inbound parsing, PDF quotation attachment, auto-reply', status: 'Active' },
  { name: 'Microsoft 365 Outlook', category: 'Communication', detail: 'Exchange mailbox monitoring and drafting approvals', status: 'Active' },
  { name: 'WhatsApp Business API', category: 'Communication', detail: '24/7 conversational support and live parcel tracking links', status: 'Active' },
  { name: 'Slack Connect', category: 'Communication', detail: 'Operations alerts, high-value quotation approval requests', status: 'Active' },
  { name: 'Shopify Store', category: 'Commerce', detail: 'Checkout webhook to courier dispatch routing in 1.8s', status: 'Active' },
  { name: 'WooCommerce', category: 'Commerce', detail: 'Inventory reservation, delivery assignment, and order syncing', status: 'Active' },
  { name: 'SendMe Okada Fleets', category: 'Logistics', detail: 'Automated bike rider proximity assignment and live GPS sharing', status: 'Active' },
  { name: 'GIG Logistics API', category: 'Logistics', detail: 'Interstate parcel booking and digital waybill generation', status: 'Active' },
  { name: 'Paystack', category: 'Financial', detail: 'Direct charge webhooks, checkout links, and automatic reconciliation', status: 'Active' },
  { name: 'Stripe Billing', category: 'Financial', detail: 'International subscription renewals and digital tax receipts', status: 'Active' },
  { name: 'HubSpot CRM', category: 'Financial', detail: 'Deal pipeline updates, company contact sync, activity logging', status: 'Active' },
  { name: 'Google Sheets', category: 'Commerce', detail: 'Real-time tabular row insertion for custom dispatch logs', status: 'Active' },
]

export function AffiliateTeaser() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'Communication', 'Commerce', 'Logistics', 'Financial']

  const filtered = activeCategory === 'All'
    ? INTEGRATIONS
    : INTEGRATIONS.filter((item) => item.category === activeCategory)

  return (
    <section id="integrations" className="py-20 sm:py-28 border-b border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section 1: Integrations */}
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
            Integrations
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
            Connects with your current software stack
          </h2>
          <p className="mt-3 text-sm text-[#8F95A3] leading-relaxed">
            Zhen Automation sits directly on top of your existing communication channels, e-commerce stores, dispatch fleets, and accounting tools. Zero migration needed.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#181A21] text-[#F4F5F7] border border-white/10 font-medium'
                  : 'text-[#8F95A3] hover:text-[#F4F5F7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-white/8 bg-[#121419] p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-[#F4F5F7]">{item.name}</span>
                  <span className="font-mono text-[10px] text-[#8F95A3]">{item.category}</span>
                </div>
                <p className="text-xs text-[#8F95A3] leading-relaxed">{item.detail}</p>
              </div>
              <div className="pt-2 border-t border-white/6 flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8F95A3]">Connector: Native API</span>
                <span className="text-[#10B981] flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#10B981]" /> {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Agency Partner Program */}
        <div id="affiliate" className="mt-24 pt-16 border-t border-white/8">
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
                  Agency & consultant program
                </p>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F4F5F7]">
                  Earn 20% recurring monthly commissions onboarding businesses
                </h3>
                <p className="text-sm text-[#8F95A3] leading-relaxed">
                  Implement Zhen Automation for your clients or refer growing companies. You earn a 20% recurring monthly payout for every active business account for the lifetime of their subscription.
                </p>

                <ul className="space-y-2 text-xs text-[#F4F5F7] pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                    <span>20% monthly recurring commission on all client plans and fuel top-ups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                    <span>Multi-client agency dashboard with shared template deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                    <span>Direct monthly settlements via Bank Wire, Paystack, or Crypto USDT</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link to="/auth?mode=register" className={buttonClass('primary', 'lg')}>
                    Join agency network <ArrowRight className="size-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Commission Structure */}
              <div className="space-y-3 font-mono text-xs">
                <div className="rounded-lg border border-white/8 bg-[#0B0C0E] p-4">
                  <div className="flex items-center justify-between text-[#F4F5F7] font-medium mb-1">
                    <span>Tier 1: Direct client accounts</span>
                    <span className="text-[#FF5416]">20% recurring</span>
                  </div>
                  <p className="text-[#8F95A3] font-sans text-xs">
                    Credited monthly on every active workflow subscription referred through your partner link.
                  </p>
                </div>

                <div className="rounded-lg border border-white/8 bg-[#0B0C0E] p-4">
                  <div className="flex items-center justify-between text-[#F4F5F7] font-medium mb-1">
                    <span>Tier 2: Sub-agency referrals</span>
                    <span className="text-[#F4F5F7]">5% override</span>
                  </div>
                  <p className="text-[#8F95A3] font-sans text-xs">
                    Earn an ongoing 5% override across all companies onboarded by consultants in your network.
                  </p>
                </div>

                <div className="rounded-lg border border-white/6 bg-[#16181F] p-3 text-[11px] text-[#8F95A3] flex items-center justify-between">
                  <span>Average monthly agency earnings:</span>
                  <span className="text-[#10B981] font-semibold">$1,850 / month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
