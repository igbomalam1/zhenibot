import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  PlayCircle,
  Cpu,
  Mail,
  Bike,
  Headphones,
  Receipt,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { formatCompact } from '@/lib/format'
import { FUND_METRICS } from '@/lib/demo'
import { buttonClass } from '@/components/ui/Button'
import { TrustStrip } from '@/components/landing/Navbar'
import { QuantRadarCanvas } from '@/components/landing/QuantRadarCanvas'

function useLiveCounter(base: number, step = 3, interval = 1200) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const id = window.setInterval(
      () => setValue((v) => v + step + Math.floor(Math.random() * 4)),
      interval,
    )
    return () => window.clearInterval(id)
  }, [step, interval])
  return value
}

interface Scenario {
  id: string
  title: string
  icon: typeof Mail
  color: string
  triggerText: string
  processingText: string
  actions: { title: string; detail: string; status: string }[]
  latency: string
  timeSaved: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'email',
    title: 'Smart Email Concierge',
    icon: Mail,
    color: '#6366F1',
    triggerText: 'New wholesale inquiry from sales@apexventures.co (RFQ attached)',
    processingText: 'Zhen AI parsed 8 line items from PDF, calculated volume pricing & verified warehouse stock',
    actions: [
      { title: 'Personalized Reply Sent', detail: 'Quotation #QT-409 attached in 1.2s', status: 'Delivered' },
      { title: 'CRM Deal Created', detail: 'HubSpot pipeline stage: High-Priority Lead ($14,500)', status: 'Synced' },
      { title: 'Calendar Invite', detail: 'Demo call suggested for Tuesday 10:00 AM', status: 'Reserved' },
    ],
    latency: '1.2s',
    timeSaved: '25 mins saved',
  },
  {
    id: 'dispatch',
    title: 'Delivery & Okada Booking',
    icon: Bike,
    color: '#06B6D4',
    triggerText: 'Order #ZH-8831 placed on Shopify / WhatsApp (Wuse 2, Abuja)',
    processingText: 'Zhen calculated route distance, selected closest available okada courier & generated waybill',
    actions: [
      { title: 'Rider #42 Assigned', detail: 'Okada Express dispatch pinged & accepted pickup', status: 'En Route' },
      { title: 'Customer WhatsApp Update', detail: 'Live GPS tracking link sent to recipient (+234 803 ••• 4192)', status: 'Sent' },
      { title: 'POS Inventory Updated', detail: 'Reserved 2x Sneaker Pair SKU-801 in central warehouse', status: 'Logged' },
    ],
    latency: '1.8s',
    timeSaved: '40 mins saved',
  },
  {
    id: 'support',
    title: '24/7 AI Customer Care Rep',
    icon: Headphones,
    color: '#10B981',
    triggerText: 'WhatsApp message at 2:14 AM: "Is my package still coming today? It is urgent!"',
    processingText: 'Natural language sentiment analysis identified anxious customer and retrieved real-time rider GPS',
    actions: [
      { title: 'Warm AI Response', detail: '"Hello! Rider Ibrahim is 8 mins away on Adetokunbo Crescent."', status: 'Sent' },
      { title: 'Live Map Card Shared', detail: 'Shared dynamic map card with 1-click rider call button', status: 'Delivered' },
      { title: 'Ticket Resolved', detail: 'Customer replied: "Thank you so much!" (Sentiment: 100%)', status: 'Closed' },
    ],
    latency: '0.9s',
    timeSaved: '18 mins saved',
  },
  {
    id: 'invoice',
    title: 'Invoicing & Paystack Sync',
    icon: Receipt,
    color: '#F59E0B',
    triggerText: 'Client approved project estimate #EST-1049 for ₦450,000',
    processingText: 'Zhen verified tax calculations, created Paystack checkout link & booked into accounting ledger',
    actions: [
      { title: 'Invoice & Payment Link', detail: 'Emailed to CFO with 1-click Paystack / bank transfer', status: 'Delivered' },
      { title: 'Auto-Reconciliation', detail: 'Bank webhook detected payment in 3 mins · Receipt sent', status: 'Reconciled' },
      { title: 'Project Slack Notification', detail: 'Posted 🎉 deal win & unlocked project onboarding channel', status: 'Broadcasted' },
    ],
    latency: '1.4s',
    timeSaved: '30 mins saved',
  },
]

