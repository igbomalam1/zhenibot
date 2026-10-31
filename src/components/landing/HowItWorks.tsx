import type { LucideIcon } from 'lucide-react'
import {
  PlugZap,
  Sliders,
  Cpu,
  ShieldAlert,
  Mail,
  Bike,
  Headphones,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'

const STEPS: {
  icon: LucideIcon
  step: string
  title: string
  description: string
  tag: string
}[] = [
  {
    icon: PlugZap,
    step: 'Step 01',
    title: 'Connect Your Channels in 60s',
    description:
      'Link your everyday business tools with 1-click: Gmail, Outlook, WhatsApp Business, Shopify, WooCommerce, Paystack, and logistics fleets.',
    tag: '150+ NATIVE INTEGRATIONS · ZERO CODE',
  },
  {
    icon: Sliders,
    step: 'Step 02',
    title: 'Activate Intelligence Playbooks',
    description:
      'Select pre-built autonomous blueprints: Smart Email Responder, Okada/Courier Dispatch Engine, 24/7 Support Agent, or Invoice Reconciler.',
    tag: 'PRE-TUNED FOR HIGH-GROWTH BUSINESSES',
  },
  {
    icon: Cpu,
    step: 'Step 03',
    title: 'Autonomous 24/7 Execution',
    description:
      'Zhen AI reads emails, assigns bike riders, answers anxious customers, and reconciles payments in under 2 seconds with 99.98% reliability.',
    tag: '1.2S AVG EXECUTION · NEVER SLEEPS',
  },
  {
    icon: ShieldAlert,
    step: 'Step 04',
    title: 'Human-in-the-Loop Safeguards',
    description:
      'Enjoy full oversight. Inspect live logs, configure approval gates for high-value transactions, and receive instant alerts if human intervention is needed.',
    tag: 'ENTERPRISE AUDIT TRAIL & CONTROL',
  },
]

export function HowItWorks() {
  return (
    <section id="solutions" className="relative py-28 border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-bold">
            HOW ZHEN AUTOMATION OPERATES
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-display">
            Turn Chaos Into Self-Driving Workflows
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Eliminate repetitive busywork. A battle-tested 4-step framework that gives business owners and teams their time back.
          </p>
        </div>

        {/* 4 Step Architecture Cards */}
        <div className="relative mt-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="glass-card glass-card-hover group relative flex flex-col justify-between rounded-2xl p-7 border border-white/8"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-6">
                    <span className="font-mono text-xs font-bold text-brand-400 tracking-wider">
                      {s.step}
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#12182b] text-brand-400 group-hover:border-brand-400/50 group-hover:bg-brand-500/10 transition-colors">
                      <s.icon className="size-5" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {s.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/5 pt-4">
                  <span className="font-mono text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Solution Pillars */}
        <div id="simulator" className="mt-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3.5 py-1 text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider mb-3">
              <Zap className="size-3.5" /> 4 CORE BUSINESS AUTOMATION ENGINES
            </span>
            <h3 className="text-3xl font-extrabold text-white font-display tracking-tight sm:text-4xl">
              Engineered For The Everyday Needs of Modern Businesses
            </h3>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Everything your business does manually can now be triggered, reasoned, and executed by Zhen AI in milliseconds.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* 1. Email Concierge */}
            <div className="glass-card relative rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-brand-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400 border border-brand-500/30">
                  <Mail className="size-6" />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold text-brand-400 uppercase tracking-widest block">
                    INBOX AUTOPILOT
                  </span>
                  <h4 className="text-xl font-bold text-white font-display">
                    Smart Email Concierge & Auto-Responder
                  </h4>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Connect your business inboxes (sales@, support@, info@). Zhen parses incoming RFQs, extracts PDF invoices, verifies inventory, and sends intelligent, context-aware personalized replies in seconds.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Autonomous quotation generation from customer RFQ attachments',
                  'Instant triage: Urgent customer issues flagged to Slack/SMS',
                  'Cal.com / Google Calendar auto-scheduling for inbound sales leads',
                  'Contextual memory: Remembers past client terms and order history',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="size-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-[#0b101d] p-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>BENCHMARK: <span className="text-emerald-400 font-bold">1.2s avg response</span></span>
                <span className="text-brand-300 font-semibold">22+ hrs saved / week</span>
              </div>
            </div>

            {/* 2. Delivery & Okada Courier Booking */}
            <div className="glass-card relative rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Bike className="size-6" />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                    LOGISTICS & FLEET DISPATCH
                  </span>
                  <h4 className="text-xl font-bold text-white font-display">
                    On-Demand Delivery & Okada Booking
                  </h4>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Zero phone calls to dispatch riders. Orders from WhatsApp, Shopify, or in-store POS automatically ping local bike riders (SendMe, GIGL, Bolt, internal fleet), optimize pickup routes, and send WhatsApp tracking to the customer.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Instant okada/bike assignment based on real-time proximity',
                  'Automatic distance-based delivery fee calculations and bill-back',
                  'Dynamic WhatsApp tracking links with live GPS coordinates',
                  'Auto-reassignment if rider rejects or experiences route delay',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-[#0b101d] p-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>DISPATCH LATENCY: <span className="text-cyan-400 font-bold">1.8s instant</span></span>
                <span className="text-cyan-300 font-semibold">98.4% on-time rate</span>
              </div>
            </div>

            {/* 3. 24/7 AI Customer Care Rep */}
            <div className="glass-card relative rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Headphones className="size-6" />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    OMNI-CHANNEL CARE
                  </span>
                  <h4 className="text-xl font-bold text-white font-display">
                    24/7 AI Customer Care Representative
                  </h4>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Delight your customers 24 hours a day across WhatsApp Business, Website Chat, and Instagram. Answers FAQs, checks parcel status, resolves return inquiries, and escalates to your team seamlessly when human touch is desired.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Resolves 88%+ of customer tickets with zero human intervention',
                  'Speaks natural Nigerian English, Pidgin, French, Hausa, Yoruba',
                  'Connected to your live inventory, order database, and courier GPS',
                  'Warm tone, empathetic replies, and smart sentiment detection',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-[#0b101d] p-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>CSAT RATING: <span className="text-emerald-400 font-bold">4.9 / 5.0</span></span>
                <span className="text-emerald-300 font-semibold">&lt; 1s response time</span>
              </div>
            </div>

            {/* 4. Autonomous Invoicing & Payments */}
            <div className="glass-card relative rounded-3xl p-8 border border-white/10 overflow-hidden hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Receipt className="size-6" />
                </span>
                <div>
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    FINANCIAL AUTOMATION
                  </span>
                  <h4 className="text-xl font-bold text-white font-display">
                    Invoicing & Payment Reconciliation
                  </h4>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                No more manual bookkeeping or chasing unpaid invoices. Zhen generates branded PDF invoices upon closed deals, creates Paystack/Stripe checkout links, matches bank webhooks, and issues receipts automatically.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  'Instant Paystack, Flutterwave, Moniepoint & Stripe integration',
                  'Automated polite payment reminders via WhatsApp & Email',
                  'Real-time reconciliation of bank transfers and mobile payments',
                  'Automatic sync with QuickBooks, Xero, and Google Sheets',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/8 bg-[#0b101d] p-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>RECONCILIATION: <span className="text-amber-400 font-bold">100% accurate</span></span>
                <span className="text-amber-300 font-semibold">Zero lost payments</span>
              </div>
            </div>
          </div>

          {/* Central Call to Action */}
          <div className="mt-14 text-center">
            <Link
              to="/auth"
              className={buttonClass(
                'primary',
                'lg',
                'bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 shadow-xl shadow-brand-500/25',
              )}
            >
              Start Automating Your Business Operations <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
