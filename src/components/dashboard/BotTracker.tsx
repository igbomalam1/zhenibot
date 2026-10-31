import { useEffect, useState } from 'react'
import { Cpu, Activity } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'

export function BotTracker() {
  const [tasksHandled, setTasksHandled] = useState(148)
  const dailyQuota = 500

  useEffect(() => {
    const id = window.setInterval(() => {
      setTasksHandled((prev) => prev + Math.floor(1 + Math.random() * 3))
    }, 2800)
    return () => window.clearInterval(id)
  }, [])

  const pct = Math.min((tasksHandled / dailyQuota) * 100, 100)

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/8 shadow-xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
            <Cpu className="size-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-display font-bold text-white tracking-tight">
              Automation Engine Health
            </h3>
            <p className="font-mono text-[10px] text-slate-400 uppercase">
              14 Distributed Regional Clusters Synced
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ALL SYSTEMS OPERATIONAL
        </span>
      </div>

      <div className="mb-2.5 flex items-end justify-between font-mono">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Daily Task Throughput</p>
          <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
            {tasksHandled}{' '}
            <span className="text-xs font-semibold text-brand-300">/ {dailyQuota} Plan Quota</span>
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <Activity className="size-3" /> 99.98% Success Rate
        </span>
      </div>

      <Progress value={pct} tone="brand" className="h-2.5" />

      <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
        {[
          { label: 'Avg Latency', value: '1.2s' },
          { label: 'Active Workflows', value: '5 Live' },
          { label: 'Time Saved Today', value: '14.2 hrs' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/6 bg-[#0b101e] px-2.5 py-2.5">
            <p className="font-mono text-xs font-bold text-white tracking-tight">{s.value}</p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
