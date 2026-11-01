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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-1.5 rounded-full bg-[#459F34]" />
          <span className="font-mono text-[11px] text-[#8F95A3] tracking-widest uppercase">
            Partner & agency network
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7]">
          Agency & referral network
        </h1>
        <p className="mt-1 text-sm text-[#8F95A3]">
          Onboard other businesses to Zhen Automation and earn 20% recurring monthly revenue across all client subscriptions.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Onboarded businesses', value: totals.count, icon: Building2, color: 'text-[#F4F5F7]' },
          { label: 'Total commission earned', value: formatCurrency(totals.total), icon: Gift, color: 'text-emerald-400' },
          { label: 'Direct 20% payouts', value: formatCurrency(totals.tier1), icon: Percent, color: 'text-[#459F34]' },
          { label: 'Sub-agency 5% overrides', value: formatCurrency(totals.tier2), icon: Network, color: 'text-[#8F95A3]' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-xl p-4 border border-white/8 bg-[#0e1a0b]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F95A3]">{s.label}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="font-mono text-2xl font-bold text-[#F4F5F7] tnum">{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Shareable Link Box */}
      <div className="rounded-xl p-6 sm:p-8 border border-white/8 bg-[#0e1a0b]">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#459F34]/20 bg-[#459F34]/10 px-2.5 py-1 text-xs font-semibold text-[#459F34] font-mono uppercase tracking-wider">
              <Sparkles className="size-3.5" /> Recurring monthly payouts
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F5F7] tracking-tight">
              Your exclusive agency partner link
            </h2>
            <p className="text-xs text-[#8F95A3] leading-relaxed">
              Every company or client that registers through your link is mapped to your agency profile. Whenever they top up automation compute credits or renew monthly tiers, 20% is credited directly to your settlement wallet.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="flex-1 rounded-lg border border-white/10 bg-[#081106] px-3.5 py-2.5 font-mono text-xs text-[#F4F5F7] truncate focus:border-[#459F34] focus:outline-none"
              />
              <Button
                type="button"
                onClick={copy}
                className="bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold shrink-0"
              >
                {copied ? <Check className="size-4 mr-1.5" /> : <Copy className="size-4 mr-1.5" />}
                {copied ? 'Copied' : 'Copy partner link'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-white/6 bg-[#081106] p-6 text-center">
            <div className="rounded-lg bg-white p-3">
              <QRCodeSVG value={referralUrl} size={120} level="M" />
            </div>
            <p className="mt-3 font-mono text-[10px] text-[#545A67] uppercase tracking-wider">
              Scan to open agency signup portal
            </p>
          </div>
        </div>
      </div>

      {/* Referral Client Ledger */}
      <div className="rounded-xl p-6 border border-white/8 bg-[#0e1a0b]">
        <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-4">
          <h3 className="text-sm font-semibold text-[#F4F5F7]">Client portfolio roster</h3>
          <span className="font-mono text-xs text-[#8F95A3] tnum">
            {referrals.length} connected businesses
          </span>
        </div>

        {referrals.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#545A67] font-mono">
            No client accounts registered yet. Share your partner link to start earning 20% recurring.
          </div>
        ) : (
          <div className="space-y-2">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-white/6 bg-[#081106] p-3.5 text-xs transition-colors hover:border-white/15"
              >
                <div>
                  <p className="font-medium text-[#F4F5F7]">{maskName(r.referee?.full_name ?? null)}</p>
                  <p className="font-mono text-[10px] text-[#8F95A3]">
                    {r.referee?.email ? maskEmail(r.referee.email) : '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-emerald-400 tnum">+{formatCurrency(r.commission_amount)}</p>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8F95A3] font-semibold">
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
