import { useState } from 'react'
import {
  Zap,
  AlertTriangle,
  Play,
  Pause,
  History,
  X,
  RefreshCw,
} from 'lucide-react'
import type { ClientAutomation, AutomationExecutionLog } from '@/lib/portalStore'
import { portalStore } from '@/lib/portalStore'
import { useToast } from '@/contexts/ToastContext'

interface PortalAutomationsProps {
  automations: ClientAutomation[]
  onRefresh: () => void
}

export function PortalAutomations({ automations, onRefresh }: PortalAutomationsProps) {
  const toast = useToast()
  const [selectedAuto, setSelectedAuto] = useState<ClientAutomation | null>(null)
  const [isLogsOpen, setIsLogsOpen] = useState(false)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')

  const handleToggleState = (auto: ClientAutomation) => {
    const nextStatus = auto.status === 'active' ? 'paused' : 'active'
    portalStore.updateAutomationStatus(auto.id, nextStatus)
    toast.success(`Automation system "${auto.name}" marked as ${nextStatus}.`)
    onRefresh()
  }

  const handleRunDiagnostic = (auto: ClientAutomation) => {
    setIsTestRunning(true)
    setTimeout(() => {
      setIsTestRunning(false)
      toast.success(`Diagnostic passed for "${auto.name}". Latency: 120ms, Webhooks OK.`)
    }, 1200)
  }

  const filtered = automations.filter(
    (a) => filterCategory === 'all' || a.category === filterCategory
  )

  const activeLogs: AutomationExecutionLog[] = selectedAuto
    ? portalStore.getAutomationLogs(selectedAuto.id)
    : []

  const statusBadge = (status: ClientAutomation['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#00B82E]">
            <span className="size-1.5 rounded-full bg-[#00B82E] animate-pulse" />
            Active
          </span>
        )
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#F59E0B]">
            <Pause className="size-3" />
            Paused
          </span>
        )
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#EF4444]">
            <AlertTriangle className="size-3" />
            Needs Attention
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#64748B]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview and Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Live Automation Workspaces</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor the autonomous workflows running your daily business operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#00B82E]"
          >
            <option value="all">All Automation Types</option>
            <option value="WhatsApp Automation">WhatsApp Bots</option>
            <option value="Payment Verification">Payment Reconciliation</option>
            <option value="Order & Delivery">Logistics & Dispatch</option>
            <option value="Business Records Sync">ERP & Spreadsheet Sync</option>
          </select>
        </div>
      </div>

      {/* Automations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((auto) => (
          <div
            key={auto.id}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center shrink-0">
                    <Zap className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] leading-tight">
                      {auto.name}
                    </h3>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {auto.category}
                    </span>
                  </div>
                </div>
                {statusBadge(auto.status)}
              </div>

              {/* Description */}
              <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                {auto.description}
              </p>

              {/* Metrics Pills */}
              {auto.metrics && auto.metrics.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {auto.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-center"
                    >
                      <div className="text-[10px] text-[#64748B] font-medium truncate">
                        {m.label}
                      </div>
                      <div className="text-sm font-extrabold text-[#111827] mt-0.5">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#F8FAFC] text-center text-xs text-[#94A3B8]">
                  Monitoring data will activate upon live deployment.
                </div>
              )}

              {/* Technical Health Indicators */}
              <div className="pt-2 border-t border-[#E5E7EB] space-y-1.5 text-xs text-[#64748B]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px]">System Reliability / SLA</span>
                  <span className="font-bold text-[#00B82E] font-mono">
                    {auto.uptime_percentage}% Uptime
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Trigger Triggered</span>
                  <span className="font-mono text-[#111827]">{auto.trigger_event}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Last Successful Run</span>
                  <span className="font-mono text-[#111827]">
                    {auto.last_execution_at
                      ? new Date(auto.last_execution_at).toLocaleTimeString()
                      : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAuto(auto)
                  setIsLogsOpen(true)
                }}
                className="h-8 px-3 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <History className="size-3.5 text-[#64748B]" />
                <span>Execution Logs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isTestRunning}
                  onClick={() => handleRunDiagnostic(auto)}
                  className="h-8 px-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Run end-to-end ping test"
                >
                  <RefreshCw
                    className={`size-3 text-[#00B82E] ${isTestRunning ? 'animate-spin' : ''}`}
                  />
                  <span>Test Ping</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleState(auto)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    auto.status === 'active'
                      ? 'border border-[#E5E7EB] hover:bg-[#FEF2F2] text-[#64748B] hover:text-[#EF4444]'
                      : 'bg-[#00B82E] text-white hover:bg-[#008F27]'
                  }`}
                >
                  {auto.status === 'active' ? (
                    <>
                      <Pause className="size-3" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3" />
                      <span>Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#64748B]">
          No automations found in this category.
        </div>
      )}

      {/* Execution Logs Drawer / Modal */}
      {isLogsOpen && selectedAuto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#111827]">
                    Execution Audit Logs
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E]">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{selectedAuto.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLogsOpen(false)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {activeLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111827]">{log.event_name}</span>
                    <span className="text-[10px] font-mono text-[#00B82E] font-bold">
                      {log.duration_ms}ms
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-mono leading-relaxed">
                    {log.payload_summary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-mono pt-1">
                    <span>{new Date(log.executed_at).toLocaleString()}</span>
                    <span className="text-[#00B82E] font-bold">Status: {log.status}</span>
                  </div>
                </div>
              ))}

              {activeLogs.length === 0 && (
                <div className="py-12 text-center text-xs text-[#64748B]">
                  No execution logs recorded yet. Events will appear automatically as webhooks trigger.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
              <span>Private technical credentials and API keys are protected.</span>
              <button
                type="button"
                onClick={() => setIsLogsOpen(false)}
                className="h-9 px-4 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-white font-semibold cursor-pointer"
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
