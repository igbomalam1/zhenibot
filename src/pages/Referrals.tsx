import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Copy, Network, Percent, Share2, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useReferrals } from '@/hooks/useFund'
import { REFERRAL_BASE_URL } from '@/lib/constants'
import { formatCurrency, formatDate, maskEmail } from '@/lib/format'
import { Badge, statusTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'

function maskName(name: string | null): string {
  if (!name) return 'Investor'
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
  const { referrals, loading } = useReferrals()

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
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.info('Select the link and copy manually.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-1.5 rounded-full bg-brand-400" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Referrals
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Invite Friends & Earn
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-400">
          Earn 15% direct commission on level 1, plus 2% bonus commission on level 2.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5 border border-white/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              DIRECT EARNINGS (15%)
            </span>
            <span className="flex size-7 items-center justify-center rounded border border-brand-400/30 bg-brand-400/10 text-brand-400">
              <Percent className="size-3.5" />
            </span>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(totals.tier1)}
          </p>
          <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase">Level 1 Commission</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              TEAM EARNINGS (2%)
            </span>
            <span className="flex size-7 items-center justify-center rounded border border-amber-400/30 bg-amber-400/10 text-amber-400">
              <Network className="size-3.5" />
            </span>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(totals.tier2)}
          </p>
          <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase">Level 2 Commission</p>
        </div>

        <div className="glass-card rounded-xl p-5 border border-white/8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              TOTAL INVITED
            </span>
            <span className="flex size-7 items-center justify-center rounded border border-white/10 bg-[#121522] text-slate-300">
              <Users className="size-3.5" />
            </span>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totals.count} <span className="text-xs text-slate-500 font-normal">PEOPLE</span>
          </p>
          <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase">
            {referrals.filter((r) => r.tier === 1).length} DIRECT ·{' '}
            {referrals.filter((r) => r.tier === 2).length} INDIRECT
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Link Share Card */}
        <Card className="border border-white/10 shadow-xl">
          <CardHeader
            title="Your Referral Link"
            subtitle="Share your link or QR code with friends to earn instant rewards"
            icon={<Share2 className="size-5" />}
          />
          <div className="flex flex-col items-center gap-6 rounded-xl border border-white/8 bg-[#090b12] p-6 sm:flex-row">
            <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-2xl">
              <QRCodeSVG value={referralUrl} size={128} level="M" fgColor="#08090e" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                REFERRAL CODE:{' '}
                <strong className="text-brand-400 font-bold">{profile?.referral_code ?? 'PENDING'}</strong>
              </p>
              <code className="block break-all rounded-lg border border-white/10 bg-[#0e111d] p-3 font-mono text-[11px] leading-relaxed text-slate-300">
                {referralUrl}
              </code>
              <Button
                type="button"
                onClick={() => void copy()}
                className="mt-3 w-full"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copied' : 'Copy Referral Link'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Matrix Rules */}
        <Card className="border border-white/10 shadow-xl">
          <CardHeader title="How You Earn" subtitle="Instant bonuses paid directly to your balance" icon={<Percent className="size-5" />} />
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between rounded-xl border border-brand-400/25 bg-brand-400/5 p-4">
              <div>
                <p className="text-xs font-display font-bold text-white uppercase tracking-wider">Level 1: Direct Friends</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When someone joins with your link and deposits, you get 15% immediately.
                </p>
              </div>
              <Badge tone="brand">15%</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
              <div>
                <p className="text-xs font-display font-bold text-white uppercase tracking-wider">Level 2: Friends of Friends</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When your friends invite others who deposit, you get an extra 2% bonus.
                </p>
              </div>
              <Badge tone="warning">2%</Badge>
            </div>

            <p className="rounded-lg border border-white/6 bg-[#090b12] p-3 font-mono text-[11px] leading-relaxed text-slate-400">
              Commissions are paid instantly and can be withdrawn anytime.
            </p>
          </div>
        </Card>
      </div>

      {/* Downline Table */}
      <Card className="border border-white/10 shadow-xl">
        <CardHeader title="Invited Friends" subtitle="People who joined using your referral link" icon={<Users className="size-5" />} />
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full min-w-[640px] text-left text-sm font-sans">
            <thead>
              <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-semibold">MEMBER</th>
                <th className="pb-3 pr-4 font-semibold">LEVEL</th>
                <th className="pb-3 pr-4 font-semibold">YOUR BONUS</th>
                <th className="pb-3 pr-4 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold">JOIN DATE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono text-xs text-slate-500">
                    Retrieving network records…
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-mono text-xs text-slate-500">
                    No active downline nodes found. Share your referral link above.
                  </td>
                </tr>
              ) : (
                referrals.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                    <td className="py-3.5 pr-4">
                      <p className="font-display font-bold text-sm text-white">{maskName(r.referee?.full_name ?? null)}</p>
                      <p className="font-mono text-[11px] text-slate-500">{maskEmail(r.referee?.email ?? 'unknown@invite')}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={r.tier === 1 ? 'brand' : 'warning'}>TIER {r.tier}</Badge>
                    </td>
                    <td className="py-3.5 pr-4 font-mono font-bold text-brand-400">
                      {formatCurrency(r.commission_amount)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge tone={statusTone(r.status)}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-500">{formatDate(r.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}