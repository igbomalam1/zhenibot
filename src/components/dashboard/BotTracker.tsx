import { useEffect, useState } from 'react'
import { Cpu } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'

export function BotTracker() {
  const [progress, setProgress] = useState(42)
  const [achieved, setAchieved] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (achieved) return p
        const next = p + 1.8 + Math.random() * 4
        if (next >= 100) {
          setAchieved(true)
          return 100
        }
        return next
      })
    }, 1600)
    return () => window.clearInterval(id)
  }, [achieved])

  const pct = Math.min(progress, 100)

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-400/10 text-brand-400">
            <Cpu className="size-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-display font-bold text-white tracking-tight">
              Trading Bot Tracker
            </h3>
            <p className="font-mono text-[10px] text-slate-500 uppercase">
              Auto trading with 5% risk stop
            </p>
          </div>
        </div>

        <span
          className={cn(
            'flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider',
            achieved
              ? 'border-profit-500/30 bg-profit-500/15 text-profit-400'
              : 'border-brand-400/30 bg-brand-400/10 text-brand-400',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              achieved ? 'bg-profit-400' : 'animate-pulse bg-brand-400',
            )}
          />
          {achieved ? 'Target Reached' : 'Trading Active'}
        </span>
      </div>

      <div className="mb-2.5 flex items-end justify-between font-mono">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Today's 2% Target</p>
          <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {pct.toFixed(1)}%{' '}
            <span className="text-xs font-semibold text-brand-400">/ 2.0% Goal</span>
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          Resets at 00:00 UTC
        </span>
      </div>

      <Progress value={pct} tone={achieved ? 'success' : 'brand'} className="h-2.5" />

      <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
        {[
          { label: 'Run Time', value: '21 min' },
          { label: 'Active Trades', value: '3 Pairs' },
          { label: 'Current Risk', value: '-0.38%' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-white/6 bg-[#090b12] px-2.5 py-2.5">
            <p className="font-mono text-xs font-bold text-white tracking-tight">{s.value}</p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}