import { useState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import { buttonClass } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export function ProfitCalculator() {
  const [emailsPerDay, setEmailsPerDay] = useState(80)
  const [supportTicketsPerDay, setSupportTicketsPerDay] = useState(65)
  const [deliveriesPerWeek, setDeliveriesPerWeek] = useState(90)
  const [teamHourlyCost, setTeamHourlyCost] = useState(18) // avg $/hr or equivalent

  // Calculations:
  // Email triage & reply: ~6 mins saved per email
  // Customer care query: ~8 mins saved per ticket
  // Delivery dispatch & tracking: ~12 mins saved per order
  const monthlyEmails = emailsPerDay * 30
  const monthlyTickets = supportTicketsPerDay * 30
  const monthlyDeliveries = deliveriesPerWeek * 4.2

  const hoursSavedEmails = (monthlyEmails * 6) / 60
  const hoursSavedTickets = (monthlyTickets * 8) / 60
  const hoursSavedDeliveries = (monthlyDeliveries * 12) / 60

  const totalHoursSavedMonth = Math.round(hoursSavedEmails + hoursSavedTickets + hoursSavedDeliveries)
  const estimatedCostSavedMonth = Math.round(totalHoursSavedMonth * teamHourlyCost)
  const responseSpeedup = '99.4%'

  return (
    <section id="calculator" className="relative py-28 border-t border-white/8 bg-[#070b14]/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-bold">
            INTERACTIVE ROI & TIME SAVINGS
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-display">
            Calculate Your Business Hours Saved
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            See exactly how many hours of manual chaos Zhen Automation eliminates from your business every single month.
          </p>
        </div>

        <div className="glass-card mx-auto mt-14 grid max-w-5xl gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] border border-white/10 shadow-2xl">
          {/* Controls Column */}
          <div className="space-y-7">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-400" /> Inbound Emails / Day
                </label>
                <span className="font-mono text-sm font-bold text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20">
                  {emailsPerDay} emails
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={emailsPerDay}
                onChange={(e) => setEmailsPerDay(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>10 / day</span>
                <span>500+ / day</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" /> WhatsApp & Support Inquiries / Day
                </label>
                <span className="font-mono text-sm font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  {supportTicketsPerDay} inquiries
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={400}
                step={5}
                value={supportTicketsPerDay}
                onChange={(e) => setSupportTicketsPerDay(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>10 / day</span>
                <span>400+ / day</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400" /> Deliveries & Okada Dispatches / Week
                </label>
                <span className="font-mono text-sm font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                  {deliveriesPerWeek} deliveries
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={600}
                step={5}
                value={deliveriesPerWeek}
                onChange={(e) => setDeliveriesPerWeek(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>5 / week</span>
                <span>600+ / week</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" /> Estimated Staff Hourly Rate ($/hr)
                </label>
                <span className="font-mono text-sm font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                  ${teamHourlyCost}/hr
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={teamHourlyCost}
                onChange={(e) => setTeamHourlyCost(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-white/10 accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>$5/hr</span>
                <span>$60/hr</span>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-brand-500/30 bg-gradient-to-br from-[#12182c] via-[#0d1222] to-[#0a0e1a] p-6 sm:p-7 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  ESTIMATED MONTHLY SAVINGS
                </span>
                <span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-400">
                  <Sparkles className="size-3" /> 16.4x ROI
                </span>
              </div>

              {/* Big Stat 1: Hours Saved */}
              <div className="mb-6">
                <p className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {formatNumber(totalHoursSavedMonth)}{' '}
                  <span className="text-lg font-medium text-brand-300 font-sans">hrs / mo</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Equivalent to ~{Math.round(totalHoursSavedMonth / 40)} full-time work weeks restored to your calendar.
                </p>
              </div>

              {/* Big Stat 2: Money Saved */}
              <div className="mb-6 rounded-xl border border-white/8 bg-black/30 p-4">
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                  ESTIMATED OVERHEAD SAVED
                </span>
                <p className="font-mono text-3xl font-bold text-emerald-400">
                  ${formatNumber(estimatedCostSavedMonth)}
                  <span className="text-xs font-normal text-slate-400 ml-2">/ month</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Over ${(estimatedCostSavedMonth * 12).toLocaleString()} saved annually in operations payroll & overhead.
                </p>
              </div>

              {/* Speedup Badge */}
              <div className="space-y-2 border-t border-white/8 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Response Speed Acceleration</span>
                  <span className="font-mono font-bold text-cyan-400">{responseSpeedup} faster</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Human Dispatch Overhead</span>
                  <span className="font-mono font-bold text-emerald-400">Reduced by 92%</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/auth"
                className={buttonClass(
                  'primary',
                  'lg',
                  'w-full bg-gradient-to-r from-brand-600 to-brand-500 shadow-lg shadow-brand-500/25',
                )}
              >
                Claim Your Free Pilot <ArrowRight className="size-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
