import { useState } from 'react'
import { ChevronDown, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/landing/Navbar'
import { buttonClass } from '@/components/ui/Button'

const YEAR = new Date().getFullYear()

const FAQS = [
  {
    q: 'How does Zhen Automation handle incoming business emails without hallucinating or making mistakes?',
    a: 'Zhen Automation uses deterministic policy guardrails along with advanced enterprise LLMs. It extracts structured entities (products, quantities, client IDs, quotation formats) from your customer emails and verifies them against your connected inventory or pricing database. If an email exceeds your threshold of uncertainty, it drafts the reply and requests 1-click human approval.',
  },
  {
    q: 'Can Zhen Automation book and dispatch local bike and okada riders in cities like Abuja or Lagos?',
    a: 'Yes! Zhen integrates directly with local on-demand courier networks (like SendMe, GIGL, Bolt Delivery) as well as your own in-house fleet of riders. The moment an order is confirmed on WhatsApp or your website, Zhen validates the recipient address, calculates the distance fee, pings the nearest rider, and sends a live GPS tracking link to the customer.',
  },
  {
    q: 'Does the 24/7 AI Customer Care Representative speak Pidgin or natural conversational nuances?',
    a: 'Absolutely. Zhen AI is tuned specifically for regional and global conversational commerce. It naturally comprehends and responds in English, Nigerian Pidgin, French, Hausa, Yoruba, and Spanish, ensuring your customers feel understood and respected at any hour of the night.',
  },
  {
    q: 'How quickly can our business launch our first automation?',
    a: 'Most businesses go live within 5 to 15 minutes. With our 1-click OAuth connectors for Gmail, Outlook, WhatsApp Business, Paystack, and Shopify, you simply select your desired automation blueprint and turn the switch ON.',
  },
  {
    q: 'Can Zhen generate compliant PDF invoices and reconcile Paystack payments?',
    a: 'Yes. Zhen monitors approved deals or new orders, autonomously generates branded PDF invoices with Paystack/Stripe/bank transfer details, and automatically reconciles your accounts when payment webhooks arrive. Unpaid bills trigger courteous automated follow-ups.',
  },
  {
    q: 'Do we need a programmer or software engineer on our team?',
    a: 'Zero coding is required. The Zhen Automation Studio is completely visual. You can use our pre-built automation playbooks or drag-and-drop triggers, conditions, and actions with zero code.',
  },
  {
    q: 'How secure is our company and customer data?',
    a: 'All data in transit and at rest is encrypted using AES-256 and TLS 1.3 enterprise standards. We never train public foundation models on your proprietary business communications or customer lists.',
  },
]

const PRICING_PLANS = [
  {
    name: 'Starter Automator',
    price: '$49',
    period: '/ month',
    tag: 'SOLOPRENEURS & LOCAL SHOPS',
    description: 'Perfect for small businesses looking to eliminate manual email replies and WhatsApp order chaos.',
    features: [
      'Up to 3,500 automated tasks / month',
      'Smart Email Concierge (1 inbox)',
      'WhatsApp AI Customer Care Rep',
      'Instant Delivery & Okada Courier Booking',
      'Community & email support',
    ],
    popular: false,
    cta: 'Start 14-Day Free Trial',
  },
  {
    name: 'Growth Pro',
    price: '$129',
    period: '/ month',
    tag: 'MOST POPULAR',
    description: 'For growing e-commerce stores, logistics fleets, and busy operational teams.',
    features: [
      'Up to 25,000 automated tasks / month',
      'Unlimited business inboxes & WhatsApp lines',
      'Automated dispatch to 5+ courier fleets',
      'Autonomous Invoicing & Paystack / Stripe sync',
      'Custom visual workflow builder',
      'Priority 24/7 technical support',
    ],
    popular: true,
    cta: 'Launch Growth Pro',
  },
  {
    name: 'Enterprise Fleet',
    price: '$399',
    period: '/ month',
    tag: 'ENTERPRISE & AGENCIES',
    description: 'For large operations requiring custom LLM fine-tuning, SLA guarantees, and dedicated servers.',
    features: [
      'Unlimited monthly task executions',
      'Dedicated private webhook cluster (14ms latency)',
      'Custom ERP & proprietary database connectors',
      'Human-in-the-loop multi-tier approval chains',
      'Dedicated Solutions Architect & SLA',
    ],
    popular: false,
    cta: 'Contact Enterprise Team',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={f.q}
            className={cn(
              'glass-card overflow-hidden rounded-2xl border border-white/8 transition-colors',
              isOpen && 'border-brand-500/30 bg-[#0d1424]',
            )}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-bold text-white transition-colors hover:text-brand-300 cursor-pointer"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{f.q}</span>
              <ChevronDown
                className={cn(
                  'size-4.5 shrink-0 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180 text-brand-400',
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t border-white/5 px-5 pb-5 pt-3">
                <p className="text-sm leading-relaxed text-slate-300 font-normal">
                  {f.a}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-[#060911] pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Pricing Section */}
        <div id="pricing" className="mb-28">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-bold">
              TRANSPARENT VALUE
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-display">
              Plans That Scale With Your Operations
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Try Zhen Automation risk-free for 14 days. No credit card required to start.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'glass-card relative flex flex-col justify-between rounded-3xl p-8 border transition-all duration-300',
                  plan.popular
                    ? 'border-brand-500/50 bg-gradient-to-b from-[#131b32] to-[#0d1424] shadow-2xl shadow-brand-500/10 -translate-y-2'
                    : 'border-white/8 hover:border-white/20',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-brand-500 to-cyan-500 px-4 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <span className="font-mono text-[10px] font-bold text-brand-400 uppercase tracking-widest block">
                    {plan.tag}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-1 border-y border-white/8 py-4">
                    <span className="font-mono text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-mono">{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    to="/auth?mode=register"
                    className={buttonClass(
                      plan.popular ? 'primary' : 'secondary',
                      'lg',
                      'w-full font-bold',
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-bold">
              FREQUENT QUESTIONS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-display">
              Got Questions? We Have Answers.
            </h2>
          </div>
          <Faq />
        </div>

        {/* Big CTA Banner */}
        <div className="mb-20 rounded-3xl border border-brand-500/30 bg-gradient-to-r from-brand-600/30 via-[#10172b] to-cyan-500/20 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Ready to Stop Doing Manual Busywork?
            </h3>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Join hundreds of high-growth companies that run their emails, courier deliveries, and customer support on autopilot with Zhen Automation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/auth?mode=register"
                className={buttonClass('primary', 'lg', 'bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 shadow-xl')}
              >
                Launch Your First Automation <Sparkles className="size-4 ml-1" />
              </Link>
              <Link
                to="/auth"
                className={buttonClass('secondary', 'lg')}
              >
                Schedule Architecture Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Links & Info */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/8 pt-12 pb-8">
          <div>
            <Logo />
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              Autonomous AI workflows and operations engine designed for modern businesses. Email triage, courier dispatch, 24/7 care reps, and invoice reconciliation on autopilot.
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 14 Automation Clusters Online (99.98%)</span>
            </div>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">
              Solutions
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#simulator" className="hover:text-brand-300 transition-colors">Smart Email Concierge</a></li>
              <li><a href="#simulator" className="hover:text-cyan-300 transition-colors">Delivery & Okada Dispatch</a></li>
              <li><a href="#simulator" className="hover:text-emerald-300 transition-colors">24/7 AI Customer Care Rep</a></li>
              <li><a href="#simulator" className="hover:text-amber-300 transition-colors">Invoicing & Paystack Sync</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">Custom Workflow Studio</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform & Ecosystem
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#integrations" className="hover:text-white transition-colors">150+ App Integrations</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a></li>
              <li><a href="#affiliate" className="hover:text-white transition-colors">Agency & Partner Program</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Developer API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">
              Security & Enterprise
            </h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-400" /> AES-256 Data Encryption</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-400" /> SOC2 & GDPR Compliant</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-400" /> Dedicated Private Cluster</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-400" /> 99.98% Guaranteed Uptime</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {YEAR} Zhen Automation Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
