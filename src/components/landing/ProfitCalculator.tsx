import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { formatNumber } from '@/lib/format'

export function ProfitCalculator() {
  const [teamSize, setTeamSize] = useState(3)
  const [hoursPerDayPerStaff, setHoursPerDayPerStaff] = useState(3.5)
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(120000)

  // Calculations:
  // 1. Total manual hours wasted per month = teamSize * hoursPerDay * 24 working days
  const monthlyWastedHours = Math.round(teamSize * hoursPerDayPerStaff * 24)

  // 2. Hourly salary cost = avgMonthlySalary / (24 days * 8 hours)
  const hourlyCost = avgMonthlySalary / (24 * 8)

  // 3. Financial value of recovered productive time per month
  const monthlySalaryValueSaved = Math.round(monthlyWastedHours * hourlyCost)

  return (
    <section id="calculator" className="w-full bg-[#081106] text-white py-20 md:py-28 border-b border-[#459F34]/20">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white">
            <span>Calculate Your </span>
            <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
              Monthly Savings
            </span>
          </h2>

          <div className="h-1 w-20 bg-[#459F34] md:mx-auto" />

          <p className="max-w-[700px] text-white/70 text-base md:text-lg">
            How many hours does your team spend answering the same questions, copying and pasting data, reconciling bank transfers, and calling delivery riders?
          </p>
        </div>

        {/* Calculator Interactive Grid */}
        <div className="grid gap-8 lg:grid-cols-2 items-center max-w-5xl mx-auto">
          
          {/* Controls Box */}
          <div className="p-8 border border-white/10 bg-white/5 space-y-8">
            
            {/* Slider 1: Staff count */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold uppercase text-white">
                  Staff Members Doing Routine Work
                </span>
                <span className="font-mono text-xl font-bold text-[#459F34]">
                  {teamSize} people
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-white/20 accent-[#459F34] cursor-pointer"
              />
              <p className="text-[11px] text-white/50 mt-1">Sales reps, receptionists, admin officers, and dispatch coordinators.</p>
            </div>

            {/* Slider 2: Hours spent daily per person */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold uppercase text-white">
                  Hours Spent on Repetitive Tasks Daily
                </span>
                <span className="font-mono text-xl font-bold text-[#459F34]">
                  {hoursPerDayPerStaff} hrs / day
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={hoursPerDayPerStaff}
                onChange={(e) => setHoursPerDayPerStaff(Number(e.target.value))}
                className="w-full h-2 bg-white/20 accent-[#459F34] cursor-pointer"
              />
              <p className="text-[11px] text-white/50 mt-1">Answering prices, typing receipts, confirming bank alerts, typing in sheets.</p>
            </div>

            {/* Slider 3: Average monthly salary per staff */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold uppercase text-white">
                  Average Monthly Staff Salary
                </span>
                <span className="font-mono text-xl font-bold text-[#459F34]">
                  ₦{formatNumber(avgMonthlySalary)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={avgMonthlySalary}
                onChange={(e) => setAvgMonthlySalary(Number(e.target.value))}
                className="w-full h-2 bg-white/20 accent-[#459F34] cursor-pointer"
              />
            </div>

          </div>

          {/* Results Box */}
          <div className="p-8 border-2 border-[#459F34] bg-[#081106] shadow-[0_0_40px_rgba(69,159,52,0.15)] flex flex-col justify-between space-y-8">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#459F34]">
                Your Monthly Recovered Productivity
              </span>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs text-white/60 uppercase">Working Hours Saved Every Month</p>
                  <p className="font-mono text-5xl font-black text-white mt-1">
                    ~{monthlyWastedHours} <span className="text-2xl text-[#459F34] font-bold">Hours</span>
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-white/60 uppercase">Salary Value Shifted From Manual Chores To Direct Revenue Growth</p>
                  <p className="font-mono text-4xl sm:text-5xl font-black text-[#459F34] mt-1">
                    ~₦{formatNumber(monthlySalaryValueSaved)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/70 mt-6 leading-relaxed">
                Imagine your team spending these {monthlyWastedHours} hours pitching new clients, closing big orders, and improving your products instead of typing the same messages over and over again.
              </p>
            </div>

            <a
              href="#contact"
              className="bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold py-4 px-6 text-center text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Stop Wasting Time · Let's Automate</span>
              <ArrowRight className="size-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}
