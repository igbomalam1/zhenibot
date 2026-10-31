import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Copy, Network, Percent, Gift, Sparkles, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useReferrals } from '@/hooks/useFund'
import { REFERRAL_BASE_URL } from '@/lib/constants'
import { formatCurrency, maskEmail } from '@/lib/format'
import { Button } from '@/components/ui/Button'

function maskName(name: string | null): string {
  if (!name) return 'Business Client'
  const parts = name.split(' ')
  if (parts.length === 1) {
    return `${parts[0].slice(0, 2)}•••`
  }
  return `${parts[0].slice(0, 3)}••• ${parts[parts.length - 1]?.slice(0, 1) ?? ''}•`
}

export function Referrals() {
  const { profile } = useAuth()
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const { referrals } = useReferrals()

  const referralUrl = useMemo(() => {
    const code = profile?.referral_code ?? ''
    return `${REFERRAL_BASE_URL}/auth?mode=register&ref=${encodeURIComponent(code)}`
  }, [profile?.referral_code])

  const totals = useMemo(() => {
    let tier1 = 0
    let tier2 = 0
    for (const r of referrals) {
      if (r.tier === 1) tier1 += r.commission_amount
      else tier2 += r.commission_amount
    }
    return { tier1, tier2, total: tier1 + tier2, count: referrals.length }
  }, [referrals])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      toast.success('Agency referral link copied!')
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.info('Select the link and copy manually.')
    }
  }

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="font-mono text-[10px] text-brand-300 uppercase tracking-widest font-bold">
            PARTNER & AGENCY PROGRAM
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Agency & Referral Network
        </h1>
        <p className="mt-1 text-xs text-slate-300">
          Onboard other businesses to Zhen Automation and earn 20% recurring monthly revenue across all client subscriptions.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Onboarded Businesses', value: totals.count, icon: Building2, color: 'text-brand-300' },
          { label: 'Total Commission Earned', value: formatCurrency(totals.total), icon: Gift, color: 'text-emerald-400' },
          { label: 'Direct 20% Payouts', value: formatCurrency(totals.tier1), icon: Percent, color: 'text-cyan-300' },
          { label: 'Sub-Agency 5% Overrides', value: formatCurrency(totals.tier2), icon: Network, color: 'text-indigo-400' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/8 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{s.label}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Shareable Link Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-300 font-mono uppercase">
              <Sparkles className="size-3.5" /> RECURRING MONTHLY PAYOUTS
            </span>
            <h2 className="text-2xl font-bold text-white font-display">
              Your Exclusive Agency Partner Link
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every company or client that creates an account through your link is tied to your agency code. Whenever they purchase automation credits or renew monthly plans, 20% is credited directly to your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 rounded-xl border border-white/10 bg-[#0a0f1e] px-4 py-3 font-mono text-xs text-white truncate focus:outline-none"
              />
              <Button
                type="button"
                onClick={copy}
                className="bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold shrink-0 cursor-pointer"
              >
                {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy Partner Link'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-black/40 p-5 text-center">
            <div className="rounded-xl bg-white p-3 shadow-md">
              <QRCodeSVG value={referralUrl} size={130} level="M" />
            </div>
            <p className="mt-3 font-mono text-[10px] text-slate-400 uppercase">
              Scan to open agency signup portal
            </p>
          </div>
        </div>
      </div>

      {/* Referral Client Ledger */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-4">
          <h3 className="text-base font-display font-bold text-white">Client Portfolio Roster</h3>
          <span className="font-mono text-xs text-slate-400">
            {referrals.length} Connected Businesses
          </span>
        </div>

        {referrals.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">
            No client accounts registered yet. Share your partner link to start earning 20% recurring.
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0a0f1e] p-3.5 text-xs transition-colors hover:border-brand-500/20"
              >
                <div>
                  <p className="font-display font-bold text-white">{maskName(r.referee?.full_name ?? null)}</p>
                  <p className="font-mono text-[10px] text-slate-400">
                    {r.referee?.email ? maskEmail(r.referee.email) : '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-400">+{formatCurrency(r.commission_amount)}</p>
                  <span className="font-mono text-[9px] uppercase text-brand-300 font-semibold">
                    Tier {r.tier} ({r.tier === 1 ? '20%' : '5%'})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
