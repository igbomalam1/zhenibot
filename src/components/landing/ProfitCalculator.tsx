import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import { buttonClass } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

export function ProfitCalculator() {
  const [emailsPerDay, setEmailsPerDay] = useState(80)
  const [supportTicketsPerDay, setSupportTicketsPerDay] = useState(65)
  const [deliveriesPerWeek, setDeliveriesPerWeek] = useState(90)
  const [hourlyRate, setHourlyRate] = useState(16)

  const monthlyEmails = emailsPerDay * 30
  const monthlyTickets = supportTicketsPerDay * 30
  const monthlyDeliveries = deliveriesPerWeek * 4.2

  // Measured task durations:
  // Email triage & personalized quotation: 6 min
  // Customer care lookup & resolution: 7 min
  // Rider dispatch, fee negotiation & tracking: 12 min
  const hoursSavedEmails = (monthlyEmails * 6) / 60
  const hoursSavedTickets = (monthlyTickets * 7) / 60
  const hoursSavedDeliveries = (monthlyDeliveries * 12) / 60

  const totalHoursMonth = Math.round(hoursSavedEmails + hoursSavedTickets + hoursSavedDeliveries)
  const totalCostSavedMonth = Math.round(totalHoursMonth * hourlyRate)

  return (
    <section id="calculator" className="py-20 sm:py-28 border-b border-white/8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-[#FF5416] font-medium">
            Operational economics
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F4F5F7]">
            Calculate hours saved each month
          </h2>
          <p className="mt-3 text-sm text-[#8F95A3] leading-relaxed">
            Estimate how much operational time Zhen Automation eliminates based on your current email, dispatch, and support ticket volumes.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Controls */}
          <div className="space-y-6 rounded-xl border border-white/8 bg-[#121419] p-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#F4F5F7]">Inbound correspondence / day</span>
                <span className="font-mono text-[#F4F5F7]" data-tabular="true">
                  {emailsPerDay} emails
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={400}
                step={5}
                value={emailsPerDay}
                onChange={(e) => setEmailsPerDay(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[#1C1F28] accent-[#FF5416] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#F4F5F7]">WhatsApp & support inquiries / day</span>
                <span className="font-mono text-[#F4F5F7]" data-tabular="true">
                  {supportTicketsPerDay} inquiries
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={supportTicketsPerDay}
                onChange={(e) => setSupportTicketsPerDay(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[#1C1F28] accent-[#FF5416] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#F4F5F7]">Deliveries & courier dispatches / week</span>
                <span className="font-mono text-[#F4F5F7]" data-tabular="true">
                  {deliveriesPerWeek} packages
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={deliveriesPerWeek}
                onChange={(e) => setDeliveriesPerWeek(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[#1C1F28] accent-[#FF5416] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#F4F5F7]">Average staff hourly compensation ($/hr)</span>
                <span className="font-mono text-[#F4F5F7]" data-tabular="true">
                  ${hourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[#1C1F28] accent-[#FF5416] cursor-pointer"
              />
            </div>
          </div>

          {/* Result Docket */}
          <div className="rounded-xl border border-white/8 bg-[#121419] p-6 space-y-6">
            <div>
              <p className="font-mono text-xs text-[#8F95A3] uppercase tracking-wider">
                Monthly time restored
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-5xl font-semibold text-[#F4F5F7] tracking-tight" data-tabular="true">
                  {formatNumber(totalHoursMonth)}
                </span>
                <span className="text-sm text-[#8F95A3]">hours / month</span>
              </div>
              <p className="text-xs text-[#8F95A3] mt-2">
                Equivalent to ~{Math.round(totalHoursMonth / 40)} full-time work weeks saved across your staff.
              </p>
            </div>

            <div className="border-t border-white/8 pt-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F95A3]">Estimated monthly payroll overhead saved</span>
                <span className="font-mono font-medium text-[#10B981]" data-tabular="true">
                  ${formatNumber(totalCostSavedMonth)} / mo
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F95A3]">Annual operational savings</span>
                <span className="font-mono font-medium text-[#F4F5F7]" data-tabular="true">
                  ${formatNumber(totalCostSavedMonth * 12)} / yr
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8F95A3]">Response latency improvement</span>
                <span className="font-mono text-[#F4F5F7]">From 4 hrs to 1.2s</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/auth" className={buttonClass('primary', 'lg', 'w-full')}>
                Start 14-day free trial <ArrowRight className="size-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
