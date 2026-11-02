import { useState } from 'react'
import {
  Plus,
  Search,
  Printer,
  X,
  Trash2,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { Invoice, Client, Project, InvoiceItem } from '@/lib/businessStore'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { useToast } from '@/contexts/ToastContext'

interface AdminInvoicesProps {
  invoices: Invoice[]
  clients: Client[]
  projects: Project[]
  onRefresh: () => void
}

export function AdminInvoices({ invoices, clients, projects, onRefresh }: AdminInvoicesProps) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null)

  // Payment recording state
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (Verified)')

  // Invoice creation form state
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
    { description: 'WhatsApp Business Sales Assistant & Verification Webhook', quantity: 1, unit_price: 550000 },
  ])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('Thank you for partnering with Zhenbot. Payment due within 7 business days.')

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 100000 }])
  }

  const removeItem = (idx: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, field: keyof Omit<InvoiceItem, 'id' | 'total'>, val: string | number) => {
    const updated = [...items]
    updated[idx] = { ...updated[idx], [field]: val }
    setItems(updated)
  }

  const calculatedItems: InvoiceItem[] = items.map((it, idx) => ({
    id: `item-${idx}`,
    description: it.description,
    quantity: Number(it.quantity) || 1,
    unit_price: Number(it.unit_price) || 0,
    total: (Number(it.quantity) || 1) * (Number(it.unit_price) || 0),
  }))

  const subtotal = calculatedItems.reduce((sum, it) => sum + it.total, 0)
  const total = Math.max(0, subtotal - discount)

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const client = clients.find((c) => c.id === clientId) || clients[0]
    const project = projects.find((p) => p.id === projectId)

    businessStore.addInvoice({
      client_id: client ? client.id : 'cli-gen',
      client_name: client ? client.company_name : 'General Client',
      client_email: client ? client.email : 'contact@client.com',
      client_address: client?.address || 'Nigeria',
      project_id: project?.id,
      project_name: project?.name,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items: calculatedItems,
      subtotal,
      discount,
      tax: 0,
      total,
      amount_paid: 0,
      status: 'sent',
      notes,
    })

    toast.success('Invoice created successfully!')
    setIsCreateOpen(false)
    onRefresh()
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentModalInvoice || paymentAmount <= 0) return

    businessStore.recordInvoicePayment(paymentModalInvoice.id, paymentAmount, paymentMethod)
    toast.success(`Payment of ₦${paymentAmount.toLocaleString()} recorded!`)
    setPaymentModalInvoice(null)
    onRefresh()
  }

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus
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
              placeholder="Search invoices..."
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
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="sent">Sent / Pending</option>
            <option value="draft">Draft</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Issue / Due Date</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-4 font-mono font-bold text-[#111827]">{inv.invoice_number}</td>
                <td className="p-4">
                  <div className="font-bold text-[#111827]">{inv.client_name}</div>
                  <div className="text-[11px] text-[#64748B]">{inv.client_email}</div>
                </td>
                <td className="p-4 font-mono text-[11px] text-[#64748B]">
                  <div>Issued: {inv.issue_date}</div>
                  <div>Due: {inv.due_date}</div>
                </td>
                <td className="p-4 font-mono font-bold text-[#111827]">₦{inv.total.toLocaleString()}</td>
                <td className="p-4 font-mono font-bold text-[#00B82E]">
                  ₦{(inv.amount_paid || 0).toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inv.status === 'paid'
                        ? 'bg-[#F0FDF4] text-[#00B82E]'
                        : inv.status === 'partially_paid'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {inv.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentModalInvoice(inv)
                      setPaymentAmount(inv.total - (inv.amount_paid || 0))
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F0FDF4] hover:bg-[#00B82E] text-[#00B82E] hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                  >
                    + Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewInvoice(inv)}
                    className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[11px] font-bold text-[#111827] transition-colors cursor-pointer"
                  >
                    Preview / Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Generate Client Invoice</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Select Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name} ({c.contact_person})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Related Project</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="">None / General</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#111827]">Service Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-bold text-[#00B82E] hover:underline cursor-pointer"
                  >
                    + Add Line Item
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Service description"
                      value={it.description}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="flex-1 h-9 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                      className="w-16 h-9 rounded-xl border border-[#E5E7EB] px-2 text-xs font-mono text-center text-[#111827] focus:border-[#00B82E] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price (₦)"
                      value={it.unit_price}
                      onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))}
                      className="w-32 h-9 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="size-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Calculations Summary */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-[#111827]">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#64748B]">
                  <span>Discount (₦):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-28 h-7 text-right rounded border border-[#E5E7EB] px-2 font-mono text-xs text-[#111827]"
                  />
                </div>
                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between text-sm font-bold text-[#111827]">
                  <span>Total Payable:</span>
                  <span className="text-[#00B82E] font-mono">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Notes / Terms</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Record Confirmed Payment</h3>
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
                <div className="font-bold text-[#111827]">{paymentModalInvoice.invoice_number}</div>
                <div className="text-[#64748B] mt-0.5">{paymentModalInvoice.client_name}</div>
                <div className="mt-2 text-[#00B82E] font-mono font-bold">
                  Outstanding: ₦{(paymentModalInvoice.total - (paymentModalInvoice.amount_paid || 0)).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Amount Received (₦) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                >
                  <option value="Bank Transfer (Verified)">Bank Transfer (Verified)</option>
                  <option value="Paystack Direct Webhook">Paystack Direct Webhook</option>
                  <option value="Flutterwave Webhook">Flutterwave Webhook</option>
                  <option value="Corporate Cheque">Corporate Cheque</option>
                  <option value="Direct Cash Deposit">Direct Cash Deposit</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BRANDED INVOICE PREVIEW / PRINTABLE VIEW */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-8 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
            {/* Action Bar (Top) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] print:hidden">
              <div className="text-xs font-bold text-[#64748B] uppercase font-mono">Invoice Preview</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8.5 px-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoice(null)}
                  className="size-8 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Branded Invoice Sheet */}
            <div className="space-y-6 text-[#111827]">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <ZhenbotLogo variant="full" size="md" />
                  <p className="text-xs text-[#64748B] mt-2">
                    Official Business Automation Agency<br />
                    automate@zhenibot.com • zhenibot.com
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black uppercase text-[#111827] tracking-tight">INVOICE</div>
                  <div className="text-xs font-mono font-bold text-[#00B82E] mt-1">{previewInvoice.invoice_number}</div>
                  <div className="text-[11px] text-[#64748B] mt-1 font-mono">Date: {previewInvoice.issue_date}</div>
                  <div className="text-[11px] text-[#64748B] font-mono">Due: {previewInvoice.due_date}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
                <span className="font-mono uppercase text-[10px] text-[#64748B] font-bold">Billed To:</span>
                <div className="text-sm font-bold text-[#111827] mt-0.5">{previewInvoice.client_name}</div>
                <div className="text-[#64748B]">{previewInvoice.client_email}</div>
                {previewInvoice.client_address && (
                  <div className="text-[#64748B] mt-0.5">{previewInvoice.client_address}</div>
                )}
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Price</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {previewInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-[#111827]">{it.description}</td>
                      <td className="py-3 text-center font-mono">{it.quantity}</td>
                      <td className="py-3 text-right font-mono">₦{it.unit_price.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono font-bold text-[#111827]">₦{it.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Subtotal:</span>
                    <span className="font-mono text-[#111827]">₦{previewInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {previewInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-mono">-₦{previewInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-[#E5E7EB]">
                    <span>Total:</span>
                    <span className="font-mono text-[#00B82E]">₦{previewInvoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>Amount Paid:</span>
                    <span className="font-mono font-bold text-[#111827]">
                      ₦{(previewInvoice.amount_paid || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-4 border-t border-[#E5E7EB] text-xs text-[#64748B] space-y-1">
                <div className="font-bold text-[#111827]">Payment Instructions:</div>
                <p>Transfer to official Zhenbot corporate account or pay via Paystack invoice link.</p>
                <p className="text-[11px] italic">{previewInvoice.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
