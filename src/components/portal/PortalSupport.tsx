import { useState } from 'react'
import {
  Plus,
  Send,
  X,
} from 'lucide-react'
import type { ClientSupportTicket } from '@/lib/portalStore'
import { portalStore } from '@/lib/portalStore'
import { useToast } from '@/contexts/ToastContext'

interface PortalSupportProps {
  tickets: ClientSupportTicket[]
  clientId: string
  companyName: string
  clientName: string
  onRefresh: () => void
}

export function PortalSupport({
  tickets,
  clientId,
  companyName,
  clientName,
  onRefresh,
}: PortalSupportProps) {
  const toast = useToast()
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '')
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  // New ticket state
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<ClientSupportTicket['priority']>('medium')
  const [description, setDescription] = useState('')

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0]

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) {
      toast.error('Please enter a subject and describe the issue.')
      return
    }

    const created = portalStore.addSupportTicket(
      {
        client_id: clientId,
        client_name: companyName,
        subject: subject.trim(),
        description: description.trim(),
        priority,
        status: 'open',
      },
      description.trim()
    )

    toast.success(`Support request ${created.ticket_number} submitted!`)
    setIsNewTicketOpen(false)
    setSubject('')
    setDescription('')
    setSelectedTicketId(created.id)
    onRefresh()
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim() || !activeTicket) return

    portalStore.addTicketReply(
      activeTicket.id,
      replyMessage.trim(),
      'client',
      clientName || companyName
    )

    setReplyMessage('')
    toast.success('Reply submitted to support engineer!')
    onRefresh()
  }

  const statusBadge = (status: ClientSupportTicket['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0090FE]">
            Open
          </span>
        )
      case 'in_progress':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
            In Progress
          </span>
        )
      case 'awaiting_client':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#F59E0B]">
            Awaiting Response
          </span>
        )
      case 'resolved':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
            Resolved
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
            Closed
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Messages & Support Centre</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Submit operational inquiries, report edge cases, and request flow adjustments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewTicketOpen(true)}
          className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Two Column Layout: Tickets List & Active Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left (4 cols): Tickets Directory */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E5E7EB]">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Your Tickets ({tickets.length})
            </h3>
          </div>

          <div className="divide-y divide-[#F1F5F9] overflow-y-auto max-h-[550px] flex-1">
            {tickets.map((t) => {
              const isSelected = activeTicket?.id === t.id
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer space-y-1.5 ${
                    isSelected ? 'bg-[#F0FDF4]/50 border-l-4 border-l-[#00B82E]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] font-bold text-[#64748B]">
                      {t.ticket_number}
                    </span>
                    {statusBadge(t.status)}
                  </div>
                  <h4 className="text-xs font-bold text-[#111827] line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">{t.description}</p>
                  <div className="text-[10px] text-[#94A3B8] font-mono pt-1">
                    Updated {new Date(t.updated_at).toLocaleDateString()}
                  </div>
                </div>
              )
            })}

            {tickets.length === 0 && (
              <div className="py-12 text-center text-xs text-[#64748B]">
                No support tickets filed yet.
              </div>
            )}
          </div>
        </div>

        {/* Right (8 cols): Active Ticket Conversation */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between overflow-hidden">
          {activeTicket ? (
            <>
              {/* Ticket Details Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#00B82E]">
                      {activeTicket.ticket_number}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-[#64748B] font-semibold">
                      {activeTicket.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827] mt-1">
                    {activeTicket.subject}
                  </h3>
                </div>
                {statusBadge(activeTicket.status)}
              </div>

              {/* Message Thread */}
              <div className="p-5 overflow-y-auto max-h-[380px] space-y-4 flex-1">
                {activeTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender_type === 'client' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs space-y-1.5 ${
                        msg.sender_type === 'client'
                          ? 'bg-[#00B82E] text-white rounded-br-xs'
                          : 'bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] rounded-bl-xs'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold ${
                          msg.sender_type === 'client' ? 'text-white/80' : 'text-[#64748B]'
                        }`}
                      >
                        {msg.sender_name}
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>
                      <div
                        className={`text-[9px] font-mono text-right ${
                          msg.sender_type === 'client' ? 'text-white/70' : 'text-[#94A3B8]'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a response or add more operational details..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 h-10 px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Send className="size-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-[#64748B]">
              Select a ticket or create a new request.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#111827]">New Support Request</h3>
              <button
                type="button"
                onClick={() => setIsNewTicketOpen(false)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Need to adjust automated WhatsApp greeting text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                >
                  <option value="low">Low Priority (Question / Query)</option>
                  <option value="medium">Medium Priority (Flow Improvement)</option>
                  <option value="high">High Priority (Urgent Change)</option>
                  <option value="urgent">Urgent Priority (System Interruption)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue, workflow context, or exact change requested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
