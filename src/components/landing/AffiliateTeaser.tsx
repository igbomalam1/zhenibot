import { useState } from 'react'
import {
  ArrowRight,
  Gift,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'

interface Integration {
  name: string
  category: 'Comms' | 'E-Commerce' | 'Logistics' | 'Payments' | 'CRMs'
  icon: string
  desc: string
  badge: string
}

const INTEGRATIONS: Integration[] = [
  { name: 'Gmail & Google Workspace', category: 'Comms', icon: '✉️', desc: 'Auto-triage, quote attachments, calendar scheduling', badge: 'Popular' },
  { name: 'Outlook & Office 365', category: 'Comms', icon: '📬', desc: 'Enterprise email triage and automated response drafts', badge: 'Enterprise' },
  { name: 'WhatsApp Business API', category: 'Comms', icon: '💬', desc: 'Conversational 24/7 AI support & tracking updates', badge: 'Instant' },
  { name: 'Slack & Telegram', category: 'Comms', icon: '⚡', desc: 'Ops team alerts and real-time human approval queues', badge: 'Active' },
  { name: 'Shopify', category: 'E-Commerce', icon: '🛍️', desc: 'Instant order intake to courier dispatch pipeline', badge: 'Sync' },
  { name: 'WooCommerce', category: 'E-Commerce', icon: '🛒', desc: 'Sync orders, customer care, and inventory auto-reserves', badge: 'Live' },
  { name: 'SendMe & Okada Fleets', category: 'Logistics', icon: '🛵', desc: 'Direct-to-rider booking, route tracking, delivery status', badge: 'Auto-Dispatch' },
  { name: 'DHL & GIG Logistics', category: 'Logistics', icon: '📦', desc: 'Interstate parcel booking & automated waybill issuance', badge: 'Carrier' },
  { name: 'Paystack', category: 'Payments', icon: '💳', desc: 'Webhooks, payment links, and instant ledger reconciliation', badge: 'Top Tier' },
  { name: 'Stripe & Flutterwave', category: 'Payments', icon: '🏦', desc: 'Global card checkouts and automated invoice receipts', badge: 'Global' },
  { name: 'HubSpot & Salesforce', category: 'CRMs', icon: '📈', desc: 'Automatic contact creation, pipeline updates, and deals', badge: 'Bi-Directional' },
  { name: 'Google Sheets & Airtable', category: 'CRMs', icon: '📊', desc: 'Live data logging and no-code custom database sync', badge: 'Realtime' },
]

export function AffiliateTeaser() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'Comms', 'E-Commerce', 'Logistics', 'Payments', 'CRMs']

  const filtered = activeCategory === 'All'
    ? INTEGRATIONS
    : INTEGRATIONS.filter((item) => item.category === activeCategory)

  return (
    <section id="integrations" className="relative py-28 border-t border-white/8">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section 1: Integrations Ecosystem */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold">
            CONNECTS WITH YOUR ENTIRE TECH STACK
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-display">
            150+ Plug-and-Play Integrations
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Zhen Automation sits seamlessly on top of your existing communication channels, e-commerce stores, dispatch fleets, and accounting tools. Zero migration required.
          </p>
        </div>

        {/* Category Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'border border-brand-400/50 bg-brand-500/15 text-white shadow-md'
                  : 'border border-white/8 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="glass-card glass-card-hover group rounded-2xl p-5 border border-white/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="rounded-md border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-300 uppercase">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span className="text-slate-400 font-semibold">{item.category}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Zhen Agency & Partner Network */}
        <div id="affiliate" className="mt-32">
          <div className="glass-card relative rounded-3xl p-8 sm:p-12 border border-brand-500/30 overflow-hidden shadow-2xl">
            {/* Ambient Background glow */}
            <div className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/30 bg-brand-500/10 px-3.5 py-1 text-xs font-bold text-brand-300 font-mono uppercase tracking-wider mb-4">
                  <Gift className="size-3.5 text-brand-400" /> AGENCY & PARTNER PROGRAM
                </span>
                <h3 className="text-3xl font-extrabold text-white font-display tracking-tight sm:text-4xl">
                  Earn 20% Recurring Commission Onboarding Other Businesses
                </h3>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  Are you an agency, software consultant, or operational wizard? Implement Zhen Automation for your clients or refer growing companies to our platform. Earn a 20% recurring monthly payout for every active business workflow account.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    '20% recurring monthly commissions on all client plan renewals',
                    'Dedicated Agency Partner Portal with multi-client workflow management',
                    'Priority 24/7 technical architect support & custom API setup assistance',
                    'Instant payouts via Bank Wire, Paystack, or Crypto USDT',
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="size-4 text-brand-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/auth?mode=register"
                    className={buttonClass('primary', 'lg', 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/25')}
                  >
                    Join Partner Program <ArrowRight className="size-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Commission Tier Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1d] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                    COMMISSION TIERS
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">MONTHLY RECURRING</span>
                </div>

                <div className="rounded-xl border border-brand-400/30 bg-brand-500/10 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-white text-base">Tier 1: Direct Referrals</span>
                    <span className="font-mono font-bold text-lg text-brand-300">20% Cut</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Earn 20% of the subscription fees for every business that signs up with your referral link or agency ID.
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-white text-base">Tier 2: Sub-Agency Network</span>
                    <span className="font-mono font-bold text-lg text-cyan-300">5% Cut</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    When agencies you recruit onboard other businesses, you receive a continuous 5% override across their entire client roster.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/40 p-4 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span>AVERAGE AGENCY EARNINGS:</span>
                  <span className="text-emerald-400 font-bold">$1,850 / month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
