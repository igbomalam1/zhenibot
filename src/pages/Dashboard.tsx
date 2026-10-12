import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  EyeOff,
  FileText,
  Gift,
  History,
  Activity,
  Coins,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
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
import { formatCurrency, formatDate } from '@/lib/format'
import { getEquitySeries } from '@/lib/demo'
import { BRAND } from '@/lib/constants'
import { Badge } from '@/components/ui/Badge'
import { BotTracker } from '@/components/dashboard/BotTracker'
import { TradeFeed } from '@/components/dashboard/TradeFeed'

export function Dashboard() {
  const { profile, user } = useAuth()
  const { stats, loading } = useDashboardStats()
  const [hideBalance, setHideBalance] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const equity = useMemo(() => getEquitySeries(), [])

  const name = profile?.full_name?.split(' ')[0] ?? 'Investor'
  const netWorth = stats.walletBalance + stats.activeDeposit
  const dailyProjected = stats.activeDeposit * BRAND.dailyRate

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
            <span className="size-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              PORTFOLIO ACCOUNT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="mt-0.5 font-mono text-xs text-slate-500">{todayLabel}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand-400/25 bg-brand-400/10 px-3 py-1.5 font-mono text-xs font-bold text-brand-400">
            <Sparkles className="size-3.5 text-brand-400" />
            1.6% DAILY YIELD
          </span>
        </div>
      </div>

      {/* MASTER FINTECH HERO BALANCE CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-[#0e1424] via-[#0a0d17] to-[#070910] p-6 sm:p-8 shadow-2xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Account Net Worth
            </span>
            <button
              type="button"
              onClick={() => setHideBalance((v) => !v)}
              className="rounded-lg p-1 text-slate-500 hover:text-slate-300 transition-colors"
              title={hideBalance ? 'Show balance' : 'Hide balance'}
            >
              {hideBalance ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-emerald-400 font-mono text-xs font-bold shadow-sm">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALGO YIELD ACTIVE · 24H CYCLE</span>
          </div>
        </div>

        {/* Hero Figure */}
        <div className="relative z-10 mt-4 mb-6">
          <div className="flex items-baseline gap-2">
            <p className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              {loading ? (
                'Loading…'
              ) : hideBalance ? (
                '••••••••'
              ) : (
                formatCurrency(netWorth)
              )}
            </p>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-brand-400" />
            Daily Projected Dividend:{' '}
            <strong className="text-brand-400 font-bold">
              {hideBalance ? '••••' : `+${formatCurrency(dailyProjected)} / day`}
            </strong>
          </p>
        </div>

        {/* BANK-APP CLICKY ACTION BUTTONS ROW */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1 pb-2">
          <Link
            to="/dashboard/deposit"
            className="group flex items-center justify-center gap-2.5 rounded-2xl bg-brand-400 px-4 py-3.5 text-xs font-display font-black text-obsidian-950 shadow-lg shadow-brand-400/20 transition-all duration-150 hover:bg-brand-300 active:scale-95"
          >
            <ArrowDownToLine className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Add Funds</span>
          </Link>

          <Link
            to="/dashboard/withdraw"
            className="group flex items-center justify-center gap-2.5 rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 text-xs font-display font-bold text-white shadow-md transition-all duration-150 hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            <ArrowUpFromLine className="size-4 text-slate-300 transition-transform group-hover:-translate-y-0.5" />
            <span>Cash Out</span>
          </Link>

          <Link
            to="/dashboard/referrals"
            className="group flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs font-display font-bold text-slate-200 shadow-md transition-all duration-150 hover:bg-white/8 hover:text-white active:scale-95"
          >
            <Gift className="size-4 text-brand-400" />
            <span>Earn 15%</span>
          </Link>

          <Link
            to="/dashboard/history"
            className="group flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-xs font-display font-bold text-slate-200 shadow-md transition-all duration-150 hover:bg-white/8 hover:text-white active:scale-95"
          >
            <FileText className="size-4 text-slate-400" />
            <span>Statement</span>
          </Link>
        </div>

        {/* SMALLER BALANCE DETAILS ON THE CARD (Unified Sub-metrics Strip) */}
        <div className="relative z-10 mt-7 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Available Cash
            </span>
            <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-white">
              {loading ? '…' : hideBalance ? '••••' : formatCurrency(stats.walletBalance)}
            </p>
            <span className="font-mono text-[10px] text-brand-400 font-semibold block mt-0.5">
              Ready to withdraw
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active In Trading
            </span>
            <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-white">
              {loading ? '…' : hideBalance ? '••••' : formatCurrency(stats.activeDeposit)}
            </p>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold block mt-0.5">
              1.6% Daily Yield
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Profit Earned
            </span>
            <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-brand-400">
              {loading ? '…' : hideBalance ? '••••' : formatCurrency(stats.totalEarned)}
            </p>
            <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
              Cumulative Dividends
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-colors hover:border-white/10">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Withdrawn
            </span>
            <p className="mt-1 font-mono text-lg sm:text-xl font-bold text-slate-300">
              {loading ? '…' : hideBalance ? '••••' : formatCurrency(stats.totalWithdrawn)}
            </p>
            <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
              Settled to personal wallet
            </span>
          </div>
        </div>
      </div>

      {/* REFERRAL QUICK BOOST & INVITE CARD */}
      <div className="rounded-2xl border border-brand-400/25 bg-gradient-to-r from-brand-400/10 via-[#0a0f1c] to-[#0d1424] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-400 text-obsidian-950 font-bold shadow-md shadow-brand-400/30">
            <Coins className="size-5" />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
              Earn 15% Tier-1 + 2% Tier-2 Commissions
              <span className="rounded bg-brand-400/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-brand-400">
                INSTANT
              </span>
            </h4>
            <p className="font-mono text-xs text-slate-400 mt-0.5">
              Code: <strong className="text-white">{profile?.referral_code || '—'}</strong> · Share your link to receive instant commissions whenever your partners fund.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void copyReferral()}
          className="flex items-center gap-2 rounded-xl border border-brand-400/30 bg-brand-400/15 px-4 py-2 font-mono text-xs font-bold text-brand-400 hover:bg-brand-400/25 transition-all active:scale-95"
        >
          {copiedLink ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
          <span>{copiedLink ? 'Copied Link!' : 'Copy Referral Link'}</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN TRADING & ANALYTICS GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Bot Tracker & Growth Chart */}
        <div className="space-y-6">
          <BotTracker />

          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl">
            <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-[#121522] text-slate-300">
                  <Activity className="size-4.5 text-brand-400" />
                </span>
                <div>
                  <h3 className="text-sm font-display font-bold text-white tracking-tight">
                    Algorithmic Yield Chart
                  </h3>
                  <p className="font-mono text-[10px] text-slate-500 uppercase">
                    30-DAY CUMULATIVE EQUITY
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
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: 'monospace',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Cumulative Equity']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00e599"
                    strokeWidth={2}
                    fill="url(#eq)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#00e599' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Live Trades Feed */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl max-h-fit">
          <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-[#121522] text-brand-400">
                <History className="size-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-display font-bold text-white tracking-tight">
                  Live Algorithmic Execution
                </h3>
                <p className="font-mono text-[10px] text-slate-500 uppercase">
                  HIGH FREQUENCY SCALPER FEED
                </p>
              </div>
            </div>
            <Badge tone="brand" pulse>LIVE</Badge>
          </div>
          <TradeFeed />
        </div>
      </div>

      {/* Account Info Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/6 font-mono text-[11px] text-slate-500">
        <p>
          ACCOUNT ID: <span className="text-slate-400">{user?.id.slice(0, 16)}…</span>
        </p>
        <p>
          MEMBER SINCE: <span className="text-slate-400">{formatDate(profile?.created_at)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-brand-400">
          <ShieldCheck className="size-3.5" /> 256-BIT ENCRYPTED QUANT POOL
        </p>
      </div>
    </div>
  )
}