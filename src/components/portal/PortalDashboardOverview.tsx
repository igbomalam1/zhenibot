import {
  FolderKanban,
  Zap,
  CheckCircle2,
  Receipt,
  CreditCard,
  Headphones,
  ArrowRight,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react'
import type { Project, Invoice } from '@/lib/businessStore'
import type { ClientAutomation, AutomationExecutionLog, ClientSupportTicket } from '@/lib/portalStore'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

interface PortalDashboardOverviewProps {
  projects: Project[]
  automations: ClientAutomation[]
  invoices: Invoice[]
  logs: AutomationExecutionLog[]
  tickets: ClientSupportTicket[]
  companyName: string
  onNavigate: (section: any) => void
}

export function PortalDashboardOverview({
  projects,
  automations,
  invoices,
  logs,
  tickets,
  companyName,
  onNavigate,
}: PortalDashboardOverviewProps) {
  const activeProjects = projects.filter(
    (p) => p.status === 'in_progress' || p.status === 'testing' || p.status === 'planning'
  )
  const completedProjects = projects.filter((p) => p.status === 'completed')

  const outstandingInvoices = invoices.filter(
    (i) => i.status !== 'paid' && i.status !== 'cancelled'
  )
  const outstandingAmount = outstandingInvoices.reduce(
    (sum, i) => sum + (i.total - (i.amount_paid || 0)),
    0
  )

  const totalPaymentsMade = invoices.reduce((sum, i) => sum + (i.amount_paid || 0), 0)

  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress')

  const activeAutomations = automations.filter((a) => a.status === 'active')

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] text-white p-7 sm:p-8 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-full bg-[#00B82E]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B82E]/20 text-[#00B82E] text-xs font-bold border border-[#00B82E]/30">
            <span className="size-2 rounded-full bg-[#00B82E] animate-ping" />
            <span>Operational Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {companyName}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Monitor the custom software and automations Zhenbot has deployed for your business.
            Track live milestones, review automated transaction records, and request direct operational changes.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="h-10 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Projects</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('automations')}
              className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer border border-white/10"
            >
              <span>Automation Systems ({automations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. TOP KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Active Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#EFF6FF] text-[#0090FE] flex items-center justify-center mb-3">
            <FolderKanban className="size-4" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Active Projects</div>
          <div className="text-2xl font-extrabold text-[#111827] mt-1">{activeProjects.length}</div>
        </div>

        {/* Active Automations */}
        <div
          onClick={() => onNavigate('automations')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-3">
            <Zap className="size-4" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Automations</div>
          <div className="text-2xl font-extrabold text-[#111827] mt-1">
            {activeAutomations.length}
            <span className="text-[10px] text-[#00B82E] font-bold ml-1.5">Live</span>
          </div>
        </div>

        {/* Completed Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#F8FAFC] text-[#111827] flex items-center justify-center mb-3">
            <CheckCircle2 className="size-4 text-[#00B82E]" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Completed</div>
          <div className="text-2xl font-extrabold text-[#111827] mt-1">{completedProjects.length}</div>
        </div>

        {/* Outstanding Invoices */}
        <div
          onClick={() => onNavigate('invoices')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-3">
            <Receipt className="size-4" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Pending Invoices</div>
          <div className="text-xl font-extrabold text-[#111827] mt-1">
            {outstandingAmount > 0 ? `₦${(outstandingAmount / 1000).toFixed(0)}K` : '₦0'}
          </div>
        </div>

        {/* Total Payments Made */}
        <div
          onClick={() => onNavigate('payments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-3">
            <CreditCard className="size-4" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Total Paid</div>
          <div className="text-xl font-extrabold text-[#111827] mt-1">
            ₦{(totalPaymentsMade / 1000).toFixed(0)}K
          </div>
        </div>

        {/* Open Support Tickets */}
        <div
          onClick={() => onNavigate('support')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all cursor-pointer group"
        >
          <div className="size-8 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center mb-3">
            <Headphones className="size-4" />
          </div>
          <div className="text-[11px] font-semibold text-[#64748B]">Support Requests</div>
          <div className="text-2xl font-extrabold text-[#111827] mt-1">{openTickets.length}</div>
        </div>
      </div>

      {/* 2. PROJECT OVERVIEW & AUTOMATION HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Active Projects & Milestones */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Active Projects & Delivery</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Current progress and milestones Zhenbot is building for you
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-[#00B82E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>All Projects</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const nextMilestone = project.milestones.find((m) => m.status !== 'completed')
              return (
                <div
                  key={project.id}
                  onClick={() => onNavigate('projects')}
                  className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white hover:border-[#00B82E]/40 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#111827]">{project.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0090FE] font-bold">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#00B82E] shrink-0">
                      {project.progress}% Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#00B82E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  {/* Next Milestone & Delivery */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#64748B] pt-1 gap-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-[#00B82E]" />
                      <span>
                        Next Milestone:{' '}
                        <strong className="text-[#111827]">
                          {nextMilestone ? nextMilestone.title : 'All Milestones Cleared'}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-[#64748B]" />
                      <span>Target Delivery: {project.expected_delivery}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {projects.length === 0 && (
              <div className="py-12 text-center text-xs text-[#64748B]">
                No active projects assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* Right (5 cols): Live Automations Monitor */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Deployed Automations</h3>
                <p className="text-xs text-[#64748B]">Real-time operational status</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('automations')}
                className="text-xs font-semibold text-[#00B82E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {automations.map((auto) => (
                <div
                  key={auto.id}
                  onClick={() => onNavigate('automations')}
                  className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#00B82E]/40 bg-[#F8FAFC] hover:bg-white transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] truncate max-w-[200px]">
                      {auto.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
                      <span className="size-1.5 rounded-full bg-[#00B82E] animate-pulse" />
                      Active ({auto.uptime_percentage}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-1">{auto.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono pt-1">
                    <span>Executions: {auto.total_executions.toLocaleString()}</span>
                    <span>Last run: {new Date(auto.last_execution_at || Date.now()).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}

              {automations.length === 0 && (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  No live automations connected yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Support / Contact Card */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#00B82E]/30 text-xs space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="size-4 text-[#00B82E]" />
              <span className="font-bold text-[#111827]">Dedicated Project Manager</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Your assigned engineer is available for real-time adjustments and workflow improvements.
            </p>
            <a
              href="https://wa.me/2348000000000?text=Hello%20Zhenbot%20Team,%20following%20up%20from%20our%20Client%20Portal."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B82E] hover:underline pt-1"
            >
              <span>Message on WhatsApp</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY TIMELINE & UPCOMING ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Operational Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Recent Activity Timeline</h3>
              <p className="text-xs text-[#64748B]">Audited log of automation and project events</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-[#00B82E] hover:underline cursor-pointer"
            >
              Reports & Logs
            </button>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E7EB]">
            {logs.slice(0, 4).map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-6 top-1 size-3 rounded-full bg-[#00B82E] border-2 border-white shadow-xs" />
                <div className="text-xs font-bold text-[#111827]">{log.event_name}</div>
                <p className="text-xs text-[#64748B] mt-0.5">{log.payload_summary}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#94A3B8] font-mono">
                  <span>{new Date(log.executed_at).toLocaleString()}</span>
                  <span>•</span>
                  <span>Latency: {log.duration_ms}ms</span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-6 text-center text-xs text-[#64748B]">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Action Items (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Upcoming Items</h3>
            <p className="text-xs text-[#64748B]">Approvals, milestones, and invoice due dates</p>
          </div>

          <div className="space-y-3">
            {/* Outstanding invoice alert if any */}
            {outstandingInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => onNavigate('invoices')}
                className="p-3.5 rounded-xl border border-[#EF4444]/20 bg-[#FEF2F2] flex items-center justify-between cursor-pointer hover:bg-[#FEE2E2] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="size-4 text-[#EF4444] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{inv.invoice_number}</div>
                    <div className="text-[11px] text-[#64748B]">
                      Due by {inv.due_date} (₦{(inv.total - (inv.amount_paid || 0)).toLocaleString()})
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#EF4444] underline">View</span>
              </div>
            ))}

            {/* Upcoming milestones */}
            {projects.flatMap((p) => p.milestones).filter((m) => m.status !== 'completed').slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="size-4 text-[#0090FE] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#111827]">{m.title}</div>
                    <div className="text-[11px] text-[#64748B]">Due by {m.due_date}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0090FE] capitalize">
                  {m.status.replace('_', ' ')}
                </span>
              </div>
            ))}

            {/* Documents preview shortcut */}
            <div
              onClick={() => onNavigate('documents')}
              className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="size-4 text-[#00B82E] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#111827]">Project Documents & Deliverables</div>
                  <div className="text-[11px] text-[#64748B]">Contracts, technical blueprints & manuals</div>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#64748B]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
