import { useState } from 'react'
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  ExternalLink,
  X,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { Expense, Invoice } from '@/lib/businessStore'
import type { ZhenbotTransaction } from '@/types/database'
import { useToast } from '@/contexts/ToastContext'

interface AdminFinanceProps {
  expenses: Expense[]
  invoices: Invoice[]
  transactions: ZhenbotTransaction[]
  onApproveTx: (tx: ZhenbotTransaction) => void
  onRejectTx: (txId: string) => void
  actionLoadingId: string | null
  getExplorerUrl: (tx: ZhenbotTransaction) => { name: string; url: string } | null
  onRefresh: () => void
}

export function AdminFinance({
  expenses,
  invoices,
  transactions,
  onApproveTx,
  onRejectTx,
  actionLoadingId,
  getExplorerUrl,
  onRefresh,
}: AdminFinanceProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<'expenses' | 'transactions' | 'cashflow'>('expenses')
  const [search, setSearch] = useState('')
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  // Expense form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Expense['category']>('Software & Subscriptions')
  const [amount, setAmount] = useState(50000)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<Expense['payment_method']>('Bank Transfer')
  const [vendor, setVendor] = useState('')
  const [description, setDescription] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || amount <= 0) {
      toast.error('Please enter expense title and valid amount.')
      return
    }

    businessStore.addExpense({
      title: title.trim(),
      category,
      amount: Number(amount),
      date,
      payment_method: paymentMethod,
      vendor: vendor.trim() || 'Direct Vendor',
      description: description.trim(),
      is_recurring: isRecurring,
    })

    toast.success('Expense recorded successfully!')
    setIsAddExpenseOpen(false)
    setTitle('')
    setVendor('')
    setDescription('')
    onRefresh()
  }

  // Calculations
  const totalCollectedRevenue = invoices
    .filter((i) => i.status === 'paid' || i.status === 'partially_paid')
    .reduce((sum, i) => sum + (i.amount_paid || 0), 0)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netOperatingProfit = totalCollectedRevenue - totalExpenses

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.vendor.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.user?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (tx.tx_hash || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#64748B] mb-2">
            <TrendingUp className="size-4 text-[#00B82E]" />
            <span>Collected Cashflow (Inflow)</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#00B82E]">
            ₦{totalCollectedRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">From verified client invoices & retainers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#64748B] mb-2">
            <TrendingDown className="size-4 text-[#EF4444]" />
            <span>Operating Expenses (Outflow)</span>
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#EF4444]">
            ₦{totalExpenses.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Tools, cloud hosting, APIs, & contractors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-bold text-[#64748B] mb-2">
            <DollarSign className="size-4 text-[#111827]" />
            <span>Net Operating Balance</span>
          </div>
          <div
            className={`text-2xl font-mono font-extrabold ${
              netOperatingProfit >= 0 ? 'text-[#111827]' : 'text-red-600'
            }`}
          >
            ₦{netOperatingProfit.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">Realized operating surplus</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-2">
          {[
            { id: 'expenses', label: 'Business Expenses', count: expenses.length },
            { id: 'transactions', label: 'Payment Verifications', count: transactions.filter((t) => t.status === 'pending').length },
            { id: 'cashflow', label: 'Financial Summary' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'expenses' | 'transactions' | 'cashflow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#00B82E] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>{tab.label}</span>
              {Boolean(tab.count && tab.count > 0) && (
                <span className="size-4 rounded-full bg-white text-[#00B82E] text-[10px] font-mono font-bold flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          {activeTab === 'expenses' && (
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: EXPENSES TABLE */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Expense Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#111827]">{exp.title}</div>
                    <div className="text-[11px] text-[#64748B]">{exp.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-[#111827]">{exp.vendor}</td>
                  <td className="p-4 font-mono font-bold text-[#EF4444]">-₦{exp.amount.toLocaleString()}</td>
                  <td className="p-4 font-mono text-[#64748B]">{exp.date}</td>
                  <td className="p-4 text-[#64748B]">{exp.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS & APPROVALS (Preserving legacy verification logic) */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Tx ID / Type</th>
                <th className="p-4">Investor / Client</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Network / Proof</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredTransactions.map((tx) => {
                const explorer = getExplorerUrl(tx)
                const isPending = tx.status === 'pending'
                return (
                  <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-[#111827]">{tx.id.slice(0, 8)}...</div>
                      <span className="text-[10px] font-bold uppercase text-[#00B82E]">{tx.type}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#111827]">{tx.user?.full_name || 'Anonymous User'}</div>
                      <div className="text-[11px] text-[#64748B]">{tx.user?.email}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-[#111827]">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="text-[11px] font-mono text-[#64748B]">{tx.network || 'USDT'}</div>
                      {explorer && (
                        <a
                          href={explorer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[#0090FE] hover:underline"
                        >
                          <span>{explorer.name}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'completed' || tx.status === 'approved'
                            ? 'bg-[#F0FDF4] text-[#00B82E]'
                            : tx.status === 'rejected'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-700 animate-pulse'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onApproveTx(tx)}
                            disabled={actionLoadingId === 'approve_' + tx.id}
                            className="px-3 py-1 rounded-lg bg-[#00B82E] hover:bg-[#008F27] text-white font-bold text-xs cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectTx(tx.id)}
                            disabled={actionLoadingId === 'reject_' + tx.id}
                            className="px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] font-mono text-[#64748B]">Audited</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#64748B]">
                    No transactions matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: CASHFLOW BREAKDOWN */}
      {activeTab === 'cashflow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#111827]">Revenue By Invoice Category</h3>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] text-xs">
                  <div>
                    <div className="font-bold text-[#111827]">{inv.client_name}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">{inv.invoice_number}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#00B82E]">₦{inv.total.toLocaleString()}</div>
                    <span className="text-[10px] font-bold uppercase text-[#64748B]">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#111827]">Major Expense Vendors</h3>
            <div className="space-y-3">
              {expenses.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] text-xs">
                  <div>
                    <div className="font-bold text-[#111827]">{exp.vendor}</div>
                    <div className="text-[10px] text-[#64748B]">{exp.category}</div>
                  </div>
                  <div className="font-mono font-bold text-red-600">-₦{exp.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECORD EXPENSE MODAL */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Record Operating Expense</h3>
              <button
                type="button"
                onClick={() => setIsAddExpenseOpen(false)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cloudflare Enterprise Edge & DDoS"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Expense['category'])}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="Software & Subscriptions">Software & Subscriptions</option>
                    <option value="Infrastructure & Hosting">Infrastructure & Hosting</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Salaries & Contractors">Salaries & Contractors</option>
                    <option value="Office Expenses">Office Expenses</option>
                    <option value="Operations">Operations</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Amount (₦) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. AWS / Meta Platforms"
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as Expense['payment_method'])}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Corporate Card">Corporate Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="recurringExpense"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded text-[#00B82E] focus:ring-[#00B82E]"
                  />
                  <label htmlFor="recurringExpense" className="text-xs text-[#64748B] cursor-pointer">
                    Recurring monthly expense
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context or purpose of expenditure..."
                  className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
