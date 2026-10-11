import { Gift, Network } from 'lucide-react'

function TierNode({
  badge,
  name,
  sub,
  amount,
  accent,
}: {
  badge: string
  name: string
  sub: string
  amount: string
  accent: string
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <div className="relative">
        <span
          className="absolute -right-2 -top-2 rounded px-2 py-0.5 font-mono text-[11px] font-extrabold text-obsidian-950 shadow-md"
          style={{ background: accent }}
        >
          {amount}
        </span>
        <div className="flex size-14 items-center justify-center rounded-xl bg-[#141828] border border-white/10 font-display font-bold text-white text-base shadow-inner">
          {name}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-white font-display">{name}</p>
        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{sub}</p>
      </div>
      <span className="rounded border border-white/10 bg-[#0d0f17] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-300">
        {badge}
      </span>
    </div>
  )
}

export function AffiliateTeaser() {
  return (
    <section id="affiliate" className="relative py-28 border-t border-white/8">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold">
            REFERRAL PROGRAM
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-display">
            Earn by Inviting Friends
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Get paid on 2 levels. Earn 15% when someone you invite deposits, and an extra 2% when their friends deposit.
          </p>
        </div>

        <div className="glass-card relative mt-16 rounded-2xl p-6 sm:p-10 border border-white/8 shadow-2xl">
          <div className="relative grid gap-6 sm:grid-cols-3">
            {/* Origin Node */}
            <div className="rounded-xl border border-white/8 bg-[#090b12] p-6">
              <TierNode
                badge="Your Account"
                name="You"
                sub="Level 0"
                amount="YOU"
                accent="#00e599"
              />
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                Share your personal link. Anyone who signs up with your link is tied to your account.
              </p>
            </div>

            {/* Tier 1 Node */}
            <div className="relative rounded-xl border border-brand-400/30 bg-brand-400/[0.04] p-6">
              <div className="mb-2 text-center">
                <span className="inline-block rounded bg-brand-400 px-2.5 py-0.5 font-mono text-[10px] font-extrabold text-obsidian-950 uppercase">
                  LEVEL 1 · 15% BONUS
                </span>
              </div>
              <TierNode
                badge="Direct Friend"
                name="Friend A"
                sub="Level 1"
                amount="15%"
                accent="#00e599"
              />
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-300">
                You get a <span className="font-semibold text-brand-400">15% instant bonus</span> every time Friend A makes a deposit.
              </p>
            </div>

            {/* Tier 2 Node */}
            <div className="relative rounded-xl border border-white/10 bg-[#090b12] p-6">
              <div className="mb-2 text-center">
                <span className="inline-block rounded border border-brand-400/30 bg-brand-400/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand-400 uppercase">
                  LEVEL 2 · 2% BONUS
                </span>
              </div>
              <TierNode
                badge="Friend's Friend"
                name="Friend B"
                sub="Level 2"
                amount="2%"
                accent="#38bdf8"
              />
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-300">
                When Friend A invites Friend B, you also get an extra <span className="font-semibold text-sky-400">2% bonus</span> on Friend B's deposits.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 border-t border-white/8 pt-6">
            <div className="flex items-start gap-3 rounded-lg border border-white/6 bg-[#090b12] p-4">
              <Network className="mt-0.5 size-5 shrink-0 text-brand-400" />
              <p className="text-xs leading-relaxed text-slate-300 font-sans">
                <span className="font-bold text-white uppercase font-mono">Instant Payouts:</span> Referral bonuses are added directly to your balance the moment a deposit is confirmed.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-white/6 bg-[#090b12] p-4">
              <Gift className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-slate-300 font-sans">
                <span className="font-bold text-white uppercase font-mono">Withdraw Anytime:</span> You can withdraw your referral bonuses anytime or keep them to grow your balance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}