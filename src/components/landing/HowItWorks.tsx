import type { LucideIcon } from 'lucide-react'
import { Bot, Coins, Lock, Wallet } from 'lucide-react'

const STEPS: {
  icon: LucideIcon
  step: string
  title: string
  description: string
  tag: string
}[] = [
  {
    icon: Wallet,
    step: 'Step 1',
    title: 'Deposit Money',
    description:
      'Deposit from just $50. Your funds start working in the next trading cycle right away.',
    tag: 'FROM $50 · NO DEPOSIT FEES',
  },
  {
    icon: Bot,
    step: 'Step 2',
    title: 'Bot Trades Automatically',
    description:
      'Our bot trades Crypto, Stocks, and Commodities. It aims for 2% daily profit with a safe 5% risk stop.',
    tag: 'SAFE 5% RISK STOP',
  },
  {
    icon: Lock,
    step: 'Step 3',
    title: 'Locks In Profit',
    description:
      'Once the daily target is reached, the bot locks in profits. No risky trades are left open overnight.',
    tag: 'PROFITS PROTECTED',
  },
  {
    icon: Coins,
    step: 'Step 4',
    title: 'Get 1.2% Daily Profit',
    description:
      'You get 1.2% daily profit added to your balance every 24 hours. Withdraw anytime from $10.',
    tag: 'WITHDRAW ANYTIME FROM $10',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 border-t border-white/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-display">
            How Zhenbot Works
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            A simple 4-step process designed to grow your money every day automatically.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="glass-card glass-card-hover group relative flex flex-col justify-between rounded-2xl p-7 border border-white/8"
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-6">
                    <span className="font-mono text-xs font-bold text-brand-400 tracking-wider">
                      {s.step}
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#10131e] text-brand-400 group-hover:border-brand-400/50 group-hover:bg-brand-400/10 transition-colors">
                      <s.icon className="size-5" />
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {s.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/5 pt-4">
                  <span className="font-mono text-[10px] font-semibold text-brand-400 uppercase tracking-wider block">
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}