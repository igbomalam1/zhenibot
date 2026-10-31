import { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Zap, Gift } from 'lucide-react'
import { useTransactions } from '@/hooks/useFund'
import { formatCurrency, formatDate, shortId } from '@/lib/format'
import { Badge, statusTone } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { TransactionType } from '@/types/database'

type Filter = 'all' | TransactionType

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Operations' },
  { id: 'deposit', label: 'Credit Top-Ups' },
  { id: 'withdrawal', label: 'Revenue Payouts' },
  { id: 'dividend', label: 'Compute Credits' },
  { id: 'referral_bonus', label: 'Agency Commissions' },
]

export function HistoryPage() {
  const { transactions } = useTransactions()
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
    deposit: 'CREDIT TOP-UP',
    withdrawal: 'PAYOUT DISPATCH',
    dividend: 'COMPUTE REBATE',
    referral_bonus: 'AGENCY COMMISSION',
  }

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] text-brand-300 uppercase tracking-widest font-bold">
            AUDIT TRAIL & LOGS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Execution Logs & Ledger
        </h1>
        <p className="mt-1 text-xs text-slate-300">
          Immutable audit record of all automated workflows, credit top-ups, courier calls, and agency payouts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Credits Provisioned', value: formatCurrency(totals.deposit), icon: ArrowDownToLine, color: 'text-cyan-400' },
          { label: 'Revenue Settled', value: formatCurrency(totals.withdrawal), icon: ArrowUpFromLine, color: 'text-amber-400' },
          { label: 'Compute Credits', value: formatCurrency(totals.dividend), icon: Zap, color: 'text-emerald-400' },
          { label: 'Agency Commissions', value: formatCurrency(totals.bonus), icon: Gift, color: 'text-brand-300' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/8 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{s.label}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/8 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'rounded-xl px-3.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer',
              filter === tab.id
                ? 'bg-brand-500/15 border border-brand-500/40 text-brand-300 shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="glass-card rounded-2xl border border-white/8 shadow-xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono">
            No transaction records match the active filter.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.02] transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/8 text-slate-300 font-mono text-xs shrink-0 mt-0.5">
                    {row.type === 'deposit' ? '⚡' : row.type === 'withdrawal' ? '📤' : row.type === 'referral_bonus' ? '🎁' : '⚙️'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-brand-300 uppercase">
                        {typeLabel[row.type]}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">#{shortId(row.id)}</span>
                    </div>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">
                      {row.network || 'Zhen Automation Core'} {row.tx_hash && `· Tx: ${shortId(row.tx_hash)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 font-mono">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(row.amount)}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(row.created_at)}</p>
                  </div>
                  <Badge tone={statusTone(row.status)}>
                    {row.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
