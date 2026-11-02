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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-1.5 rounded-full bg-[#459F34]" />
          <span className="font-mono text-[11px] text-[#8F95A3] tracking-widest uppercase">
            Audit trail & logs
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7]">
          Execution logs & ledger
        </h1>
        <p className="mt-1 text-sm text-[#8F95A3]">
          Immutable audit record of all automated workflows, credit top-ups, courier calls, and agency payouts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Credits provisioned', value: formatCurrency(totals.deposit), icon: ArrowDownToLine, color: 'text-[#F4F5F7]' },
          { label: 'Revenue settled', value: formatCurrency(totals.withdrawal), icon: ArrowUpFromLine, color: 'text-[#459F34]' },
          { label: 'Compute credits', value: formatCurrency(totals.dividend), icon: Zap, color: 'text-emerald-400' },
          { label: 'Agency commissions', value: formatCurrency(totals.bonus), icon: Gift, color: 'text-[#8F95A3]' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl p-4 border border-white/8 bg-[#0e1a0b]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F95A3]">{s.label}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="font-mono text-2xl font-bold text-[#F4F5F7] tnum">{s.value}</p>
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
              'rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors cursor-pointer',
              filter === tab.id
                ? 'bg-white/10 border border-white/15 text-[#F4F5F7]'
                : 'text-[#8F95A3] hover:bg-white/5 hover:text-[#F4F5F7]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-white/8 bg-[#0e1a0b] overflow-hidden">
        {rows.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#545A67] font-mono">
            No transaction records match the active filter.
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.02] transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#081106] border border-white/8 text-[#00B82E] shrink-0 mt-0.5">
                    {row.type === 'deposit' ? (
                      <ArrowDownToLine className="size-4" />
                    ) : row.type === 'withdrawal' ? (
                      <ArrowUpFromLine className="size-4" />
                    ) : row.type === 'referral_bonus' ? (
                      <Gift className="size-4" />
                    ) : (
                      <Zap className="size-4" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-medium text-[#8F95A3] uppercase tracking-wider">
                        {typeLabel[row.type]}
                      </span>
                      <span className="font-mono text-[10px] text-[#545A67]">#{shortId(row.id)}</span>
                    </div>
                    <p className="font-mono text-xs text-[#8F95A3] mt-0.5">
                      {row.network || 'Zhen Automation Core'} {row.tx_hash && `· Tx: ${shortId(row.tx_hash)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 font-mono">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#F4F5F7] tnum">{formatCurrency(row.amount)}</p>
                    <p className="text-[10px] text-[#545A67]">{formatDate(row.created_at)}</p>
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
