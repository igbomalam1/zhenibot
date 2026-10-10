import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  X,
  Radio,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { Logo } from '@/components/landing/Navbar'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownCircle },
  { to: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpCircle },
  { to: '/dashboard/referrals', label: 'Referrals', icon: Percent },
  { to: '/dashboard/history', label: 'History', icon: History },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, signOut } = useAuth()
  const name = profile?.full_name ?? 'User'

  return (
    <div className="flex h-full flex-col bg-[#06080d] border-r border-white/8">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-5 border-b border-white/8">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500">
          MENU
        </div>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all font-mono',
                isActive
                  ? 'bg-brand-400/10 text-brand-400 border border-brand-400/30 font-bold shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Status Footer */}
      <div className="border-t border-white/8 p-3.5 bg-[#080a11]">
        <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f18] p-3">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#121522]">
            <img
              src="/default-avatar.svg"
              alt={name}
              className="size-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-display font-bold text-white">{name}</p>
            <p className="truncate font-mono text-[11px] text-brand-400 font-semibold">
              {formatCurrency(profile?.wallet_balance ?? 0)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono font-medium text-slate-400 transition-colors hover:bg-risk-500/10 hover:text-risk-400"
        >
          <LogOut className="size-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-[#08090e]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 animate-fade-up">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-white/8 bg-[#08090e]/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4.5" />
            </button>

            <div>
              <p className="text-sm font-display font-bold text-white tracking-tight">
                Dashboard
              </p>
              <p className="hidden text-[11px] font-mono text-slate-500 sm:block">
                1.2% Daily Profit Bot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="hidden items-center gap-1.5 rounded border border-brand-400/30 bg-brand-400/10 px-2.5 py-1 text-[11px] font-bold text-brand-400 sm:flex">
              <Radio className="size-3 animate-pulse" />
              LIVE
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-[#0c0f18] py-1 px-2.5">
              <div className="size-6 overflow-hidden rounded-full border border-white/10 bg-[#121522]">
                <img
                  src="/default-avatar.svg"
                  alt="User"
                  className="size-full object-cover"
                />
              </div>
              <span className="font-display font-semibold text-xs text-white max-w-[120px] truncate">
                {profile?.full_name?.split(' ')[0] ?? 'Investor'}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}