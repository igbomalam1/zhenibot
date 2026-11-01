import {
  MessageSquareCode,
  FileSpreadsheet,
  Receipt,
  Truck,
  Repeat,
  Mail,
  Workflow,
  CheckCircle,
} from 'lucide-react'

const AUTOMATION_SERVICES = [
  {
    icon: MessageSquareCode,
    title: '24/7 WhatsApp & Social Sales Bots',
    summary: 'Never leave a buyer waiting again, even at midnight.',
    description:
      'We build intelligent WhatsApp, Instagram, and web chat assistants that answer customer questions, send product catalogs, take orders, and qualify serious buyers on complete autopilot.',
    deliverables: [
      'Instant answers to prices, availability & delivery fees',
      'Automatic collection of buyer name, phone, and address',
      'Direct checkout link generation (Paystack / Flutterwave)',
    ],
  },
  {
    icon: Receipt,
    title: 'Automated Invoicing & Bank Reconciliation',
    summary: 'Stop manually confirming fake bank alerts and sending manual receipts.',
    description:
      'When a customer pays, your system automatically verifies the transaction, sends an official branded PDF receipt via WhatsApp/email, and logs it into your sales records with zero mistakes.',
    deliverables: [
      'Instant PDF receipt generation with company logo',
      'Bank & Paystack payment confirmation webhooks',
      'Gentle automated payment reminder messages for pending bills',
    ],
  },
  {
    icon: Truck,
    title: 'Delivery, Booking & Courier Dispatch',
    summary: 'Coordinate pickups and dispatch riders without back-and-forth calls.',
    description:
      'The moment an order is confirmed or a client books a slot, delivery addresses are checked, waybills are prepared, and your internal or third-party courier riders are notified immediately.',
    deliverables: [
      'Automatic order detail routing to okada & dispatch riders',
      'Live tracking link sent to the customer via SMS/WhatsApp',
      'Delivery status auto-updated in your inventory records',
    ],
  },
  {
    icon: Mail,
    title: 'Inbound Email Triage & Quote Generator',
    summary: 'Turn quote requests into official PDF quotes in 30 seconds.',
    description:
      'If your company receives RFQs, procurement emails, or quotation requests every day, we automate extracting line items, calculating accurate pricing, and drafting professional replies.',
    deliverables: [
      'Scans incoming customer requests and reads attached files',
      'Drafts professional quotes adhering to your price rules',
      'Syncs correspondence directly with your CRM or Google Drive',
    ],
  },
  {
    icon: FileSpreadsheet,
    title: 'Google Sheets & Database Synchronization',
    summary: 'Eliminate duplicate data entry across different departments.',
    description:
      'Whenever anything happens — a sale, a return, an inquiry, or a new client signup — every team spreadsheet, inventory tracker, and accounting book updates simultaneously in real-time.',
    deliverables: [
      'Connects your forms, stores, and inboxes into one live Sheet',
      'Low inventory and daily restock alerts sent to manager phones',
      'Daily end-of-day sales and performance summary reports',
    ],
  },
  {
    icon: Workflow,
    title: 'Tailored Business Operations Workflow',
    summary: 'Have a specific, unique way you run your business? We automate it.',
    description:
      'Every business has its own unique headache. Whether you run a school, real estate agency, clinic, law firm, or wholesale warehouse, we map out your exact daily process and put it on rails.',
    deliverables: [
      'Full process audit and custom logic diagram',
      'Connection across all software you currently use',
      'Staff onboarding and hands-on operational training',
    ],
  },
]

export function HowItWorks() {
  return (
    <section id="services" className="w-full bg-white py-16 md:py-24 border-b border-black/10">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        
        {/* Section Heading matching portfolio-v2 */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#459F34]/10 border border-[#459F34]/30 text-[#459F34] text-xs font-bold uppercase tracking-wider">
            <Repeat className="size-3.5" />
            <span>End-to-End Automation Services</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase text-black">
            <span>What We </span>
            <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
              Automate For You
            </span>
          </h2>

          <div className="h-1 w-20 bg-[#459F34] md:mx-auto" />

          <p className="max-w-[700px] text-black/80 text-base md:text-lg">
            We take the repetitive, boring, time-consuming tasks your team does manually every single day and turn them into fast, error-free automated workflows.
          </p>
        </div>

        {/* Services Grid (Flat clean cards with #459F34 accent) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AUTOMATION_SERVICES.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group flex flex-col p-8 border border-black/10 bg-white hover:border-[#459F34] hover:shadow-[0_4px_24px_rgba(69,159,52,0.12)] transition-all duration-300"
              >
                {/* Icon box */}
                <div className="p-4 bg-[#459F34]/10 text-[#459F34] w-fit mb-6 border border-[#459F34]/20 group-hover:bg-[#459F34] group-hover:text-white transition-colors duration-300">
                  <Icon size={28} strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold uppercase tracking-tight text-black group-hover:text-[#459F34] transition-colors mb-2">
                  {service.title}
                </h3>

                {/* Summary */}
                <p className="text-sm font-semibold text-[#459F34] mb-3">
                  {service.summary}
                </p>

                {/* Description */}
                <p className="text-sm text-black/70 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Bullet Points */}
                <div className="mt-auto pt-6 border-t border-black/5 space-y-2.5">
                  {service.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-black/80 font-medium">
                      <CheckCircle className="size-4 text-[#459F34] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA below services */}
        <div className="mt-16 p-8 border border-[#459F34]/30 bg-[#459F34]/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold uppercase text-black">
              Have a custom workflow not listed here?
            </h4>
            <p className="text-sm text-black/70 mt-1">
              If your staff does it manually on a computer or phone, we can automate it. Tell us your process and we will design it for you.
            </p>
          </div>
          <a
            href="#contact"
            className="bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold text-sm py-3.5 px-8 transition-colors shrink-0"
          >
            Request Custom Workflow
          </a>
        </div>

      </div>
    </section>
  )
}
