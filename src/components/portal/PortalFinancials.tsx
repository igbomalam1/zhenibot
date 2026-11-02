import { useState } from 'react'
import {
  Receipt,
  CreditCard,
  FileCheck2,
  Download,
  Printer,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import type { Invoice } from '@/lib/businessStore'
import type { ClientPayment } from '@/lib/portalStore'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'

interface PortalFinancialsProps {
  invoices: Invoice[]
  payments: ClientPayment[]
  companyName: string
  clientEmail: string
  defaultTab?: 'invoices' | 'payments' | 'receipts'
}

export function PortalFinancials({
  invoices,
  payments,
  companyName,
  clientEmail,
  defaultTab = 'invoices',
}: PortalFinancialsProps) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'receipts'>(defaultTab)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [previewReceipt, setPreviewReceipt] = useState<ClientPayment | null>(null)

  const unpaidInvoices = invoices.filter(
    (i) => i.status !== 'paid' && i.status !== 'cancelled'
  )
  const totalOutstanding = unpaidInvoices.reduce(
    (sum, i) => sum + (i.total - (i.amount_paid || 0)),
    0
  )
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)

  const statusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
            Paid in Full
          </span>
        )
      case 'partially_paid':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#F59E0B]">
            Partially Paid
          </span>
        )
      case 'overdue':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444]">
            Overdue
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0090FE]">
            Unpaid
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B]">Total Invoiced</span>
            <Receipt className="size-4 text-[#0090FE]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111827]">
            ₦{invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">{invoices.length} invoices generated</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B]">Total Payments Verified</span>
            <CreditCard className="size-4 text-[#00B82E]" />
          </div>
          <div className="text-2xl font-extrabold text-[#00B82E]">
            ₦{totalPaid.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Confirmed bank & Paystack transfers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#64748B]">Pending Balance</span>
            <Clock className="size-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#111827]">
            ₦{totalOutstanding.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">
            {unpaidInvoices.length > 0 ? `${unpaidInvoices.length} awaiting settlement` : 'All cleared'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'invoices'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <Receipt className="size-4" />
          <span>Invoices ({invoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <CreditCard className="size-4" />
          <span>Payments ({payments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'receipts'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>Official Receipts</span>
        </button>
      </div>

      {/* 1. INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB]">
            <h3 className="text-base font-bold text-[#111827]">Invoices Directory</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Review line items, milestone breakdowns, and payment statuses
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Invoice Number</th>
                  <th className="py-3 px-4 font-semibold">Project</th>
                  <th className="py-3 px-4 font-semibold">Issue Date</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Paid Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#111827] font-mono">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111827]">
                      {inv.project_name || 'Automation Services'}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{inv.issue_date}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{inv.due_date}</td>
                    <td className="py-3.5 px-4 font-bold text-[#111827]">
                      ₦{inv.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#00B82E]">
                      ₦{(inv.amount_paid || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">{statusBadge(inv.status)}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setPreviewInvoice(inv)}
                        className="h-8 px-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="size-3.5 text-[#64748B]" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB]">
            <h3 className="text-base font-bold text-[#111827]">Verified Payments Log</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Audited transaction records confirmed via banking webhooks or administrative clearance
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Payment Reference</th>
                  <th className="py-3 px-4 font-semibold">Associated Invoice</th>
                  <th className="py-3 px-4 font-semibold">Amount Paid</th>
                  <th className="py-3 px-4 font-semibold">Method</th>
                  <th className="py-3 px-4 font-semibold">Confirmed At</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-bold font-mono text-[#111827]">
                      {p.reference}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {p.invoice_number}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#00B82E]">
                      ₦{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111827]">
                      {p.payment_method}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {new Date(p.paid_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
                        <CheckCircle2 className="size-3" />
                        Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setPreviewReceipt(p)}
                        className="text-xs font-semibold text-[#00B82E] hover:underline cursor-pointer"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. RECEIPTS TAB */}
      {activeTab === 'receipts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
                  <FileCheck2 className="size-4.5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
                  Official Receipt
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-[#111827]">{p.reference}</div>
                <div className="text-[11px] text-[#64748B]">Invoice: {p.invoice_number}</div>
                <div className="text-xl font-extrabold text-[#111827] mt-2">
                  ₦{p.amount.toLocaleString()}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
                <span>{new Date(p.paid_at).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => setPreviewReceipt(p)}
                  className="font-bold text-[#00B82E] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>View Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INVOICE MODAL VIEW */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 border border-[#E5E7EB] shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-5">
              <div>
                <ZhenbotLogo variant="full" size="md" />
                <p className="text-xs text-[#64748B] mt-2">
                  Zhenbot Automation • automate@zhenibot.com • zhenibot.com
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewInvoice(null)}
                className="size-8 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-[#94A3B8] uppercase font-mono text-[10px] font-bold">
                  Billed To
                </span>
                <div className="font-bold text-[#111827] text-sm mt-0.5">
                  {previewInvoice.client_name}
                </div>
                <div className="text-[#64748B]">{previewInvoice.client_email}</div>
                <div className="text-[#64748B]">{previewInvoice.client_address}</div>
              </div>

              <div className="text-right space-y-1">
                <div>
                  <span className="text-[#94A3B8] uppercase font-mono text-[10px] font-bold">
                    Invoice Number:
                  </span>{' '}
                  <span className="font-bold text-[#111827] font-mono">
                    {previewInvoice.invoice_number}
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Issue Date:</span>{' '}
                  <span className="text-[#111827]">{previewInvoice.issue_date}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Due Date:</span>{' '}
                  <span className="text-[#111827] font-bold">{previewInvoice.due_date}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Description</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {previewInvoice.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-3 px-4 font-medium text-[#111827]">
                        {it.description}
                      </td>
                      <td className="py-3 px-3 text-center text-[#64748B]">{it.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#64748B]">
                        ₦{it.unit_price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#111827]">
                        ₦{it.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal</span>
                  <span className="font-mono">₦{previewInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[#111827] text-sm pt-2 border-t border-[#E5E7EB]">
                  <span>Total Amount</span>
                  <span>₦{previewInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#00B82E] font-bold pt-1">
                  <span>Amount Paid</span>
                  <span>₦{(previewInvoice.amount_paid || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Settlement Instructions */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs space-y-1">
              <div className="font-bold text-[#111827]">Payment Instructions</div>
              <p className="text-[#64748B]">
                Direct Bank Transfer: Providus Bank / Zhenbot Technologies Ltd • Acct: 0100994411
              </p>
              <p className="text-[#64748B]">
                Or settle instantly via Paystack link dispatched to {clientEmail}.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-10 px-5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="size-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL VIEW */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 border border-[#E5E7EB] shadow-2xl text-center">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewReceipt(null)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mx-auto size-14 rounded-full bg-[#F0FDF4] border-2 border-[#00B82E] flex items-center justify-center text-[#00B82E]">
              <ShieldCheck className="size-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00B82E] font-bold">
                Official Payment Receipt
              </span>
              <h3 className="text-xl font-extrabold text-[#111827]">Payment Confirmed</h3>
              <p className="text-xs text-[#64748B]">{companyName}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E5E7EB] space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Reference</span>
                <span className="font-mono font-bold text-[#111827]">
                  {previewReceipt.reference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Invoice</span>
                <span className="font-mono text-[#111827]">{previewReceipt.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount</span>
                <span className="font-bold text-[#00B82E]">
                  ₦{previewReceipt.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Method</span>
                <span className="text-[#111827]">{previewReceipt.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date</span>
                <span className="text-[#111827]">
                  {new Date(previewReceipt.paid_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full h-10 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="size-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
