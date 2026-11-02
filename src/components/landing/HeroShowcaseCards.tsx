import { RotateCw, DollarSign, Globe, TrendingUp, Star } from 'lucide-react'

export function HeroShowcaseCards() {
  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 pt-12 pb-6">
      {/* 5-Card Grid Showcase matching Image 1 (Optivize AI reference) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: 2 Cards (md:col-span-3) */}
        <div className="md:col-span-3 flex flex-col gap-5 justify-between">
          
          {/* Card 1: Daily Tasks Automated */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-4">
                <RotateCw className="size-4.5" />
              </div>
              <p className="text-xs font-semibold text-[#64748B]">Daily Tasks Automated</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-2xl font-extrabold text-[#111827]">12,500</span>
                <span className="text-[11px] font-bold text-[#00B82E] bg-[#F0FDF4] px-1.5 py-0.5 rounded-md border border-[#00B82E]/20">
                  +42%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-3 leading-relaxed">
              Workflow optimization eliminating repetitive work for clients
            </p>
          </div>

          {/* Card 2: Cost Savings Generated */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-4">
                <DollarSign className="size-4.5" />
              </div>
              <p className="text-xs font-semibold text-[#64748B]">Cost Savings Generated</p>
              <div className="mt-1.5">
                <span className="text-2xl font-extrabold text-[#111827]">₦480,000,000</span>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-3 leading-relaxed">
              Realized operational savings through smart automation pipelines
            </p>
          </div>

        </div>

        {/* CENTER COLUMN: Large Sales / Operations Analysis Card (md:col-span-6) */}
        <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#111827]">Operations &amp; Sales Analysis</span>
              <span className="text-xs font-medium text-[#94A3B8]">July 2026</span>
            </div>
            <div className="text-3xl font-extrabold text-[#111827] mb-6">
              $480,000
            </div>

            {/* Custom SVG Bar Chart with Diagonal Striped Hatched Bars & Solid Green Peak */}
            <div className="relative h-44 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 450 160">
                <defs>
                  {/* Diagonal Stripe Pattern matching Image 1 */}
                  <pattern
                    id="diagonalHatch"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                  >
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#86EFAC" strokeWidth="2.5" />
                  </pattern>
                </defs>

                {/* Light Baseline */}
                <line x1="20" y1="135" x2="430" y2="135" stroke="#F1F5F9" strokeWidth="1.5" />

                {/* Jan Bar: Striped */}
                <rect x="60" y="70" width="36" height="65" rx="5" fill="url(#diagonalHatch)" />
                <text x="68" y="152" className="text-[11px] fill-[#94A3B8] font-medium">Jan</text>

                {/* Feb Bar: Striped */}
                <rect x="140" y="85" width="36" height="50" rx="5" fill="url(#diagonalHatch)" />
                <text x="148" y="152" className="text-[11px] fill-[#94A3B8] font-medium">Feb</text>

                {/* Mar Bar: Striped */}
                <rect x="220" y="55" width="36" height="80" rx="5" fill="url(#diagonalHatch)" />
                <text x="227" y="152" className="text-[11px] fill-[#94A3B8] font-medium">Mar</text>

                {/* Apr Bar: Solid Dark Forest Green (Peak) */}
                <rect x="300" y="20" width="38" height="115" rx="6" fill="#1C3524" />
                <text x="309" y="152" className="text-[11px] fill-[#111827] font-bold">Apr</text>

                {/* May Bar: Striped */}
                <rect x="380" y="75" width="36" height="60" rx="5" fill="url(#diagonalHatch)" />
                <text x="386" y="152" className="text-[11px] fill-[#94A3B8] font-medium">May</text>
              </svg>
            </div>
          </div>

          {/* 4 Bottom Trust Stats matching Image 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-4 border-t border-[#F1F5F9] text-center">
            <div>
              <div className="text-sm font-bold text-[#111827]">500+</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Companies Trust Us</div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#111827]">99.9%</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Uptime SLA</div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#111827]">50M+</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Tasks Automated</div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#111827] flex items-center justify-center gap-1">
                <span>4.9</span>
                <Star className="size-3 fill-[#F59E0B] text-[#F59E0B]" />
              </div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Client Rating</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Dark Forest Green Card + Predictions Card (md:col-span-3) */}
        <div className="md:col-span-3 flex flex-col gap-5 justify-between">
          
          {/* Card 4: Global Users / Businesses (Dark Forest Green) */}
          <div className="bg-[#1C3524] rounded-2xl p-5 text-white shadow-[0_4px_20px_rgba(28,53,36,0.15)] flex flex-col justify-between">
            <div>
              <div className="size-9 rounded-xl bg-white/10 text-[#86EFAC] flex items-center justify-center mb-4 border border-white/10">
                <Globe className="size-4.5" />
              </div>
              <p className="text-xs font-medium text-white/70">Global Businesses</p>
              <div className="mt-1.5">
                <span className="text-2xl font-extrabold text-white">150K+</span>
              </div>
            </div>
            <p className="text-[11px] text-white/60 mt-3">
              Across 40+ countries worldwide
            </p>
          </div>

          {/* Card 5: AI-Powered Predictions / Workflow Accuracy */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00B82E]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] flex items-center justify-center mb-4">
                <TrendingUp className="size-4.5" />
              </div>
              <p className="text-xs font-semibold text-[#64748B]">Workflow Accuracy</p>
              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#111827]">98%</span>
                {/* Sparkline curve */}
                <svg className="w-14 h-6 text-[#00B82E]" viewBox="0 0 56 24" fill="none">
                  <path
                    d="M 2 18 C 10 20, 18 12, 26 14 C 34 16, 42 4, 54 2"
                    stroke="#00B82E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-3 leading-relaxed">
              Validated with real customer operations &amp; live transactions
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
