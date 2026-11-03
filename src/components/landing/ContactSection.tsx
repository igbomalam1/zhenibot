import { useState, type FormEvent } from 'react'
import { Send, CheckCircle2, Mail, ArrowRight, Clock, ShieldCheck, Globe } from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { useToast } from '@/contexts/ToastContext'
import { businessStore } from '@/lib/businessStore'

export function ContactSection() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [biggestPain, setBiggestPain] = useState('Customer chats & social DMs (WhatsApp, Telegram, X, IG)')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter your name and contact number.')
      return
    }

    setSending(true)
    try {
      await businessStore.addEnquiry({
        name: name.trim(),
        business_name: businessName.trim() || 'General Business',
        phone: phone.trim(),
        service_of_interest: biggestPain,
        details: details.trim() || 'Process review request submitted from website.',
        status: 'new',
        source: 'Landing Page Process Review',
      })
      setSending(false)
      setSubmitted(true)
      toast.success('Thank you! Our automation team will reach out shortly.')
    } catch {
      setSending(false)
      setSubmitted(true)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-[#E5E7EB] relative">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111827] leading-[1.15]">
            Your Business Has Better Things to Do Than{' '}
            <span className="text-[#00B82E]">Repetitive Tasks.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed">
            Let's identify the processes slowing your business down and build automation that works around the way you operate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Fast Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#111827]">
                  Instant WhatsApp Consultation
                </h3>
                <p className="text-sm text-[#64748B] mt-1.5 leading-relaxed">
                  Prefer a direct, casual conversation? Chat with our automation engineers on WhatsApp right now.
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20would%20like%20to%20automate%20my%20business%20processes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <WhatsAppIcon className="size-5" />
                    <span>Chat on WhatsApp</span>
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href="https://t.me/zhenautomation_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    <Send className="size-4 text-[#00B82E]" />
                    <span>Chat on Telegram (@zhenautomation_bot)</span>
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#111827]">Fast Response Time</div>
                    <div className="text-xs text-[#64748B]">Replies within minutes across global timezones</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#111827]">Direct Email</div>
                    <a href="mailto:automate@zhenibot.com" className="text-xs text-[#00B82E] hover:underline">
                      automate@zhenibot.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center shrink-0">
                    <Globe className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#111827]">Global Reach</div>
                    <div className="text-xs text-[#64748B]">Serving growing businesses worldwide</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reassurance pill */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex items-center gap-3.5">
              <ShieldCheck className="size-5 text-[#00B82E] shrink-0" />
              <p className="text-xs text-[#64748B] leading-relaxed">
                <strong className="text-[#111827] font-semibold">Zero disruption guarantee:</strong> Your team never changes their habits; automation connects into your current tools seamlessly.
              </p>
            </div>
          </div>

          {/* Right Column: Custom Review Request Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="size-14 bg-[#F0FDF4] text-[#00B82E] rounded-full flex items-center justify-center mx-auto border border-[#00B82E]/20">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#111827]">Request Received!</h4>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#111827]">{name}</strong>. An automation specialist will review your details and reach out to show you exactly how to automate this.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#111827] hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#E5E7EB] pb-4 mb-2">
                    <h3 className="text-lg font-bold text-[#111827]">
                      Request Free Process Review
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      Tell us how your business works. We'll show you what can be automated.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111827] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tunde Bello"
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#64748B]/60 focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111827] mb-1.5">
                        WhatsApp or Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +234 801 234 5678"
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#64748B]/60 focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111827] mb-1.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Global Logistics"
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#64748B]/60 focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111827] mb-1.5">
                        What Takes Up The Most Time?
                      </label>
                      <select
                        value={biggestPain}
                        onChange={(e) => setBiggestPain(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 transition-all"
                      >
                        <option value="Customer chats & social DMs (WhatsApp, Telegram, X, IG)">Customer chats & social DMs (WhatsApp, Telegram, X, IG)</option>
                        <option value="Running & managing ads on Facebook, Google & lead flows">Running & managing ads on Facebook, Google & lead flows</option>
                        <option value="Manual invoice preparation & bank confirmation">Manual invoice preparation & bank confirmation</option>
                        <option value="Coordinating orders, warehouse & courier dispatches">Coordinating orders, warehouse & courier dispatches</option>
                        <option value="Typing sales data into multiple spreadsheets & CRM">Typing sales data into multiple spreadsheets & CRM</option>
                        <option value="Reading customer emails and preparing custom quotes">Reading customer emails and preparing custom quotes</option>
                        <option value="Other custom business workflow">Other custom business workflow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111827] mb-1.5">
                      Tell Us Briefly How You Currently Run It
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g. When a lead or customer engages with our ads or messages us on WhatsApp/Telegram, we manually verify details, prepare quotes, and update spreadsheets..."
                      className="w-full p-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#64748B]/60 focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 px-6 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-70"
                  >
                    <Send className="size-4" />
                    <span>{sending ? 'Sending...' : "Let's Automate Your Business"}</span>
                  </button>

                  <p className="text-[11px] text-center text-[#64748B] pt-1">
                    Free review • No obligation • Direct demonstration
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
