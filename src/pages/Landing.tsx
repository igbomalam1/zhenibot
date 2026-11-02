import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { IndustrySection } from '@/components/landing/IndustrySection'
import { WorkflowShowcaseSection } from '@/components/landing/WorkflowShowcaseSection'
import { WhyZhenbotSection } from '@/components/landing/WhyZhenbotSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { ContactSection } from '@/components/landing/ContactSection'
import { Footer } from '@/components/landing/Footer'

export function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#111827] antialiased selection:bg-[#00B82E]/20 selection:text-[#111827]">
      {/* Navigation */}
      <Navbar />

      <main>
        {/* Section 1: Hero Section */}
        <Hero />

        {/* Section 2: The Problem (Manual Chores) */}
        <ProblemSection />

        {/* Section 3: What We Automate (Core Capabilities) */}
        <HowItWorks />

        {/* Section 4: How It Works (3 Steps to Live Automation) */}
        <ProcessSection />

        {/* Section 5: Industries We Help */}
        <IndustrySection />

        {/* Section 6: End-to-End Connected Workflow */}
        <WorkflowShowcaseSection />

        {/* Section 7: Why Zhenbot (Key Benefits) */}
        <WhyZhenbotSection />

        {/* Section 8: Frequently Asked Questions */}
        <FaqSection />

        {/* Section 9: Final Call to Action & Process Review */}
        <ContactSection />
      </main>

      {/* Section 10: Standardized 4-Column Footer */}
      <Footer />
    </div>
  )
}
