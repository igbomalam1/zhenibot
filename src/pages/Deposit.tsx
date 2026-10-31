import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase, TABLE } from '@/lib/supabase'
import { BRAND, DEPOSIT_NETWORKS } from '@/lib/constants'
import type { DepositNetwork } from '@/lib/constants'
import { formatCurrency, formatNumber } from '@/lib/format'
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
  const estimatedTasks = Math.round(amountNumber * 125) // ~125 automated operations per $1
  const estimatedHoursSaved = Math.round((estimatedTasks * 10) / 60)

  // Fetch or dynamically auto-assign user's unique wallets from database
  useEffect(() => {
    if (!user?.id) return

    const loadWallets = async () => {
      setLoadingWallet(true)
      const { data, error } = await supabase.rpc('zhenbot_get_or_assign_user_wallets', {
        p_user_id: user.id,
      })

      if (!error && data) {
        setAssignedWallets(data as { evm?: string; btc?: string; trc20?: string })
      } else {
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

  const currentAddress =
    network.chainFamily === 'evm'
      ? assignedWallets.evm || ''
      : assignedWallets.trc20 || ''

  const copyAddress = async () => {
    if (!currentAddress) {
      toast.error('No deposit address assigned for this network yet. Contact support.')
      return
    }
    try {
      await navigator.clipboard.writeText(currentAddress)
      setCopied(true)
      toast.success('Provisioning address copied to clipboard!')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info('Select the address and copy manually.')
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentAddress || currentAddress.startsWith('Awaiting')) {
      toast.error('Please wait for an active provisioning address to be assigned before submitting.')
      return
    }
    if (amountNumber < BRAND.minDeposit) {
      toast.error(`Minimum credit top-up is ${formatCurrency(BRAND.minDeposit)}.`)
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
      toast.error(`Failed to submit credit request: ${error.message}`)
      setSubmitting(false)
      return
    }

    void sendDepositReceivedEmail({
      userId: user?.id,
      amount: amountNumber,
      network: `${network.asset} · ${network.network}`,
      txHash: cleanTxHash || undefined,
      walletAddress: currentAddress,
    })

    setSubmitting(false)
    setSubmittedSuccess(true)
    toast.success('Automation fuel request submitted! Provisioning team alerted.')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex size-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-brand-300 uppercase">
              COMPUTE FUEL & WORKFLOW CREDITS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
            Provision Automation Credits
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            Top up execution credits to power your email auto-responders, dispatch riders, and 24/7 AI customer care reps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-brand-500/25 bg-brand-500/10 px-3.5 py-2 font-mono text-xs text-brand-300">
            <ShieldCheck className="size-4 text-cyan-300" />
            <span>Instant Provisioning · 0% Top-Up Fees</span>
          </div>
        </div>
      </div>

      {/* Success Dialog Banner if already submitted */}
      {submittedSuccess && (
        <div className="rounded-2xl border border-brand-500/40 bg-gradient-to-r from-brand-600/15 via-[#0e1728] to-[#080d1a] p-6 shadow-2xl animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white font-bold shadow-lg shadow-brand-500/30">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-display font-bold text-white">
                Credit Provisioning Request Logged & Verifying
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                We registered your fuel top-up of <strong className="text-brand-300 font-mono font-bold">${amountNumber} USDT</strong> (~{formatNumber(estimatedTasks)} compute tasks) on{' '}
                <strong className="text-white">{network.network}</strong>. Your cluster balance updates automatically upon confirmation.
              </p>
              <div className="pt-2 flex gap-3">
                <Button size="sm" variant="outline" onClick={() => setSubmittedSuccess(false)}>
                  Top Up More Credits
                </Button>
                <a
                  href="/dashboard"
                  className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1"
                >
                  Return to Command Center →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Select Settlement Rail */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-mono text-xs font-bold">
              1
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Select Settlement Network
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Min Top-up: <strong className="text-white">{formatCurrency(BRAND.minDeposit)}</strong>
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
                  'group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.98] cursor-pointer',
                  isSelected
                    ? 'border-brand-500 bg-gradient-to-b from-[#141d33] to-[#0c1220] shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/50'
                    : 'border-white/8 bg-[#090d16] hover:border-white/20 hover:bg-[#0e1424]',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <DualTokenBadge networkId={n.id} size="md" />

                  {n.popular && (
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: n.badgeBg, color: n.accent }}
                    >
                      RECOMMENDED
                    </span>
                  )}
                </div>

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

                <div className="mt-3.5 flex items-center justify-between border-t border-white/6 pt-2.5 font-mono text-[10px]">
                  <span className="text-slate-400">{n.feeNote}</span>
                  <span className={cn(
                    'flex size-4 items-center justify-center rounded-full',
                    isSelected ? 'bg-brand-500 text-white font-bold' : 'border border-white/20 text-transparent'
                  )}>
                    ✓
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 2: Amount & Compute Capacity Estimator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-mono text-xs font-bold">
              2
            </span>
            <span className="font-display text-sm font-bold text-white tracking-tight">
              Enter Credit Amount
            </span>
          </div>
          <span className="font-mono text-xs text-cyan-300 font-semibold">
            1 USD Credit = ~125 AI Executions
          </span>
        </div>

        <Card className="border border-white/10 bg-[#0a0f1e] p-5 shadow-xl">
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Credits to Top Up (USDT / USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min={BRAND.minDeposit}
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50.00"
                    className="w-full rounded-xl border border-white/10 bg-[#10172a] py-3.5 pl-9 pr-24 font-mono text-xl font-bold text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-mono text-xs font-bold text-brand-300 bg-brand-500/10 border border-brand-500/25 px-2 py-1 rounded-md">
                    <span>CREDITS</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] text-slate-400 uppercase font-semibold mb-2">
                  Compute Plan Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      className={cn(
                        'rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer',
                        amountNumber === preset
                          ? 'border-brand-400 bg-brand-500 text-white shadow-md shadow-brand-500/25'
                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white',
                      )}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Capacity Output Box */}
            <div className="flex flex-col justify-between rounded-xl border border-brand-500/30 bg-gradient-to-br from-[#12192e] to-[#0a0f1d] p-4 text-xs font-mono">
              <div>
                <div className="flex items-center justify-between border-b border-white/8 pb-2 mb-3">
                  <span className="text-slate-400 uppercase text-[10px]">ESTIMATED WORKFLOW POWER</span>
                  <Sparkles className="size-3 text-cyan-300" />
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Autonomous Tasks</span>
                    <span className="text-2xl font-bold text-white tracking-tight">
                      ~{formatNumber(estimatedTasks)}{' '}
                      <span className="text-xs font-normal text-slate-400">actions</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Labor Hours Saved</span>
                    <span className="text-xl font-bold text-emerald-400 tracking-tight">
                      ~{formatNumber(estimatedHoursSaved)} hours
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                Covers Smart Emails, Okada Dispatches & 24/7 Customer Care.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* STEP 3: Transfer & Settlement Address */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-mono text-xs font-bold">
            3
          </span>
          <span className="font-display text-sm font-bold text-white tracking-tight">
            Provisioning Address & Settlement
          </span>
        </div>

        <Card className="border border-white/10 bg-[#0a0f1e] p-6 shadow-xl">
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-black/40 p-4">
              {currentAddress ? (
                <div className="rounded-xl bg-white p-3 shadow-md">
                  <QRCodeSVG value={currentAddress} size={150} level="M" />
                </div>
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-white/5 text-slate-500 text-xs text-center p-3">
                  Loading provisioning rail...
                </div>
              )}
              <span className="mt-3 font-mono text-[10px] text-slate-400 uppercase">
                Scan to Transfer {network.asset}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Dedicated {network.network} Address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#10172a] p-3 font-mono text-xs text-white">
                  <span className="truncate flex-1 select-all">
                    {loadingWallet ? 'Fetching address from network...' : currentAddress || 'Awaiting assignment'}
                  </span>
                  <button
                    type="button"
                    onClick={copyAddress}
                    disabled={!currentAddress}
                    className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-400 transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                    Transaction Hash / Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x... or transaction reference"
                    className="w-full rounded-xl border border-white/10 bg-[#10172a] py-3 px-4 font-mono text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 shadow-lg shadow-brand-500/25"
                >
                  Confirm Credit Top-Up <ArrowRight className="size-4 ml-1" />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
