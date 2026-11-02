import { Search, Cog, Rocket } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Understand Your Business',
    description:
      'We learn how your business currently operates, examine your existing channels, and identify repetitive tasks draining your team’s productive hours.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Build Your Automation',
    description:
      'We develop custom workflows that connect your existing business processes and tools into a seamless, automated operational pipeline.',
    icon: Cog,
  },
  {
    step: '03',
    title: 'Launch & Streamline',
    description:
      'We deploy, test, and refine the automation in production so your business can operate with maximum speed, zero delay, and minimal manual effort.',
    icon: Rocket,
  },
]

export function ProcessSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#F8FAFC] py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            From Manual Processes to{' '}
            <span className="text-[#00B82E]">Automatic Operations.</span>
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            You don't need a technical background or software engineers on staff. We analyze, build, integrate, and support your automations from start to finish.
          </p>
        </div>

        {/* 3-Step Process (Horizontal on desktop, timeline on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 flex flex-col justify-between relative transition-all duration-200 hover:border-[#00B82E]/40 hover:shadow-[0_8px_24px_rgba(0,184,46,0.06)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#00B82E] bg-[#F0FDF4] px-2.5 py-1 rounded-[6px]">
                      STEP {s.step}
                    </span>
                    <div className="size-10 rounded-[10px] bg-[#F8FAFC] border border-[#E5E7EB] text-[#00B82E] flex items-center justify-center">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    {s.title}
                  </h3>

                  <p className="text-[15px] text-[#64748B] leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#F1F5F9] text-xs font-mono text-[#64748B]">
                  Phase {idx + 1} of 3
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
