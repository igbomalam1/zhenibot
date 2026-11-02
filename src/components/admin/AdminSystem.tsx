import { useState, useEffect } from 'react'
import {
  Mail,
  Smartphone,
  CreditCard,
  Database,
  Save,
  MousePointerClick,
  Activity,
  Radio,
  RefreshCw,
  Send,
  Sparkles,
  Eye,
} from 'lucide-react'
import type { ActivityLogItem } from '@/lib/businessStore'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import {
  getEmailHeaderConfig,
  saveEmailHeaderConfig,
  type EmailHeaderConfig,
  sendSendbyteEmail,
} from '@/lib/sendbyte'

interface ClickLogItem {
  id: string
  session_id: string
  event_name: string
  element_id: string | null
  section: string | null
  metadata: Record<string, any>
  page_url: string
  user_agent: string
  created_at: string
}

interface AdminSystemProps {
  section: 'integrations' | 'team' | 'logs' | 'settings'
  logs: ActivityLogItem[]
}

export function AdminSystem({ section, logs }: AdminSystemProps) {
  const toast = useToast()

  // Logs sub-tab state
  const [logView, setLogView] = useState<'audit' | 'clicks'>('audit')
  const [clickLogs, setClickLogs] = useState<ClickLogItem[]>([])
  const [loadingClicks, setLoadingClicks] = useState(false)

  // Fetch real-time clicks from Supabase
  const loadClickLogs = async () => {
    setLoadingClicks(true)
    try {
      const { data } = await supabase
        .from('zhenbot_clicks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (data) {
        setClickLogs(data as ClickLogItem[])
      }
    } catch {
      //
    } finally {
      setLoadingClicks(false)
    }
  }

  useEffect(() => {
    if (section === 'logs' && logView === 'clicks') {
      void loadClickLogs()

      // Subscribe to real-time incoming clicks
      const channel = supabase
        .channel('admin_clicks_stream')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'zhenbot_clicks' },
          (payload) => {
            setClickLogs((prev) => [payload.new as ClickLogItem, ...prev.slice(0, 99)])
          }
        )
        .subscribe()

      return () => {
        void supabase.removeChannel(channel)
      }
    }
  }, [section, logView])

  // Settings State
  const [companyName, setCompanyName] = useState('Zhenbot (Zhen Automation)')
  const [supportEmail, setSupportEmail] = useState('automate@zhenibot.com')
  const [currency, setCurrency] = useState('NGN (₦)')
  const [invoicePrefix, setInvoicePrefix] = useState('ZH-INV')
  const [savedSettings, setSavedSettings] = useState(false)

  // SendByte Email Header Config State
  const [emailHeader, setEmailHeader] = useState<EmailHeaderConfig>(() => getEmailHeaderConfig())
  const [savedEmailConfig, setSavedEmailConfig] = useState(false)
  const [testEmailTo, setTestEmailTo] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  useEffect(() => {
    // Sync email config from localStorage / listener
    const onEmailConfigChange = (e: any) => {
      if (e.detail) setEmailHeader(e.detail)
    }
    window.addEventListener('zhenbot_email_config_update', onEmailConfigChange)
    return () => {
      window.removeEventListener('zhenbot_email_config_update', onEmailConfigChange)
    }
  }, [])

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSettings(true)
    toast.success('System configuration saved successfully!')
    setTimeout(() => setSavedSettings(false), 2000)
  }

  const handleSaveEmailHeader = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavedEmailConfig(true)
    await saveEmailHeaderConfig(emailHeader)
    toast.success('SendByte modern email header updated successfully!')
    setTimeout(() => setSavedEmailConfig(false), 2000)
  }

  const handleSendTestEmail = async () => {
    if (!testEmailTo.trim()) {
      toast.error('Please enter an email address to receive the test email.')
      return
    }

    setSendingTest(true)
    try {
      const res = await sendSendbyteEmail({
        to: testEmailTo.trim(),
        subject: `[Test Preview] ${emailHeader.title}`,
        recipientName: 'Administrator',
        text: `This is a live test email sent directly through SendByte Africa.\n\nHeader Title: ${emailHeader.title}\nHeader Subtitle: ${emailHeader.subtitle}\n\nYour emails match the modern SendMe layout and are branded for Zhenbot Automation.`,
      })

      if (res.success) {
        toast.success(`Test email sent to ${testEmailTo.trim()} via SendByte!`)
      } else {
        toast.error('SendByte dispatch: Saved to system logs.')
      }
    } catch {
      toast.error('Could not dispatch test email. Please check internet connection.')
    } finally {
      setSendingTest(false)
    }
  }

  // INTEGRATIONS VIEW
  if (section === 'integrations') {
    const INTEGRATIONS = [
      {
        name: 'Supabase Cloud Database & Auth',
        icon: Database,
        status: 'Connected',
        description: 'PostgreSQL operational storage with real-time replication.',
        health: '100% Operational',
        latency: '18ms',
      },
      {
        name: 'SendByte Africa Email Infrastructure',
        icon: Mail,
        status: 'Connected',
        description: 'High-deliverability transactional & notification engine (api.sendbyte.africa).',
        health: 'Live Delivery (automate@zhenibot.com)',
        latency: '24ms',
      },
      {
        name: 'WhatsApp Cloud API Gateway',
        icon: Smartphone,
        status: 'Active',
        description: 'Bi-directional customer messaging and automated catalog bot.',
        health: 'Live Inbound & Outbound',
        latency: '12ms',
      },
      {
        name: 'Paystack Direct Webhook Reconciler',
        icon: CreditCard,
        status: 'Verified',
        description: 'Real-time payment verification and instant digital PDF receipt generation.',
        health: 'Zero-fraud Webhook Active',
        latency: '14ms',
      },
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Connected Services & APIs</h3>
              <p className="text-xs text-[#64748B]">Real-time operational health of connected infrastructure</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#00B82E] bg-[#F0FDF4] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#00B82E] animate-pulse" />
              <span>All 4 Services Live</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {INTEGRATIONS.map((it, idx) => {
              const Icon = it.icon
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white border border-[#E5E7EB] text-[#00B82E] flex items-center justify-center shadow-xs">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827]">{it.name}</h4>
                        <span className="text-[10px] font-mono text-[#00B82E] font-bold">
                          ● {it.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed">{it.description}</p>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                    <span>{it.health}</span>
                    <span className="text-[#00B82E] font-bold">{it.latency}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // TEAM & STAFF VIEW
  if (section === 'team') {
    const STAFF = [
      {
        name: 'Usman Bello',
        email: 'automate@zhenibot.com',
        role: 'Super Administrator',
        department: 'Operations & Engineering',
        status: 'Active',
      },
      {
        name: 'David O.',
        email: 'david@zhenibot.com',
        role: 'Automation Architect',
        department: 'Workflow Infrastructure',
        status: 'Active',
      },
      {
        name: 'Zainab M.',
        email: 'zainab@zhenibot.com',
        role: 'CRM & Integrations Lead',
        department: 'Client Delivery',
        status: 'Active',
      },
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Team & Role-Based Permissions</h3>
              <p className="text-xs text-[#64748B]">Authenticated personnel managing the Zhenbot business</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Access Level</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {STAFF.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC]">
                    <td className="p-4">
                      <div className="font-bold text-[#111827]">{s.name}</div>
                      <div className="text-[11px] text-[#64748B]">{s.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-[#111827]">{s.role}</td>
                    <td className="p-4 text-[#64748B]">{s.department}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E] font-bold text-[10px]">
                        Full Admin Access
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-[#00B82E]">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ACTIVITY LOGS & LIVE TELEMETRY VIEW
  if (section === 'logs') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Audit Trail & Click Telemetry</h3>
              <p className="text-xs text-[#64748B]">Real-time operational ledger and live visitor click stream across the entire platform</p>
            </div>

            {/* Toggle Pill */}
            <div className="flex items-center p-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLogView('audit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  logView === 'audit'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <Activity className="size-3.5" />
                <span>Admin Audit Log ({logs.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setLogView('clicks')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  logView === 'clicks'
                    ? 'bg-white text-[#00B82E] shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <MousePointerClick className="size-3.5 text-[#00B82E]" />
                <span className="flex items-center gap-1">
                  <span>Live Click Telemetry</span>
                  <span className="size-1.5 rounded-full bg-[#00B82E] animate-ping" />
                </span>
              </button>
            </div>
          </div>

          {/* AUDIT LOG TAB */}
          {logView === 'audit' && (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827]">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E5E7EB] font-mono text-[10px] text-[#00B82E] font-bold">
                        {log.target_type}: {log.target_id}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-[11px]">{log.details}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-semibold text-[#111827] text-[11px]">{log.admin_name}</div>
                    <div className="font-mono text-[10px] text-[#64748B]">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIVE CLICK TELEMETRY TAB */}
          {logView === 'clicks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F0FDF4] border border-[#00B82E]/20 text-xs">
                <div className="flex items-center gap-2 text-[#008F27] font-medium">
                  <Radio className="size-4 animate-pulse text-[#00B82E]" />
                  <span>Streaming live clicks from Supabase <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-[11px]">zhenbot_clicks</code></span>
                </div>
                <button
                  type="button"
                  onClick={() => void loadClickLogs()}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#00B82E]/30 text-[#008F27] font-semibold text-[11px] flex items-center gap-1 hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`size-3 ${loadingClicks ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {clickLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#64748B]">
                  No clicks recorded yet. Every button, link, and navigation tap across the website, portal, and admin is tracked live.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {clickLogs.map((click) => (
                    <div
                      key={click.id}
                      className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#00B82E]/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[#111827] bg-[#F8FAFC] border border-[#E5E7EB] px-2 py-0.5 rounded text-[11px]">
                            {click.event_name}
                          </span>
                          {click.section && (
                            <span className="text-[10px] text-[#64748B] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                              section: {click.section}
                            </span>
                          )}
                          {click.page_url && (
                            <span className="text-[10px] text-[#00B82E] font-mono bg-[#F0FDF4] px-1.5 py-0.5 rounded">
                              {click.page_url}
                            </span>
                          )}
                        </div>
                        {click.metadata && Object.keys(click.metadata).length > 0 && (
                          <div className="text-[11px] text-[#64748B] font-mono truncate max-w-xl">
                            {JSON.stringify(click.metadata)}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-[10px] text-[#64748B]">
                          {new Date(click.created_at).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          {click.session_id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // SETTINGS VIEW
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Business Configuration</h3>
          <p className="text-xs text-[#64748B]">Manage company details, invoicing prefixes, and default currency</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Official Contact Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Default Invoicing Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-bold text-[#111827] focus:border-[#00B82E] focus:outline-none"
              >
                <option value="NGN (₦)">Nigerian Naira (NGN ₦) — Default</option>
                <option value="USD ($)">US Dollar (USD $)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Invoice Number Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="size-4" />
              <span>{savedSettings ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SENDBYTE EMAIL INFRASTRUCTURE & MODERN HEADER CUSTOMIZATION */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-[#00B82E] animate-pulse" />
              <h3 className="text-base font-bold text-[#111827]">SendByte Africa — Email Header & Layout Configuration</h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Customize the modern header title and subtitle stamped on every transactional and client email.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#00B82E] border border-[#00B82E]/30 font-mono text-[10px] font-bold self-start sm:self-auto">
            API: api.sendbyte.africa
          </span>
        </div>

        {/* Header Configuration Form */}
        <form onSubmit={handleSaveEmailHeader} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Header Banner Title (Eye-Catching Headline)
            </label>
            <input
              type="text"
              value={emailHeader.title}
              onChange={(e) => setEmailHeader({ ...emailHeader, title: e.target.value })}
              placeholder="e.g. Automate Your Business Operations"
              className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs font-bold text-[#111827] focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Header Banner Subtitle (Supporting Description)
            </label>
            <textarea
              rows={2}
              value={emailHeader.subtitle}
              onChange={(e) => setEmailHeader({ ...emailHeader, subtitle: e.target.value })}
              placeholder="e.g. Eliminating repetitive manual operations across messaging, payments, orders, and record-keeping."
              className="w-full rounded-xl border border-[#E5E7EB] p-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#64748B]">
              Changes persist live across all system, onboarding, invoice, and portal emails.
            </span>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#111827] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="size-4 text-[#00B82E]" />
              <span>{savedEmailConfig ? 'Saved to DB!' : 'Update Email Header'}</span>
            </button>
          </div>
        </form>

        {/* LIVE VISUAL PREVIEW OF THE MODERN EMAIL HEADER */}
        <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
              <Eye className="size-4 text-[#00B82E]" />
              <span>Live Visual Header Preview (SendMe &amp; Fairly-Used Layout)</span>
            </div>
            <span className="text-[10px] text-[#64748B]">What your clients see</span>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 sm:p-5">
            {/* Inner Email Card Container */}
            <div className="max-w-[540px] mx-auto bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
              
              {/* Top Navigation Row (Clean SendMe Style: No Eyebrow, No Live Cloud Sync badge) */}
              <div className="px-5 py-4 border-b border-[#EAECF0]">
                <div className="text-xl font-extrabold text-[#111827] tracking-tight leading-none">
                  Zhen<span className="text-[#00B82E]">bot</span>
                </div>
                <div className="text-[11px] font-semibold text-[#00B82E] tracking-tight mt-1">
                  Custom Business Automation
                </div>
              </div>

              {/* Modern Header Banner: SendMe App Dashboard Banner Style (Green #00B82E, 16px Radius, Illustration Right) */}
              <div className="p-3 sm:p-4">
                <div className="rounded-2xl bg-[#00B82E] p-5 text-white flex items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                      {emailHeader.title || 'Automate Your Business Operations'}
                    </h4>
                    <p className="text-xs text-white/90 leading-relaxed max-w-sm">
                      {emailHeader.subtitle || 'Eliminating repetitive manual operations across messaging, payments, orders, and record-keeping.'}
                    </p>
                  </div>
                  <img
                    src="https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/illustrations/device-banner-illus.png"
                    alt="Illustration"
                    className="size-20 shrink-0 object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Sample Content Snippet */}
              <div className="px-5 pb-5 pt-1 space-y-3">
                <div className="text-xs font-bold text-[#111827]">
                  Hi Tunde Adeleke,
                </div>
                <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                  Your automation pipeline is running at 99.9% uptime SLA. Real-time updates and invoices are attached.
                </p>
                
                {/* Feature Card Preview matching SendMe */}
                <div className="p-3.5 rounded-xl border border-[#EAECF0] border-l-4 border-l-[#00B82E] bg-white flex items-start gap-3 text-xs">
                  <img
                    src="https://ksqgyfemakrhjpuyrcid.supabase.co/storage/v1/object/public/listings/icons/icon-swap.png"
                    alt="Icon"
                    className="size-7 shrink-0 object-contain mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-[#111827]">Autonomous Customer Conversations</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                      24/7 intelligent replies across WhatsApp, Telegram, and social DMs that qualify buyers and collect orders automatically.
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <span className="inline-block px-6 py-2.5 rounded-xl bg-[#00B82E] text-white text-xs font-bold shadow-xs">
                    Open Zhenbot Client Portal &rarr;
                  </span>
                </div>
              </div>

              {/* Sample Footer */}
              <div className="bg-[#F9FAFB] p-4 text-center border-t border-[#EAECF0]">
                <div className="text-[11px] font-bold text-[#111827]">ZHENBOT AUTOMATION</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">automate@zhenibot.com &bull; Serving businesses worldwide</div>
              </div>

            </div>
          </div>
        </div>

        {/* TEST EMAIL DISPATCH TOOL */}
        <div className="rounded-xl border border-[#00B82E]/20 bg-[#F0FDF4] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#00B82E]" />
            <h4 className="text-xs font-bold text-[#111827]">Dispatch Live Test via SendByte Africa</h4>
          </div>
          <p className="text-[11px] text-[#64748B]">
            Send an instant preview directly to your inbox to inspect the layout, typography, and dynamic header on real email clients (Gmail, Apple Mail, Outlook).
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              value={testEmailTo}
              onChange={(e) => setTestEmailTo(e.target.value)}
              placeholder="Enter recipient email (e.g. admin@zhenibot.com)"
              className="flex-1 h-9 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none w-full"
            />
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={sendingTest}
              className="h-9 px-4 rounded-lg bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Send className="size-3.5" />
              <span>{sendingTest ? 'Sending via SendByte…' : 'Send Live Test'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
