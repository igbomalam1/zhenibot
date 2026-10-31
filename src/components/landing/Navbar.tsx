import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sparkles, Cpu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/ui/Button'

const LINKS = [
  { href: '#solutions', label: 'Solutions' },
  { href: '#simulator', label: 'Workflow Engine' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#calculator', label: 'ROI Calculator' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-3 font-display font-bold text-white group select-none', className)}
    >
      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 via-[#0e1424] to-cyan-500/10 shadow-lg shadow-brand-500/10 transition-all duration-300 group-hover:border-brand-400/60 group-hover:shadow-brand-500/30">
        {/* Futuristic circuit nodes */}
        <div className="relative size-5 text-brand-400">
          <svg viewBox="0 0 24 24" fill="none" className="size-full stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" fill="#6366F1" fillOpacity="0.4" />
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-cyan-400" />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-white leading-none">
          ZHEN<span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent ml-1 font-black">AUTOMATION</span>
        </span>
        <span className="text-[9.5px] font-mono tracking-widest uppercase text-slate-400 leading-tight mt-1 flex items-center gap-1">
          <span className="size-1 rounded-full bg-emerald-400" /> AUTONOMOUS BIZ OPS
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
        'fixed inset-x-0 top-0 z-50 transition-all duration-200',
        scrolled
          ? 'border-b border-white/[0.08] bg-[#090d16]/90 backdrop-blur-xl shadow-xl shadow-black/50'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors hover:text-brand-300 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="hidden xl:flex items-center gap-2 border-r border-white/10 pr-4 mr-1">
            <span className="relative flex size-2">
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              ENGINE: <span className="text-emerald-400 font-semibold">ONLINE (99.98%)</span>
            </span>
          </div>
          <Link to="/auth" className={buttonClass('ghost', 'sm')}>
            Sign In
          </Link>
          <Link
            to="/auth"
            className={buttonClass('primary', 'sm', 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-brand-500/30')}
          >
            Launch Studio <Sparkles className="size-3.5 ml-1 text-cyan-200" />
          </Link>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#090d16]/98 px-5 pb-6 pt-4 backdrop-blur-2xl lg:hidden shadow-2xl">
          <nav className="flex flex-col gap-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-brand-300"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex gap-3">
              <Link to="/auth" className={buttonClass('ghost', 'md', 'flex-1')}>
                Sign In
              </Link>
              <Link to="/auth" className={buttonClass('primary', 'md', 'flex-1')}>
                Launch Studio
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0c1220]/80 px-6 py-4 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
        <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Cpu className="size-4" />
        </span>
        <span>
          Autonomous Infrastructure · Over <span className="text-white font-mono font-bold">4.8M+ tasks</span> executed seamlessly
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {[
          { name: 'Gmail / Outlook', status: 'Syncing', icon: '✉️' },
          { name: 'SendMe / Logistics', status: 'Dispatched', icon: '🛵' },
          { name: 'WhatsApp Care', status: 'Instant', icon: '💬' },
          { name: 'Paystack / Invoicing', status: 'Reconciled', icon: '⚡' },
        ].map((node) => (
          <span
            key={node.name}
            className="flex items-center gap-2 rounded-lg border border-white/8 bg-[#121a2e] px-3 py-1.5 font-mono text-[11px] text-slate-300 shadow-xs"
          >
            <span>{node.icon}</span>
            <span className="font-semibold text-white">{node.name}</span>
            <span className="text-emerald-400 font-medium text-[10px]">{node.status}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
