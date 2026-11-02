import { ArrowRight } from 'lucide-react'
import { AutomationEcosystemVisual } from '@/components/landing/AutomationEcosystemVisual'
import { HeroShowcaseCards } from '@/components/landing/HeroShowcaseCards'

export function Hero() {
  return (
    <section className="relative w-full bg-white bg-grid-dots py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center border-b border-[#E5E7EB] overflow-hidden">
      {/* Soft Green Top Ambient Accent */}
      <div
        className="absolute top-0 right-1/4 -translate-y-1/2 size-[450px] rounded-full bg-[#00B82E]/5 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container px-6 max-w-[1240px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 w-full">
          
          {/* Left Side: Clean Bold Headline & CTAs */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-8">
            
            {/* Main Headline with Highlighted Green Line */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.12] text-[#111827]">
              <span>Your Business Shouldn't Run on Manual Labour.</span>
              <span className="block mt-3 text-[#00B82E]">
                Let Automation Do the Repetitive Work.
              </span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#contact"
                className="bg-[#00B82E] hover:bg-[#008F27] text-white font-semibold text-[15px] h-[52px] px-7 rounded-[12px] shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Automate My Business</span>
                <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#services"
                className="bg-white hover:bg-[#F0FDF4] text-[#111827] border border-[#E5E7EB] hover:border-[#00B82E]/40 font-semibold text-[15px] h-[52px] px-7 rounded-[12px] transition-all text-center flex items-center justify-center cursor-pointer"
              >
                <span>See What We Automate</span>
              </a>
            </div>

          </div>

          {/* Right Side: Preserved Floating Automation Ecosystem Visual */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <AutomationEcosystemVisual />
          </div>

        </div>

        {/* Live Performance & Operations Showcase matching Optivize AI reference */}
        <div className="mt-16 pt-8 border-t border-[#F1F5F9]">
          <HeroShowcaseCards />
        </div>
      </div>
    </section>
  )
}
