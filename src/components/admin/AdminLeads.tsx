import { useState } from 'react'
import {
  Search,
  UserCheck,
  X,
  Mail,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { LeadEnquiry } from '@/lib/businessStore'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useToast } from '@/contexts/ToastContext'

interface AdminLeadsProps {
  enquiries: LeadEnquiry[]
  onRefresh: () => void
  onOpenEmailComposer?: (toEmail: string, subject: string) => void
}

export function AdminLeads({ enquiries, onRefresh, onOpenEmailComposer }: AdminLeadsProps) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<LeadEnquiry | null>(null)
  const [noteText, setNoteText] = useState('')

  const handleStatusUpdate = (id: string, status: LeadEnquiry['status']) => {
    businessStore.updateEnquiryStatus(id, status)
    toast.success('Inquiry status updated')
    onRefresh()
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status })
    }
  }

  const handleAddNote = (id: string) => {
    if (!noteText.trim()) return
    businessStore.updateEnquiryStatus(id, selectedEnquiry?.status || 'contacted', noteText.trim())
    setNoteText('')
    toast.success('Internal note added')
    onRefresh()
  }

  const handleConvertToClient = (enquiryId: string) => {
    const client = businessStore.convertEnquiryToClient(enquiryId)
    if (client) {
      toast.success(`Successfully converted ${client.contact_person} to Client Directory!`)
      onRefresh()
      setSelectedEnquiry(null)
    }
  }

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.business_name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.details.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search enquiries & leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none"
          >
            <option value="all">All Inquiry Statuses</option>
            <option value="new">New / Unread</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="converted">Converted to Client</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span>Total Captured:</span>
          <strong className="text-[#111827] font-mono font-bold text-sm">{enquiries.length}</strong>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4">Visitor & Business</th>
              <th className="p-4">Service of Interest</th>
              <th className="p-4">Submission Summary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Quick Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filtered.map((enq) => (
              <tr key={enq.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[#111827] text-sm">{enq.name}</div>
                  <div className="text-[#00B82E] font-semibold text-xs mt-0.5">{enq.business_name}</div>
                  <div className="font-mono text-[10px] text-[#64748B] mt-1">{enq.phone}</div>
                </td>
                <td className="p-4 max-w-[200px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#00B82E] font-bold text-[11px] line-clamp-2">
                    {enq.service_of_interest}
                  </span>
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{enq.details}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      enq.status === 'new'
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : enq.status === 'converted'
                        ? 'bg-blue-100 text-blue-800'
                        : enq.status === 'proposal_sent'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {enq.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 font-mono text-[#64748B] text-[11px]">
                  {new Date(enq.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-4 text-right space-x-2">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      enq.name,
                    )},%20this%20is%20Zhenbot%20Automation%20reviewing%20your%20request%20for%20${encodeURIComponent(
                      enq.business_name,
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white font-bold text-xs transition-colors shadow-xs"
                    title="Launch WhatsApp chat"
                  >
                    <WhatsAppIcon className="size-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] cursor-pointer"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#64748B]">
                  No matching website submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* INQUIRY DETAIL & ACTIONS MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0FDF4] text-[#00B82E] font-bold">
                  {selectedEnquiry.source}
                </span>
                <h3 className="text-xl font-bold text-[#111827] mt-1">{selectedEnquiry.name}</h3>
                <p className="text-xs text-[#64748B]">Company: {selectedEnquiry.business_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="size-8 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Submission Detail Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B]">Operation Bottleneck</span>
                <div className="text-xs font-bold text-[#111827] mt-0.5">{selectedEnquiry.service_of_interest}</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748B]">How They Currently Run It</span>
                <p className="text-xs text-[#111827] mt-1 p-3 rounded-lg bg-white border border-[#E5E7EB] leading-relaxed">
                  "{selectedEnquiry.details}"
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] pt-1">
                <span>Phone: <strong className="text-[#111827]">{selectedEnquiry.phone}</strong></span>
                <span>Captured: {new Date(selectedEnquiry.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Status Management */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111827]">Update Inquiry Status</label>
              <div className="flex flex-wrap gap-2">
                {(['new', 'contacted', 'proposal_sent', 'converted', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusUpdate(selectedEnquiry.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                      selectedEnquiry.status === st
                        ? 'bg-[#00B82E] text-white shadow-xs'
                        : 'bg-[#F8FAFC] border border-[#E5E7EB] text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111827]">Internal Admin Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Spoke on WhatsApp, interested in 500k WhatsApp bot setup..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 h-9 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedEnquiry.id)}
                  className="px-3.5 h-9 rounded-xl bg-[#111827] text-white text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>

              {selectedEnquiry.internal_notes && selectedEnquiry.internal_notes.length > 0 && (
                <div className="space-y-1 mt-2">
                  {selectedEnquiry.internal_notes.map((n, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#F8FAFC] text-[11px] text-[#64748B]">
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleConvertToClient(selectedEnquiry.id)}
                className="px-4 py-2 rounded-xl bg-[#0090FE] hover:bg-[#007ad6] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="size-4" />
                <span>Convert to Active Client</span>
              </button>

              <div className="flex items-center gap-2">
                {onOpenEmailComposer && selectedEnquiry.email && (
                  <button
                    type="button"
                    onClick={() => onOpenEmailComposer(selectedEnquiry.email || '', `Re: Automation Review for ${selectedEnquiry.business_name}`)}
                    className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="size-3.5" />
                    <span>Email</span>
                  </button>
                )}
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <WhatsAppIcon className="size-4" />
                  <span>WhatsApp Call/Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
