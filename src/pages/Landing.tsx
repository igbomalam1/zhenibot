import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { AffiliateTeaser } from '@/components/landing/AffiliateTeaser'
import { ProfitCalculator } from '@/components/landing/ProfitCalculator'
import { Footer } from '@/components/landing/Footer'

export function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090e]">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AffiliateTeaser />
        <ProfitCalculator />
      </main>
      <Footer />
    </div>
  )
}