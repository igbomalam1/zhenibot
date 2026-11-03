import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

const FAQS = [
  {
    q: 'What exactly does Zhenbot automate?',
    a: 'We automate virtually any repetitive business workflow. This includes multi-channel communications (WhatsApp, Telegram, X/Twitter, Instagram, and Email), automated ad campaign workflows (Facebook and Google Ads lead routing), instant payment verification and digital invoicing, order fulfillment, multi-app spreadsheet/CRM synchronization, and custom operational tasks.',
  },
  {
    q: 'Do you work with businesses across the globe?',
    a: 'Yes, absolutely. We serve and build custom automations for businesses worldwide. All our solutions run on enterprise-grade cloud architecture that operates 24/7 across every timezone and region.',
  },
  {
    q: 'Can you automate our social channels, messaging apps, and ad workflows?',
    a: 'Yes. We build intelligent, tailored workflows across your favorite platforms—whether running automated ad lead follow-ups from Facebook and Google, replying to customer inquiries on Telegram and WhatsApp, or managing DMs and mentions on X (Twitter) and Instagram.',
  },
  {
    q: 'Do I need an existing website to use your automations?',
    a: 'No. Many of our clients operate through social channels, messaging apps, phone calls, or physical locations. We automate workflows directly across your existing communication apps, spreadsheets, emails, and payment gateways without requiring a website.',
  },
  {
    q: 'Can Zhenbot connect to our payment processor and bank?',
    a: 'Yes. We integrate with leading payment processors and banking APIs worldwide (including Stripe, PayPal, Paystack, Flutterwave, and custom bank webhooks). Payments are reconciled in real-time, instantly issuing branded receipts with zero manual verification.',
  },
  {
    q: 'Can you build automation around our existing software tools?',
    a: 'Yes. We never force you to replace your existing tools. We build custom integrations between whatever software you already rely on—Google Workspace, Microsoft 365, Notion, Airtable, Shopify, WooCommerce, Salesforce, HubSpot, or proprietary databases.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Most standard business automations are mapped, built, tested, and fully deployed within 3 to 7 business days from our initial consultation.',
  },
  {
    q: 'Do you provide continuous monitoring and maintenance?',
    a: 'Yes. Every automation comes with round-the-clock cloud monitoring, preventative maintenance, and dedicated technical support to ensure your business processes run continuously with zero downtime.',
  },
]

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section id="faq" className="w-full bg-white py-20 md:py-28 border-b border-[#E5E7EB]">
      <div className="container px-6 max-w-[880px] mx-auto">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#111827] leading-[1.18]">
            Frequently Asked <span className="text-[#00B82E]">Questions.</span>
          </h2>
          <p className="text-base text-[#64748B] max-w-lg mx-auto">
            Clear, honest answers about how custom business automation works.
          </p>
        </div>

        {/* Clean Accordion FAQ */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="border border-[#E5E7EB] rounded-[14px] bg-white transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <span className="font-bold text-[16px] text-[#111827]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-5 text-[#00B82E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-[15px] text-[#64748B] leading-relaxed border-t border-[#F1F5F9]">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-14 p-6 rounded-[16px] bg-[#F0FDF4] border border-[#00B82E]/30 text-center space-y-3">
          <h4 className="text-base font-bold text-[#111827]">
            Have a question specific to your operational setup?
          </h4>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            Get in touch directly with our automation engineers for immediate answers.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-sm h-11 px-6 rounded-[12px] transition-colors shadow-xs cursor-pointer"
          >
            <span>Ask an Automation Engineer</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

      </div>
    </section>
  )
}
