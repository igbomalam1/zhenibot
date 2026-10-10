import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/ui/Button'

const LINKS = [
  { href: '#how', label: 'How It Works' },
  { href: '#calculator', label: 'Calculator' },
  { href: '#affiliate', label: 'Referrals' },
  { href: '#faq', label: 'FAQ' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-3 font-display font-bold text-white group', className)}
    >
      <div className="relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand-400/30 bg-[#0d121f] shadow-sm transition-all group-hover:border-brand-400/60 group-hover:shadow-brand-400/20">
        <img
          src="/logo.svg"
          alt="Zhenbot Logo"
          className="size-6 object-contain"
        />
        <span className="absolute -top-1 -right-1 flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-white leading-none">
          ZHEN<span className="text-brand-400 font-extrabold">BOT</span>
        </span>
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 leading-tight mt-0.5">
          AUTO TRADING
        </span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-200',
        scrolled
          ? 'border-b border-white/[0.08] bg-[#08090e]/90 backdrop-blur-xl shadow-lg shadow-black/40'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:text-brand-400"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="hidden xl:flex items-center gap-2 border-r border-white/10 pr-4 mr-1">
            <span className="relative flex size-2">
              <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              BOT: <span className="text-brand-400 font-semibold">ACTIVE</span>
            </span>
          </div>
          <Link to="/auth" className={buttonClass('ghost', 'sm')}>
            Sign In
          </Link>
          <Link to="/auth" className={buttonClass('primary', 'sm')}>
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#08090e]/98 px-5 pb-6 pt-4 backdrop-blur-2xl lg:hidden shadow-2xl">
          <nav className="flex flex-col gap-1.5">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-brand-400"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex gap-3">
              <Link to="/auth" className={buttonClass('ghost', 'md', 'flex-1')}>
                Sign In
              </Link>
              <Link to="/auth" className={buttonClass('primary', 'md', 'flex-1')}>
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0c0e17]/80 px-5 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
        <ShieldCheck className="size-4 text-brand-400 shrink-0" />
        <span>
          Protected Funds · Over <span className="text-white font-mono font-semibold">$84.7M</span> traded
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {[
          { name: 'Bybit', speed: 'Live' },
          { name: 'Binance', speed: 'Live' },
          { name: 'Bitget', speed: 'Live' },
          { name: 'MEXC', speed: 'Live' },
        ].map((ex) => (
          <span
            key={ex.name}
            className="flex items-center gap-1.5 rounded-md border border-white/8 bg-[#111422] px-2.5 py-1 font-mono text-[11px] text-slate-300"
          >
            <span className="size-1.5 rounded-full bg-brand-400" />
            <span className="font-semibold text-white">{ex.name}</span>
            <span className="text-slate-500 font-normal">{ex.speed}</span>
          </span>
        ))}
      </div>
    </div>
  )
}