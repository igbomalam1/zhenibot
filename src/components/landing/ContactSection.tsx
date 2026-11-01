import { useState, type FormEvent } from 'react'
import { Mail, MessageSquare, Send, CheckCircle2, MapPin } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export function ContactSection() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [biggestPain, setBiggestPain] = useState('Answering WhatsApp / IG messages all day')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      toast.error('Please enter your name and phone number.')
      return
    }

    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      toast.success('Thank you! We will reach out on WhatsApp shortly.')
    }, 800)
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-b border-black/10 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:w-2/5 space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#459F34]/10 border border-[#459F34]/30 text-[#459F34] text-xs font-bold uppercase tracking-wider mb-4">
                <span>Free 15-Min Audit</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight leading-none mb-6">
                Let's Automate <br />
                <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">
                  Your Business
                </span>
              </h3>
              <p className="text-black/70 text-base md:text-lg leading-relaxed">
                Tell us what takes up your time every day. We will analyze your workflow and show you exactly what can be put on autopilot — completely free of charge.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-black/10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#459F34]/10 text-[#459F34] border border-[#459F34]/20 shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-black">Fast WhatsApp Response</h4>
                  <p className="text-sm text-black/70 mt-0.5">Chat directly with an automation consultant.</p>
                  <a
                    href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20would%20like%20to%20automate%20my%20business%20processes."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-sm font-bold text-[#459F34] hover:underline"
                  >
                    +234 (0) 800-000-0000 &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#459F34]/10 text-[#459F34] border border-[#459F34]/20 shrink-0">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-black">Email Consultations</h4>
                  <p className="text-sm text-black/70 mt-0.5">Send us your workflow documents or inquiries.</p>
                  <a
                    href="mailto:contact@zhenautomation.com"
                    className="inline-block mt-1 text-sm font-bold text-[#459F34] hover:underline"
                  >
                    contact@zhenautomation.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#459F34]/10 text-[#459F34] border border-[#459F34]/20 shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-black">Headquarters & Availability</h4>
                  <p className="text-sm text-black/70 mt-0.5">Abuja & Lagos, Nigeria. Serving businesses nationwide.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Form */}
          <div className="lg:w-3/5 w-full">
            <div className="p-8 md:p-10 border border-black/10 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.04)]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="size-16 bg-[#459F34]/10 text-[#459F34] border border-[#459F34]/30 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h4 className="text-2xl font-bold uppercase text-black">Inquiry Received!</h4>
                  <p className="text-sm text-black/70 max-w-md mx-auto">
                    Thank you {name}. One of our automation architects will review your business details and reach out to you on WhatsApp within 30 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase hover:bg-black/80"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tunde Bello"
                        className="w-full border border-black/15 bg-white p-3.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-[#459F34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0801 234 5678"
                        className="w-full border border-black/15 bg-white p-3.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-[#459F34]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                        Business or Brand Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Crown Gadgets & Logistics"
                        className="w-full border border-black/15 bg-white p-3.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-[#459F34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                        What Takes Up The Most Time?
                      </label>
                      <select
                        value={biggestPain}
                        onChange={(e) => setBiggestPain(e.target.value)}
                        className="w-full border border-black/15 bg-white p-3.5 text-sm text-black focus:outline-none focus:border-[#459F34]"
                      >
                        <option value="Answering WhatsApp / IG messages all day">Answering WhatsApp / IG messages all day</option>
                        <option value="Manual invoice preparation & bank confirmation">Manual invoice preparation & bank confirmation</option>
                        <option value="Calling & coordinating delivery / okada riders">Calling & coordinating delivery / okada riders</option>
                        <option value="Typing sales data into multiple spreadsheets">Typing sales data into multiple spreadsheets</option>
                        <option value="Reading procurement emails and calculating quotes">Reading procurement emails and calculating quotes</option>
                        <option value="Other custom business workflow">Other custom business workflow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      Tell Us Briefly How You Currently Run It
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g. When a customer pays, we check the bank app, screenshot it, send to warehouse on WhatsApp, then call a dispatch rider..."
                      className="w-full border border-black/15 bg-white p-3.5 text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-[#459F34]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#459F34] hover:bg-[#3a862b] text-white font-bold uppercase tracking-wider text-sm py-4 px-8 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="size-4" />
                    <span>{sending ? 'Submitting...' : 'Submit For Free Automation Review'}</span>
                  </button>

                  <p className="text-[11px] text-center text-black/50">
                    No spam. No commitment. We only reach out with a direct plan on how to automate your process.
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
