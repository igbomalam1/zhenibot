import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Mail,
  Bike,
  Headphones,
  Receipt,
  Calendar,
  Play,
  CheckCircle2,
  ArrowRight,
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
  status: boolean
  desc: string
  tasksToday: number
}

export function Dashboard() {
  const { profile } = useAuth()
  const [hideBalance, setHideBalance] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [alertNotice, setAlertNotice] = useState<string | null>(null)
  const equity = useMemo(() => getEquitySeries(), [])

  const [workflows, setWorkflows] = useState<WorkflowSwitch[]>([
    {
      id: 'wf-email',
      title: 'Email correspondence',
      category: 'Inbound parsing',
      icon: Mail,
      status: true,
      desc: 'Triages sales inquiries, parses RFQ attachments, sends personalized replies in 1.2s.',
      tasksToday: 74,
    },
    {
      id: 'wf-dispatch',
      title: 'Okada courier dispatch',
      category: 'Logistics fleet',
      icon: Bike,
      status: true,
      desc: 'Pings closest bike rider upon order checkout, calculates fee, and shares live tracking.',
      tasksToday: 42,
    },
    {
      id: 'wf-support',
      title: '24/7 Customer support',
      category: 'Conversational care',
      icon: Headphones,
      status: true,
      desc: 'Handles order status, return queries & product questions in natural multilingual English & Pidgin.',
      tasksToday: 118,
    },
    {
      id: 'wf-invoice',
      title: 'Invoicing & Paystack sync',
      category: 'Financial operations',
      icon: Receipt,
      status: true,
      desc: 'Generates branded PDF invoices, syncs Paystack webhooks, and reconciles the accounting ledger.',
      tasksToday: 31,
    },
    {
      id: 'wf-cal',
      title: 'Sales meeting scheduler',
      category: 'Calendar routing',
      icon: Calendar,
      status: true,
      desc: 'Books qualifying enterprise leads directly into executive Google Meet and Zoom slots.',
      tasksToday: 19,
    },
  ])

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: !w.status } : w)),
    )
  }

  const triggerTestRun = (wf: WorkflowSwitch) => {
    setAlertNotice(`Test execution sent for ${wf.title}. Latency: 1.1s.`)
    window.setTimeout(() => setAlertNotice(null), 3500)
  }

  const creditsBalance = profile?.wallet_balance ?? 125.0
  const referralUrl = `${window.location.origin}/auth?mode=register&ref=${profile?.referral_code || ''}`

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Top Header without generic greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Operations console
          </h1>
          <p className="mt-0.5 text-xs text-[#8F95A3] font-mono">
            All 14 clusters operational · 4 active engines running
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/deposit"
            className="rounded-md border border-white/10 bg-[#142410] px-3 py-1.5 text-xs text-white hover:bg-[#1E212B] transition-colors"
          >
            Provision credits
          </Link>
          <button
            type="button"
            onClick={copyReferral}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#142410] px-3 py-1.5 font-mono text-xs text-[#8F95A3] hover:text-white transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="size-3 text-[#10B981]" /> : <Copy className="size-3" />}
            <span>{copiedLink ? 'Copied' : 'Partner link'}</span>
          </button>
        </div>
      </div>

      {alertNotice && (
        <div className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-2.5 text-xs font-mono text-[#10B981] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="size-4" /> {alertNotice}
          </span>
          <button type="button" onClick={() => setAlertNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Status Banner */}
      <div className="rounded-xl border border-white/8 bg-[#0e1a0b] p-5">
        <div className="grid gap-6 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8F95A3]">
              <span>Credit balance</span>
              <button
                type="button"
                onClick={() => setHideBalance((v) => !v)}
                className="text-slate-500 hover:text-white"
              >
                {hideBalance ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </button>
            </div>
            <p className="mt-1 font-mono text-2xl font-semibold text-white" data-tabular="true">
              {hideBalance ? '••••••' : formatCurrency(creditsBalance)}
            </p>
            <p className="text-[11px] text-[#8F95A3] mt-0.5 font-mono">~12,500 compute tasks</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs text-[#8F95A3]">Tasks executed today</span>
            <p className="mt-1 font-mono text-2xl font-semibold text-white" data-tabular="true">
              284
            </p>
            <p className="text-[11px] text-[#10B981] mt-0.5 font-mono">100% autonomous</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs text-[#8F95A3]">Hours saved this month</span>
            <p className="mt-1 font-mono text-2xl font-semibold text-white" data-tabular="true">
              142.5h
            </p>
            <p className="text-[11px] text-[#8F95A3] mt-0.5 font-mono">~3.5 work weeks</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-xs text-[#8F95A3]">Average latency</span>
            <p className="mt-1 font-mono text-2xl font-semibold text-[#10B981]" data-tabular="true">
              1.2s
            </p>
            <p className="text-[11px] text-[#8F95A3] mt-0.5 font-mono">End-to-end</p>
          </div>
        </div>
      </div>

      {/* Autonomous Engines Switchboard */}
      <div className="rounded-xl border border-white/8 bg-[#0e1a0b] p-5">
        <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
          <h2 className="text-sm font-medium text-white">
            Active workflows ({workflows.filter((w) => w.status).length} running)
          </h2>
          <span className="font-mono text-xs text-[#8F95A3]">Real-time switchboard</span>
        </div>

        <div className="divide-y divide-white/6">
          {workflows.map((wf) => {
            const Icon = wf.icon
            return (
              <div
                key={wf.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-7 items-center justify-center rounded-md bg-[#142410] border border-white/8 text-[#459F34] shrink-0 mt-0.5">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{wf.title}</span>
                      <span className="font-mono text-[10px] text-[#8F95A3]">({wf.category})</span>
                    </div>
                    <p className="text-[#8F95A3] mt-0.5">{wf.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center font-mono">
                  <span className="text-[#8F95A3] text-[11px]">
                    Today: <strong className="text-white">{wf.tasksToday}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => triggerTestRun(wf)}
                    className="flex items-center gap-1 text-[#8F95A3] hover:text-white transition-colors cursor-pointer"
                  >
                    <Play className="size-3" /> Test
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWorkflow(wf.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out ${
                      wf.status ? 'bg-[#459F34]' : 'bg-[#262A36]'
                    }`}
                  >
                    <span
                      className={`inline-block size-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                        wf.status ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Throughput Chart and Live Feed */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <BotTracker />

          <div className="rounded-xl border border-white/8 bg-[#0e1a0b] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-white">30-day task throughput</h3>
                <p className="text-xs text-[#8F95A3] font-mono">Cumulative automated executions</p>
              </div>
              <span className="font-mono text-xs text-[#10B981]">+310% MoM</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equity}>
                  <defs>
                    <linearGradient id="colorTasksClean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#459F34" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#459F34" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="day" stroke="#545A67" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#545A67" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e1a0b',
                      borderColor: '#ffffff15',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#459F34"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorTasksClean)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Execution Stream */}
        <div className="rounded-xl border border-white/8 bg-[#0e1a0b] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-3">
              <h3 className="text-sm font-medium text-white">Execution stream</h3>
              <span className="font-mono text-[10px] text-[#10B981] flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#10B981]" /> Live
              </span>
            </div>
            <TradeFeed />
          </div>

          <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs text-[#8F95A3] font-mono">
            <span>Immutable audit active</span>
            <Link to="/dashboard/history" className="text-[#F4F5F7] hover:underline flex items-center gap-1">
              Full ledger <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
