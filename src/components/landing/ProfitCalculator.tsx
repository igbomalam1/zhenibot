import { useState } from 'react'
import { CalendarDays, TrendingUp, Wallet, ArrowRight, ShieldCheck } from 'lucide-react'
import { BRAND } from '@/lib/constants'
import { formatCurrency, formatNumber } from '@/lib/format'
import { buttonClass } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export function ProfitCalculator() {
  const [amount, setAmount] = useState(1000)
  const daily = amount * BRAND.dailyRate
  const weekly = daily * 7
  const monthly = daily * 30
  const yearly = daily * 365

  return (
    <section id="calculator" className="relative py-28 border-t border-white/8 bg-[#06080d]/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold">
            PROFIT CALCULATOR
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-display">
            Calculate Your Earnings
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            See how much you can earn based on the{' '}
            <span className="text-brand-400 font-semibold font-mono">1.2% daily profit</span> rate.
          </p>
        </div>

        <div className="glass-card mx-auto mt-14 grid max-w-4xl gap-8 rounded-2xl p-6 sm:p-10 lg:grid-cols-2 border border-white/10 shadow-2xl">
          {/* Controls Column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    YOUR DEPOSIT
                  </p>
                  <p className="mt-1 font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {formatCurrency(amount, 0)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-brand-400/30 bg-brand-400/10 px-3 py-1 font-mono text-xs font-bold text-brand-400">
                  <TrendingUp className="size-3.5" />
                  1.2% DAILY
                </div>
              </div>

              {/* Slider Input */}
              <div className="mt-8">
                <input
                  type="range"
                  min={BRAND.minDeposit}
                  max={BRAND.maxDeposit}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-white/10 accent-brand-400 cursor-pointer"
                  aria-label="Investment amount"
                />

                <div className="mt-2.5 flex justify-between font-mono text-xs text-slate-500">
                  <span>Min: {formatCurrency(BRAND.minDeposit, 0)}</span>
                  <span>Max: {formatCurrency(BRAND.maxDeposit, 0)}</span>
                </div>
              </div>

              {/* Preset Chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[500, 1000, 2500, 5000, 10000].map((v) => {
                  const active = amount === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={`rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition-all border ${
                        active
                          ? 'border-brand-400/60 bg-brand-400/15 text-brand-400'
                          : 'border-white/10 bg-[#121522] text-slate-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      ${formatNumber(v, 0)}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/8 bg-[#090b12] p-4 text-xs text-slate-400 leading-relaxed font-sans">
              <div className="flex items-center gap-2 text-white font-medium mb-1">
                <ShieldCheck className="size-4 text-brand-400" />
                <span>Fast Withdrawals</span>
              </div>
              Profits are added to your balance every day. You can withdraw your money anytime once your balance reaches{' '}
              <span className="font-mono text-slate-200">{formatCurrency(BRAND.minWithdrawal)}</span>.
            </div>
          </div>

          {/* Matrix Output Column */}
          <div className="flex flex-col justify-between gap-6 border-t border-white/8 pt-6 lg:border-t-0 lg:border-l lg:border-white/8 lg:pl-8 lg:pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Daily Profit', value: daily, icon: CalendarDays, tone: 'text-brand-400', badge: 'Every 24h' },
                { label: 'Weekly Profit', value: weekly, icon: CalendarDays, tone: 'text-white', badge: '7 Days' },
                { label: 'Monthly Profit', value: monthly, icon: Wallet, tone: 'text-white', badge: '30 Days' },
                { label: 'Yearly Profit', value: yearly, icon: TrendingUp, tone: 'text-brand-400', badge: '365 Days' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-white/8 bg-[#0b0e18] p-4 transition-colors hover:border-white/15"
                >
                  <div className="flex items-center justify-between">
                    <row.icon className="size-4 text-slate-500" />
                    <span className="font-mono text-[10px] text-slate-500 uppercase">{row.badge}</span>
                  </div>
                  <p className={`mt-3 font-mono text-2xl font-bold tracking-tight ${row.tone}`}>
                    {formatCurrency(row.value)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {row.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/auth"
              className={buttonClass('primary', 'lg', 'w-full')}
            >
              Start Earning 1.2% Daily <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}