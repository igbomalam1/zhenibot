import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Radio,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { Logo } from '@/components/landing/Navbar'

interface NavItem {
  to: string
  label: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  end?: boolean
}

const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  {
    section: 'BANKING & ASSETS',
    items: [
      {
        to: '/dashboard',
        label: 'Overview',
        subtitle: 'Portfolio & 1.6% Yield',
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: '/dashboard/deposit',
        label: 'Deposit Funds',
        subtitle: 'Deploy Investment Capital',
        icon: ArrowDownToLine,
      },
      {
        to: '/dashboard/withdraw',
        label: 'Withdraw Cash',
        subtitle: 'Fast 2FA Payouts',
        icon: ArrowUpFromLine,
      },
    ],
  },
  {
    section: 'GROWTH & COMMISSIONS',
    items: [
      {
        to: '/dashboard/referrals',
        label: 'Affiliate Network',
        subtitle: 'Earn 15% Direct + 2% Team',
        icon: Gift,
        badge: '15% BONUS',
      },
      {
        to: '/dashboard/history',
        label: 'Account Ledger',
        subtitle: 'Statements & Transactions',
        icon: FileText,
      },
    ],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, signOut } = useAuth()
  const name = profile?.full_name ?? 'Investor'

  return (
    <div className="flex h-full flex-col bg-[#06080d] border-r border-white/8 select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/8 bg-[#080b12]">
        <Logo />
        <span className="flex items-center gap-1 rounded-md border border-brand-400/20 bg-brand-400/10 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-400">
          <ShieldCheck className="size-3 text-brand-400" /> PRO
        </span>
      </div>

      {/* Fintech Button Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.section} className="space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {group.section}
            </div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center justify-between rounded-xl p-2.5 transition-all duration-150 active:scale-[0.98]',
                    isActive
                      ? 'bg-[#101422] border border-brand-400/40 shadow-lg shadow-black/40 text-white'
                      : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:border-white/6 hover:text-slate-200',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-xl transition-all',
                          isActive
                            ? 'bg-brand-400 text-obsidian-950 font-bold shadow-md shadow-brand-400/25'
                            : 'bg-white/[0.05] border border-white/8 text-slate-400 group-hover:bg-white/[0.09] group-hover:text-white',
                        )}
                      >
                        <item.icon className="size-4.5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <p
                          className={cn(
                            'text-xs font-display font-bold tracking-tight truncate',
                            isActive ? 'text-white' : 'text-slate-300 group-hover:text-white',
                          )}
                        >
                          {item.label}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 truncate group-hover:text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 shrink-0">
                      {item.badge && (
                        <span className="rounded bg-brand-400/15 border border-brand-400/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-brand-400">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          'size-3.5 transition-transform duration-150',
                          isActive
                            ? 'text-brand-400 translate-x-0.5'
                            : 'text-slate-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5',
                        )}
                      />
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {profile?.is_admin && (
          <div className="pt-2">
            <NavLink
              to="/admin"
              onClick={onNavigate}
              className="group flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-400 hover:bg-amber-500/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-display font-bold text-white tracking-tight">Admin Console</p>
                  <p className="text-[10px] font-mono text-amber-400/80">Manage Wallets & Users</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-amber-400" />
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Account Card (Fintech Bank Debit Style) */}
      <div className="border-t border-white/8 p-3.5 bg-[#080a11]">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0f1320] to-[#0a0d16] p-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121522]">
              <img
                src="/default-avatar.svg"
                alt={name}
                className="size-full object-cover"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0f1320] bg-brand-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-display font-bold text-white tracking-tight">
                {name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  BAL:
                </span>
                <span className="font-mono text-xs text-brand-400 font-bold truncate">
                  {formatCurrency(profile?.wallet_balance ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-slate-500 uppercase">
              <span className="size-1.5 rounded-full bg-emerald-400" /> 1.6% ACTIVE
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-400 transition-colors hover:bg-risk-500/15 hover:text-risk-400 active:scale-95"
              title="Sign Out"
            >
              <LogOut className="size-3" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
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
                1.6% Daily Profit Bot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {profile?.is_admin && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <ShieldCheck className="size-3.5" />
                <span>Admin</span>
              </NavLink>
            )}
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