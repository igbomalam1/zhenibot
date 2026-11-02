import {
  MessageSquareCode,
  Megaphone,
  CreditCard,
  Truck,
  FileSpreadsheet,
  Workflow,
} from 'lucide-react'

const SERVICES = [
  {
    icon: MessageSquareCode,
    title: 'Multi-Channel & Social Automation',
    description:
      'Engage leads and customers instantly 24/7 across WhatsApp, Telegram, X (Twitter), Instagram, and email. Auto-answer inquiries, share pricing, and qualify prospects without human delay.',
  },
  {
    icon: Megaphone,
    title: 'Ad Campaigns & Lead Routing',
    description:
      'Connect your paid ads on Facebook, Instagram, and Google directly to instant automated follow-ups. Route ad inquiries into automated conversations, booking links, and recorded deals.',
  },
  {
    icon: CreditCard,
    title: 'Payment Verification & Invoicing',
    description:
      'Connect payment gateways, international merchant accounts, and banking APIs. Transactions verify automatically the second funds clear, issuing official branded invoices and PDF receipts.',
  },
  {
    icon: Truck,
    title: 'Orders, Fulfillment & Logistics',
    description:
      'End-to-end operational dispatch. Inbound orders instantly sync with your inventory, notify warehouse staff, assign courier drivers, and provide clients with real-time tracking.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Spreadsheet & CRM Synchronization',
    description:
      'Eliminate copy-pasting and duplicate entry. Every sale, new lead, transaction receipt, and inventory change syncs seamlessly across your spreadsheets, CRMs, and accounting databases.',
  },
  {
    icon: Workflow,
    title: 'Any Custom Business Workflow',
    description:
      'If your team performs a manual routine repeatedly, we can engineer custom automation for it. We build secure bridges between your internal software, tools, and third-party APIs.',
  },
]

export function HowItWorks() {
  return (
    <section id="services" className="w-full bg-white py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            One Business. Multiple Operations.{' '}
            <span className="text-[#00B82E]">All Automated.</span>
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            From ad lead capture and multi-platform communications to payment verification, dispatch, and bookkeeping — we automate your operational pipeline end-to-end.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon
            return (
              <div
                key={idx}
                className="group bg-white border border-[#E5E7EB] rounded-[16px] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-[#00B82E]/40 hover:shadow-[0_12px_32px_rgba(0,184,46,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="size-12 rounded-[12px] bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-6 group-hover:bg-[#00B82E] group-hover:text-white transition-colors duration-200">
                    <Icon className="size-6 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#00B82E] transition-colors mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-[15px] text-[#64748B] leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
