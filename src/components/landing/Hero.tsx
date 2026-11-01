import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { buttonClass } from '@/components/ui/Button'
import { TrustStrip } from '@/components/landing/Navbar'

interface Scenario {
  id: string
  name: string
  trigger: string
  detail: string
  output: string
  latency: string
  saved: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'email',
    name: 'Email correspondence',
    trigger: 'Inbound quote request from purchasing@kora-retail.ng (RFQ document attached)',
    detail: 'Extracted 12 line items from PDF, cross-checked current warehouse inventory, applied tier-2 volume discount.',
    output: 'Formal quotation #QT-842 emailed back with payment link in 1.2s. Deal moved to Qualified in CRM.',
    latency: '1.2s',
    saved: '22 minutes saved',
  },
  {
    id: 'dispatch',
    name: 'Okada & bike dispatch',
    trigger: 'Shopify order #4912 paid via Paystack (Destination: Wuse 2, Abuja)',
    detail: 'Calculated route distance from central hub, validated destination, selected closest available courier.',
    output: 'Rider Ibrahim S. (#28) assigned. Live GPS tracking link sent to buyer over WhatsApp.',
    latency: '1.8s',
    saved: '35 minutes saved',
  },
  {
    id: 'care',
    name: '24/7 Customer support',
    trigger: 'WhatsApp message at 02:14 AM: "Is my order still coming today? Need it early."',
    detail: 'Retrieved order delivery state, confirmed rider route, and drafted reassuring response in conversational English.',
    output: 'Replied: "Good morning! Rider is 8 minutes away on Adetokunbo Crescent." Ticket resolved.',
    latency: '0.9s',
    saved: '15 minutes saved',
  },
  {
    id: 'invoice',
    name: 'Invoice reconciliation',
    trigger: 'Bank transfer webhook received for ₦240,000 against invoice #INV-309',
    detail: 'Verified transaction reference, matched amount against open receivables, booked journal entry.',
    output: 'Ledger reconciled, receipt issued to client via WhatsApp and email. Zero manual bookkeeping.',
    latency: '1.4s',
    saved: '18 minutes saved',
  },
]

export function Hero() {
  const [activeId, setActiveId] = useState('email')
  const [running, setRunning] = useState(false)

  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0]

  const handleRun = () => {
    setRunning(true)
    window.setTimeout(() => setRunning(false), 900)
  }

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] items-start">
          {/* Left Column: Heading & Value Proposition */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#142410] border border-white/10 px-2.5 py-1 text-xs font-mono text-[#F4F5F7]">
              <span className="size-1.5 rounded-full bg-[#459F34]" />
              <span>Zhen Operations Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F5F7] leading-[1.15]">
              Autonomous business operations,{' '}
              <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
                running 24 hours a day.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#8F95A3] leading-relaxed max-w-lg">
              Connect inboxes, logistics fleets, and payment webhooks into one autonomous system.
              Inbound emails answered in 1.4 seconds. Couriers dispatched at checkout. Invoices reconciled the moment Paystack clears.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/auth" className={buttonClass('primary', 'lg')}>
                Start 14-day trial <ArrowRight className="size-4 ml-1" />
              </Link>
              <a href="#solutions" className={buttonClass('secondary', 'lg')}>
                See capabilities
              </a>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/8">
              <div>
                <p className="font-mono text-2xl font-semibold text-[#F4F5F7]" data-tabular="true">
                  1.2s
                </p>
                <p className="text-xs text-[#8F95A3] mt-1">Average execution</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-[#F4F5F7]" data-tabular="true">
                  18.5h
                </p>
                <p className="text-xs text-[#8F95A3] mt-1">Saved per business/wk</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-[#F4F5F7]" data-tabular="true">
                  88%
                </p>
                <p className="text-xs text-[#8F95A3] mt-1">Autonomous care resolution</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Operational Switchboard */}
          <div className="rounded-xl border border-white/10 bg-[#0e1a0b] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-5">
              <div>
                <h3 className="text-sm font-medium text-[#F4F5F7]">Live execution switchboard</h3>
                <p className="text-xs text-[#8F95A3] mt-0.5">Test real operational events in production simulation</p>
              </div>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#142410] px-2.5 py-1 text-xs font-mono text-[#F4F5F7] hover:bg-[#20232C] transition-colors cursor-pointer"
              >
                <RefreshCw className={`size-3 text-[#459F34] ${running ? 'animate-spin' : ''}`} />
                <span>{running ? 'Running...' : 'Execute'}</span>
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap gap-1.5 mb-5 p-1 rounded-lg bg-[#081106] border border-white/6">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`flex-1 min-w-[120px] rounded-md px-2.5 py-1.5 text-xs text-center transition-colors cursor-pointer ${
                    s.id === activeId
                      ? 'bg-[#142410] text-[#F4F5F7] font-medium border border-white/10'
                      : 'text-[#8F95A3] hover:text-[#F4F5F7]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Event Docket */}
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-white/6 bg-[#081106] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#8F95A3]">
                  <span>01 / INBOUND EVENT</span>
                  <span className="text-[#459F34]">Received</span>
                </div>
                <p className="text-[#F4F5F7] font-sans text-xs pt-1">{active.trigger}</p>
              </div>

              <div className="rounded-lg border border-white/6 bg-[#081106] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#8F95A3]">
                  <span>02 / COGNITIVE PROCESSING</span>
                  <span className="text-[#8F95A3]">{active.latency}</span>
                </div>
                <p className="text-[#8F95A3] font-sans text-xs pt-1">{active.detail}</p>
              </div>

              <div className="rounded-lg border border-white/6 bg-[#142410] p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#8F95A3]">
                  <span className="flex items-center gap-1.5 text-[#10B981]">
                    <CheckCircle2 className="size-3" /> 03 / ACTION DISPATCHED
                  </span>
                  <span className="text-[#10B981]">{active.saved}</span>
                </div>
                <p className="text-[#F4F5F7] font-sans text-xs pt-1">{active.output}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-[#8F95A3]">
              <span>Deterministic guardrails active</span>
              <span className="font-mono text-[11px]">Audit ref: #ZH-88104</span>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <TrustStrip />
        </div>
      </div>
    </section>
  )
}
