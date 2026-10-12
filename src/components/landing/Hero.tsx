import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, Radio, TrendingUp, Cpu } from 'lucide-react'
import { formatCompact, formatPercent } from '@/lib/format'
import { FUND_METRICS, getTrades } from '@/lib/demo'
import { buttonClass } from '@/components/ui/Button'
import { TrustStrip } from '@/components/landing/Navbar'
import { QuantRadarCanvas } from '@/components/landing/QuantRadarCanvas'

function useLiveCounter(base: number, step = 3, interval = 1300) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const id = window.setInterval(
      () => setValue((v) => v + step + Math.floor(Math.random() * 4)),
      interval,
    )
    return () => window.clearInterval(id)
  }, [step, interval])
  return value
}

export function Hero() {
  const executions = useLiveCounter(FUND_METRICS.executions, 5, 1100)
  const volume = useLiveCounter(FUND_METRICS.avgDailyVolume, 7, 1600)
  const trades = useMemo(() => getTrades(6), [])

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      {/* Background Subtle Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <QuantRadarCanvas className="w-full h-full" />
      </div>

      {/* Grid Overlay */}
      <div className="grid-pattern absolute inset-0 pointer-events-none" aria-hidden />

      {/* Subtle Hairline Ambient Top Beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-4xl bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-display leading-[1.12]">
              Automated Trading Bot.
              <span className="text-gradient block mt-2">Earn 1.6% Daily Profit.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
              Earn{' '}
              <span className="font-semibold text-brand-400 underline decoration-brand-400/40 decoration-2 underline-offset-4">
                1.6% daily profit
              </span>{' '}
              automatically. Our bot trades Crypto, Stocks, and Commodities 24/7 with a safe 5% risk stop.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/auth" className={buttonClass('primary', 'lg')}>
                Start Earning <ArrowRight className="size-4" />
              </Link>
              <a
                href="#proof"
                className={buttonClass('secondary', 'lg')}
              >
                <PlayCircle className="size-4 text-brand-400" /> See Live Trades
              </a>
            </div>

            {/* Metric Strip */}
            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 border-t border-white/8 pt-8">
              {[
                { label: 'Total Trades', value: formatCompact(executions), sub: 'Live trades' },
                { label: '24h Volume', value: `$${formatCompact(volume)}`, sub: 'Automated' },
                { label: 'Win Rate', value: `${FUND_METRICS.winRate}%`, sub: 'Success rate' },
              ].map((s) => (
                <div key={s.label} className="border-l border-white/10 pl-4 py-1">
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">{s.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1.5">
                    {s.label}
                  </p>
                  <p className="text-[11px] font-mono text-brand-400 mt-0.5">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Execution Terminal */}
          <div className="relative animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card relative rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/10">
              {/* Terminal Header */}
              <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-brand-400/10 text-brand-400 border border-brand-400/20">
                    <Cpu className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-display font-bold text-white tracking-tight">
                      Live Trading Feed
                    </h3>
                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                      BYBIT · BINANCE · BITGET · MEXC
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-md border border-brand-400/25 bg-brand-400/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-400">
                  <Radio className="size-3 animate-pulse" /> LIVE
                </span>
              </div>

              {/* Order Flow Stream */}
              <div className="space-y-2">
                {trades.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border border-white/6 bg-[#090b12]/70 px-3.5 py-2.5 transition-colors hover:border-brand-400/30"
                    style={{ opacity: 1 - i * 0.08 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                        {t.pair}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">
                        {t.exchange}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden font-mono text-xs text-slate-400 sm:inline">
                        {t.entry} <span className="text-slate-600">→</span> {t.exit}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[11px] font-bold bg-brand-400/15 text-brand-400 border border-brand-400/20">
                        <TrendingUp className="size-3" />
                        {formatPercent(t.profitPct, 2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cycle Target Progress Bar */}
              <div className="mt-5 rounded-xl border border-white/8 bg-[#090b12] p-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider text-[11px]">Today's 2% Target</span>
                  <span className="font-bold text-brand-400">78% COMPLETE</span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-600 to-brand-400 shadow-sm" />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>START: 00:00 UTC</span>
                  <span className="text-slate-400">MAX RISK STOP: 5%</span>
                  <span>RESET: 24:00 UTC</span>
                </div>
              </div>
            </div>

            {/* Tactical Floating Credit Badge */}
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-brand-400/30 bg-[#0d101a]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:flex items-center gap-3.5 animate-float">
              <div className="flex size-9 items-center justify-center rounded-lg bg-brand-400/15 text-brand-400">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white tracking-tight">+$14,872.40</p>
                <p className="text-[11px] font-mono text-brand-400 uppercase tracking-wider">Earned Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="mt-16">
          <TrustStrip />
        </div>

        {/* Live Connectivity Proof Grid */}
        <div id="proof" className="mt-20 scroll-mt-24">
          <div className="flex items-center justify-between mb-6 border-b border-white/8 pb-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-brand-400 font-semibold">
                CONNECTED EXCHANGES
              </p>
              <h2 className="text-xl font-display font-bold text-white mt-0.5">
                Live Trading Across Major Platforms
              </h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <span className="size-1.5 rounded-full bg-brand-400" /> 99.9% Uptime
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { name: 'Bybit', speed: 'Fast', type: 'Crypto Trading', status: 'Active' },
              { name: 'Binance', speed: 'Fast', type: 'Crypto Trading', status: 'Active' },
              { name: 'Bitget', speed: 'Fast', type: 'Crypto Trading', status: 'Active' },
              { name: 'MEXC', speed: 'Fast', type: 'Crypto Trading', status: 'Active' },
            ].map((node) => (
              <div
                key={node.name}
                className="glass-card flex flex-col justify-between rounded-xl p-4.5 border border-white/8 transition-all hover:border-brand-400/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-display font-bold text-white">{node.name}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">{node.type}</p>
                  </div>
                  <span className="size-2 rounded-full bg-brand-400" />
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">STATUS</span>
                  <span className="font-mono text-sm font-bold text-brand-400">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}