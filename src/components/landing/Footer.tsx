import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/landing/Navbar'
import { buttonClass } from '@/components/ui/Button'

const YEAR = new Date().getFullYear()

const FAQS = [
  {
    q: 'How does Zhen Automation handle incoming correspondence without hallucinating or making errors?',
    a: 'Zhen Automation enforces deterministic policy guardrails on top of foundation models. It extracts structured entities (products, quantities, client IDs, quotation formats) and verifies them against your connected database or spreadsheet before generating a response. If an inquiry exceeds your configured confidence threshold, it drafts the reply and requests human approval.',
  },
  {
    q: 'Can Zhen Automation book and dispatch local bike and okada riders in Nigerian cities?',
    a: 'Yes. Zhen integrates directly with local on-demand courier networks (like SendMe, GIGL, Bolt Delivery) as well as your own in-house fleet of riders in Lagos, Abuja, and Port Harcourt. The moment an order is confirmed, Zhen validates the recipient address, calculates the distance fee, pings the nearest rider, and sends a live GPS tracking link to the customer over WhatsApp.',
  },
  {
    q: 'Does the 24/7 AI Customer Care Representative speak Pidgin and understand regional nuances?',
    a: 'Yes. Zhen AI is tuned for conversational commerce in Nigeria and West Africa. It comprehends and responds in English, Nigerian Pidgin, French, Hausa, Yoruba, and Spanish, ensuring your customers feel understood and assisted at any hour of the night.',
  },
  {
    q: 'How quickly can our business launch our first automation?',
    a: 'Most businesses go live within 10 to 15 minutes. With 1-click OAuth connectors for Gmail, Outlook, WhatsApp Business, Paystack, and Shopify, you select your desired automation blueprint and switch it on.',
  },
  {
    q: 'Can Zhen generate compliant PDF invoices and reconcile Paystack payments?',
    a: 'Yes. Zhen monitors approved deals or new orders, autonomously generates branded PDF invoices with Paystack/Stripe/bank transfer details, and automatically reconciles your accounts when payment webhooks arrive. Unpaid bills trigger courteous automated follow-ups.',
  },
  {
    q: 'Do we need a programmer or software engineer on our team?',
    a: 'Zero coding is required. The Zhen Automation console is visual. You can use our pre-built automation playbooks or drag-and-drop triggers, conditions, and actions with zero code.',
  },
  {
    q: 'How is company and customer data protected?',
    a: 'All data in transit and at rest is encrypted using AES-256 and TLS 1.3 enterprise standards. We never train public foundation models on your proprietary business communications or customer lists.',
  },
]

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$49',
    period: '/ month',
    description: 'For single founders and small shops needing email auto-replies and courier dispatch.',
    features: [
      'Up to 3,500 automated tasks / month',
      'Smart email concierge (1 inbox)',
      'WhatsApp AI customer care rep',
      'Instant courier dispatching',
      'Standard support via email',
    ],
    highlight: false,
    cta: 'Start 14-day trial',
  },
  {
    name: 'Growth Pro',
    price: '$129',
    period: '/ month',
    description: 'For growing e-commerce stores, logistics fleets, and busy operational teams.',
    features: [
      'Up to 25,000 automated tasks / month',
      'Unlimited business inboxes & WhatsApp lines',
      'Automated dispatch to 5+ courier fleets',
      'Autonomous invoicing & Paystack sync',
      'Custom visual workflow editor',
      'Priority technical support',
    ],
    highlight: true,
    cta: 'Start 14-day trial',
  },
  {
    name: 'Enterprise Fleet',
    price: '$399',
    period: '/ month',
    description: 'For high-volume operations requiring dedicated clusters, private VPCs, and custom SLAs.',
    features: [
      'Unlimited monthly task executions',
      'Dedicated private webhook cluster (14ms latency)',
      'Custom ERP & proprietary database connectors',
      'Multi-tier human approval workflows',
      'Dedicated solutions architect & 99.99% SLA',
    ],
    highlight: false,
    cta: 'Contact enterprise team',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/8">
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q} className="py-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-[#F4F5F7] hover:text-white transition-colors cursor-pointer"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{f.q}</span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-[#8F95A3] transition-transform duration-150',
                  isOpen && 'rotate-180 text-white',
                )}
              />
            </button>
            {isOpen && (
              <div className="pt-3 pr-8">
                <p className="text-xs leading-relaxed text-[#8F95A3]">
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
    <footer className="pt-20 pb-12 bg-[#0B0C0E]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Pricing Section */}
        <div id="pricing" className="mb-24 pb-20 border-b border-white/8">
          <div className="max-w-xl mb-12">
            <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
              Transparent plans
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
              Simple pricing that scales with your operations
            </h2>
            <p className="mt-3 text-sm text-[#8F95A3]">
              Every tier includes a 14-day free trial. No credit card required to start.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-xl border p-6 flex flex-col justify-between space-y-6',
                  plan.highlight
                    ? 'border-[#FF5416]/50 bg-[#14161D]'
                    : 'border-white/8 bg-[#121419]',
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-[#F4F5F7]">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="font-mono text-[10px] text-[#FF5416] border border-[#FF5416]/30 px-2 py-0.5 rounded">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-[#8F95A3] leading-relaxed">{plan.description}</p>

                  <div className="mt-5 flex items-baseline gap-1 border-y border-white/8 py-3 font-mono">
                    <span className="text-3xl font-semibold text-[#F4F5F7]" data-tabular="true">{plan.price}</span>
                    <span className="text-xs text-[#8F95A3]">{plan.period}</span>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-xs text-[#F4F5F7]">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to="/auth?mode=register"
                    className={buttonClass(
                      plan.highlight ? 'primary' : 'secondary',
                      'md',
                      'w-full font-medium',
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
        <div id="faq" className="mb-24 pb-20 border-b border-white/8">
          <div className="max-w-xl mb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
              Questions
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F4F5F7]">
              Frequently asked questions
            </h2>
          </div>
          <Faq />
        </div>

        {/* Bottom Navigation */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12">
          <div>
            <Logo />
            <p className="mt-3 text-xs text-[#8F95A3] leading-relaxed">
              Autonomous operations engine for modern businesses. Inbound email triage, courier dispatching, and 24/7 care reps on autopilot.
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-[#8F95A3]">
              <span className="size-1.5 rounded-full bg-[#10B981]" />
              <span>14 automation clusters operational</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs font-medium text-[#F4F5F7] uppercase tracking-wider mb-3">
              Engines
            </p>
            <ul className="space-y-2 text-xs text-[#8F95A3]">
              <li><a href="#solutions" className="hover:text-white transition-colors">Email correspondence</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Okada courier dispatch</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">24/7 Customer support</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">Invoicing & Paystack sync</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs font-medium text-[#F4F5F7] uppercase tracking-wider mb-3">
              Platform
            </p>
            <ul className="space-y-2 text-xs text-[#8F95A3]">
              <li><a href="#integrations" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Economics calculator</a></li>
              <li><a href="#affiliate" className="hover:text-white transition-colors">Agency partner program</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing tiers</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs font-medium text-[#F4F5F7] uppercase tracking-wider mb-3">
              Standards
            </p>
            <ul className="space-y-2 text-xs text-[#8F95A3]">
              <li>AES-256 encrypted at rest</li>
              <li>Deterministic guardrails</li>
              <li>Zero customer data training</li>
              <li>99.98% operational uptime</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8F95A3]">
          <p>© {YEAR} Zhen Automation Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <a href="#" className="hover:text-white">Terms of service</a>
            <a href="#" className="hover:text-white">Security report</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
