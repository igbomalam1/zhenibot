import { MessageSquare, FileCheck2, Cpu, CheckCircle2 } from 'lucide-react'

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Free 15-Minute Audit',
    desc: 'We hop on a quick call or WhatsApp chat to see how your business currently operates, what takes up your staff’s time, and where manual bottlenecks occur.',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'Custom Blueprint Design',
    desc: 'We design your automated blueprint, mapping every trigger, condition, message template, and software integration to fit your exact operational style.',
    icon: FileCheck2,
  },
  {
    step: '03',
    title: 'Implementation & Rigorous Testing',
    desc: 'We connect your tools (WhatsApp, Paystack, Gmail, Sheets, etc.), test edge cases, and ensure zero failed actions before going live.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Launch & Hands-off Operation',
    desc: 'Your automation goes live! Your repetitive daily operations now run seamlessly in the background with ongoing monitoring and support from our team.',
    icon: CheckCircle2,
  },
]

export function ProcessSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#081106] text-white py-20 md:py-28 border-b border-[#459F34]/20">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#459F34]/20 border border-[#459F34]/40 text-[#459F34] text-xs font-bold uppercase tracking-wider">
            <span>Our 4-Step Process</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-white">
            <span>How We Put Your Business On </span>
            <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
              Autopilot
            </span>
          </h2>

          <div className="h-1 w-20 bg-[#459F34] md:mx-auto" />

          <p className="max-w-[650px] text-white/70 text-base md:text-lg">
            You don’t have to learn new complicated software or write a single line of code. We build it, connect it, test it, and run it for you.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="relative p-8 border border-white/10 bg-white/5 hover:border-[#459F34] transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-black text-[#459F34]">
                      {s.step}
                    </span>
                    <div className="p-2.5 bg-[#459F34]/10 text-[#459F34] border border-[#459F34]/30">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold uppercase text-white tracking-tight mb-3">
                    {s.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#459F34]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
