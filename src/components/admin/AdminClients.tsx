import { useState } from 'react'
import {
  Search,
  Plus,
  Mail,
  Phone,
  X,
  Receipt,
  FolderKanban,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { Client, Project, Invoice } from '@/lib/businessStore'
import { portalStore } from '@/lib/portalStore'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useToast } from '@/contexts/ToastContext'

interface AdminClientsProps {
  clients: Client[]
  projects: Project[]
  invoices: Invoice[]
  onRefresh: () => void
}

export function AdminClients({ clients, projects, invoices, onRefresh }: AdminClientsProps) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Form state
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('Retail & E-commerce')
  const [clientType, setClientType] = useState<Client['client_type']>('Project-Based')
  const [address, setAddress] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !contactPerson.trim()) {
      toast.error('Please enter company and contact person name.')
      return
    }

    const newClient = businessStore.addClient({
      company_name: companyName.trim(),
      contact_person: contactPerson.trim(),
      email: email.trim() || 'contact@client.com',
      phone: phone.trim() || '+234 800 000 0000',
      whatsapp: phone.trim() || '+234 800 000 0000',
      industry,
      client_type: clientType,
      status: 'active',
      total_billed: 0,
      total_paid: 0,
      address: address.trim() || 'Lagos, Nigeria',
      internal_notes: ['Client registered via CRM portal.'],
    })

    // Auto-provision portal owner user
    portalStore.addUser({
      client_id: newClient.id,
      email: newClient.email,
      full_name: newClient.contact_person,
      role: 'owner',
      status: 'active',
    })

    toast.success('Client added and Portal account provisioned!')
    setIsAddOpen(false)
    setCompanyName('')
    setContactPerson('')
    setEmail('')
    setPhone('')
    onRefresh()
  }

  const handleCopyInvite = (c: Client) => {
    const inviteLink = portalStore.generateInviteLink(c.id, c.email, c.contact_person, 'owner')
    navigator.clipboard.writeText(inviteLink)
    toast.success(`Portal invite link copied for ${c.company_name}!`)
  }

  const handleOpenPortalAsClient = (c: Client) => {
    portalStore.switchClientForPreview(c.id)
    window.open('/portal', '_blank')
    toast.success(`Opened ${c.company_name} Portal Workspace!`)
  }

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || c.client_type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none"
          >
            <option value="all">All Relationship Types</option>
            <option value="Project-Based">Project-Based</option>
            <option value="Retainer">Monthly Retainer</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Trial">Pilot Trial</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4">Company & Client</th>
              <th className="p-4">Contact Channels</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Portal Status</th>
              <th className="p-4">Total Billed</th>
              <th className="p-4">Collected</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[#111827] text-sm">{c.company_name}</div>
                  <div className="text-[#64748B] text-xs mt-0.5">{c.contact_person}</div>
                </td>
                <td className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#111827]">
                    <Mail className="size-3 text-[#64748B]" />
                    <span>{c.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
                    <Phone className="size-3" />
                    <span>{c.phone}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium text-[11px]">
                    {c.industry}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#00B82E]">
                    <ShieldCheck className="size-3" />
                    <span>Portal Active</span>
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-[#111827]">
                  ₦{c.total_billed.toLocaleString()}
                </td>
                <td className="p-4 font-mono font-bold text-[#00B82E]">
                  ₦{c.total_paid.toLocaleString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPortalAsClient(c)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#00B82E] text-[11px] font-bold cursor-pointer"
                    title="Open workspace as this client"
                  >
                    <ExternalLink className="size-3" />
                    <span>Portal</span>
                  </button>

                  <a
                    href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#111827] text-[11px] font-bold"
                  >
                    <WhatsAppIcon className="size-3 text-[#00B82E]" />
                    <span>Chat</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedClient(c)}
                    className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[11px] font-bold text-[#111827] transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD CLIENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Add Client to CRM</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Wholesales"
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Tunde Bello"
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 801 234 5678"
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                    <option value="Logistics & Delivery">Logistics & Delivery</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Relationship Type</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value as Client['client_type'])}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="Project-Based">Project-Based</option>
                    <option value="Retainer">Monthly Retainer</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Trial">Pilot Trial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Address / Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT DETAILS SLIDE-OVER / MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0FDF4] text-[#00B82E] font-bold">
                  {selectedClient.client_type}
                </span>
                <h3 className="text-xl font-bold text-[#111827] mt-1">{selectedClient.company_name}</h3>
                <p className="text-xs text-[#64748B]">Contact: {selectedClient.contact_person}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="size-8 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dashboard Access */}
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#00B82E]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#00B82E]" />
                  <span className="text-xs font-bold text-[#111827]">Dashboard Access</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#00B82E] border border-[#00B82E]/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Client has dashboard access to view live automations, project milestones, invoices, and support tickets.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopyInvite(selectedClient)}
                  className="h-8 px-3 rounded-lg bg-white border border-[#00B82E]/40 text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="size-3.5 text-[#00B82E]" />
                  <span>Copy Invite Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPortalAsClient(selectedClient)}
                  className="h-8 px-3.5 rounded-lg bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Dashboard</span>
                </button>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#64748B]">Total Billed</span>
                <div className="text-lg font-mono font-bold text-[#111827]">
                  ₦{selectedClient.total_billed.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#64748B]">Total Collected</span>
                <div className="text-lg font-mono font-bold text-[#00B82E]">
                  ₦{selectedClient.total_paid.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Associated Projects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-2">
                <FolderKanban className="size-4 text-[#00B82E]" />
                <span>Client Projects</span>
              </h4>
              <div className="space-y-2">
                {projects
                  .filter((p) => p.client_id === selectedClient.id)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#111827]">{p.name}</div>
                        <div className="text-[11px] text-[#64748B] font-mono">
                          Budget: ₦{p.budget.toLocaleString()}
                        </div>
                      </div>
                      <span className="font-bold text-[#00B82E] capitalize text-[11px]">
                        {p.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Associated Invoices */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-2">
                <Receipt className="size-4 text-[#00B82E]" />
                <span>Invoices & Billing History</span>
              </h4>
              <div className="space-y-2">
                {invoices
                  .filter((i) => i.client_id === selectedClient.id)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#111827]">{inv.invoice_number}</div>
                        <div className="text-[10px] font-mono text-[#64748B]">
                          Issued: {inv.issue_date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#111827]">
                          ₦{inv.total.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-bold text-[#00B82E] capitalize">
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
