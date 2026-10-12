import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase, TABLE } from '@/lib/supabase'
import { BRAND, DEPOSIT_NETWORKS } from '@/lib/constants'
import type { DepositNetwork } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { sendDepositReceivedEmail } from '@/lib/email'
import { DualTokenBadge } from '@/components/ui/CryptoIcons'

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500]

export function Deposit() {
  const { user } = useAuth()
  const toast = useToast()

  const [network, setNetwork] = useState<DepositNetwork>(DEPOSIT_NETWORKS[0])
  const [amount, setAmount] = useState('100')
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [assignedWallets, setAssignedWallets] = useState<{
    evm?: string
    btc?: string
    trc20?: string
  }>({})
  const [loadingWallet, setLoadingWallet] = useState(true)

  const amountNumber = Number(amount) || 0
  const dailyReturn = amountNumber * BRAND.dailyRate
  const monthlyReturn = dailyReturn * 30

  // Fetch or dynamically auto-assign user's unique wallets from database
  useEffect(() => {
    if (!user?.id) return

    const loadWallets = async () => {
      setLoadingWallet(true)
      // Call RPC function to get or assign unique wallets for this user
      const { data, error } = await supabase.rpc('zhenbot_get_or_assign_user_wallets', {
        p_user_id: user.id,
      })

      if (!error && data) {
        setAssignedWallets(data as { evm?: string; btc?: string; trc20?: string })
      } else {
        // Fallback: check profile assigned columns directly
        const { data: profile } = await supabase
          .from(TABLE.users)
          .select('assigned_evm_wallet, assigned_btc_wallet, assigned_trc20_wallet')
          .eq('id', user.id)
          .single()

        if (profile) {
          setAssignedWallets({
            evm: profile.assigned_evm_wallet || undefined,
            btc: profile.assigned_btc_wallet || undefined,
            trc20: profile.assigned_trc20_wallet || undefined,
          })
        }
      }
      setLoadingWallet(false)
    }

    void loadWallets()
  }, [user?.id])

  // Resolve active address for chosen chain family - STRICTLY from database pool, NEVER mock
  const currentAddress =
    network.chainFamily === 'evm'
      ? assignedWallets.evm || ''
      : assignedWallets.trc20 || ''

  const copyAddress = async () => {
    if (!currentAddress) {
      toast.error('No deposit wallet assigned for this network yet. Contact support.')
      return
    }
    try {
      await navigator.clipboard.writeText(currentAddress)
      setCopied(true)
      toast.success('Address copied to clipboard!')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info('Select the address and copy manually.')
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentAddress || currentAddress.startsWith('Awaiting')) {
      toast.error('Please wait for an active deposit wallet to be assigned before depositing.')
      return
    }
    if (amountNumber < BRAND.minDeposit) {
      toast.error(`Minimum deposit is ${formatCurrency(BRAND.minDeposit)}.`)
      return
    }

    setSubmitting(true)
    const cleanTxHash = txHash.trim() || null

    const { error } = await supabase.from(TABLE.transactions).insert({
      user_id: user?.id,
      type: 'deposit',
      amount: amountNumber,
      status: 'pending',
      network: `${network.asset} · ${network.network}`,
      wallet_address: currentAddress,
      tx_hash: cleanTxHash,
    })

    if (error) {
      toast.error(`Failed to submit deposit: ${error.message}`)
      setSubmitting(false)
      return
    }

    // Dispatch confirmation email to investor and instant alert to blessedjohnny2552@gmail.com
    void sendDepositReceivedEmail({
      userId: user?.id,
      amount: amountNumber,
      network: `${network.asset} · ${network.network}`,
      txHash: cleanTxHash || undefined,
      walletAddress: currentAddress,
    })

    setSubmitting(false)
    setSubmittedSuccess(true)
    toast.success('Deposit request submitted successfully! An alert was sent to the audit team.')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex size-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand-400 uppercase">
              DEPOSIT FUNDS · 1.2% DAILY RETURN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Deposit USDT
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Select your preferred USDT network, transfer funds, and start receiving daily earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-brand-400/25 bg-brand-400/10 px-3.5 py-2 font-mono text-xs text-brand-300">
            <ShieldCheck className="size-4 text-brand-400" />
            <span>0% Deposit Fees · Instant Credit</span>
          </div>
        </div>
      </div>

      {/* Success Dialog Banner if already submitted */}
      {submittedSuccess && (
        <div className="rounded-2xl border border-brand-400/40 bg-gradient-to-r from-brand-400/15 via-[#0e1724] to-[#080d1a] p-6 shadow-2xl animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-400 text-obsidian-950 font-bold shadow-lg shadow-brand-400/30">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-display font-bold text-white">
                Deposit Received & Pending Verification
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                We have registered your deposit of <strong className="text-brand-400 font-mono font-bold">${amountNumber} USDT</strong> on{' '}
                <strong className="text-white">{network.network}</strong>. Our automated blockchain listener and finance team have been notified. Your capital will be deployed to active trading immediately upon confirmation.
              </p>
              <div className="pt-2 flex gap-3">
                <Button size="sm" variant="outline" onClick={() => setSubmittedSuccess(false)}>
                  Make Another Deposit
                </Button>
                <a
                  href="/dashboard"
                  className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1"
                >
                  Go to Overview →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Select Token Network (Visual Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-brand-400 text-obsidian-950 font-mono text-xs font-bold">
              1
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Select USDT Network
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Min Deposit: <strong className="text-white">{formatCurrency(BRAND.minDeposit)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {DEPOSIT_NETWORKS.map((n) => {
            const isSelected = network.id === n.id
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setNetwork(n)}
                className={cn(
                  'group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98]',
                  isSelected
                    ? 'border-brand-400 bg-gradient-to-b from-[#111927] to-[#0c121e] shadow-xl shadow-brand-400/10 ring-1 ring-brand-400/50'
                    : 'border-white/8 bg-[#090c14] hover:border-white/20 hover:bg-[#0e1320]',
                )}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <DualTokenBadge networkId={n.id} size="md" />

                  {n.popular && (
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: n.badgeBg, color: n.accent }}
                    >
                      POPULAR
                    </span>
                  )}
                </div>

                {/* Token Names */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-display font-extrabold text-white tracking-tight">
                      {n.asset}
                    </span>
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: n.accent }}
                    >
                      {n.shortName}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 font-medium">
                    {n.network}
                  </p>
                </div>

                {/* Bottom Fee & Confirmations */}
                <div className="mt-3.5 flex items-center justify-between border-t border-white/6 pt-2.5 font-mono text-[10px]">
                  <span className="text-slate-400">{n.feeNote}</span>
                  <span className={cn(
                    'flex size-4 items-center justify-center rounded-full',
                    isSelected ? 'bg-brand-400 text-obsidian-950 font-bold' : 'border border-white/20 text-transparent'
                  )}>
                    ✓
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 2: Amount & Yield Calculator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-brand-400 text-obsidian-950 font-mono text-xs font-bold">
              2
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Enter Deposit Amount
            </span>
          </div>
          <span className="font-mono text-xs text-brand-400 font-semibold">
            1 USDT = $1.00 USD
          </span>
        </div>

        <Card className="border border-white/10 bg-[#090c14] p-5 shadow-xl">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            {/* Input + Presets */}
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Amount to Deposit (USDT)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min={BRAND.minDeposit}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="20.00"
                    className="w-full rounded-xl border border-white/10 bg-[#101422] py-3.5 pl-9 pr-24 font-mono text-xl font-bold text-white placeholder-slate-600 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-xs font-bold text-brand-400 bg-brand-400/10 border border-brand-400/25 px-2 py-1 rounded-md">
                    <span>USDT</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <p className="font-mono text-[10px] text-slate-500 uppercase font-semibold mb-2">
                  Quick Amount Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all',
                        amountNumber === preset
                          ? 'border-brand-400 bg-brand-400 text-obsidian-950 shadow-md shadow-brand-400/20'
                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white',
                      )}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Projected Yield Box */}
            <div className="flex flex-col justify-between rounded-xl border border-white/8 bg-[#0c101c] p-4.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-brand-400" />
                    Automated Earnings
                  </span>
                  <span className="rounded bg-brand-400/15 border border-brand-400/30 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-400">
                    1.2% DAILY
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 font-mono">
                  <div className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5">
                    <p className="text-[10px] text-slate-500 uppercase">Estimated Daily</p>
                    <p className="text-base font-bold text-brand-400">
                      +{formatCurrency(dailyReturn)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5">
                    <p className="text-[10px] text-slate-500 uppercase">Estimated Monthly</p>
                    <p className="text-base font-bold text-white">
                      +{formatCurrency(monthlyReturn)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-white/6 pt-2.5 font-mono text-[10px] text-slate-500 flex items-center justify-between">
                <span>Principal Lock: 30 Days</span>
                <span className="text-emerald-400 font-semibold">Zero Deposit Fee</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* STEP 3: Transfer & Wallet Address Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-brand-400 text-obsidian-950 font-mono text-xs font-bold">
              3
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Send USDT to Your Dedicated Address
            </span>
          </div>
          <span className="rounded border border-brand-400/25 bg-brand-400/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-brand-400">
            {loadingWallet ? 'GENERATING...' : 'SECURE DEDICATED VAULT'}
          </span>
        </div>

        <Card className="border border-white/10 bg-[#090c14] p-6 shadow-2xl">
          {currentAddress ? (
            <div className="grid gap-6 md:grid-cols-[180px_1fr] items-center">
              {/* QR Code Container */}
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-2xl bg-white p-3 shadow-2xl">
                  <QRCodeSVG value={currentAddress} size={150} level="M" fgColor="#08090e" />
                </div>
                <span className="font-mono text-[10px] text-slate-400 text-center">
                  Scan with Exchange / Wallet App
                </span>
              </div>

              {/* Address & Copy Flow */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Deposit Destination Address ({network.shortName})
                    </label>
                    <span className="font-mono text-[10px] text-slate-400">
                      Network: <strong className="text-white">{network.network}</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 rounded-xl border border-brand-400/35 bg-[#0f1422] p-3.5 font-mono text-xs text-brand-300 break-all select-all font-semibold shadow-inner">
                      {currentAddress}
                    </div>
                    <Button
                      type="button"
                      onClick={copyAddress}
                      size="md"
                      className="shrink-0 flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="size-4 text-obsidian-950" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          <span>COPY ADDRESS</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Safety Alert Strip */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                  <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <p>
                    Send only <strong className="text-white">USDT</strong> on the{' '}
                    <strong className="text-white">{network.network}</strong> network to this address. Sending any other currency or using an incompatible network may result in loss of funds. Minimum transfer is{' '}
                    <strong className="text-white">${BRAND.minDeposit}.00</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-1">
                <Info className="size-6" />
              </div>
              <h4 className="text-base font-display font-bold text-white">
                Wallet Assignment Pending
              </h4>
              <p className="font-sans text-xs text-slate-400 max-w-md mx-auto">
                No active {network.network} ({network.shortName}) wallet is currently available in the system pool. Please notify administrator to replenish the pool, or choose another network (e.g. USDT BSC).
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* STEP 4: Confirm Transfer Form */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-brand-400 text-obsidian-950 font-mono text-xs font-bold">
            4
          </span>
          <span className="font-display text-sm font-bold text-white tracking-tight">
            Confirm & Complete Deposit
          </span>
        </div>

        <form onSubmit={onSubmit}>
          <Card className="border border-white/10 bg-[#090c14] p-5 shadow-xl space-y-4">
            <div>
              <label className="block font-mono text-xs font-semibold text-slate-300 mb-1.5 uppercase">
                Transaction Hash / TxID (Optional)
              </label>
              <input
                type="text"
                placeholder="Paste transaction hash if available from your exchange (optional)…"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#101422] px-4 py-3 font-mono text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
              />
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                You can leave this blank if you don't have the hash yet. Our system tracks incoming wallet transfers automatically.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-extrabold shadow-xl shadow-brand-400/20 disabled:opacity-50"
              loading={submitting}
              disabled={!currentAddress}
            >
              {submitting
                ? 'Confirming Deposit…'
                : !currentAddress
                ? 'Deposit Unavailable — Awaiting Wallet'
                : 'I Have Transferred the Funds — Submit Deposit'}
              {!submitting && currentAddress && <ArrowRight className="size-5 ml-1.5" />}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  )
}