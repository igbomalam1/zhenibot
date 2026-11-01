import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonClass } from '@/components/ui/Button'

const LINKS = [
  { href: '#solutions', label: 'Capabilities' },
  { href: '#dispatch', label: 'Dispatch' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#calculator', label: 'Economics' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'Questions' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2.5 text-[#F4F5F7] group select-none', className)}
    >
      <div className="flex size-7 items-center justify-center rounded-md bg-[#142410] border border-white/10 text-[#459F34] transition-colors group-hover:border-[#459F34]/50">
        <svg viewBox="0 0 20 20" fill="none" className="size-4 stroke-current" strokeWidth="2.2">
          <path d="M3 5h14M3 15h14M8 5l-4 5 4 5M12 5l4 5-4 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-sm font-semibold tracking-tight text-white">
          Zhen
        </span>
        <span className="font-mono text-[11px] text-[#8F95A3] tracking-normal">
          automation
        </span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-150',
        scrolled
          ? 'border-b border-white/[0.08] bg-[#081106]/90 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-[#8F95A3] transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 border-r border-white/8 pr-3 mr-1 text-[11px] font-mono text-[#8F95A3]">
            <span className="size-1.5 rounded-full bg-[#10B981]" />
            <span>99.98% uptime</span>
          </div>
          <Link to="/auth" className={buttonClass('ghost', 'sm')}>
            Sign in
          </Link>
          <Link to="/auth" className={buttonClass('primary', 'sm')}>
            Launch console
          </Link>
        </div>

        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-md border border-white/10 text-[#8F95A3] hover:bg-white/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/8 bg-[#081106] px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-xs text-[#8F95A3] hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-white/8 flex gap-2">
              <Link to="/auth" className={buttonClass('secondary', 'sm', 'flex-1')}>
                Sign in
              </Link>
              <Link to="/auth" className={buttonClass('primary', 'sm', 'flex-1')}>
                Launch console
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
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/8 py-3 px-1 text-xs text-[#8F95A3]">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[#F4F5F7]">4,842,910</span>
        <span>automated business tasks executed to date</span>
      </div>
      <div className="flex items-center gap-5 font-mono text-[11px]">
        <span>Gmail & Outlook API</span>
        <span className="text-white/20">/</span>
        <span>SendMe & Bolt Fleet</span>
        <span className="text-white/20">/</span>
        <span>WhatsApp Business</span>
        <span className="text-white/20">/</span>
        <span>Paystack & Stripe</span>
      </div>
    </div>
  )
}
