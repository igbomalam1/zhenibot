import { ArrowRight, CheckCircle2, MessageSquare, Zap, Clock, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-32 flex items-center justify-center border-b border-black/10">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">
          
          {/* Left Text Column */}
          <div className="w-full lg:w-3/5 flex flex-col items-start text-left space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#459F34]/10 border border-[#459F34]/30 text-[#459F34] text-xs font-bold uppercase tracking-wider">
              <Zap className="size-3.5 fill-[#459F34]" />
              <span>Full-Service Business Automation Agency</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] uppercase text-black">
              <span>We Automate Your</span><br />
              <span>Repetitive Daily Work.</span><br />
              <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
                So You Grow Faster.
              </span>
            </h1>

            {/* Subtitle in plain, relatable language */}
            <p className="w-full max-w-xl text-black/80 text-base md:text-lg leading-relaxed">
              Tired of answering the same customer questions all day, chasing payments, calculating quotes, and typing into spreadsheets? 
              We build custom automated systems that connect your WhatsApp, emails, invoices, and operations — working 24/7 so your team can focus on making sales.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
              <a
                href="#contact"
                className="bg-[#459F34] hover:bg-[#3a862b] text-white border border-[#459F34] font-semibold py-4 px-8 transition-colors text-center flex items-center justify-center gap-2"
              >
                <span>Automate My Business</span>
                <ArrowRight className="size-4" />
              </a>
              <a
                href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20would%20like%20a%20free%20consultation%20on%20automating%20my%20business%20processes."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-[#459F34] text-[#459F34] hover:bg-[#459F34]/10 font-semibold py-4 px-8 transition-colors text-center flex items-center justify-center gap-2"
              >
                <MessageSquare className="size-4" />
                <span>Free 15-Min Process Audit</span>
              </a>
            </div>

            {/* Trust Points */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-black/10 w-full text-xs text-black/70 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#459F34] shrink-0" />
                <span>Zero Coding Needed From You</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#459F34] shrink-0" />
                <span>Ready In 3 to 7 Days</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <ShieldCheck className="size-4 text-[#459F34] shrink-0" />
                <span>Dedicated Local Support</span>
              </div>
            </div>

          </div>

          {/* Right Visual Area: Clean Flat Automation Blueprint */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="w-full max-w-md border-2 border-[#459F34] bg-[#081106] p-6 text-white shadow-[0_8px_30px_rgba(69,159,52,0.12)] space-y-5">
              
              <div className="flex items-center justify-between border-b border-[#459F34]/30 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-2.5 rounded-full bg-[#459F34] animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#459F34]">
                    Live Workflow Example
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/50">Zero Human Delay</span>
              </div>

              {/* Step 1 */}
              <div className="p-3.5 border border-white/10 bg-white/5 flex items-start gap-3">
                <div className="size-6 bg-[#459F34] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Inquiry Received</p>
                  <p className="text-xs text-white/70 mt-0.5">
                    Customer sends order request on WhatsApp or Email at 11:45 PM.
                  </p>
                </div>
              </div>

              {/* Down Arrow / Connector */}
              <div className="flex justify-center -my-2">
                <div className="w-0.5 h-4 bg-[#459F34]" />
              </div>

              {/* Step 2 */}
              <div className="p-3.5 border border-[#459F34]/50 bg-[#459F34]/10 flex items-start gap-3">
                <div className="size-6 bg-[#459F34] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-[#459F34] uppercase">Instant Automated Action</p>
                  <p className="text-xs text-white/80 mt-0.5">
                    System checks price sheet, creates invoice & Paystack link, and sends instant polite reply.
                  </p>
                </div>
              </div>

              {/* Down Arrow / Connector */}
              <div className="flex justify-center -my-2">
                <div className="w-0.5 h-4 bg-[#459F34]" />
              </div>

              {/* Step 3 */}
              <div className="p-3.5 border border-white/10 bg-white/5 flex items-start gap-3">
                <div className="size-6 bg-[#459F34] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase">Payment & Follow-through</p>
                  <p className="text-xs text-white/70 mt-0.5">
                    Once paid, receipt is issued, Google Sheet is updated, and rider is booked for delivery.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/70">
                <span>Result:</span>
                <span className="text-[#459F34] font-bold">100% Automated · 0 Minutes Lost</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
