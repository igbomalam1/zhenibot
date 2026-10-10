import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpFromLine,
  KeyRound,
  MailCheck,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useTransactions } from '@/hooks/useFund'
import { supabase, TABLE } from '@/lib/supabase'
import { BRAND, DEPOSIT_NETWORKS } from '@/lib/constants'
import type { NetworkId } from '@/lib/constants'
import { formatCurrency, formatDate, timeAgo } from '@/lib/format'
import { Badge, statusTone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type Step = 'form' | 'verify' | 'done'

export function Withdraw() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const { transactions, loading } = useTransactions()

  const [step, setStep] = useState<Step>('form')
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<NetworkId>(DEPOSIT_NETWORKS[0].id)
  const [code, setCode] = useState('')
  const [txId, setTxId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const balance = profile?.wallet_balance ?? 0
  const amountNumber = Number(amount) || 0
  const target = DEPOSIT_NETWORKS.find((n) => n.id === network) ?? DEPOSIT_NETWORKS[0]

  const withdrawals = transactions.filter((t) => t.type === 'withdrawal')

  const requestWithdrawal = async (e: FormEvent) => {
    e.preventDefault()
    if (amountNumber < BRAND.minWithdrawal) {
      toast.error(
        `Minimum withdrawal is ${formatCurrency(BRAND.minWithdrawal)}.`,
      )
      return
    }
    if (amountNumber > balance) {
      toast.error('Amount exceeds your available balance.')
      return
    }
    if (address.trim().length < 12) {
      toast.error('Enter a valid destination wallet address.')
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
      toast.error(error?.message ?? 'Failed to request withdrawal.')
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
      toast.error('Could not reach the verification service. Contact support.')
      setSending(false)
      return
    }

    setTxId(data.id as string)
    setStep('verify')
    setSending(false)
    toast.success('Verification code sent to your email.')
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
    toast.success('Withdrawal request verified and approved.')
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-1.5 rounded-full bg-brand-400" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Withdraw
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Withdraw Money
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-400">
          Fast withdrawals to your crypto wallet, verified with a one-time email code.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          {/* Balance readout card */}
          <div className="glass-card flex items-center justify-between rounded-xl p-5 border border-white/8">
            <div className="flex items-center gap-3.5">
              <span className="flex size-11 items-center justify-center rounded-lg border border-brand-400/30 bg-brand-400/10 text-brand-400">
                <Wallet className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  AVAILABLE BALANCE
                </p>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] text-brand-400 bg-brand-400/10 border border-brand-400/20 px-2.5 py-1 rounded">
              MIN: {formatCurrency(BRAND.minWithdrawal)}
            </span>
          </div>

          <Card className="border border-white/10 shadow-xl">
            {step === 'form' && (
              <>
                <CardHeader
                  title="Withdraw Details"
                  subtitle="Enter how much you want to withdraw and your receiving address"
                  icon={<ArrowUpFromLine className="size-5" />}
                />
                <form onSubmit={(e) => void requestWithdrawal(e)} className="space-y-4">
                  <Input
                    name="amount"
                    type="number"
                    min={BRAND.minWithdrawal}
                    step="0.01"
                    label="Withdrawal Amount (USD)"
                    suffix={`MAX: ${formatCurrency(balance)}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Select
                    name="network"
                    label="Receiving Network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as NetworkId)}
                  >
                    {DEPOSIT_NETWORKS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    name="address"
                    label={`Receiving ${target.asset} Address (${target.network})`}
                    placeholder="Paste your receiving wallet address…"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="w-full mt-2" loading={sending}>
                    <ShieldCheck className="size-4" />
                    Request Withdrawal
                  </Button>
                  <p className="text-center font-mono text-[11px] text-slate-500">
                    A 6-digit confirmation code will be sent to your email.
                  </p>
                </form>
              </>
            )}

            {step === 'verify' && (
              <div className="animate-fade-up">
                <CardHeader
                  title="Email Verification"
                  subtitle="Enter the 6-digit code sent to your email address"
                  icon={<MailCheck className="size-5" />}
                />
                <form onSubmit={(e) => void confirmWithdrawal(e)} className="space-y-4">
                  <Input
                    name="code"
                    label="Verification Code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    icon={<KeyRound className="size-4" />}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-xl tracking-[0.4em] text-center"
                  />
                  <Button type="submit" size="lg" className="w-full" loading={confirming}>
                    <ShieldCheck className="size-4" />
                    Confirm & Complete Withdrawal
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="w-full text-center font-mono text-xs text-slate-500 hover:text-slate-300"
                  >
                    ← Back to withdraw form
                  </button>
                </form>
              </div>
            )}

            {step === 'done' && (
              <div className="animate-fade-up py-8 text-center font-sans">
                <span className="mx-auto flex size-14 items-center justify-center rounded-xl border border-brand-400/30 bg-brand-400/10 text-brand-400">
                  <MailCheck className="size-7" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-white font-display">Withdrawal Approved</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  Your withdrawal has been verified and will be sent to your wallet shortly.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setStep('form')}>Make Another Withdrawal</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Ledger History */}
        <Card className="border border-white/10 shadow-xl">
          <CardHeader
            title="Withdrawal History"
            subtitle="Your previous withdrawal requests and status"
            icon={<ArrowUpFromLine className="size-5" />}
          />
          {loading ? (
            <p className="py-8 text-center font-mono text-xs text-slate-500">Loading history…</p>
          ) : withdrawals.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs text-slate-500">
              No previous withdrawals found.
            </p>
          ) : (
            <div className="space-y-2.5">
              {withdrawals.slice(0, 6).map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/6 bg-[#090b12] p-3.5 transition-colors hover:border-white/12"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-white tracking-tight">
                      {formatCurrency(w.amount)}
                    </p>
                    <p className="truncate font-mono text-[10px] text-slate-400 mt-0.5">
                      {w.network} · {w.wallet_address?.slice(0, 14)}…
                    </p>
                    <p className="font-mono text-[10px] text-slate-600 mt-0.5">
                      {formatDate(w.created_at)} ({timeAgo(w.created_at)})
                    </p>
                  </div>
                  <Badge tone={statusTone(w.status)}>
                    {w.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}