import { useState } from 'react'
import { ChevronDown, MessageSquare, ShieldCheck, Mail, MapPin } from 'lucide-react'

const YEAR = new Date().getFullYear()

const FAQS = [
  {
    q: 'What exactly does Zhen Automation do for my business?',
    a: 'We are an agency that builds custom software automations for businesses. If your team spends hours typing the same replies on WhatsApp, preparing invoices, confirming bank transfers, booking delivery riders, or updating spreadsheets, we connect your tools so these tasks happen automatically in seconds without human delay.',
  },
  {
    q: 'Do I or my staff need to know how to code?',
    a: 'Not at all. You never touch any code. Our agency handles the setup, connections, testing, and maintenance. Your staff simply continues using WhatsApp, their email, or spreadsheets, and the automation works quietly in the background.',
  },
  {
    q: 'Can you automate our WhatsApp customer inquiries and sales?',
    a: 'Yes! We configure smart WhatsApp and Instagram assistants that know your product catalog, answer pricing questions, take customer orders, collect delivery addresses, and generate Paystack or bank payment links 24 hours a day.',
  },
  {
    q: 'How long does it take to set up an automation for our company?',
    a: 'Most standard business automations (like WhatsApp order bots, invoicing, or spreadsheet syncs) take between 3 to 7 business days from the initial consultation to full live deployment.',
  },
  {
    q: 'What if we already have existing software or a custom system?',
    a: 'That is what we specialize in. We do not force you to change your software. We build bridges between whatever you currently use — Gmail, Outlook, Google Sheets, Excel, Paystack, Shopify, WooCommerce, or your in-house database.',
  },
  {
    q: 'How do we get started?',
    a: 'Simply send us a message through the contact form on this page or tap the "Chat on WhatsApp" button. We will schedule a free 15-minute process audit to map out what you can automate and give you a clear proposal.',
  },
]

export function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <footer className="w-full bg-[#081106] text-white border-t border-[#459F34]/20">
      
      {/* FAQ Section */}
      <div className="py-20 md:py-28 border-b border-white/10">
        <div className="container px-6 md:px-12 max-w-4xl mx-auto">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-[#459F34] bg-[#459F34]/10 px-3 py-1 border border-[#459F34]/20">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
              Got <span className="text-[#459F34] underline decoration-[#459F34] decoration-4 underline-offset-8">Questions?</span>
            </h2>
            <p className="text-sm md:text-base text-white/70 max-w-lg mx-auto">
              Everything you need to know about working with Zhen Automation.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="border border-white/10 bg-white/5 transition-colors overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03]"
                  >
                    <span className="font-bold text-base text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-5 text-[#459F34] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 text-sm text-white/75 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Direct CTA under FAQs */}
          <div className="mt-14 p-8 border border-[#459F34]/40 bg-[#459F34]/10 text-center space-y-4">
            <h3 className="text-xl font-bold uppercase text-white">
              Still have a specific question about your process?
            </h3>
            <p className="text-sm text-white/80 max-w-md mx-auto">
              Chat directly with our automation engineers on WhatsApp for quick, straight answers.
            </p>
            <a
              href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20have%20a%20question%20about%20automating%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold text-sm py-3 px-8 transition-colors"
            >
              <MessageSquare className="size-4" />
              <span>Chat with Us on WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-16">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center bg-[#459F34] text-white font-bold text-lg">
                  Z
                </div>
                <span className="font-bold text-lg tracking-tight text-white uppercase">
                  ZHEN <span className="text-[#459F34]">AUTOMATION</span>
                </span>
              </div>
              <p className="text-sm text-white/70 max-w-sm leading-relaxed">
                We are a business automation agency in Nigeria. We build custom software workflows that eliminate repetitive daily chores, speed up sales, and help businesses scale smoothly.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#459F34] font-semibold">
                <ShieldCheck className="size-4" />
                <span>100% Reliable & Secure Cloud Automation Architecture</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Services
              </h4>
              <ul className="space-y-2.5 text-xs text-white/70">
                <li><a href="#services" className="hover:text-[#459F34]">WhatsApp Sales Assistants</a></li>
                <li><a href="#services" className="hover:text-[#459F34]">Bank & Payment Reconciliation</a></li>
                <li><a href="#services" className="hover:text-[#459F34]">Delivery & Courier Dispatch</a></li>
                <li><a href="#services" className="hover:text-[#459F34]">Email & PDF Quote Automations</a></li>
                <li><a href="#services" className="hover:text-[#459F34]">Spreadsheet & CRM Syncing</a></li>
                <li><a href="#services" className="hover:text-[#459F34]">Custom Business Workflows</a></li>
              </ul>
            </div>

            {/* Col 3: Direct Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                Contact & Support
              </h4>
              <ul className="space-y-3 text-xs text-white/70">
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-[#459F34]" />
                  <span>contact@zhenautomation.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-[#459F34]" />
                  <span>WhatsApp: +234 (0) 800-000-0000</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#459F34]" />
                  <span>Abuja & Lagos, Nigeria</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <p>© {YEAR} Zhen Automation Agency. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Built with precision for growing Nigerian businesses</span>
            </p>
          </div>
        </div>
      </div>

    </footer>
  )
}
