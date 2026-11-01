import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#services', label: 'What We Automate' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#integrations', label: 'Apps We Connect' },
  { href: '#calculator', label: 'Savings Calculator' },
  { href: '#contact', label: 'Contact Us' },
]

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-3 select-none group', className)}>
      <div className="flex size-9 items-center justify-center bg-[#459F34] text-white font-bold text-lg">
        Z
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-base tracking-tight text-black leading-none">
          ZHEN <span className="text-[#459F34]">AUTOMATION</span>
        </span>
        <span className="text-[10px] tracking-wider text-black/60 uppercase font-medium mt-0.5">
          Business Automation Agency
        </span>
      </div>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-[#459F34]/20 shadow-xs'
          : 'bg-white border-black/10'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-black/80 hover:text-[#459F34] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20want%20to%20automate%20my%20business%20workflow."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-black hover:text-[#459F34] transition-colors"
          >
            <MessageSquare className="size-4 text-[#459F34]" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href="#contact"
            className="bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold text-sm py-3 px-6 transition-colors border border-[#459F34] flex items-center gap-2"
          >
            <span>Start Your Setup</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-black hover:text-[#459F34] p-2 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-b border-[#459F34] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-semibold text-black hover:text-[#459F34] py-1 border-b border-black/5"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20want%20to%20automate%20my%20business%20workflow."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 border border-[#459F34] text-[#459F34] font-semibold text-sm hover:bg-[#459F34]/5"
            >
              Chat on WhatsApp
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold text-sm"
            >
              Start Your Setup
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
