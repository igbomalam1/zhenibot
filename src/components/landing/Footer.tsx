import { useState } from 'react'
import { ChevronDown, Lock, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/landing/Navbar'

const YEAR = new Date().getFullYear()

const FAQS = [
  {
    q: 'How do I earn 1.2% daily profit?',
    a: 'Zhenbot trades Crypto, Stocks, and Commodities automatically 24/7. It targets 2% daily profit with a safe 5% stop loss. You receive 1.2% profit credited directly to your balance every 24 hours.',
  },
  {
    q: 'What is the minimum withdrawal?',
    a: 'The minimum withdrawal is $10.00. Each withdrawal is confirmed with a one-time email code to keep your funds safe, and sent directly to your wallet.',
  },
  {
    q: 'How safe is my money?',
    a: 'The bot uses an automatic 5% stop loss to protect against market drops. Once the 2% daily target is reached, trading stops for the day to lock in your earnings.',
  },
  {
    q: 'When do I get my daily profit?',
    a: 'Profits are credited every 24 hours. The trading day begins at 00:00 UTC and runs 7 days a week.',
  },
  {
    q: 'How do referral bonuses work?',
    a: 'When someone joins with your link and deposits, you get 15% immediately. When they invite a friend who deposits, you get an extra 2%.',
  },
  {
    q: 'Can I withdraw my profit and referral bonuses anytime?',
    a: 'Yes. All earnings are added to your available balance and can be withdrawn anytime as long as you have at least $10.',
  },
  {
    q: 'Can I withdraw my capital?',
    a: "Yes, your capital is separated from your profits and returns every 30 days. If you wish to invest it to keep earning, you're free.",
  },
]

const SECURITY = [
  { icon: Lock, label: 'Secure Cold Storage', tag: 'PROTECTED' },
  { icon: ShieldCheck, label: 'Safe API Trading', tag: 'SECURE' },
  { icon: Zap, label: '5% Daily Stop Loss', tag: 'ACTIVE' },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl space-y-2.5">
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={f.q}
            className={cn(
              'glass-card overflow-hidden rounded-xl border border-white/8 transition-colors',
              isOpen && 'border-brand-400/30 bg-[#0d101a]',
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-display font-bold text-white sm:text-base">
                {f.q}
              </span>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180 text-brand-400',
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400 border-t border-white/5 pt-3">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LinkColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-xs text-slate-400 transition-colors hover:text-brand-400"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-[#05070c]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* FAQ Section */}
        <div id="faq" className="mb-20 scroll-mt-24">
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold">
              HELP & QUESTIONS
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <Faq />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {SECURITY.map((s) => (
              <span
                key={s.label}
                className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-[#0c0f18] px-3.5 py-2 font-mono text-xs text-slate-300"
              >
                <s.icon className="size-4 text-brand-400" />
                <span>{s.label}</span>
                <span className="text-[10px] text-brand-400/80 bg-brand-400/10 px-1.5 py-0.5 rounded font-bold">
                  {s.tag}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-10 border-t border-white/8 pt-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400">
              An automated trading bot that trades Crypto, Stocks, and Commodities to pay you 1.2% daily profit with a safe 5% stop loss.
            </p>
            <div className="mt-5 flex items-center gap-2.5 font-mono text-xs">
              {['Twitter', 'Telegram', 'Support'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded border border-white/10 px-2.5 py-1 text-[10px] text-slate-400 transition-colors hover:border-brand-400/40 hover:text-brand-400"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <LinkColumn
            title="Platform"
            links={['How It Works', 'Calculator', 'Referrals', 'FAQ']}
          />
          <LinkColumn
            title="About"
            links={['About Us', 'Risk Notice', 'Terms', 'Privacy', 'Contact']}
          />
          <div>
            <p className="mb-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Risk Notice
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Trading financial markets involves risk. Never invest money you cannot afford to lose. The 1.2% daily profit is a trading target, not a fixed guarantee.
            </p>
          </div>
        </div>

        {/* Baseline Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row font-mono text-xs text-slate-500">
          <p>
            © {YEAR} Zhenbot Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold">
              Go to Your Account <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}