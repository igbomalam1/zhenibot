import {
  MessageSquare,
  ShoppingCart,
  CreditCard,
  Receipt,
  Truck,
  FileSpreadsheet,
  ArrowRight,
  Check,
} from 'lucide-react'

const WORKFLOW_NODES = [
  {
    step: '1',
    label: 'Customer Enquiry',
    icon: MessageSquare,
    desc: 'Ad click, WhatsApp, Telegram or DM',
    status: 'Automated 24/7',
  },
  {
    step: '2',
    label: 'Order Captured',
    icon: ShoppingCart,
    desc: 'Items & delivery address confirmed',
    status: 'Validated',
  },
  {
    step: '3',
    label: 'Payment Confirmed',
    icon: CreditCard,
    desc: 'Gateway or bank webhook verified',
    status: 'Instant Verification',
  },
  {
    step: '4',
    label: 'Receipt Sent',
    icon: Receipt,
    desc: 'Official branded PDF to buyer',
    status: 'Instant (0.8s)',
  },
  {
    step: '5',
    label: 'Rider Notified',
    icon: Truck,
    desc: 'Pickup & dropoff sent to dispatch',
    status: 'Dispatched',
  },
  {
    step: '6',
    label: 'Records Updated',
    icon: FileSpreadsheet,
    desc: 'Spreadsheets & inventory synced',
    status: 'Reconciled',
  },
]

export function WorkflowShowcaseSection() {
  return (
    <section className="w-full bg-white py-20 md:py-28 border-b border-[#E5E7EB] overflow-hidden">
      <div className="container px-6 max-w-[1240px] mx-auto">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            See What Happens When{' '}
            <span className="text-[#00B82E]">Everything Connects.</span>
          </h2>
          <p className="text-base md:text-lg text-[#64748B] leading-relaxed max-w-2xl mx-auto">
            Instead of 6 different manual tasks scattered across multiple phones and staff members, Zhenbot links your entire operational journey into one seamless, continuous pipeline.
          </p>
        </div>

        {/* Polished Horizontal Workflow Showcase */}
        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[20px] p-6 sm:p-10 shadow-xs relative">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
            {WORKFLOW_NODES.map((node, idx) => {
              const Icon = node.icon
              const isLast = idx === WORKFLOW_NODES.length - 1
              return (
                <div key={idx} className="flex flex-col relative">
                  <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-5 flex flex-col justify-between h-full transition-all duration-200 hover:border-[#00B82E]/50 hover:shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-9 rounded-[10px] bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
                          <Icon className="size-4.5" />
                        </div>
                        <span className="size-5 rounded-full bg-[#111827] text-white font-mono font-bold text-[10px] flex items-center justify-center">
                          {node.step}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-[#111827] mb-1">
                        {node.label}
                      </h3>
                      
                      <p className="text-xs text-[#64748B] leading-snug">
                        {node.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#00B82E]">
                      <Check className="size-3 stroke-[2.5]" />
                      <span>{node.status}</span>
                    </div>
                  </div>

                  {/* Connector indicator for desktop */}
                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 size-5 rounded-full bg-white border border-[#E5E7EB] items-center justify-center text-[#00B82E] shadow-2xs">
                      <ArrowRight className="size-3" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00B82E] animate-pulse" />
              <span>Full Workflow Time: <strong className="text-[#111827]">Under 2.4 Seconds</strong></span>
            </div>
            <span>Zero manual typing · Zero human delay</span>
          </div>

        </div>

      </div>
    </section>
  )
}
