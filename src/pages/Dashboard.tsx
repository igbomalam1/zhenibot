import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BadgeDollarSign,
  History,
  LayoutGrid,
  Percent,
  Plus,
  Wallet,
  Activity,
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
import { useDashboardStats } from '@/hooks/useFund'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'
import { getEquitySeries } from '@/lib/demo'
import { BRAND } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BotTracker } from '@/components/dashboard/BotTracker'
import { TradeFeed } from '@/components/dashboard/TradeFeed'

function StatCard({
  code,
  label,
  value,
  sub,
  icon,
  tone,
}: {
  code: string
  label: string
  value: string
  sub: string
  icon: ReactNode
  tone: 'brand' | 'profit' | 'neutral'
}) {
  const tones = {
    brand: 'border-brand-400/25 bg-brand-400/10 text-brand-400',
    profit: 'border-emerald-500/25 bg-emerald-500/10 text-brand-400',
    neutral: 'border-white/10 bg-white/[0.04] text-slate-300',
  } as const

  return (
    <div className="glass-card flex flex-col justify-between rounded-xl p-5 border border-white/8 transition-all hover:border-white/15">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
            {code}
          </span>
          <span className={`flex size-8 items-center justify-center rounded-lg border ${tones[tone]}`}>
            {icon}
          </span>
        </div>
        <p className="mt-3 font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</p>
      </div>
      <div className="mt-3 border-t border-white/5 pt-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 font-mono text-[10px] text-slate-500">{sub}</p>
      </div>
    </div>
  )
}

function QuickActions({ balance, onClose }: { balance: number; onClose: () => void }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="border-b border-white/8 pb-3 mb-5">
        <h3 className="text-lg font-display font-bold text-white">Quick Actions</h3>
        <p className="text-xs font-mono text-slate-400 mt-1">
          AVAILABLE BALANCE:{' '}
          <span className="font-bold text-brand-400">{formatCurrency(balance)}</span>
        </p>
      </div>

      <div className="space-y-3">
        <Link
          to="/dashboard/deposit"
          onClick={onClose}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0c0f18] p-4 transition-all hover:border-brand-400/40 hover:bg-[#101422] group"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-brand-400/10 border border-brand-400/30 text-brand-400 group-hover:bg-brand-400 group-hover:text-obsidian-950 transition-colors">
            <ArrowDownCircle className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-display font-bold text-sm text-white">Deposit</p>
            <p className="text-xs text-slate-400 mt-0.5">Add funds to start earning 1.2% daily profit →</p>
          </div>
        </Link>

        <Link
          to="/dashboard/withdraw"
          onClick={onClose}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0c0f18] p-4 transition-all hover:border-white/20 hover:bg-[#101422] group"
        >
          <span className="flex size-11 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-obsidian-950 transition-colors">
            <ArrowUpCircle className="size-5" />
          </span>
          <div className="flex-1">
            <p className="font-display font-bold text-sm text-white">Withdraw</p>
            <p className="text-xs text-slate-400 mt-0.5">Withdraw your profits and referral earnings →</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export function Dashboard() {
  const { profile, user } = useAuth()
  const { stats, loading } = useDashboardStats()
  const [quickOpen, setQuickOpen] = useState(false)
  const equity = useMemo(() => getEquitySeries(), [])
  const name = profile?.full_name?.split(' ')[0] ?? 'Investor'

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-1.5 rounded-full bg-brand-400" />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Live System Status
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="mt-1 font-mono text-xs text-slate-400">{todayLabel}</p>
        </div>

        <Button onClick={() => setQuickOpen(true)}>
          <Plus className="size-4" /> Quick Action
        </Button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          code="Balance"
          label="Available Balance"
          value={loading ? '…' : formatCurrency(stats.walletBalance)}
          sub="Ready to withdraw anytime"
          icon={<Wallet className="size-4.5" />}
          tone="brand"
        />
        <StatCard
          code="Profit"
          label="Today's Profit"
          value={loading ? '…' : formatCurrency(stats.todayEarnings)}
          sub={`${formatNumber(BRAND.dailyRate * 100, 1)}% daily profit paid`}
          icon={<BadgeDollarSign className="size-4.5" />}
          tone="profit"
        />
        <StatCard
          code="Referrals"
          label="Referral Earnings"
          value={loading ? '…' : formatCurrency(stats.affiliateCommission)}
          sub="15% direct + 5% team bonus"
          icon={<Percent className="size-4.5" />}
          tone="profit"
        />
        <StatCard
          code="Withdrawn"
          label="Total Withdrawn"
          value={loading ? '…' : formatCurrency(stats.totalWithdrawn)}
          sub={`${formatNumber(stats.depositCount, 0)} completed deposits`}
          icon={<LayoutGrid className="size-4.5" />}
          tone="neutral"
        />
      </div>

      {/* Main Grid: Bot Tracker + Equity Chart + Trade Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <BotTracker />

          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl">
            <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#121522] text-slate-300">
                  <Activity className="size-4.5 text-brand-400" />
                </span>
                <div>
                  <h3 className="text-sm font-display font-bold text-white tracking-tight">
                    Fund Growth
                  </h3>
                  <p className="font-mono text-[10px] text-slate-500 uppercase">
                    30-DAY PERFORMANCE
                  </p>
                </div>
              </div>
              <Badge tone="success">+38.4% NET</Badge>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equity} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e599" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#00e599" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={28}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0a0d15',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Portfolio Equity']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e599"
                    strokeWidth={1.75}
                    fill="url(#eq)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#00e599' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Trade Feed */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl max-h-fit">
          <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#121522] text-brand-400">
                <History className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-display font-bold text-white tracking-tight">
                  Live Trades
                </h3>
                <p className="font-mono text-[10px] text-slate-500 uppercase">
                  AUTOMATED TRADING FEED
                </p>
              </div>
            </div>
            <Badge tone="brand" pulse>LIVE</Badge>
          </div>
          <TradeFeed />
        </div>
      </div>

      <Modal open={quickOpen} onClose={() => setQuickOpen(false)}>
        <QuickActions balance={stats.walletBalance} onClose={() => setQuickOpen(false)} />
      </Modal>

      <p className="text-center font-mono text-[11px] text-slate-600">
        ACCOUNT ID: <span className="text-slate-400">{user?.id.slice(0, 16)}…</span> · JOINED:{' '}
        <span className="text-slate-400">{formatDate(profile?.created_at)}</span>
      </p>
    </div>
  )
}