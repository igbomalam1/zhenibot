import { Link } from 'react-router-dom'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { Mail, Globe, ArrowUpRight } from 'lucide-react'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="w-full bg-white text-[#111827] border-t border-[#E5E7EB]">
      {/* Main Footer Links */}
      <div className="py-16 md:py-20">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Col 1: Brand Info (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <ZhenbotLogo variant="full" size="md" />
              <p className="text-sm text-[#64748B] max-w-sm leading-relaxed pt-2">
                Helping businesses eliminate repetitive work through intelligent, custom-built automation. Built around the way your operations work.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/2348000000000?text=Hello%20Zhen%20Automation,%20I%20would%20like%20to%20automate%20my%20business%20processes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#00B82E] hover:underline"
                >
                  <WhatsAppIcon className="size-3.5" />
                  <span>Start a conversation on WhatsApp</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Col 2: Explore Navigation (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#00B82E] transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">What We Automate</a></li>
                <li><a href="#how-it-works" className="hover:text-[#00B82E] transition-colors">How It Works</a></li>
                <li><a href="#industries" className="hover:text-[#00B82E] transition-colors">Industries</a></li>
                <li><a href="#faq" className="hover:text-[#00B82E] transition-colors">FAQ</a></li>
                <li>
                  <Link to="/portal" className="text-[#00B82E] font-semibold hover:underline">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Services (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">
                What We Automate
              </h4>
              <ul className="space-y-3 text-sm text-[#64748B]">
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Multi-Platform Conversations</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Ad Campaigns & Lead Routing</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Payment & Invoicing</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Orders & Fulfillment</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Spreadsheets & CRM Sync</a></li>
                <li><a href="#services" className="hover:text-[#00B82E] transition-colors">Custom Business Operations</a></li>
              </ul>
            </div>

            {/* Col 4: Get in Touch (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-3.5 text-sm text-[#64748B]">
                <li className="flex items-start gap-2.5">
                  <Mail className="size-4 text-[#00B82E] shrink-0 mt-0.5" />
                  <a href="mailto:automate@zhenibot.com" className="hover:text-[#00B82E] transition-colors">
                    automate@zhenibot.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <WhatsAppIcon className="size-4 text-[#00B82E] shrink-0 mt-0.5" />
                  <a
                    href="https://wa.me/2348000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00B82E] transition-colors"
                  >
                    +234 (0) 800-000-0000
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Globe className="size-4 text-[#00B82E] shrink-0 mt-0.5" />
                  <span>Worldwide — Serving businesses globally</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="py-6 border-t border-[#E5E7EB] bg-[#F8FAFC]">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {YEAR} Zhenbot (Zhen Automation). All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/portal/login" className="hover:text-[#111827] transition-colors">
              Sign In
            </Link>
            <a href="#" className="hover:text-[#111827] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#111827] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
