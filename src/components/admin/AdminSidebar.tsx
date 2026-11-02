import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Inbox,
  MessageSquare,
  Mail,
  Clock,
  Bell,
  Receipt,
  CreditCard,
  TrendingDown,
  BarChart3,
  Globe,
  Radio,
  UserCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
} from 'lucide-react'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { cn } from '@/lib/utils'

export type AdminSection =
  | 'dashboard'
  | 'projects'
  | 'clients'
  | 'leads'
  | 'chats'
  | 'emails'
  | 'followups'
  | 'notifications'
  | 'invoices'
  | 'transactions'
  | 'expenses'
  | 'reports'
  | 'content'
  | 'integrations'
  | 'team'
  | 'logs'
  | 'settings'

interface NavItem {
  id: AdminSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

interface AdminSidebarProps {
  currentSection: AdminSection
  onSelectSection: (section: AdminSection) => void
  collapsed: boolean
  onToggleCollapse: () => void
  unreadCounts: {
    leads: number
    chats: number
    emails: number
    notifications: number
  }
}

export function AdminSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  unreadCounts,
}: AdminSidebarProps) {
  const NAV_GROUPS: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'BUSINESS MANAGEMENT',
      items: [
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'clients', label: 'Clients & CRM', icon: Users },
        { id: 'leads', label: 'Leads & Enquiries', icon: Inbox, badge: unreadCounts.leads },
        { id: 'chats', label: 'Chat Management', icon: MessageSquare, badge: unreadCounts.chats },
      ],
    },
    {
      group: 'COMMUNICATION',
      items: [
        { id: 'emails', label: 'Email Inbox', icon: Mail, badge: unreadCounts.emails },
        { id: 'followups', label: 'Follow-ups & CRM', icon: Clock },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCounts.notifications },
      ],
    },
    {
      group: 'FINANCIAL MANAGEMENT',
      items: [
        { id: 'invoices', label: 'Invoices', icon: Receipt },
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        { id: 'expenses', label: 'Expenses', icon: TrendingDown },
        { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
      ],
    },
    {
      group: 'WEBSITE MANAGEMENT',
      items: [
        { id: 'content', label: 'Website Content', icon: Globe },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'integrations', label: 'Integrations', icon: Radio },
        { id: 'team', label: 'Team & Staff', icon: UserCheck },
        { id: 'logs', label: 'Activity Logs', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen bg-white border-r border-[#E5E7EB] transition-all duration-300 flex flex-col',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
        {!collapsed ? (
          <div className="flex flex-col">
            <ZhenbotLogo variant="compact" size="sm" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-[#00B82E] mt-0.5">
              Operations OS
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <span className="size-8 rounded-xl bg-[#00B82E] text-white flex items-center justify-center font-bold text-sm">
              Z
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Quick Search in Sidebar (expanded only) */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-8.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] pl-8.5 pr-3 text-xs text-[#111827] placeholder:text-[#64748B]/60 focus:bg-white focus:border-[#00B82E] focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Navigation Links Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                {grp.group}
              </h4>
            )}
            {grp.items.map((item) => {
              const Icon = item.icon
              const isActive = currentSection === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative group',
                    isActive
                      ? 'bg-[#F0FDF4] text-[#00B82E] font-bold shadow-xs'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]',
                    collapsed && 'justify-center px-0 py-2.5',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 shrink-0 transition-transform group-hover:scale-105',
                      isActive ? 'text-[#00B82E]' : 'text-[#64748B] group-hover:text-[#111827]',
                    )}
                  />

                  {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                  {/* Notification Badge */}
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={cn(
                        'size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        isActive
                          ? 'bg-[#00B82E] text-white'
                          : 'bg-[#EF4444] text-white',
                        collapsed && 'absolute -top-1 -right-1 size-4 text-[9px]',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator Bar on collapsed view */}
                  {collapsed && isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#00B82E]" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-[#F8FAFC]">
            <div className="size-7 rounded-lg bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center border border-[#00B82E]/20">
              <Zap className="size-3.5 text-[#00B82E]" />
            </div>
            <div className="flex-1 truncate">
              <div className="text-[11px] font-bold text-[#111827]">Zhen Automation</div>
              <div className="text-[10px] text-[#64748B]">All Systems Normal</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="size-2 rounded-full bg-[#00B82E] animate-pulse" title="System Normal" />
          </div>
        )}
      </div>
    </aside>
  )
}
