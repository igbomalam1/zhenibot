import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpFromLine,
  KeyRound,
  ShieldCheck,
  Wallet,
  Bike,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTransactions } from '@/hooks/useFund'
import { supabase, TABLE } from '@/lib/supabase'
import { BRAND, DEPOSIT_NETWORKS } from '@/lib/constants'
import type { NetworkId } from '@/lib/constants'
import { formatCurrency, timeAgo } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type Step = 'form' | 'verify' | 'done'

export function Withdraw() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const { transactions } = useTransactions()

  const [step, setStep] = useState<Step>('form')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<NetworkId>(DEPOSIT_NETWORKS[0].id)
  const [code, setCode] = useState('')
  const [txId, setTxId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Fleet settings state
  const [pickupCity, setPickupCity] = useState('Abuja (Wuse 2)')
  const [autoDispatchOnPaid, setAutoDispatchOnPaid] = useState(true)
  const [selectedFleet, setSelectedFleet] = useState('SendMe Okada Express')

  const balance = profile?.wallet_balance ?? 0
  const amountNumber = Number(amount) || 0
  const target = DEPOSIT_NETWORKS.find((n) => n.id === network) ?? DEPOSIT_NETWORKS[0]

  const withdrawals = transactions.filter((t) => t.type === 'withdrawal')

  const requestWithdrawal = async (e: FormEvent) => {
    e.preventDefault()
    if (amountNumber < BRAND.minWithdrawal) {
      toast.error(`Minimum payout is ${formatCurrency(BRAND.minWithdrawal)}.`)
      return
    }
    if (amountNumber > balance) {
      toast.error('Amount exceeds your available balance.')
      return
    }
    if (address.trim().length < 12) {
      toast.error('Enter a valid destination settlement address.')
      return
    }
    setSending(true)

    const { data, error } = await supabase
      .from(TABLE.transactions)
      .insert({
        user_id: user?.id,
        type: 'withdrawal',
        amount: amountNumber,
        status: 'pending',
        network: `${target.asset} · ${target.network}`,
        wallet_address: address.trim(),
      })
      .select('id')
      .single()

    if (error || !data) {
      toast.error(error?.message ?? 'Failed to request payout.')
      setSending(false)
      return
    }

    try {
      await supabase.functions.invoke('send-withdrawal-verification', {
        body: {
          user_id: user?.id,
          transaction_id: data.id,
          amount: amountNumber,
          network: `${target.asset} · ${target.network}`,
          wallet_address: address.trim(),
        },
      })
    } catch {
      toast.error('Could not reach verification service. Contact support.')
      setSending(false)
      return
    }

    setTxId(data.id as string)
    setStep('verify')
    setSending(false)
    toast.success('2FA security code dispatched to your email.')
  }

  const confirmWithdrawal = async (e: FormEvent) => {
    e.preventDefault()
    if (!txId || code.trim().length < 6) {
      toast.error('Enter the 6-digit code from your email.')
      return
    }
    setConfirming(true)

    const { error } = await supabase.functions.invoke('confirm-withdrawal', {
      body: { user_id: user?.id, transaction_id: txId, code: code.trim() },
    })

    setConfirming(false)
    if (error) {
      toast.error(error.message || 'Invalid or expired verification code.')
      return
    }

    setStep('done')
    toast.success('Payout request verified and approved.')
  }

  return (
    <div className="space-y-8 select-none">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[10px] text-brand-300 uppercase tracking-widest font-bold">
            LOGISTICS & REVENUE SETTLEMENT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Dispatch & Fleet Settings
        </h1>
        <p className="mt-1 text-xs text-slate-300">
          Configure on-demand delivery couriers and withdraw accumulated partner agency commissions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* Balance readout card */}
          <div className="glass-card flex items-center justify-between rounded-2xl p-5 border border-white/8 shadow-xl">
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
                <Wallet className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Available Revenue & Credits
                </p>
                <p className="font-mono text-2xl font-extrabold text-white tracking-tight">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold text-emerald-400">
              WITHDRAWABLE
            </span>
          </div>

          {/* Courier & Logistics Fleet Configuration */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <Bike className="size-5 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base">On-Demand Courier Dispatch Rules</h3>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold">FLEET ONLINE</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Default Warehouse / Pickup Hub
                </label>
                <select
                  value={pickupCity}
                  onChange={(e) => {
                    setPickupCity(e.target.value)
                    toast.success('Pickup hub updated!')
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-xs font-mono text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="Abuja (Wuse 2)">Abuja Central Hub (Wuse 2, Abuja)</option>
                  <option value="Lagos (Ikeja)">Lagos Mainland Hub (Ikeja, Lagos)</option>
                  <option value="Lagos (Lekki)">Lagos Island Hub (Lekki Phase 1)</option>
                  <option value="Port Harcourt">Port Harcourt Logistics Hub (GRA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Preferred On-Demand Courier Partner
                </label>
                <select
                  value={selectedFleet}
                  onChange={(e) => {
                    setSelectedFleet(e.target.value)
                    toast.success('Preferred courier partner updated!')
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-xs font-mono text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="SendMe Okada Express">SendMe Okada Express (Fastest Okada Rider Dispatch)</option>
                  <option value="GIG Logistics API">GIG Logistics (Interstate & Express)</option>
                  <option value="Bolt Delivery Direct">Bolt Delivery Business API</option>
                  <option value="Custom In-House Fleet">Custom In-House Okada Fleet (Internal WhatsApp)</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/6 bg-black/30 p-3">
                <div>
                  <p className="text-xs font-semibold text-white">Auto-Dispatch Upon Payment Confirmation</p>
                  <p className="text-[11px] text-slate-400">Pings closest okada rider immediately when Paystack webhook verifies order.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAutoDispatchOnPaid((v) => !v)
                    toast.info(autoDispatchOnPaid ? 'Auto-dispatch paused' : 'Auto-dispatch activated!')
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoDispatchOnPaid ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block size-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      autoDispatchOnPaid ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Step 1: Cashout Form */}
          {step === 'form' && (
            <Card className="border border-white/8 bg-[#0a0f1d] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpFromLine className="size-4 text-brand-400" />
                <h3 className="font-display font-bold text-white text-base">Withdraw Partner Revenue</h3>
              </div>
              <form onSubmit={requestWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Payout Amount ($)
                  </label>
                  <Input
                    type="number"
                    min={BRAND.minWithdrawal}
                    step="0.01"
                    placeholder="Min $10.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Settlement Network
                  </label>
                  <Select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as NetworkId)}
                  >
                    {DEPOSIT_NETWORKS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    Destination Wallet / Settlement Address
                  </label>
                  <Input
                    placeholder="Enter recipient address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={sending}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 shadow-md shadow-brand-500/20"
                >
                  Proceed with Payout
                </Button>
              </form>
            </Card>
          )}

          {/* Step 2: 2FA Verification */}
          {step === 'verify' && (
            <Card className="border border-brand-500/40 bg-[#0e1526] p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3 text-brand-300">
                <KeyRound className="size-5" />
                <h3 className="font-display font-bold text-white text-base">2FA Email Verification</h3>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Enter the 6-digit confirmation code dispatched to your registered enterprise email address.
              </p>
              <form onSubmit={confirmWithdrawal} className="space-y-4">
                <Input
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-center text-lg tracking-widest"
                />
                <Button
                  type="submit"
                  size="lg"
                  loading={confirming}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500"
                >
                  Confirm & Finalize Payout
                </Button>
              </form>
            </Card>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-3">
              <div className="flex size-12 mx-auto items-center justify-center rounded-2xl bg-emerald-500 text-obsidian-950">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-base font-display font-bold text-white">Payout Dispatched</h3>
              <p className="text-xs text-slate-300">
                Your payout has been authorized and queued for blockchain settlement.
              </p>
              <Button size="sm" variant="outline" onClick={() => setStep('form')}>
                New Payout Request
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Historical Withdrawals Ledger */}
        <div className="glass-card rounded-2xl p-6 border border-white/8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
              <h3 className="font-display font-bold text-white text-base">Recent Settlement History</h3>
              <span className="font-mono text-[10px] text-slate-400 uppercase">AUDIT TRAIL</span>
            </div>

            {withdrawals.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 font-mono">
                No historical payouts found.
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.slice(0, 6).map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0a0f1d] p-3 text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-white">{formatCurrency(w.amount)}</p>
                      <p className="font-mono text-[10px] text-slate-400">{w.network || 'USDT'}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-brand-300 uppercase">
                        {w.status}
                      </span>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{timeAgo(w.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand-400" /> Multi-Sig Cold Vault Guarded
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
