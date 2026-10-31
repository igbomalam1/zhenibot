import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Gift,
  Sparkles,
  Copy,
  Check,
  Mail,
  Bike,
  Headphones,
  Receipt,
  Calendar,
  Zap,
  Play,
  CheckCircle2,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/format'
import { getEquitySeries } from '@/lib/demo'
import { BotTracker } from '@/components/dashboard/BotTracker'
import { TradeFeed } from '@/components/dashboard/TradeFeed'

interface WorkflowSwitch {
  id: string
  title: string
  category: string
  icon: typeof Mail
  color: string
  status: boolean
  desc: string
  tasksToday: number
}

export function Dashboard() {
  const { profile } = useAuth()
  const [hideBalance, setHideBalance] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null)
  const equity = useMemo(() => getEquitySeries(), [])

  const [workflows, setWorkflows] = useState<WorkflowSwitch[]>([
    {
      id: 'wf-email',
      title: 'Smart Email Concierge & Auto-Reply',
      category: 'INBOX AUTOPILOT',
      icon: Mail,
      color: '#6366F1',
      status: true,
      desc: 'Triages sales inquiries, parses RFQ attachments, sends personalized replies in 1.2s.',
      tasksToday: 74,
    },
    {
      id: 'wf-dispatch',
      title: 'On-Demand Delivery & Okada Booking',
      category: 'LOGISTICS DISPATCH',
      icon: Bike,
      color: '#06B6D4',
      status: true,
      desc: 'Auto-pings closest bike rider upon order checkout, calculates fee & sends WhatsApp tracking.',
      tasksToday: 42,
    },
    {
      id: 'wf-support',
      title: '24/7 AI Customer Care Representative',
      category: 'WHATSAPP & WEB CARE',
      icon: Headphones,
      color: '#10B981',
      status: true,
      desc: 'Handles order status, return queries & product questions in natural multilingual English & Pidgin.',
      tasksToday: 118,
    },
    {
      id: 'wf-invoice',
      title: 'Autonomous Invoicing & Paystack Sync',
      category: 'FINANCIAL OPS',
      icon: Receipt,
      color: '#F59E0B',
      status: true,
      desc: 'Generates branded PDF invoices, syncs Paystack webhooks & reconciles accounting ledger.',
      tasksToday: 31,
    },
    {
      id: 'wf-cal',
      title: 'Smart Meeting & Calendar Scheduler',
      category: 'SALES SCHEDULING',
      icon: Calendar,
      color: '#A855F7',
      status: true,
      desc: 'Proactively books qualifying enterprise leads directly into executive Google Meet / Zoom.',
      tasksToday: 19,
    },
  ])

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: !w.status } : w)),
    )
  }

  const triggerManualTest = (wf: WorkflowSwitch) => {
    setSimulatedAlert(`Successfully triggered test execution for [${wf.title}]. Task executed in 1.1s!`)
    setTimeout(() => setSimulatedAlert(null), 4500)
  }

  const name = profile?.full_name?.split(' ')[0] ?? 'Business Ops'
  const creditsBalance = profile?.wallet_balance ?? 125.0

  const referralUrl = `${window.location.origin}/auth?mode=register&ref=${profile?.referral_code || ''}`

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      // ignore
    }
  }

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-8 select-none">
      {/* Top Greeting Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              OPERATIONS COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="mt-0.5 font-mono text-xs text-slate-400">{todayLabel} · Zhen Engine Active</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 font-mono text-xs font-bold text-brand-300">
            <Sparkles className="size-3.5 text-cyan-300" />
            99.98% HEALTH SLA
          </span>
        </div>
      </div>

      {simulatedAlert && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-emerald-300 text-xs font-mono flex items-center justify-between shadow-lg animate-fade-up">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" /> {simulatedAlert}
          </span>
          <button type="button" onClick={() => setSimulatedAlert(null)} className="text-slate-400 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* OPERATIONS HERO BALANCE CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#10172b] via-[#0b101f] to-[#070b14] p-6 sm:p-8 shadow-2xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              Automation Fuel Credits
            </span>
            <button
              type="button"
              onClick={() => setHideBalance((v) => !v)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title={hideBalance ? 'Show balance' : 'Hide balance'}
            >
              {hideBalance ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-emerald-400 font-mono text-xs font-bold shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUTONOMOUS CLUSTER SYNCED</span>
          </div>
        </div>

        {/* Hero Figure */}
        <div className="relative z-10 mt-4 flex flex-wrap items-baseline gap-4">
          <p className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {hideBalance ? '••••••' : formatCurrency(creditsBalance)}
          </p>
          <span className="font-mono text-xs text-brand-300 font-semibold bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
            ~12,500 compute tasks available
          </span>
        </div>

        {/* 3 Metrics inside hero card */}
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-white/8 pt-6">
          <div className="rounded-xl border border-white/6 bg-black/25 p-3.5">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Tasks Executed (Month)</p>
            <p className="font-mono text-xl font-bold text-white mt-1">2,841 tasks</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">+18% vs last month</p>
          </div>
          <div className="rounded-xl border border-white/6 bg-black/25 p-3.5">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Time Saved This Month</p>
            <p className="font-mono text-xl font-bold text-cyan-300 mt-1">142.5 hours</p>
            <p className="text-[10px] text-slate-400 mt-0.5">~3.5 full work weeks</p>
          </div>
          <div className="rounded-xl border border-white/6 bg-black/25 p-3.5">
            <p className="font-mono text-[10px] uppercase font-bold text-slate-400">Avg Execution Latency</p>
            <p className="font-mono text-xl font-bold text-emerald-400 mt-1">1.2 seconds</p>
            <p className="text-[10px] text-slate-400 mt-0.5">End-to-end multi-channel</p>
          </div>
        </div>

        {/* Quick action triggers */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/deposit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/25 hover:from-brand-500 hover:to-brand-400 transition-all cursor-pointer"
          >
            <Zap className="size-4" /> Top Up Fuel Credits
          </Link>
          <Link
            to="/dashboard/withdraw"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            <Bike className="size-4 text-cyan-400" /> Dispatch Fleet Settings
          </Link>
          <Link
            to="/dashboard/referrals"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-xs font-bold text-brand-300 hover:bg-brand-500/20 transition-all cursor-pointer"
          >
            <Gift className="size-4 text-brand-400" /> 20% Agency Program
          </Link>
        </div>
      </div>

      {/* ACTIVE WORKFLOWS SWITCHBOARD */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0f1d] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              Active Autonomous Workflows
              <span className="rounded-full bg-brand-500/15 border border-brand-500/30 px-2 py-0.5 font-mono text-[10px] text-brand-300 font-bold">
                {workflows.filter((w) => w.status).length} / {workflows.length} RUNNING
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle workflows on/off or test run live executions directly.
            </p>
          </div>

          <button
            type="button"
            onClick={copyReferral}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs font-semibold text-slate-300 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Agency Link'}</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {workflows.map((wf) => {
            const Icon = wf.icon
            return (
              <div
                key={wf.id}
                className={`rounded-2xl border p-4 transition-all ${
                  wf.status
                    ? 'border-white/10 bg-[#0e1528] shadow-md'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 items-center justify-center rounded-xl border shrink-0"
                      style={{
                        backgroundColor: `${wf.color}15`,
                        borderColor: `${wf.color}35`,
                        color: wf.color,
                      }}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider block" style={{ color: wf.color }}>
                        {wf.category}
                      </span>
                      <h3 className="font-display text-sm font-bold text-white">{wf.title}</h3>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => toggleWorkflow(wf.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      wf.status ? 'bg-brand-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        wf.status ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-300 mb-4">{wf.desc}</p>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 font-mono text-[11px]">
                  <span className="text-slate-400">
                    Tasks today: <span className="font-bold text-white">{wf.tasksToday}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerManualTest(wf)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  >
                    <Play className="size-3" /> Test Run
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* LOWER SECTION: BOT TRACKER & LIVE STREAM */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <BotTracker />

          {/* 30-Day Task Throughput Chart */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-display font-bold text-white">30-Day Automation Growth</h3>
                <p className="text-[11px] font-mono text-slate-400">Cumulative tasks processed on autopilot</p>
              </div>
              <span className="font-mono text-xs text-brand-300 font-bold bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                +310% MOM
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equity}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1220',
                      borderColor: '#ffffff15',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTasks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Event Feed */}
        <div className="glass-card rounded-2xl p-6 border border-white/8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-display font-bold text-white">Live Execution Feed</h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400">STREAMING</span>
            </div>
            <TradeFeed />
          </div>

          <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Audit Trail Protected</span>
            <Link to="/dashboard/history" className="text-brand-300 hover:underline">
              View All Logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
