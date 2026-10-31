import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { LIVE_AUTOMATION_EVENTS } from '@/lib/demo'
import type { AutomationEvent } from '@/lib/demo'

export function TradeFeed() {
  const [events, setEvents] = useState<AutomationEvent[]>(LIVE_AUTOMATION_EVENTS)

  useEffect(() => {
    const id = window.setInterval(() => {
      const templates = [
        {
          title: 'Smart Email Auto-Reply',
          channel: 'Gmail API',
          summary: 'Inbound quote inquiry: Generated PDF quote #QT-991 & sent personalized reply in 1.1s.',
          savingsMinutes: 20,
          latency: '1.1s',
          type: 'email' as const,
        },
        {
          title: 'Okada Dispatch Auto-Booked',
          channel: 'SendMe Express',
          summary: 'WhatsApp order: Assigned bike rider to pickup at Ikeja & sent live GPS tracking.',
          savingsMinutes: 30,
          latency: '1.7s',
          type: 'dispatch' as const,
        },
        {
          title: 'WhatsApp AI Support Resolved',
          channel: 'WhatsApp Cloud',
          summary: 'Customer checked delivery location: Answered in natural Pidgin/English in 0.9s.',
          savingsMinutes: 15,
          latency: '0.9s',
          type: 'support' as const,
        },
        {
          title: 'Paystack Payment Reconciled',
          channel: 'Paystack Webhook',
          summary: 'Reconciled ₦85,000 for order #ORD-3012, logged into accounting & issued PDF receipt.',
          savingsMinutes: 18,
          latency: '1.3s',
          type: 'invoice' as const,
        },
      ]
      const chosen = templates[Math.floor(Math.random() * templates.length)]
      const newEvt: AutomationEvent = {
        id: `evt-${Date.now()}`,
        title: chosen.title,
        channel: chosen.channel,
        summary: chosen.summary,
        savingsMinutes: chosen.savingsMinutes,
        latency: chosen.latency,
        type: chosen.type,
        status: 'completed',
        timestamp: Date.now(),
      }
      setEvents((prev) => [newEvt, ...prev.slice(0, 7)])
    }, 4500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="space-y-2.5">
      {events.map((evt) => (
        <div
          key={evt.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/6 bg-[#0a0f1e] p-3.5 transition-all hover:border-brand-500/30 hover:bg-[#0d1428]"
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-[#12192e] font-mono text-[11px] font-bold text-white shrink-0 mt-0.5">
              {evt.type === 'email' ? '✉️' : evt.type === 'dispatch' ? '🛵' : evt.type === 'support' ? '💬' : '⚡'}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-display font-bold text-white truncate">{evt.title}</p>
                <span className="rounded bg-brand-500/10 border border-brand-500/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-brand-300">
                  {evt.channel}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5 max-w-md">{evt.summary}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono">
            <span className="text-[11px] text-cyan-400 font-semibold">{evt.latency}</span>
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <CheckCircle2 className="size-3 text-emerald-400" />
              +{evt.savingsMinutes}m saved
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
