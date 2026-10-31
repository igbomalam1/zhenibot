import {
  Mail,
  Bike,
  Headphones,
  Receipt,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui/Button'

export function HowItWorks() {
  return (
    <section id="solutions" className="py-20 sm:py-28 border-b border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
            System capabilities
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
            Four core engines for everyday operations
          </h2>
          <p className="mt-3 text-sm text-[#8F95A3] leading-relaxed">
            Every business repeats the same manual actions every morning: answering quote requests, calling dispatch riders, checking delivery locations, and matching bank transfers. Zhen handles all four.
          </p>
        </div>

        {/* 4 Core Capabilities Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Engine 1: Email Correspondence */}
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-[#181A21] border border-white/8 text-[#FF5416]">
                  <Mail className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-[#F4F5F7]">Email correspondence engine</h3>
                  <p className="text-xs text-[#8F95A3]">Gmail & Outlook workspace integration</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#10B981]">1.2s avg response</span>
            </div>

            <p className="text-xs text-[#8F95A3] leading-relaxed">
              Zhen monitors sales and support inboxes, parses incoming RFQs and attached PDFs, validates wholesale volume pricing against live inventory, and sends precise personalized replies with quotation attachments.
            </p>

            <ul className="space-y-2 text-xs text-[#F4F5F7]">
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Parses unstructured PDF quotes, order tables, and line items</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Drafts context-aware responses or responds autonomously based on pricing limits</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Routes enterprise VIP inquiries directly to human account executives</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono text-[#8F95A3]">
              <span>Coverage: 100% of inbound inboxes</span>
              <span>22 hours saved/week</span>
            </div>
          </div>

          {/* Engine 2: Okada & Courier Dispatch */}
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-[#181A21] border border-white/8 text-[#FF5416]">
                  <Bike className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-[#F4F5F7]">On-demand courier dispatch</h3>
                  <p className="text-xs text-[#8F95A3]">SendMe, GIGL, Bolt & in-house riders</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#10B981]">1.8s instant booking</span>
            </div>

            <p className="text-xs text-[#8F95A3] leading-relaxed">
              When an order is paid on Shopify, WooCommerce, or WhatsApp, Zhen automatically calculates distance, validates recipient addresses, pings the nearest bike rider, and generates waybills without manual intervention.
            </p>

            <ul className="space-y-2 text-xs text-[#F4F5F7]">
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Assigns closest bike or van courier based on real-time location</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Sends live WhatsApp map tracking link to the buyer with 1-click driver call</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Automatic reassignment if rider rejects or experiences route delay</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono text-[#8F95A3]">
              <span>Coverage: Lagos, Abuja, Port Harcourt</span>
              <span>98.6% on-time dispatch</span>
            </div>
          </div>

          {/* Engine 3: 24/7 Customer Care */}
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-[#181A21] border border-white/8 text-[#FF5416]">
                  <Headphones className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-[#F4F5F7]">24/7 Customer care representative</h3>
                  <p className="text-xs text-[#8F95A3]">WhatsApp, Web Chat & Instagram DMs</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#10B981]">0.9s response</span>
            </div>

            <p className="text-xs text-[#8F95A3] leading-relaxed">
              Provides conversational customer service across WhatsApp and web around the clock. Naturally handles delivery status inquiries, return requests, and product questions in English, Nigerian Pidgin, and French.
            </p>

            <ul className="space-y-2 text-xs text-[#F4F5F7]">
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Directly connected to order database and rider GPS telemetry</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Resolves 88% of inquiries without transferring to human agents</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Seamless hand-off to your staff whenever nuanced human discretion is required</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono text-[#8F95A3]">
              <span>Multilingual: English, Pidgin, French</span>
              <span>4.9 / 5.0 satisfaction</span>
            </div>
          </div>

          {/* Engine 4: Invoicing & Payment Reconciliation */}
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/6 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-[#181A21] border border-white/8 text-[#FF5416]">
                  <Receipt className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-medium text-[#F4F5F7]">Invoicing & ledger reconciliation</h3>
                  <p className="text-xs text-[#8F95A3]">Paystack, Stripe, QuickBooks & Xero</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#10B981]">100% matched</span>
            </div>

            <p className="text-xs text-[#8F95A3] leading-relaxed">
              Automates invoice generation upon quote approval, attaches Paystack/Stripe checkout links, reconciles bank webhooks against open ledger entries, and sends receipts and payment reminders.
            </p>

            <ul className="space-y-2 text-xs text-[#F4F5F7]">
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Instant PDF invoice generation from approved orders</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Automatic matching of incoming Paystack and bank transfer webhooks</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3.5 text-[#FF5416] shrink-0 mt-0.5" />
                <span>Daily balance reconciliation sync with Google Sheets or accounting ledger</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs font-mono text-[#8F95A3]">
              <span>Zero manual journal entry</span>
              <span>Instant receipts</span>
            </div>
          </div>
        </div>

        {/* 4-Step Process Section */}
        <div id="dispatch" className="mt-24 pt-16 border-t border-white/8">
          <div className="max-w-xl mb-12">
            <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
              Architecture
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#F4F5F7]">
              How it integrates into your existing business
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Connect your channels',
                desc: 'Link Gmail, Outlook, WhatsApp Business, Paystack, and Shopify in under two minutes via standard OAuth.',
              },
              {
                step: '02',
                title: 'Set business policies',
                desc: 'Define price discount thresholds, courier dispatch hubs, and escalation rules for high-value contracts.',
              },
              {
                step: '03',
                title: 'Autonomous execution',
                desc: 'Zhen processes inbound traffic around the clock, logging every decision and payload in an audit trail.',
              },
              {
                step: '04',
                title: 'Human oversight',
                desc: 'Review live telemetry from your command center. Intervene or pause any workflow with a single toggle.',
              },
            ].map((st) => (
              <div key={st.step} className="border-t border-white/10 pt-4 space-y-2">
                <span className="font-mono text-xs text-[#FF5416] font-semibold">{st.step}</span>
                <h4 className="text-sm font-medium text-[#F4F5F7]">{st.title}</h4>
                <p className="text-xs text-[#8F95A3] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6">
            <Link to="/auth" className={buttonClass('primary', 'lg')}>
              Deploy to your business <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
