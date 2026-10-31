import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  ArrowUpFromLine,
  FileText,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
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
    section: 'OPERATIONS & AUTOMATIONS',
    items: [
      {
        to: '/dashboard',
        label: 'Operations Center',
        subtitle: 'Live Telemetry & AI Workflows',
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: '/dashboard/deposit',
        label: 'Automation Fuel & Credits',
        subtitle: 'Compute Quota & Plan Top-Up',
        icon: Zap,
        badge: 'ACTIVE',
      },
      {
        to: '/dashboard/withdraw',
        label: 'Dispatch & Fleet Settings',
        subtitle: 'Courier APIs & Payout Rails',
        icon: ArrowUpFromLine,
      },
    ],
  },
  {
    section: 'GROWTH & AUDIT',
    items: [
      {
        to: '/dashboard/referrals',
        label: 'Agency & Partner Program',
        subtitle: '20% Recurring Monthly Payouts',
        icon: Gift,
        badge: '20% CUT',
      },
      {
        to: '/dashboard/history',
        label: 'Execution Logs & Audit',
        subtitle: 'Full Task Telemetry & Payloads',
        icon: FileText,
      },
    ],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, signOut } = useAuth()
  const name = profile?.full_name ?? 'Business Ops'

  return (
    <div className="flex h-full flex-col bg-[#070b14] border-r border-white/8 select-none">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-white/8 bg-[#090e1a]">
        <Logo />
        <span className="flex items-center gap-1 rounded-md border border-brand-400/25 bg-brand-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-brand-300">
          <Sparkles className="size-3 text-cyan-300" /> PRO
        </span>
      </div>

      {/* Navigation */}
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
                      ? 'bg-[#12192e] border border-brand-500/40 shadow-lg shadow-black/40 text-white'
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
                            ? 'bg-gradient-to-br from-brand-600 to-brand-500 text-white font-bold shadow-md shadow-brand-500/30'
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
                        <span className="rounded bg-brand-500/15 border border-brand-500/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-brand-300">
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
                  <p className="text-xs font-display font-bold text-white tracking-tight">Enterprise Admin</p>
                  <p className="text-[10px] font-mono text-amber-400/80">Cluster & Fleets Control</p>
                </div>
              </div>
              <ChevronRight className="size-4 text-amber-400" />
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Organization Card */}
      <div className="border-t border-white/8 p-3.5 bg-[#080d18]">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#11172a] to-[#0a0f1d] p-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#141c32]">
              <img
                src="/default-avatar.svg"
                alt={name}
                className="size-full object-cover"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0f1320] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-display font-bold text-white tracking-tight">
                {name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  CREDITS:
                </span>
                <span className="font-mono text-xs text-brand-300 font-bold truncate">
                  {formatCurrency(profile?.wallet_balance ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
            <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-400 uppercase">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> 14 CLUSTERS SYNCED
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-400 transition-colors hover:bg-risk-500/15 hover:text-risk-400 active:scale-95 cursor-pointer"
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
    <div className="min-h-screen bg-[#090d16] text-slate-300">
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
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-white/8 bg-[#090d16]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <div>
              <p className="text-base font-display font-bold text-white tracking-tight">
                Operations Command Center
              </p>
              <p className="hidden text-[11px] font-mono text-slate-400 sm:block">
                Zhen Autonomous AI Operations Engine · 99.98% SLA
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
            <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 sm:flex">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              ENGINE LIVE
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-[#0e1424] py-1.5 px-3">
              <div className="size-6 overflow-hidden rounded-full border border-white/10 bg-[#141c30]">
                <img
                  src="/default-avatar.svg"
                  alt="User"
                  className="size-full object-cover"
                />
              </div>
              <span className="font-display font-semibold text-xs text-white max-w-[130px] truncate">
                {profile?.full_name?.split(' ')[0] ?? 'Business Ops'}
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
