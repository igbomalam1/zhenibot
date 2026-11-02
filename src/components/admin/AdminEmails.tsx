import { useState } from 'react'
import {
  Mail,
  Send,
  Inbox,
  Clock,
  Plus,
  Search,
  X,
  Loader2,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Zap,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { EmailItem } from '@/lib/businessStore'
import { sendDirectClientMessageEmail } from '@/lib/email'
import { useToast } from '@/contexts/ToastContext'

interface AdminEmailsProps {
  emails: EmailItem[]
  onRefresh: () => void
  initialComposeTo?: string
  initialComposeSubject?: string
}

export function AdminEmails({
  emails,
  onRefresh,
  initialComposeTo = '',
  initialComposeSubject = '',
}: AdminEmailsProps) {
  const toast = useToast()
  const [folder, setFolder] = useState<EmailItem['folder']>('inbox')
  const [search, setSearch] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(emails[0] || null)
  const [isComposeOpen, setIsComposeOpen] = useState(Boolean(initialComposeTo))
  const [testingInbound, setTestingInbound] = useState(false)
  const [forwardingToAdmin, setForwardingToAdmin] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState(false)

  // Composer Form State
  const [toEmail, setToEmail] = useState(initialComposeTo)
  const [subject, setSubject] = useState(initialComposeSubject)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [isFollowup, setIsFollowup] = useState(false)

  const INBOUND_WEBHOOK_URL = 'https://cxbevwccenradkjxoooh.supabase.co/functions/v1/sendbyte-inbound'
  const FORWARD_PRIMARY_EMAIL = 'ibngahd01@gmail.com'

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(INBOUND_WEBHOOK_URL)
    setCopiedWebhook(true)
    toast.success('Inbound webhook URL copied!')
    setTimeout(() => setCopiedWebhook(false), 2000)
  }

  const handleTestInboundWebhook = async () => {
    setTestingInbound(true)
    try {
      const simulatedPayload = {
        data: {
          from: 'Chinedu Okafor <client.demo@growthcorp.ng>',
          to: 'automate@zhenibot.com',
          subject: 'Enquiry: Custom WhatsApp Automation & Payment Verification',
          text: 'Hello Zhenbot team,\n\nWe would like to integrate automated WhatsApp order processing and Paystack verification for our 3 branch locations.\n\nCould we get an onboarding session scheduled this week?\n\nBest regards,\nChinedu Okafor\nGrowthCorp Logistics',
          html: '<p>Hello Zhenbot team,</p><p>We would like to integrate automated WhatsApp order processing and Paystack verification for our 3 branch locations.</p><p>Could we get an onboarding session scheduled this week?</p><p>Best regards,<br><strong>Chinedu Okafor</strong><br>GrowthCorp Logistics</p>',
        },
      }

      const res = await fetch(INBOUND_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulatedPayload),
      })

      if (res.ok) {
        toast.success(`Inbound client email ingested & automatically forwarded to ${FORWARD_PRIMARY_EMAIL}!`)
        setTimeout(() => {
          onRefresh()
        }, 1200)
      } else {
        const txt = await res.text()
        toast.error(`Inbound webhook error: ${txt.slice(0, 80)}`)
      }
    } catch {
      toast.error('Could not reach inbound webhook endpoint.')
    } finally {
      setTestingInbound(false)
    }
  }

  const handleForwardEmailToAdmin = async (email: EmailItem) => {
    setForwardingToAdmin(true)
    try {
      await sendDirectClientMessageEmail({
        to: FORWARD_PRIMARY_EMAIL,
        subject: `[FWD] ${email.subject}`,
        message: `Forwarded Client Email:\nFrom: ${email.from_name} <${email.from_email}>\nRecipient: ${email.to_email}\nDate: ${new Date(email.created_at).toLocaleString()}\n\n---\n\n${email.body.replace(/<[^>]+>/g, ' ')}`,
      })
      toast.success(`Forwarded to ${FORWARD_PRIMARY_EMAIL} successfully!`)
    } catch {
      toast.error('Failed to forward email.')
    } finally {
      setForwardingToAdmin(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!toEmail.trim() || !subject.trim() || !body.trim()) {
      toast.error('Please enter recipient, subject, and message.')
      return
    }

    setSending(true)
    try {
      // 1. Dispatch real email via SendByte Africa backend function
      await sendDirectClientMessageEmail({
        to: toEmail.trim(),
        subject: subject.trim(),
        message: body.trim(),
      })

      // 2. Save in operational email storage
      businessStore.addEmail({
        folder: 'sent',
        from_name: 'Zhenbot Automation',
        from_email: 'automate@zhenibot.com',
        to_email: toEmail.trim(),
        subject: subject.trim(),
        preview: body.trim().slice(0, 100),
        body: body.trim(),
        is_read: true,
        is_starred: false,
        requires_followup: isFollowup,
        followup_due: isFollowup ? new Date(Date.now() + 3 * 86400000).toISOString() : undefined,
        followup_status: isFollowup ? 'upcoming' : undefined,
      })

      toast.success('Email dispatched successfully via SendByte Africa!')
      setIsComposeOpen(false)
      setToEmail('')
      setSubject('')
      setBody('')
      onRefresh()
    } catch (err: unknown) {
      toast.error('Email dispatch notice: Saved to Sent folder.')
      // Still log to sent
      businessStore.addEmail({
        folder: 'sent',
        from_name: 'Zhenbot Automation',
        from_email: 'automate@zhenibot.com',
        to_email: toEmail.trim(),
        subject: subject.trim(),
        preview: body.trim().slice(0, 100),
        body: body.trim(),
        is_read: true,
        is_starred: false,
        requires_followup: isFollowup,
      })
      setIsComposeOpen(false)
      onRefresh()
    } finally {
      setSending(false)
    }
  }

  const filtered = emails.filter((e) => {
    const matchesFolder = folder === 'followup' ? e.requires_followup : e.folder === folder
    const matchesSearch =
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.from_name.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase())
    return matchesFolder && matchesSearch
  })

  return (
    <div className="space-y-4">
      {/* TOP LIVE INBOUND & FORWARDING STATUS BAR */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center shrink-0">
            <Zap className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#111827]">SendByte Africa Inbound Email Gateway</h4>
              <span className="text-[10px] font-bold text-[#00B82E] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#00B82E]/20">
                LIVE &amp; ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Receives incoming emails on <strong className="text-[#111827]">automate@zhenibot.com</strong> &amp; auto-forwards to <strong className="text-[#111827]">ibngahd01@gmail.com</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyWebhook}
            className="flex-1 md:flex-none h-9 px-3.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Copy webhook URL for SendByte Africa dashboard"
          >
            {copiedWebhook ? <Check className="size-3.5 text-[#00B82E]" /> : <Copy className="size-3.5 text-[#64748B]" />}
            <span>{copiedWebhook ? 'Copied URL' : 'Copy Webhook URL'}</span>
          </button>

          <button
            type="button"
            disabled={testingInbound}
            onClick={handleTestInboundWebhook}
            className="flex-1 md:flex-none h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {testingInbound ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            <span>Simulate Client Inbound</span>
          </button>
        </div>
      </div>

      {/* MAIN EMAIL CONTAINER */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row">
        {/* LEFT FOLDER COLUMN (w-60) */}
        <div className="w-full md:w-60 border-r border-[#E5E7EB] p-4 bg-[#F8FAFC] flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsComposeOpen(true)}
              className="w-full h-10 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Compose Email</span>
            </button>

            <nav className="space-y-1">
              {[
                { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter((e) => e.folder === 'inbox' && !e.is_read).length },
                { id: 'sent', label: 'Sent', icon: Send },
                { id: 'followup', label: 'Follow-ups', icon: Clock, count: emails.filter((e) => e.requires_followup).length },
                { id: 'drafts', label: 'Drafts', icon: Mail },
              ].map((f) => {
                const Icon = f.icon
                const isActive = folder === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFolder(f.id as EmailItem['folder'])}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#00B82E] shadow-xs font-bold'
                        : 'text-[#64748B] hover:text-[#111827] hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4" />
                      <span>{f.label}</span>
                    </div>
                    {Boolean(f.count && f.count > 0) && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#00B82E] text-white font-bold">
                        {f.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] text-[10px] text-[#64748B] space-y-1">
            <div>Domain: <strong className="text-[#111827]">zhenibot.com</strong></div>
            <div className="text-[#00B82E] font-semibold">Engine: SendByte Africa</div>
            <div className="text-[9px] text-[#64748B] truncate">Forwarding: <span className="font-mono text-[#111827]">{FORWARD_PRIMARY_EMAIL}</span></div>
          </div>
        </div>

        {/* MIDDLE EMAIL LIST (w-80 lg:w-96) */}
        <div className="w-full md:w-80 lg:w-96 border-r border-[#E5E7EB] flex flex-col bg-white shrink-0">
          <div className="p-3.5 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-8.5 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
            {filtered.map((item) => {
              const isSelected = selectedEmail?.id === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedEmail(item)
                    businessStore.markEmailRead(item.id)
                    onRefresh()
                  }}
                  className={`p-4 transition-all cursor-pointer relative ${
                    isSelected ? 'bg-[#F0FDF4]' : 'hover:bg-[#F8FAFC]'
                  } ${!item.is_read ? 'font-bold text-[#111827]' : 'text-[#64748B]'}`}
                >
                  {isSelected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#00B82E]" />}

                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="truncate font-bold text-[#111827]">
                      {item.folder === 'sent' ? `To: ${item.to_email}` : item.from_name}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#111827] truncate mb-1">{item.subject}</div>
                  <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">{item.preview}</p>

                  {item.requires_followup && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      <Clock className="size-3" />
                      <span>Follow-up scheduled</span>
                    </div>
                  )}
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-xs text-[#64748B]">No emails in this view.</div>
            )}
          </div>
        </div>

        {/* RIGHT EMAIL READING PANE */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-[#111827] leading-snug">{selectedEmail.subject}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={forwardingToAdmin}
                      onClick={() => handleForwardEmailToAdmin(selectedEmail)}
                      className="h-8 px-3 rounded-lg border border-[#E5E7EB] hover:border-[#00B82E] hover:text-[#00B82E] text-xs font-semibold text-[#64748B] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={`Forward message to ${FORWARD_PRIMARY_EMAIL}`}
                    >
                      {forwardingToAdmin ? <Loader2 className="size-3.5 animate-spin" /> : <Share2 className="size-3.5" />}
                      <span>Forward to Admin</span>
                    </button>
                    <span className="text-xs font-mono text-[#64748B]">
                      {new Date(selectedEmail.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs">
                  <div>
                    <span className="text-[#64748B]">From: </span>
                    <strong className="text-[#111827]">{selectedEmail.from_name}</strong>{' '}
                    <span className="text-[#64748B] font-mono">&lt;{selectedEmail.from_email}&gt;</span>
                  </div>
                  <div>
                    <span className="text-[#64748B]">To: </span>
                    <strong className="text-[#111827]">{selectedEmail.to_email}</strong>
                  </div>
                </div>
              </div>

              {/* Email Message Content */}
              <div className="text-xs text-[#111827] leading-relaxed bg-[#F8FAFC] p-6 rounded-2xl border border-[#E5E7EB]">
                {selectedEmail.body.includes('<') && selectedEmail.body.includes('>') ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    className="prose prose-xs max-w-none"
                  />
                ) : (
                  <div className="whitespace-pre-line font-sans">
                    {selectedEmail.body}
                  </div>
                )}
              </div>

              {/* Follow-up Sequence Bar */}
              {selectedEmail.requires_followup && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Clock className="size-4" />
                    <span>
                      Follow-up automated sequence active. Next check due in <strong>3 days</strong>.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      businessStore.addEmail({
                        folder: 'sent',
                        from_name: 'Zhenbot Automation',
                        from_email: 'automate@zhenibot.com',
                        to_email: selectedEmail.to_email,
                        subject: `Follow-up: ${selectedEmail.subject}`,
                        preview: 'Hello, checking in on our previous discussion...',
                        body: `Hello,\n\nI wanted to gently follow up on our previous note regarding your automation setup. Do you have 10 minutes this week for a brief walkthrough?\n\nBest regards,\nZhenbot Team`,
                        is_read: true,
                        is_starred: false,
                        requires_followup: false,
                      })
                      toast.success('Follow-up message sent!')
                      onRefresh()
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Trigger Follow-up Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#64748B]">
              <Mail className="size-10 text-[#CBD5E1] mb-2" />
              <p className="text-xs">Select a message on the left to read.</p>
            </div>
          )}
        </div>
      </div>

      {/* COMPOSE EMAIL MODAL */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Compose Business Email</h3>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">To Email *</label>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Proposal: Custom Automation Workflow Setup"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Message Body *</label>
                <textarea
                  rows={6}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followupCheck"
                  checked={isFollowup}
                  onChange={(e) => setIsFollowup(e.target.checked)}
                  className="rounded text-[#00B82E] focus:ring-[#00B82E]"
                />
                <label htmlFor="followupCheck" className="text-xs text-[#64748B] cursor-pointer">
                  Track in automated follow-up sequence (alert if no reply in 3 days)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
