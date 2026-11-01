import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { AffiliateTeaser } from '@/components/landing/AffiliateTeaser'
import { ProfitCalculator } from '@/components/landing/ProfitCalculator'
import { ContactSection } from '@/components/landing/ContactSection'
import { Footer } from '@/components/landing/Footer'

export function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black antialiased selection:bg-[#459F34]/25 selection:text-black">
      <Navbar />
      <main>
        {/* Section 1: Hero (White background, bold headline, flat buttons) */}
        <Hero />

        {/* Section 2: What We Automate (White background, flat cards with green hover) */}
        <HowItWorks />

        {/* Section 3: Process Steps (Dark #081106 background, high contrast drama) */}
        <ProcessSection />

        {/* Section 4: Apps We Connect (White background, category tabs & grid) */}
        <AffiliateTeaser />

        {/* Section 5: Monthly Savings Calculator (Dark #081106 background) */}
        <ProfitCalculator />

        {/* Section 6: Contact & Free Audit (White background, straightforward form & WhatsApp) */}
        <ContactSection />
      </main>
      
      {/* Footer (Dark #081106 background with FAQ accordion) */}
      <Footer />
    </div>
  )
}
