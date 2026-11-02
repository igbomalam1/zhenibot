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
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { ZhenbotLogo as Logo } from '@/components/ui/ZhenbotLogo'

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
    section: 'OPERATIONS',
    items: [
      {
        to: '/dashboard',
        label: 'Command console',
        subtitle: 'Live workflows & telemetry',
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: '/dashboard/deposit',
        label: 'Fuel & credits',
        subtitle: 'Compute quota provisioning',
        icon: Zap,
      },
      {
        to: '/dashboard/withdraw',
        label: 'Fleet & dispatch',
        subtitle: 'Courier routes & payouts',
        icon: ArrowUpFromLine,
      },
    ],
  },
  {
    section: 'AGENCY & AUDIT',
    items: [
      {
        to: '/dashboard/referrals',
        label: 'Agency program',
        subtitle: '20% recurring monthly cut',
        icon: Gift,
        badge: '20%',
      },
      {
        to: '/dashboard/history',
        label: 'Execution ledger',
        subtitle: 'Full telemetry & audit log',
        icon: FileText,
      },
    ],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { profile, signOut } = useAuth()
  const name = profile?.full_name ?? 'Operations'

  return (
    <div className="flex h-full flex-col bg-[#0F1116] border-r border-white/8 select-none">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/8">
        <Logo />
        <span className="font-mono text-[10px] text-[#8F95A3] border border-white/10 px-1.5 py-0.5 rounded">
          PRO
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.section} className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-mono font-medium tracking-wider text-[#545A67] uppercase">
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
                    'group flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors',
                    isActive
                      ? 'bg-[#142410] text-white border border-white/10 font-medium'
                      : 'text-[#8F95A3] hover:text-white hover:bg-white/[0.04]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <item.icon
                        className={cn(
                          'size-4 shrink-0',
                          isActive ? 'text-[#459F34]' : 'text-[#8F95A3] group-hover:text-white',
                        )}
                      />
                      <div className="min-w-0 text-left">
                        <p className="text-xs truncate">{item.label}</p>
                        <p className="text-[10px] text-[#545A67] truncate font-mono">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 shrink-0">
                      {item.badge && (
                        <span className="font-mono text-[9px] text-[#459F34] bg-[#459F34]/10 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          'size-3.5 transition-transform duration-100',
                          isActive ? 'text-[#459F34]' : 'text-[#545A67] opacity-60 group-hover:opacity-100',
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
              className="flex items-center justify-between rounded-lg border border-white/8 bg-[#142410] p-2 text-xs text-[#8F95A3] hover:text-white hover:bg-[#1E212B] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#459F34]" />
                <span>Enterprise admin</span>
              </div>
              <ChevronRight className="size-3.5" />
            </NavLink>
          </div>
        )}
      </nav>

      {/* Account Info */}
      <div className="border-t border-white/8 p-3 bg-[#081106]">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{name}</p>
            <p className="font-mono text-[11px] text-[#8F95A3] mt-0.5" data-tabular="true">
              Credits: <span className="text-[#F4F5F7] font-semibold">{formatCurrency(profile?.wallet_balance ?? 0)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="p-1.5 rounded-md text-[#8F95A3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-[#081106] text-[#8F95A3]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 animate-fade-up">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md border border-white/10 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-white/8 bg-[#081106]/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex size-8 items-center justify-center rounded-md border border-white/10 text-[#8F95A3] hover:bg-white/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>

            <div>
              <p className="text-xs font-medium text-white">
                Command console
              </p>
              <p className="hidden text-[10px] font-mono text-[#545A67] sm:block">
                Region: Cluster Lagos-01 · Operational
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            {profile?.is_admin && (
              <NavLink
                to="/admin"
                className="flex items-center gap-1 rounded border border-white/10 px-2 py-0.5 text-[10px] text-[#8F95A3] hover:text-white"
              >
                Admin
              </NavLink>
            )}
            <span className="flex items-center gap-1.5 text-[11px] text-[#10B981]">
              <span className="size-1.5 rounded-full bg-[#10B981]" />
              Online
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
