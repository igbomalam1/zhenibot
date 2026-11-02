import {
  Sparkles,
  Zap,
  TrendingDown,
  Layers,
  Clock,
  TrendingUp,
} from 'lucide-react'

const VALUE_POINTS = [
  {
    icon: Sparkles,
    title: 'Custom-Built Solutions',
    description:
      'We do not offer rigid templates. Every automation is configured specifically around how your company, staff, and customers already interact.',
  },
  {
    icon: Zap,
    title: 'Faster Business Operations',
    description:
      'Eliminate the lag between a customer expressing interest and closing a deal. Replies, quotes, payment receipts, and bookings happen in seconds.',
  },
  {
    icon: TrendingDown,
    title: 'Reduced Repetitive Workload',
    description:
      'Free your staff from mundane, manual chores like copying data between spreadsheets or answering the same FAQ messages all day long.',
  },
  {
    icon: Layers,
    title: 'Connected Business Systems',
    description:
      'Bridge the gap between WhatsApp, your payment gateway, courier fleets, and bookkeeping software into one unified operational ecosystem.',
  },
  {
    icon: Clock,
    title: '24/7 Configured Workflows',
    description:
      'Your business keeps generating revenue, capturing orders, and confirming payments even after working hours, on weekends, and during holidays.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable As You Grow',
    description:
      'Handle 10x more customer volume, transactions, and dispatches without having to hire, train, and manage an army of extra administrative staff.',
  },
]

export function WhyZhenbotSection() {
  return (
    <section id="why-zhenbot" className="w-full bg-[#F8FAFC] py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            Less Manual Work.{' '}
            <span className="text-[#00B82E]">More Room to Grow.</span>
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Practical, enterprise-grade business automation designed to solve real operational bottlenecks for ambitious growing companies worldwide.
          </p>
        </div>

        {/* 6 Value Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {VALUE_POINTS.map((pt, idx) => {
            const Icon = pt.icon
            return (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#00B82E]/40 hover:shadow-[0_10px_28px_rgba(0,184,46,0.06)]"
              >
                <div className="size-11 rounded-[12px] bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-5">
                  <Icon className="size-5 stroke-[2]" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2.5">
                  {pt.title}
                </h3>
                <p className="text-[15px] text-[#64748B] leading-relaxed">
                  {pt.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
