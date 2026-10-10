import { useEffect, useMemo, useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatPercent } from '@/lib/format'
import { getTrades } from '@/lib/demo'
import type { Trade } from '@/types/database'

export function TradeFeed() {
  const [trades, setTrades] = useState<Trade[]>(() => getTrades(8))

  useEffect(() => {
    const base = getTrades(48)
    let index = 8
    const id = window.setInterval(() => {
      index = (index + 1) % base.length
      setTrades((prev) => {
        const next = [base[index], ...prev].slice(0, 8)
        return next
      })
    }, 3800)
    return () => window.clearInterval(id)
  }, [])

  const rows = useMemo(() => trades, [trades])

  return (
    <div className="space-y-2">
      {rows.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-lg border border-white/6 bg-[#090b12] px-3.5 py-2.5 transition-colors hover:border-white/15"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded border border-white/10 bg-[#121522] font-mono text-[10px] font-bold text-white">
              {t.symbol}
            </span>
            <div>
              <p className="text-xs font-display font-bold text-white">{t.pair}</p>
              <p className="font-mono text-[10px] text-slate-500 uppercase">
                {t.exchange} · {t.side}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden font-mono text-xs text-slate-400 sm:block">
              {t.entry} <span className="text-slate-600">→</span> {t.exit}
            </p>
            <span
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold border ${
                t.side === 'LONG'
                  ? 'bg-brand-400/10 text-brand-400 border-brand-400/25'
                  : 'bg-sky-400/10 text-sky-400 border-sky-400/25'
              }`}
            >
              {t.side === 'LONG' ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {formatPercent(t.profitPct, 2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}