import { useState } from 'react'
import {
  Bell,
  Search,
  Plus,
  RefreshCw,
  LogOut,
  FolderPlus,
  UserPlus,
  FilePlus,
  DollarSign,
  Mail,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react'
import type { AdminSection } from './AdminSidebar'
import type { NotificationItem } from '@/lib/businessStore'

interface AdminTopBarProps {
  currentSection: AdminSection
  collapsed: boolean
  onRefresh: () => void
  refreshing: boolean
  notifications: NotificationItem[]
  onOpenNotifications: () => void
  onQuickCreate: (type: 'project' | 'client' | 'invoice' | 'expense' | 'email') => void
  onLogout: () => void
  adminEmail?: string
  adminName?: string
  globalSearch: string
  onGlobalSearchChange: (val: string) => void
}

export function AdminTopBar({
  currentSection,
  collapsed,
  onRefresh,
  refreshing,
  notifications,
  onOpenNotifications,
  onQuickCreate,
  onLogout,
  adminName = 'Super Administrator',
  adminEmail = 'automate@zhenibot.com',
  globalSearch,
  onGlobalSearchChange,
}: AdminTopBarProps) {
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getSectionTitle = (sec: AdminSection) => {
    switch (sec) {
      case 'dashboard':
        return 'Business Overview'
      case 'projects':
        return 'Client Projects & Automation Workflows'
      case 'clients':
        return 'Clients & CRM Directory'
      case 'leads':
        return 'Leads, Inquiries & Website Submissions'
      case 'chats':
        return 'Live Website Chat Management'
      case 'emails':
        return 'Business Email Workspace'
      case 'followups':
        return 'Client Follow-ups & Reminders'
      case 'notifications':
        return 'Notification Center'
      case 'invoices':
        return 'Invoices & Billing'
      case 'transactions':
        return 'Payments & Financial Transactions'
      case 'expenses':
        return 'Operating Expenses & Cashflow'
      case 'reports':
        return 'Financial Reports & Analytics'
      case 'content':
        return 'Website Content & Case Studies'
      case 'integrations':
        return 'Connected APIs & Services'
      case 'team':
        return 'Team & Staff Accounts'
      case 'logs':
        return 'System Audit Trail'
      case 'settings':
        return 'Business Configuration & Settings'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header
      className={`sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] transition-all duration-300 flex items-center justify-between px-6 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B]">
            Dashboard / <span className="text-[#00B82E] capitalize">{currentSection}</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] leading-tight">
            {getSectionTitle(currentSection)}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search projects, clients, leads, invoices, transactions..."
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            className="w-full h-9.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-4 text-xs text-[#111827] placeholder:text-[#64748B]/60 focus:bg-white focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Refresh Data Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="size-9 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer"
          title="Refresh All Data"
        >
          <RefreshCw className={`size-4 ${refreshing ? 'animate-spin text-[#00B82E]' : ''}`} />
        </button>

        {/* Quick Create Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowQuickCreate(!showQuickCreate)
              setShowNotifDropdown(false)
              setShowUserMenu(false)
            }}
            className="h-9.5 px-3.5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="size-3 opacity-80" />
          </button>

          {showQuickCreate && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  onQuickCreate('project')
                  setShowQuickCreate(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F0FDF4] hover:text-[#00B82E] cursor-pointer transition-colors"
              >
                <FolderPlus className="size-4 text-[#00B82E]" />
                <span>New Project</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickCreate('client')
                  setShowQuickCreate(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F0FDF4] hover:text-[#00B82E] cursor-pointer transition-colors"
              >
                <UserPlus className="size-4 text-[#00B82E]" />
                <span>New Client</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickCreate('invoice')
                  setShowQuickCreate(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F0FDF4] hover:text-[#00B82E] cursor-pointer transition-colors"
              >
                <FilePlus className="size-4 text-[#00B82E]" />
                <span>Create Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickCreate('expense')
                  setShowQuickCreate(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F0FDF4] hover:text-[#00B82E] cursor-pointer transition-colors"
              >
                <DollarSign className="size-4 text-[#00B82E]" />
                <span>Record Expense</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickCreate('email')
                  setShowQuickCreate(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#111827] hover:bg-[#F0FDF4] hover:text-[#00B82E] cursor-pointer transition-colors border-t border-[#E5E7EB] mt-1 pt-1.5"
              >
                <Mail className="size-4 text-[#00B82E]" />
                <span>Compose Email</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown)
              setShowQuickCreate(false)
              setShowUserMenu(false)
            }}
            className="size-9 rounded-xl border border-[#E5E7EB] text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer relative"
          >
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7EB]">
                <h4 className="text-xs font-bold text-[#111827]">Notifications</h4>
                <button
                  type="button"
                  onClick={onOpenNotifications}
                  className="text-[11px] font-semibold text-[#00B82E] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      n.is_read ? 'bg-[#F8FAFC] text-[#64748B]' : 'bg-[#F0FDF4] text-[#111827] font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-[#111827]">{n.title}</span>
                      <span className="text-[9px] font-mono text-[#64748B]">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-snug">{n.message}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="py-6 text-center text-xs text-[#64748B]">No new notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowQuickCreate(false)
              setShowNotifDropdown(false)
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="size-7 rounded-lg bg-[#00B82E] text-white font-bold text-xs flex items-center justify-center">
              {adminName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-bold text-[#111827] leading-none">{adminName}</div>
              <div className="text-[10px] text-[#64748B] mt-0.5">{adminEmail}</div>
            </div>
            <ChevronDown className="size-3.5 text-[#64748B]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                <div className="font-bold text-[#111827]">{adminName}</div>
                <div className="text-[11px] text-[#64748B] truncate">{adminEmail}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#00B82E]">
                  <CheckCircle2 className="size-3" />
                  <span>Authenticated Super Admin</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#FEF2F2] font-semibold cursor-pointer transition-colors"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
