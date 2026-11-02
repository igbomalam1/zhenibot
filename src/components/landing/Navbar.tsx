import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'

const NAV_LINKS = [
  { href: '#', label: 'Home' },
  { href: '#services', label: 'What We Automate' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#industries', label: 'Industries' },
  { href: '#why-zhenbot', label: 'About Us' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('#')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          : 'bg-white border-[#E5E7EB]'
      )}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Reusable Zhenbot Logo */}
        <div className="hidden sm:block">
          <ZhenbotLogo variant="full" size="sm" />
        </div>
        <div className="block sm:hidden">
          <ZhenbotLogo variant="compact" size="sm" />
        </div>

        {/* Middle: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeHash === link.href
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveHash(link.href)}
                className={cn(
                  'px-3.5 py-2 text-[14px] font-medium transition-colors relative rounded-md',
                  isActive
                    ? 'text-[#00B82E]'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[#00B82E] rounded-full" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right: Portal Link & Primary CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/portal"
            className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111827] hover:text-[#00B82E] px-3.5 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            <ShieldCheck className="size-4 text-[#00B82E]" />
            <span>Client Portal</span>
          </Link>

          <a
            href="#contact"
            className="bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-[14px] h-11 px-5 rounded-[12px] transition-all flex items-center gap-2 shadow-xs hover:shadow-sm"
          >
            <span>Automate My Business</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-[#111827] hover:text-[#00B82E] p-2 rounded-lg hover:bg-[#F8FAFC] focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-[#111827] hover:text-[#00B82E]"
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="text-base font-bold text-[#00B82E] pt-2 flex items-center gap-2"
            >
              <ShieldCheck className="size-4" />
              <span>Client Portal</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="w-full bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-[15px] h-12 rounded-[12px] transition-all flex items-center justify-center gap-2"
            >
              <span>Automate My Business</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
