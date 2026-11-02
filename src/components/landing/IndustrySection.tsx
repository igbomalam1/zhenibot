import {
  ShoppingBag,
  Truck,
  Building2,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Boxes,
  Sparkles,
} from 'lucide-react'

const INDUSTRIES = [
  {
    icon: ShoppingBag,
    name: 'Retail & E-commerce',
    useCase: 'WhatsApp catalog orders, payment verification & delivery dispatch',
  },
  {
    icon: Truck,
    name: 'Logistics & Delivery',
    useCase: 'Waypoint booking, rider dispatch & live GPS customer tracking',
  },
  {
    icon: Building2,
    name: 'Real Estate',
    useCase: 'Automated lead qualification, inspection booking & client reminders',
  },
  {
    icon: GraduationCap,
    name: 'Schools & Education',
    useCase: 'Tuition receipt issuing, admission inquiries & parent broadcast alerts',
  },
  {
    icon: HeartPulse,
    name: 'Hospitals & Healthcare',
    useCase: 'Patient appointment scheduling, test result alerts & digital intake forms',
  },
  {
    icon: Briefcase,
    name: 'Professional Services',
    useCase: 'Client onboarding, consultation bookings, retainer invoicing & reminders',
  },
  {
    icon: Boxes,
    name: 'Distribution & Wholesale',
    useCase: 'Bulk RFQ quote drafting, warehouse inventory sync & merchant ledger logs',
  },
  {
    icon: Sparkles,
    name: 'Service-Based Businesses',
    useCase: 'Custom automated booking pipelines tailored to your operations',
  },
]

export function IndustrySection() {
  return (
    <section id="industries" className="w-full bg-white py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            Automation Built Around{' '}
            <span className="text-[#00B82E]">Your Industry.</span>
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Every business sector operates differently. We don't sell one-size-fits-all software — we build custom automation configured around your exact daily workflow.
          </p>
        </div>

        {/* 8 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind, idx) => {
            const Icon = ind.icon
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#00B82E]/40 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,184,46,0.06)]"
              >
                <div className="size-11 rounded-[12px] bg-white border border-[#E5E7EB] text-[#00B82E] flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">
                  {ind.name}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {ind.useCase}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
