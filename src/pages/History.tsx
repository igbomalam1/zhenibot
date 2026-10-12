import { useMemo, useState } from 'react'
import { History, ArrowDownToLine, ArrowUpFromLine, Coins, Gift } from 'lucide-react'
import { useTransactions } from '@/hooks/useFund'
import { formatCurrency, formatDate, shortId } from '@/lib/format'
import { Badge, statusTone } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/database'

type Filter = 'all' | TransactionType

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Operations' },
  { id: 'deposit', label: 'Deposits' },
  { id: 'withdrawal', label: 'Withdrawals' },
  { id: 'dividend', label: '1.6% Daily Dividends' },
  { id: 'referral_bonus', label: 'Referral Rewards' },
]

export function HistoryPage() {
  const { transactions, loading } = useTransactions()
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(() => {
    const list = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)
    return list
  }, [transactions, filter])

  const totals = useMemo(() => {
    let deposit = 0
    let withdrawal = 0
    let dividend = 0
    let bonus = 0
    for (const t of transactions) {
      if (t.status !== 'completed' && t.status !== 'approved') continue
      if (t.type === 'deposit') deposit += t.amount
      if (t.type === 'withdrawal') withdrawal += t.amount
      if (t.type === 'dividend') dividend += t.amount
      if (t.type === 'referral_bonus') bonus += t.amount
    }
    return { deposit, withdrawal, dividend, bonus }
  }, [transactions])

  const typeLabel: Record<TransactionType, string> = {
    deposit: 'DEPOSIT',
    withdrawal: 'WITHDRAWAL',
    dividend: 'DIVIDEND 1.6%',
    referral_bonus: 'REFERRAL BONUS',
  }

  const typeTone: Record<TransactionType, 'brand' | 'warning' | 'telemetry'> = {
    deposit: 'telemetry',
    withdrawal: 'warning',
    dividend: 'brand',
    referral_bonus: 'brand',
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-1.5 rounded-full bg-brand-400" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            History
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Transaction History
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-400">
          Full history of all your deposits, daily profits, referral earnings, and withdrawals.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Deposits', value: totals.deposit, icon: ArrowDownToLine, tone: 'text-white' },
          { label: 'Total Withdrawn', value: totals.withdrawal, icon: ArrowUpFromLine, tone: 'text-slate-300' },
          { label: 'Daily Profits', value: totals.dividend, icon: Coins, tone: 'text-brand-400' },
          { label: 'Referral Bonuses', value: totals.bonus, icon: Gift, tone: 'text-brand-400' },
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-xl p-4.5 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{item.label}</span>
              <item.icon className="size-4 text-slate-500" />
            </div>
            <p className={`font-mono text-xl sm:text-2xl font-bold tracking-tight ${item.tone}`}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      <Card className="border border-white/10 shadow-xl">
        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-white/8 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all',
                filter === t.id
                  ? 'border border-brand-400/50 bg-brand-400/15 text-brand-400 font-bold'
                  : 'border border-white/8 bg-[#0c0f18] text-slate-400 hover:border-white/20 hover:text-white',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-12 text-center font-mono text-xs text-slate-500">Loading transactions…</p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-[#121522] text-slate-500">
              <History className="size-5" />
            </span>
            <p className="font-mono text-xs text-slate-400">No transactions found for this filter.</p>
          </div>
        ) : (
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[720px] text-left text-sm font-sans">
              <thead>
                <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">ID</th>
                  <th className="pb-3 pr-4 font-semibold">TYPE</th>
                  <th className="pb-3 pr-4 font-semibold">AMOUNT</th>
                  <th className="pb-3 pr-4 font-semibold">NETWORK / METHOD</th>
                  <th className="pb-3 pr-4 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold">DATE</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4 font-mono text-xs text-slate-400">
                      <span className="text-slate-600">#</span>{shortId(t.id)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={typeTone[t.type]}>{typeLabel[t.type]}</Badge>
                    </td>
                    <td className={`py-3.5 pr-4 font-mono font-bold ${t.type === 'withdrawal' ? 'text-white' : 'text-brand-400'}`}>
                      {t.type === 'withdrawal' ? '−' : '+'}
                      {formatCurrency(Math.abs(t.amount))}
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-[11px] text-slate-400">{t.network ?? 'Internal Transfer'}</td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={statusTone(t.status)}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-500">{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}