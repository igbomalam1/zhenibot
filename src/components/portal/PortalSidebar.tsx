import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  BarChart3,
  Receipt,
  CreditCard,
  FileCheck2,
  FolderClosed,
  Headphones,
  Building2,
  Users2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { cn } from '@/lib/utils'

export type PortalSection =
  | 'dashboard'
  | 'projects'
  | 'automations'
  | 'reports'
  | 'invoices'
  | 'payments'
  | 'receipts'
  | 'documents'
  | 'support'
  | 'profile'
  | 'team'
  | 'notifications'
  | 'settings'

interface NavItem {
  id: PortalSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

interface PortalSidebarProps {
  currentSection: PortalSection
  onSelectSection: (section: PortalSection) => void
  collapsed: boolean
  onToggleCollapse: () => void
  unreadCounts: {
    notifications: number
    invoices: number
    tickets: number
  }
  companyName: string
}

export function PortalSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  unreadCounts,
  companyName,
}: PortalSidebarProps) {
  const NAV_GROUPS: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      group: 'MY BUSINESS',
      items: [
        { id: 'projects', label: 'My Projects', icon: FolderKanban },
        { id: 'automations', label: 'My Automations', icon: Zap },
        { id: 'reports', label: 'Activity & Reports', icon: BarChart3 },
      ],
    },
    {
      group: 'FINANCIALS',
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt, badge: unreadCounts.invoices },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'receipts', label: 'Receipts', icon: FileCheck2 },
      ],
    },
    {
      group: 'RESOURCES',
      items: [
        { id: 'documents', label: 'Documents', icon: FolderClosed },
        { id: 'support', label: 'Messages & Support', icon: Headphones, badge: unreadCounts.tickets },
      ],
    },
    {
      group: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Company Profile', icon: Building2 },
        { id: 'team', label: 'Team Members', icon: Users2 },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCounts.notifications },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-white border-r border-[#E5E7EB] flex flex-col transition-all duration-300 z-30 select-none',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand Header */}
      <div className="h-18 px-5 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 overflow-hidden">
          {!collapsed ? (
            <div className="flex flex-col">
              <ZhenbotLogo variant="compact" size="sm" />
              <div className="flex items-center gap-1.5 mt-1">
                <span className="size-2 rounded-full bg-[#00B82E]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00B82E]">
                  Client Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="size-10 rounded-xl bg-[#F0FDF4] border border-[#00B82E]/30 flex items-center justify-center text-[#00B82E] font-bold text-sm">
              ZH
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="size-8 rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] flex items-center justify-center transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Active Client Badge */}
      {!collapsed && (
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center font-bold text-xs text-[#111827] shadow-xs shrink-0">
              {companyName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#111827] truncate">{companyName}</div>
              <div className="text-[11px] text-[#64748B] flex items-center gap-1 truncate">
                <ShieldCheck className="size-3 text-[#00B82E]" />
                <span>Verified Workspace</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold mb-2">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left relative',
                    isActive
                      ? 'bg-[#F0FDF4] text-[#00B82E] shadow-xs'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4.5 shrink-0 transition-transform group-hover:scale-110',
                      isActive ? 'text-[#00B82E]' : 'text-[#64748B]'
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {/* Badges */}
                  {item.badge && item.badge > 0 ? (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        isActive
                          ? 'bg-[#00B82E] text-white'
                          : 'bg-[#F0FDF4] text-[#00B82E] border border-[#00B82E]/30',
                        collapsed && 'absolute top-1 right-1 size-2 p-0 rounded-full bg-[#00B82E]'
                      )}
                    >
                      {!collapsed && item.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Support / Help Card */}
      {!collapsed && (
        <div className="p-4 m-3.5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1E293B] text-white space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#00B82E] animate-ping" />
            <span className="text-[10px] font-mono uppercase text-[#00B82E] font-bold">
              Zhenbot Support
            </span>
          </div>
          <p className="text-white/80 text-[11px] leading-relaxed">
            Need urgent changes or custom flow adjustments?
          </p>
          <button
            type="button"
            onClick={() => onSelectSection('support')}
            className="w-full mt-2 h-8 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Ticket</span>
          </button>
        </div>
      )}
    </aside>
  )
}