export function Hero() {
  const executions = useLiveCounter(FUND_METRICS.executions, 4, 1100)
  const [activeScenarioId, setActiveScenarioId] = useState('email')
  const [isSimulating, setIsSimulating] = useState(false)
  const [stepIndex, setStepIndex] = useState(2)

  const activeScenario = SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0]

  const handleSimulate = () => {
    setIsSimulating(true)
    setStepIndex(0)
    setTimeout(() => setStepIndex(1), 600)
    setTimeout(() => {
      setStepIndex(2)
      setIsSimulating(false)
    }, 1400)
  }

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
      {/* Dynamic Background Automation Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <QuantRadarCanvas className="w-full h-full" />
      </div>

      {/* Grid Overlay */}
      <div className="grid-pattern absolute inset-0 pointer-events-none" aria-hidden />

      {/* Subtle Hairline Ambient Top Beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-5xl bg-gradient-to-r from-transparent via-brand-500/40 via-cyan-400/30 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-semibold text-brand-300 mb-6 backdrop-blur-md shadow-sm">
              <span className="flex size-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono uppercase tracking-wider text-[11px] text-brand-300">
                ZHEN AUTOMATION 3.0
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">Autonomous Business Engine</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-display leading-[1.14]">
              Automate Your Day-to-Day
              <span className="text-gradient block mt-2">Business Operations.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
              Stop drowning in daily manual busywork. Zhen Automation connects your business channels to{' '}
              <span className="text-white font-semibold">auto-reply emails</span>,{' '}
              <span className="text-cyan-300 font-semibold">book & dispatch delivery riders</span>,{' '}
              <span className="text-emerald-300 font-semibold">run 24/7 AI customer care reps</span>, and reconcile
              invoices in seconds.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                className={buttonClass(
                  'primary',
                  'lg',
                  'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40',
                )}
              >
                Build Your First Automation <ArrowRight className="size-4 ml-1" />
              </Link>
              <a
                href="#simulator"
                className={buttonClass('secondary', 'lg', 'hover:border-brand-400/40')}
              >
                <PlayCircle className="size-4 text-brand-400" /> Explore Workflows
              </a>
            </div>

            {/* Metric Strip */}
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-white/10 pt-8">
              {[
                { label: 'Tasks Executed', value: formatCompact(executions), sub: 'Zero human effort' },
                { label: 'Hours Saved/Wk', value: '18.5 hrs', sub: 'Per business average' },
                { label: 'Avg Latency', value: '1.2s', sub: 'Instant execution' },
                { label: 'Uptime SLA', value: '99.98%', sub: 'High reliability' },
              ].map((s) => (
                <div key={s.label} className="border-l border-white/10 pl-4 py-1">
                  <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">{s.value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mt-1">
                    {s.label}
                  </p>
                  <p className="text-[10px] font-mono text-brand-400 mt-0.5">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Interactive Automation Sandbox */}
          <div className="relative animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card relative rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/12 overflow-hidden">
              {/* Header */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 text-brand-400 border border-brand-500/30">
                    <Cpu className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                      Zhen Automation Engine
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400">Live Interactive Operations Sandbox</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 rounded-lg border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-brand-300 hover:bg-brand-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <RefreshCw className={`size-3.5 ${isSimulating ? 'animate-spin text-cyan-400' : ''}`} />
                  {isSimulating ? 'Executing...' : 'Trigger Simulation'}
                </button>
              </div>

              {/* Scenario Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {SCENARIOS.map((sc) => {
                  const Icon = sc.icon
                  const isActive = sc.id === activeScenarioId
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setActiveScenarioId(sc.id)
                        setStepIndex(2)
                      }}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                        isActive
                          ? 'border-brand-400/60 bg-brand-500/15 shadow-sm text-white'
                          : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                      }`}
                    >
                      <Icon className="size-4" style={{ color: sc.color }} />
                      <span className="text-[11px] font-semibold tracking-tight">{sc.title.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Workflow Flow Visualizer */}
              <div className="space-y-3.5">
                {/* Node 1: Inbound Trigger */}
                <div
                  className={`rounded-2xl border p-3.5 transition-all ${
                    stepIndex >= 0
                      ? 'border-white/15 bg-[#101728]/90 shadow-md'
                      : 'border-white/5 bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-amber-400" /> STAGE 1: INBOUND TRIGGER
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">Channel Event</span>
                  </div>
                  <p className="text-xs text-white font-medium">{activeScenario.triggerText}</p>
                </div>

                {/* Connecting arrow */}
                <div className="flex justify-center -my-1 text-brand-400">
                  <div className="h-3 w-0.5 bg-gradient-to-b from-amber-400 to-brand-400" />
                </div>

                {/* Node 2: Cognitive AI Processor */}
                <div
                  className={`rounded-2xl border p-3.5 transition-all ${
                    stepIndex >= 1
                      ? 'border-brand-500/30 bg-brand-950/40 shadow-md shadow-brand-500/5'
                      : 'border-white/5 bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-3 text-brand-400" /> STAGE 2: ZHEN AI REASONING
                    </span>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">{activeScenario.latency}</span>
                  </div>
                  <p className="text-xs text-slate-300">{activeScenario.processingText}</p>
                </div>

                {/* Connecting arrow */}
                <div className="flex justify-center -my-1 text-brand-400">
                  <div className="h-3 w-0.5 bg-gradient-to-b from-brand-400 to-emerald-400" />
                </div>

                {/* Node 3: Multi-Action Dispatched */}
                <div
                  className={`rounded-2xl border p-3.5 transition-all ${
                    stepIndex >= 2
                      ? 'border-emerald-500/30 bg-emerald-950/20 shadow-md'
                      : 'border-white/5 bg-white/[0.02] opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-emerald-400" /> STAGE 3: AUTONOMOUS ACTIONS
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      {activeScenario.timeSaved}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {activeScenario.actions.map((act) => (
                      <div
                        key={act.title}
                        className="flex items-center justify-between rounded-lg bg-black/30 px-2.5 py-1.5 text-[11px] border border-white/5"
                      >
                        <div className="truncate mr-2">
                          <span className="font-semibold text-white">{act.title}</span>
                          <span className="text-slate-400 ml-1.5 font-normal">· {act.detail}</span>
                        </div>
                        <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase shrink-0">
                          {act.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Trust Bar */}
              <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-brand-400" /> Human-in-the-Loop Safeguards Active
                </span>
                <Link to="/auth" className="text-brand-300 font-semibold hover:underline flex items-center gap-1">
                  Deploy this flow <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-16">
          <TrustStrip />
        </div>
      </div>
    </section>
  )
}
