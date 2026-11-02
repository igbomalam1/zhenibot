import { useState } from 'react'
import { Bell, CheckCheck, FolderKanban, Zap, Receipt, Headphones } from 'lucide-react'
import type { ClientNotification } from '@/lib/portalStore'

interface PortalNotificationsProps {
  notifications: ClientNotification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onNavigate?: (section: any) => void
}

export function PortalNotifications({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: PortalNotificationsProps) {
  const [filterType, setFilterType] = useState('all')

  const filtered = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  )

  const iconForType = (type: ClientNotification['type']) => {
    switch (type) {
      case 'project':
      case 'milestone':
        return <FolderKanban className="size-4 text-[#0090FE]" />
      case 'automation':
        return <Zap className="size-4 text-[#00B82E]" />
      case 'invoice':
      case 'payment':
        return <Receipt className="size-4 text-[#F59E0B]" />
      case 'support':
        return <Headphones className="size-4 text-[#EA580C]" />
      default:
        return <Bell className="size-4 text-[#64748B]" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Notification Centre</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Operational alerts, milestone updates, and support updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none"
          >
            <option value="all">All Alerts</option>
            <option value="project">Projects & Milestones</option>
            <option value="automation">Automation Health</option>
            <option value="invoice">Invoices & Billing</option>
            <option value="support">Support Tickets</option>
          </select>

          <button
            type="button"
            onClick={onMarkAllRead}
            className="h-9 px-3.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="size-4 text-[#00B82E]" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs divide-y divide-[#F1F5F9] overflow-hidden">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (!n.is_read) onMarkRead(n.id)
            }}
            className={`p-5 hover:bg-[#F8FAFC] transition-colors cursor-pointer flex items-start gap-4 ${
              !n.is_read ? 'bg-[#F0FDF4]/30' : ''
            }`}
          >
            <div className="size-9 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center shrink-0 mt-0.5">
              {iconForType(n.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#111827]">{n.title}</h4>
                <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">{n.message}</p>
            </div>

            {!n.is_read && (
              <span className="size-2 rounded-full bg-[#00B82E] shrink-0 mt-2" />
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  )
}
