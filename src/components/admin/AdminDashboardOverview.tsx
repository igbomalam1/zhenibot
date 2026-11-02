import { useState } from 'react'
import {
  Users,
  FolderKanban,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Receipt,
  ChevronDown,
} from 'lucide-react'
import type { Client, Project, Invoice, Expense, LeadEnquiry } from '@/lib/businessStore'
import type { ZhenbotChatThread } from '@/types/database'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

interface DashboardOverviewProps {
  clients: Client[]
  projects: Project[]
  invoices: Invoice[]
  expenses: Expense[]
  enquiries: LeadEnquiry[]
  chatThreads: ZhenbotChatThread[]
  onNavigate: (section: string) => void
}

export function AdminDashboardOverview({
  clients,
  projects,
  invoices,
  expenses,
  enquiries,
  chatThreads,
  onNavigate,
}: DashboardOverviewProps) {
  const [chartPeriod, setChartPeriod] = useState<'Yearly' | 'Monthly' | 'Weekly'>('Yearly')
  const [incomesPeriod, setIncomesPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly')
  const [categoryPeriod, setCategoryPeriod] = useState<'Yearly' | 'Monthly'>('Yearly')

  // Calculate real figures
  const totalRevenue = invoices
    .filter((i) => i.status === 'paid' || i.status === 'partially_paid')
    .reduce((sum, i) => sum + (i.amount_paid || 0), 0)

  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + (i.total - (i.amount_paid || 0)), 0)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'in_progress' || p.status === 'testing' || p.status === 'planning',
  ).length

  const pendingEnquiriesCount = enquiries.filter(
    (e) => e.status === 'new' || e.status === 'unread' || e.status === 'contacted',
  ).length

  const unreadChatsCount = chatThreads.filter((t) => t.unread_by_admin).length

  return (
    <div className="space-y-7">
      {/* 1. TOP KPI SUMMARY CARDS (Exact Salesify Reference Match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Users / Clients */}
        <div
          onClick={() => onNavigate('clients')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Users className="size-4.5" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Users</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-[#111827]">{clients.length || 80}</span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#00B82E] bg-[#F0FDF4] px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="size-3 mr-0.5" />
              7.4%
            </span>
            <span className="text-[11px] text-[#64748B] ml-auto">from last week</span>
          </div>
        </div>

        {/* Card 2: Expense Amount */}
        <div
          onClick={() => onNavigate('expenses')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
              <Receipt className="size-4.5" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Expense Amount</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-[#111827]">
              {totalExpenses > 0 ? `₦${(totalExpenses / 1000).toFixed(1)}K` : '3.4K'}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] px-1.5 py-0.5 rounded-md">
              <ArrowDownRight className="size-3 mr-0.5" />
              20%
            </span>
            <span className="text-[11px] text-[#64748B] ml-auto">from last week</span>
          </div>
        </div>

        {/* Card 3: Income Amount */}
        <div
          onClick={() => onNavigate('invoices')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
              <DollarSign className="size-4.5" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Income Amount</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-[#111827]">
              {totalRevenue > 0 ? `₦${(totalRevenue / 1000).toFixed(0)}K` : '90K'}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] px-1.5 py-0.5 rounded-md">
              <ArrowDownRight className="size-3 mr-0.5" />
              10.4%
            </span>
            <span className="text-[11px] text-[#64748B] ml-auto">
              ₦{totalOutstanding.toLocaleString()} pending
            </span>
          </div>
        </div>

        {/* Card 4: Active Automations */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="size-9 rounded-xl bg-[#EFF6FF] text-[#0090FE] flex items-center justify-center">
              <FolderKanban className="size-4.5" />
            </div>
            <span className="text-xs font-bold text-[#64748B]">Active Automations</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-[#111827]">
              {activeProjectsCount || 12}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#00B82E] bg-[#F0FDF4] px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="size-3 mr-0.5" />
              18%
            </span>
            <span className="text-[11px] text-[#64748B] ml-auto">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CHARTS SECTION (Yearly invoices amounts & Incomes donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (8 cols): Yearly invoices amounts */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Yearly invoices amounts</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Total billed and realized automation projects over time
              </p>
            </div>
            <div className="relative">
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as 'Yearly' | 'Monthly' | 'Weekly')}
                className="appearance-none text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#00B82E] cursor-pointer"
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
              <ChevronDown className="size-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SVG Vector Line Chart with Soft Grid */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              <defs>
                <linearGradient id="chartLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00B82E" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00B82E" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="40" y1="30" x2="680" y2="30" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="40" y1="75" x2="680" y2="75" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="40" y1="120" x2="680" y2="120" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="40" y1="165" x2="680" y2="165" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="40" y1="210" x2="680" y2="210" stroke="#F1F5F9" strokeWidth="1.5" />

              {/* Y Axis Labels matching Salesify: 4B, 3B, 2B, 1B, 0 */}
              <text x="15" y="34" className="text-[11px] fill-[#94A3B8] font-medium">4B</text>
              <text x="15" y="79" className="text-[11px] fill-[#94A3B8] font-medium">3B</text>
              <text x="15" y="124" className="text-[11px] fill-[#94A3B8] font-medium">2B</text>
              <text x="15" y="169" className="text-[11px] fill-[#94A3B8] font-medium">1B</text>
              <text x="20" y="214" className="text-[11px] fill-[#94A3B8] font-medium">0</text>

              {/* Fill Area under curve */}
              <polygon
                points="60,210 160,165 260,185 360,145 460,70 560,80 660,60 660,210 60,210"
                fill="url(#chartLineGrad)"
              />

              {/* Smooth Trend Line matching Salesify */}
              <polyline
                points="60,210 160,165 260,185 360,145 460,70 560,80 660,60"
                fill="none"
                stroke="#00B82E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Peak High Point */}
              <circle cx="460" cy="70" r="4.5" fill="#00B82E" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="660" cy="60" r="5" fill="#00B82E" stroke="#FFFFFF" strokeWidth="2.5" />

              {/* X Axis Labels matching Salesify: 2020, 2021, 2022, 2023, 2024, 2025 */}
              <text x="145" y="234" className="text-[11px] fill-[#94A3B8] font-medium">2020</text>
              <text x="245" y="234" className="text-[11px] fill-[#94A3B8] font-medium">2021</text>
              <text x="345" y="234" className="text-[11px] fill-[#94A3B8] font-medium">2022</text>
              <text x="445" y="234" className="text-[11px] fill-[#94A3B8] font-medium">2023</text>
              <text x="545" y="234" className="text-[11px] fill-[#94A3B8] font-medium">2024</text>
              <text x="645" y="234" className="text-[11px] fill-[#00B82E] font-semibold">2025</text>
            </svg>
          </div>
        </div>

        {/* Right Chart (4 cols): Incomes Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#111827]">Incomes</h3>
            <div className="relative">
              <select
                value={incomesPeriod}
                onChange={(e) => setIncomesPeriod(e.target.value as 'Weekly' | 'Monthly' | 'Yearly')}
                className="appearance-none text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-2.5 pr-6 py-1 focus:outline-none cursor-pointer"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <ChevronDown className="size-3 text-[#64748B] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Clean Segmented Pie / Donut Chart */}
          <div className="flex items-center justify-center my-3 relative">
            <svg className="size-48" viewBox="0 0 100 100">
              {/* Electronics / WhatsApp Automation (Olive lime #84CC16) */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#84CC16"
                strokeWidth="20"
                strokeDasharray="40 180"
                strokeDashoffset="25"
              />
              {/* Accessories / Delivery Logistics (Warm Gold #FACC15) */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#FACC15"
                strokeWidth="20"
                strokeDasharray="65 155"
                strokeDashoffset="-15"
              />
              {/* Software / Core Automations (Vibrant Green #00B82E) */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#00B82E"
                strokeWidth="20"
                strokeDasharray="80 140"
                strokeDashoffset="-80"
              />
              {/* Maintenance / Retainer (Forest Green #15803D) */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#15803D"
                strokeWidth="20"
                strokeDasharray="35 185"
                strokeDashoffset="-160"
              />
            </svg>
          </div>

          {/* Legend matching Salesify style */}
          <div className="grid grid-cols-2 gap-2.5 text-xs pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#84CC16]" />
              <span className="text-[#64748B] text-xs">Electronics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#FACC15]" />
              <span className="text-[#64748B] text-xs">Accessories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#00B82E]" />
              <span className="text-[#64748B] text-xs">Software</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#15803D]" />
              <span className="text-[#64748B] text-xs">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER CHARTS ROW (Income category bar chart & Yearly orders amounts matching Salesify) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income category bar chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Income category</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Distribution across primary revenue streams</p>
            </div>
            <div className="relative">
              <select
                value={categoryPeriod}
                onChange={(e) => setCategoryPeriod(e.target.value as 'Yearly' | 'Monthly')}
                className="appearance-none text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#00B82E] cursor-pointer"
              >
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <ChevronDown className="size-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SVG Bar Chart with Salesify Green Rounded Bars */}
          <div className="relative h-56 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              {/* Horizontal Grid lines: 9B, 6B, 4B, 2B, 0 */}
              <line x1="35" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="35" y1="65" x2="480" y2="65" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="35" y1="110" x2="480" y2="110" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="35" y1="155" x2="480" y2="155" stroke="#F1F5F9" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="12" y="24" className="text-[11px] fill-[#94A3B8] font-medium">9B</text>
              <text x="12" y="69" className="text-[11px] fill-[#94A3B8] font-medium">6B</text>
              <text x="12" y="114" className="text-[11px] fill-[#94A3B8] font-medium">4B</text>
              <text x="12" y="159" className="text-[11px] fill-[#94A3B8] font-medium">2B</text>

              {/* Bar 1 */}
              <rect x="60" y="25" width="42" height="155" rx="6" fill="#86EFAC" />
              {/* Bar 2 */}
              <rect x="155" y="70" width="42" height="110" rx="6" fill="#86EFAC" />
              {/* Bar 3 */}
              <rect x="250" y="115" width="42" height="65" rx="6" fill="#86EFAC" />
              {/* Bar 4 */}
              <rect x="345" y="60" width="42" height="120" rx="6" fill="#86EFAC" />
              {/* Bar 5 */}
              <rect x="430" y="125" width="42" height="55" rx="6" fill="#86EFAC" />
            </svg>
          </div>
        </div>

        {/* Yearly orders amounts multi-line chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Yearly orders amounts</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Annual order volume and fulfillment frequency</p>
            </div>
            <div className="relative">
              <select className="appearance-none text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#00B82E] cursor-pointer">
                <option>Yearly</option>
                <option>Monthly</option>
              </select>
              <ChevronDown className="size-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SVG Line Chart with Grid: 70,000, 52,500, 35,000, 17,500 */}
          <div className="relative h-56 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              <line x1="50" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="50" y1="65" x2="480" y2="65" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="50" y1="110" x2="480" y2="110" stroke="#F1F5F9" strokeWidth="1.5" />
              <line x1="50" y1="155" x2="480" y2="155" stroke="#F1F5F9" strokeWidth="1.5" />

              <text x="5" y="24" className="text-[10px] fill-[#94A3B8] font-medium">70,000</text>
              <text x="5" y="69" className="text-[10px] fill-[#94A3B8] font-medium">52,500</text>
              <text x="5" y="114" className="text-[10px] fill-[#94A3B8] font-medium">35,000</text>
              <text x="5" y="159" className="text-[10px] fill-[#94A3B8] font-medium">17,500</text>

              {/* Curve 1 (Green) */}
              <polyline
                points="60,165 140,160 220,135 300,140 380,95 460,80"
                fill="none"
                stroke="#00B82E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Curve 2 (Soft Teal / Blue) */}
              <polyline
                points="60,175 140,170 220,155 300,160 380,130 460,115"
                fill="none"
                stroke="#0090FE"
                strokeWidth="2"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. LOWER OPERATIONS WORKSPACE: Recent Inquiries & Live Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Latest Website Form Inquiries & Leads */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Recent Website Inquiries</h3>
              <p className="text-xs text-[#64748B]">Real-time submissions from your public landing page</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-[#00B82E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({pendingEnquiriesCount})</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white hover:border-[#00B82E]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#111827]">{enq.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E] font-bold">
                      {enq.business_name}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{enq.details}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#64748B] font-mono">
                    <span>{enq.phone}</span>
                    <span>•</span>
                    <span>{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20this%20is%20Zhenbot%20Automation%20following%20up%20on%20your%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 rounded-lg bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Open WhatsApp chat"
                  >
                    <WhatsAppIcon className="size-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate('leads')}
                    className="h-8 px-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}

            {enquiries.length === 0 && (
              <div className="py-8 text-center text-xs text-[#64748B]">
                No pending inquiries. All caught up!
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): Live Projects & Live Chat Quick Alert */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Projects Widget */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827]">Active Projects</h3>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="text-xs font-semibold text-[#00B82E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Board View</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {projects.slice(0, 3).map((prj) => (
                <div key={prj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111827] truncate max-w-[200px]">{prj.name}</span>
                    <span className="font-mono text-[11px] font-bold text-[#00B82E]">{prj.progress}%</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#00B82E] h-full rounded-full transition-all duration-300"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <span>{prj.client_name}</span>
                    <span>Due: {prj.expected_delivery}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unread Live Chat Quick Alert */}
          <div className="bg-gradient-to-br from-[#111827] to-[#1E293B] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00B82E] animate-ping" />
                <span className="text-xs font-mono uppercase text-[#00B82E] font-bold">
                  Website Live Chat
                </span>
              </div>
              <h4 className="text-sm font-bold">
                {unreadChatsCount > 0 ? `${unreadChatsCount} Unread Conversations` : 'Chat Support Ready'}
              </h4>
              <p className="text-xs text-white/70">
                Visitors are interacting with the landing page widget in real time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('chats')}
              className="h-9 px-3.5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Open Inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
