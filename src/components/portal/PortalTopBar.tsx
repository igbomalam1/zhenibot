import { useState, useRef, useEffect } from 'react'
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Building,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Menu,
} from 'lucide-react'
import type { ClientPortalUser, ClientNotification } from '@/lib/portalStore'
import type { Client } from '@/lib/businessStore'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

interface PortalTopBarProps {
  currentSection: string
  user: ClientPortalUser
  client: Client
  allClients: Client[]
  notifications: ClientNotification[]
  onSwitchClient: (clientId: string) => void
  onSelectSection: (section: any) => void
  onMarkNotificationRead: (id: string) => void
  onMarkAllNotificationsRead: () => void
  onLogout: () => void
  onToggleMobileMenu?: () => void
}

export function PortalTopBar({
  currentSection,
  user,
  client,
  allClients,
  notifications,
  onSwitchClient,
  onSelectSection,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onLogout,
  onToggleMobileMenu,
}: PortalTopBarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isClientSwitchOpen, setIsClientSwitchOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const switchRef = useRef<HTMLDivElement>(null)

  const unreadNotifs = notifications.filter((n) => !n.is_read)

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (switchRef.current && !switchRef.current.contains(event.target as Node)) {
        setIsClientSwitchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const titles: Record<string, string> = {
    dashboard: 'Workspace Overview',
    projects: 'My Projects & Milestones',
    automations: 'Active Automation Systems',
    reports: 'Automation Activity & Reports',
    invoices: 'Invoices & Billing',
    payments: 'Verified Payments',
    receipts: 'Official Receipts',
    documents: 'Private Document Centre',
    support: 'Messages & Support Tickets',
    profile: 'Company Profile',
    team: 'Team Members & Permissions',
    notifications: 'Notifications & Alerts',
    settings: 'Portal Settings',
  }

  return (
    <header className="h-18 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden size-9 rounded-xl border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#111827]"
          >
            <Menu className="size-5" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span>Portal</span>
            <span>/</span>
            <span className="font-semibold text-[#111827] capitalize">{currentSection}</span>
          </div>
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">
            {titles[currentSection] || 'Client Portal'}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Workspace Switcher / Preview Pill */}
        <div className="relative" ref={switchRef}>
          <button
            type="button"
            onClick={() => setIsClientSwitchOpen(!isClientSwitchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
          >
            <Building className="size-3.5 text-[#00B82E]" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">{client.company_name}</span>
            <ChevronDown className="size-3 text-[#64748B]" />
          </button>

          {isClientSwitchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E5E7EB]">
                <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">
                  Switch Active Workspace
                </div>
                <div className="text-xs text-[#111827] font-semibold mt-0.5">
                  Multi-Account Access
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {allClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSwitchClient(c.id)
                      setIsClientSwitchOpen(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-[#111827] truncate">{c.company_name}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{c.industry}</div>
                    </div>
                    {c.id === client.id && <CheckCircle2 className="size-4 text-[#00B82E] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Direct WhatsApp Consultation */}
        <a
          href="https://wa.me/2348000000000?text=Hello%20Zhenbot%20Team,%20this%20is%20from%20our%20Client%20Portal."
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#00B82E] border border-[#00B82E]/20 text-xs font-semibold transition-colors cursor-pointer"
          title="Direct WhatsApp Support"
        >
          <WhatsAppIcon className="size-3.5" />
          <span>WhatsApp PM</span>
        </a>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="size-9 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#111827] transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="size-4.5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-3 z-50">
              <div className="px-4 pb-2.5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Notifications</h4>
                  <p className="text-[11px] text-[#64748B]">
                    {unreadNotifs.length} unread alerts
                  </p>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] font-semibold text-[#00B82E] hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                      !n.is_read ? 'bg-[#F0FDF4]/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-[#111827]">{n.title}</h5>
                      <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#64748B]">
                    No notifications right now.
                  </div>
                )}
              </div>

              <div className="pt-2 px-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false)
                    onSelectSection('notifications')
                  }}
                  className="w-full text-center text-xs font-semibold text-[#00B82E] hover:underline cursor-pointer py-1"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="size-8 rounded-xl bg-[#00B82E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user.full_name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[#111827] truncate max-w-[120px]">
                {user.full_name}
              </div>
              <div className="text-[10px] text-[#64748B] capitalize">{user.role}</div>
            </div>
            <ChevronDown className="size-3 text-[#64748B]" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50">
              <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                <div className="font-bold text-xs text-[#111827] truncate">{user.full_name}</div>
                <div className="text-[11px] text-[#64748B] truncate">{user.email}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#00B82E] bg-[#F0FDF4] px-2 py-0.5 rounded-full capitalize">
                  <ShieldCheck className="size-3" />
                  <span>{user.role} Access</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onSelectSection('profile')
                  }}
                  className="w-full px-4 py-2 hover:bg-[#F8FAFC] text-[#111827] flex items-center gap-2.5 cursor-pointer text-left"
                >
                  <User className="size-4 text-[#64748B]" />
                  <span>Company Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onSelectSection('support')
                  }}
                  className="w-full px-4 py-2 hover:bg-[#F8FAFC] text-[#111827] flex items-center gap-2.5 cursor-pointer text-left"
                >
                  <HelpCircle className="size-4 text-[#64748B]" />
                  <span>Support Centre</span>
                </button>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 hover:bg-[#F8FAFC] text-[#111827] flex items-center gap-2.5 cursor-pointer text-left"
                >
                  <ExternalLink className="size-4 text-[#64748B]" />
                  <span>Zhenbot Website</span>
                </a>
              </div>

              <div className="pt-1 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onLogout()
                  }}
                  className="w-full px-4 py-2 hover:bg-[#FEF2F2] text-[#EF4444] text-xs font-semibold flex items-center gap-2.5 cursor-pointer text-left transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
