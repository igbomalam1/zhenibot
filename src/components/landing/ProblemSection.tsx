import {
  MessageSquareX,
  CreditCard,
  FileQuestion,
  Truck,
  FileSpreadsheet,
  FileText,
  ArrowRight,
} from 'lucide-react'

const PROBLEMS = [
  {
    icon: MessageSquareX,
    title: 'Repeated Customer Questions',
    description:
      'Spending hours every day typing the same product prices, account numbers, and availability to hundreds of WhatsApp inquiries.',
  },
  {
    icon: CreditCard,
    title: 'Manual Payment Confirmation',
    description:
      'Chasing staff or checking mobile banking apps repeatedly to verify customer transfer alerts, risking fake transfer fraud.',
  },
  {
    icon: FileQuestion,
    title: 'Delayed Receipts & Invoice Errors',
    description:
      'Typing receipts and invoices manually by hand, leading to typos, missed line items, and impatient buyers waiting hours.',
  },
  {
    icon: Truck,
    title: 'Constant Delivery Coordination',
    description:
      'Endless back-and-forth phone calls with okada riders and couriers to negotiate fees, confirm locations, and track packages.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Repetitive Spreadsheet Updates',
    description:
      'Wasting productive work hours copying and pasting customer names, payments, and stock counts across disjointed spreadsheets.',
  },
  {
    icon: FileText,
    title: 'Slow Quotation Preparation',
    description:
      'Losing high-value business deals because preparing corporate quotations takes days instead of minutes.',
  },
]

export function ProblemSection() {
  return (
    <section className="w-full bg-[#F8FAFC] py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            Running a Business Shouldn't Mean Doing Everything Manually.
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            When your key staff are trapped doing repetitive routine chores, your business slows down, mistakes happen, and customer growth stalls.
          </p>
        </div>

        {/* 6 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((prob, idx) => {
            const Icon = prob.icon
            return (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-[16px] p-7 transition-all duration-200 hover:border-[#00B82E]/40 hover:shadow-[0_8px_24px_rgba(0,184,46,0.06)]"
              >
                <div className="size-11 rounded-[12px] bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] flex items-center justify-center mb-5">
                  <Icon className="size-5 text-[#00B82E]" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  {prob.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {prob.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Transition Bridge */}
        <div className="mt-14 text-center">
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00B82E] hover:text-[#008F27] transition-colors"
          >
            <span>See how Zhenbot automates every one of these processes</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

      </div>
    </section>
  )
}
