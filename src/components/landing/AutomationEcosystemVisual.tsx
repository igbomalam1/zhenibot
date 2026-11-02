import {
  MessageSquare,
  CheckCircle2,
  Receipt,
  Truck,
  TrendingUp,
  FileText,
  Zap,
  ShieldCheck,
  Check,
} from 'lucide-react'

export function AutomationEcosystemVisual() {
  return (
    <div className="relative w-full max-w-[600px] aspect-[1/0.95] sm:aspect-[1/0.9] flex items-center justify-center select-none overflow-visible">
      {/* Soft Ambient Green Glow in the Background */}
      <div
        className="absolute inset-0 m-auto size-[320px] sm:size-[400px] rounded-full bg-[#00B82E]/8 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 m-auto size-[180px] sm:size-[220px] rounded-full bg-[#00B82E]/12 blur-[40px] pointer-events-none"
        aria-hidden="true"
      />

      {/* SVG Connecting Flow Lines & Light Pulses */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 600 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B82E" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00B82E" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00B82E" stopOpacity="0.15" />
          </linearGradient>

          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Rings around Hub */}
        <circle
          cx="300"
          cy="270"
          r="140"
          stroke="#00B82E"
          strokeOpacity="0.15"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="animate-[spin_60s_linear_infinite] origin-[300px_270px]"
        />
        <circle
          cx="300"
          cy="270"
          r="210"
          stroke="#00B82E"
          strokeOpacity="0.1"
          strokeWidth="1"
          strokeDasharray="6 8"
          className="animate-[spin_90s_linear_infinite_reverse] origin-[300px_270px]"
        />

        {/* Line 1: Hub to WhatsApp (Top Left) */}
        <path
          d="M 300 270 C 230 240, 160 170, 130 110"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Line 2: Hub to Payments (Top Right) */}
        <path
          d="M 300 270 C 370 240, 430 170, 460 95"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Line 3: Hub to Digital Receipt (Bottom Left) */}
        <path
          d="M 300 270 C 230 310, 160 380, 125 435"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Line 4: Hub to Order & Delivery (Bottom Right) */}
        <path
          d="M 300 270 C 370 310, 440 370, 475 430"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Line 5: Hub to Invoicing (Far Left / Center-Left) */}
        <path
          d="M 300 270 C 220 275, 140 280, 70 270"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Line 6: Hub to Analytics (Far Right / Center-Right) */}
        <path
          d="M 300 270 C 380 265, 450 260, 520 250"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Pulsing Light Nodes Along Paths */}
        <circle cx="210" cy="185" r="3" fill="#00B82E" filter="url(#greenGlow)">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="385" cy="180" r="3" fill="#00B82E" filter="url(#greenGlow)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="205" cy="355" r="3" fill="#00B82E" filter="url(#greenGlow)">
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="390" cy="350" r="3" fill="#00B82E" filter="url(#greenGlow)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2.1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* ========================================================
          CENTER FLOATING ELEMENT: Glass-Like Automation Command Hub
          ======================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        {/* Outer glowing halo ring */}
        <div className="relative p-3 rounded-full bg-white/80 backdrop-blur-xl border border-[#00B82E]/30 shadow-[0_12px_40px_rgba(0,184,46,0.15)] transition-transform duration-500 hover:scale-105">
          {/* Inner Core */}
          <div className="relative size-20 sm:size-24 rounded-full bg-gradient-to-b from-[#111827] to-[#1E293B] border border-[#00B82E]/60 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
            {/* Ambient core shimmer */}
            <div className="absolute inset-0 bg-[#00B82E]/20 rounded-full animate-ping opacity-25" />
            <div className="relative z-10 size-9 rounded-full bg-[#00B82E]/20 border border-[#00B82E] flex items-center justify-center text-[#00B82E]">
              <Zap className="size-5 fill-[#00B82E]" />
            </div>
            <span className="relative z-10 text-[9px] font-mono uppercase font-bold tracking-widest text-[#00B82E] mt-1.5">
              AUTONOMOUS
            </span>
          </div>

          {/* Orbiting Satellite Indicator */}
          <div className="absolute -top-1 right-2 size-4 rounded-full bg-white border border-[#00B82E] flex items-center justify-center shadow-xs">
            <span className="size-2 rounded-full bg-[#00B82E] animate-pulse" />
          </div>
        </div>

        {/* Core Caption Tag */}
        <div className="mt-2.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E5E7EB] shadow-xs flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#00B82E]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] font-mono">
            Zhen Workflow Core
          </span>
        </div>
      </div>

      {/* ========================================================
          CARD 1: WhatsApp Customer Service (Top Left)
          ======================================================== */}
      <div className="absolute top-[2%] left-[2%] sm:left-[4%] z-10 w-[205px] sm:w-[225px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#00B82E] transition-all duration-300">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-full bg-[#00B82E]/15 text-[#00B82E] flex items-center justify-center">
              <MessageSquare className="size-3" />
            </div>
            <span className="text-[10px] font-bold uppercase text-[#111827]">
              WhatsApp Sales
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#00B82E] font-semibold bg-[#F0FDF4] px-1.5 py-0.5 rounded">
            Instant
          </span>
        </div>

        {/* Incoming Customer Message */}
        <div className="p-1.5 rounded bg-[#F8FAFC] text-[10px] text-[#111827] mb-1.5">
          <p className="text-[8px] font-mono text-[#64748B]">Buyer · 11:42 PM</p>
          <p className="font-medium truncate">Is the 50kg bag available?</p>
        </div>

        {/* Outgoing Automated Reply */}
        <div className="p-1.5 rounded bg-[#F0FDF4] border border-[#00B82E]/20 text-[10px] text-[#111827]">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#00B82E] font-bold">
            <span>Zhen AI Bot</span>
            <span>0.4s</span>
          </div>
          <p className="font-semibold text-[#008F27] mt-0.5 leading-snug">
            Yes! 14 in stock. Tap here to pay & book delivery.
          </p>
        </div>
      </div>

      {/* ========================================================
          CARD 2: Automated Payments (Top Right)
          ======================================================== */}
      <div className="absolute top-[4%] right-[2%] sm:right-[4%] z-10 w-[190px] sm:w-[210px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#00B82E] transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">
            Payment Webhook
          </span>
          <span className="size-2 rounded-full bg-[#00B82E] animate-ping" />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-[#00B82E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Check className="size-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-[#111827] tracking-tight leading-none">
              Payment Confirmed
            </p>
            <p className="font-mono text-xs font-bold text-[#008F27] mt-1">
              $850.00
            </p>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[9px] font-mono text-[#64748B]">
          <span>Ref: TX-88219</span>
          <span className="text-[#00B82E] font-bold">Auto-Verified</span>
        </div>
      </div>

      {/* ========================================================
          CARD 3: Digital Receipts (Bottom Left)
          ======================================================== */}
      <div className="absolute bottom-[4%] left-[2%] sm:left-[6%] z-10 w-[195px] sm:w-[215px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#00B82E] transition-all duration-300">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-md bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
              <Receipt className="size-3" />
            </div>
            <span className="text-[10px] font-bold uppercase text-[#111827]">
              Branded Receipt
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#00B82E] font-bold">
            PDF Sent
          </span>
        </div>

        <div className="space-y-1 font-mono text-[10px]">
          <div className="flex justify-between text-[#64748B]">
            <span>Invoice:</span>
            <span className="font-bold text-[#111827]">#ZH-4029</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Delivery:</span>
            <span className="text-[#111827]">Express Client Route</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Channel:</span>
            <span className="text-[#00B82E] font-semibold">WhatsApp & Email</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-[#F1F5F9] flex items-center gap-1 text-[9px] text-[#008F27] font-bold">
          <CheckCircle2 className="size-3 shrink-0" />
          <span>Zero fake alert risk</span>
        </div>
      </div>

      {/* ========================================================
          CARD 4: Order & Delivery Management (Bottom Right)
          ======================================================== */}
      <div className="absolute bottom-[2%] right-[2%] sm:right-[4%] z-10 w-[205px] sm:w-[225px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#00B82E] transition-all duration-300">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-md bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
              <Truck className="size-3" />
            </div>
            <span className="text-[10px] font-bold uppercase text-[#111827]">
              Courier Dispatch
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#00B82E] font-bold">
            Assigned
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] mb-1.5">
          <span className="font-bold text-[#111827]">Courier Alex M.</span>
          <span className="font-mono text-[#64748B]">Unit #28</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden mb-2">
          <div className="bg-[#00B82E] h-full w-[72%] rounded-full transition-all duration-500" />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B]">
          <span>Destination: In Transit</span>
          <span className="text-[#008F27] font-bold">Live GPS Active</span>
        </div>
      </div>

      {/* ========================================================
          CARD 5: Automated Invoicing (Far Left / Mid)
          ======================================================== */}
      <div className="hidden sm:flex absolute left-0 top-[40%] -translate-y-1/2 z-10 w-[165px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.05)] hover:border-[#00B82E] transition-all duration-300 flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="size-4 rounded bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center">
            <FileText className="size-2.5" />
          </div>
          <span className="text-[10px] font-bold uppercase text-[#111827]">
            Auto-Quote
          </span>
        </div>
        <p className="text-[9px] text-[#64748B] leading-tight">
          Procurement RFQ parsed from PDF in 1.2s.
        </p>
        <div className="flex items-center justify-between text-[8px] font-mono pt-1 border-t border-[#F1F5F9]">
          <span className="text-[#64748B]">QT-9104</span>
          <span className="text-[#00B82E] font-bold">Drafted</span>
        </div>
      </div>

      {/* ========================================================
          CARD 6: Business Analytics & Records (Far Right / Mid)
          ======================================================== */}
      <div className="hidden sm:flex absolute right-0 top-[42%] -translate-y-1/2 z-10 w-[165px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.05)] hover:border-[#00B82E] transition-all duration-300 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-3 text-[#00B82E]" />
            <span className="text-[10px] font-bold uppercase text-[#111827]">
              Google Sheet
            </span>
          </div>
          <span className="text-[8px] font-mono text-[#00B82E] font-bold">
            Live Sync
          </span>
        </div>
        <div>
          <p className="text-[8px] font-mono text-[#64748B]">Daily Volume Automated</p>
          <p className="text-xs font-mono font-bold text-[#111827]">
            +$4,850 <span className="text-[9px] text-[#008F27]">↑ 24%</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-[#64748B] pt-1 border-t border-[#F1F5F9]">
          <ShieldCheck className="size-2.5 text-[#00B82E]" />
          <span>Zero manual entry</span>
        </div>
      </div>
    </div>
  )
}
