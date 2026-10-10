import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowDownToLine,
  Copy,
  Check,
  ShieldCheck,
  TriangleAlert,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase, TABLE } from '@/lib/supabase'
import { DEPOSIT_NETWORKS } from '@/lib/constants'
import type { DepositNetwork } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { sendDepositReceivedEmail } from '@/lib/email'

export function Deposit() {
  const { user } = useAuth()
  const toast = useToast()

  const [network, setNetwork] = useState<DepositNetwork>(DEPOSIT_NETWORKS[0])
  const [amount, setAmount] = useState('100')
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [assignedWallets, setAssignedWallets] = useState<{
    evm?: string
    btc?: string
    trc20?: string
  }>({})
  const [loadingWallet, setLoadingWallet] = useState(true)

  const amountNumber = Number(amount) || 0

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

  // Resolve active address for chosen chain family
  const currentAddress =
    network.chainFamily === 'evm'
      ? assignedWallets.evm || 'Awaiting wallet assignment by admin'
      : network.chainFamily === 'btc'
      ? assignedWallets.btc || 'Awaiting BTC wallet assignment by admin'
      : assignedWallets.trc20 || 'Awaiting TRC20 wallet assignment by admin'

  const copyAddress = async () => {
    if (!currentAddress || currentAddress.startsWith('Awaiting')) {
      toast.error('No deposit wallet assigned for this chain yet. Contact admin.')
      return
    }
    try {
      await navigator.clipboard.writeText(currentAddress)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
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
    if (amountNumber < 10) {
      toast.error('Minimum deposit is $10.00.')
      return
    }
    if (txHash.trim().length < 20) {
      toast.error('Please enter a valid transaction hash (TxID).')
      return
    }
    setSubmitting(true)

    const { error } = await supabase.from(TABLE.transactions).insert({
      user_id: user?.id,
      type: 'deposit',
      amount: amountNumber,
      status: 'pending',
      network: `${network.asset} · ${network.network}`,
      wallet_address: currentAddress,
      tx_hash: txHash.trim(),
    })

    if (error) {
      toast.error(`Failed to submit deposit: ${error.message}`)
      setSubmitting(false)
      return
    }

    // Dispatch confirmation email via Resend
    void sendDepositReceivedEmail({
      userId: user?.id,
      amount: amountNumber,
      network: `${network.asset} · ${network.network}`,
      txHash: txHash.trim(),
    })

    setSubmitting(false)
    setTxHash('')
    toast.success('Deposit submitted. Confirmation email sent.')
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-1.5 rounded-full bg-brand-400" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Deposit
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Deposit Money
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-400">
          Deposit funds using crypto to start earning 1.2% daily profit.
        </p>
      </div>

      {/* Network Select Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand-400/30 bg-brand-400/10 px-3 py-1.5 font-mono text-xs font-bold text-brand-400">
          <ShieldCheck className="size-3.5" />
          SECURE WALLET
        </span>
        {DEPOSIT_NETWORKS.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setNetwork(n)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all',
              network.id === n.id
                ? 'border-brand-400/60 bg-brand-400/15 text-white'
                : 'border-white/10 bg-[#0c0f18] text-slate-400 hover:border-white/25 hover:text-white',
            )}
          >
            <span className="size-2 rounded-full" style={{ background: n.accent }} />
            {n.asset} · {n.network}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Form Card */}
        <Card className="border border-white/10 shadow-xl">
          <CardHeader
            title="Deposit Details"
            subtitle="Choose network, enter amount, and send to the address below"
            icon={<ArrowDownToLine className="size-5" />}
          />
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              {DEPOSIT_NETWORKS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNetwork(n)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    network.id === n.id
                      ? 'border-brand-400/60 bg-brand-400/10'
                      : 'border-white/8 bg-[#090b12] hover:border-white/20',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-display font-bold text-white">{n.asset}</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">{n.network}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">
                    Min {formatCurrency(n.min)} · {n.confirmations} Confirms
                  </p>
                </button>
              ))}
            </div>

            <Input
              name="amount"
              type="number"
              min={10}
              step="0.01"
              label={`Amount in USD (USDT ${network.network})`}
              suffix={`≈ ${amountNumber.toFixed(2)} ${network.asset}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Assigned Deposit Wallet
                </span>
                <span className="font-mono text-[10px] text-brand-400 uppercase bg-brand-400/10 border border-brand-400/20 px-2 py-0.5 rounded">
                  {loadingWallet ? 'Loading…' : 'Dedicated Wallet'}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-brand-400/30 bg-[#090b12] p-3">
                <code className="flex-1 break-all font-mono text-xs text-brand-300">
                  {currentAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-brand-400/30 bg-brand-400/15 px-3 py-1.5 font-mono text-xs font-bold text-brand-400 transition-colors hover:bg-brand-400 hover:text-obsidian-950"
                >
                  {copied ? <Check className="size-3.5 text-brand-400" /> : <Copy className="size-3.5" />}
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5 text-xs text-slate-300 leading-relaxed font-sans">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <p>
                Send only <strong className="text-white">{network.asset}</strong> on the{' '}
                <strong className="text-white">{network.network}</strong> network. This is your personal deposit address dedicated to your account.
              </p>
            </div>

            <Input
              name="txHash"
              label="Transaction Hash (TxID)"
              hint="Required"
              placeholder="Paste your transaction hash here…"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
            />

            <Button type="submit" size="lg" className="w-full mt-2" loading={submitting}>
              Submit Deposit
              {!submitting && <ArrowRight className="size-4 ml-1" />}
            </Button>
          </form>
        </Card>

        {/* QR & Verification Card */}
        <div className="space-y-6">
          <Card className="border border-white/10 shadow-xl">
            <CardHeader
              title="Scan QR Code"
              subtitle={`Pay with ${network.asset} on ${network.network}`}
              icon={<ShieldCheck className="size-5" />}
            />
            <div className="flex flex-col items-center gap-5 rounded-xl border border-white/8 bg-[#090b12] p-6">
              <div className="rounded-xl bg-white p-3.5 shadow-2xl">
                <QRCodeSVG value={currentAddress} size={176} level="M" fgColor="#08090e" />
              </div>
              <div className="w-full text-center">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  YOUR DEDICATED DESTINATION ADDRESS
                </p>
                <code className="mt-1 block break-all font-mono text-xs text-brand-400">
                  {currentAddress}
                </code>
              </div>

              <div className="grid w-full grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-lg border border-white/6 bg-[#0e111d] px-2 py-2.5">
                  <p className="text-sm font-bold text-white tracking-tight">{formatCurrency(amountNumber)}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">AMOUNT</p>
                </div>
                <div className="rounded-lg border border-white/6 bg-[#0e111d] px-2 py-2.5">
                  <p className="text-sm font-bold text-white tracking-tight">{network.asset}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">TOKEN</p>
                </div>
                <div className="rounded-lg border border-white/6 bg-[#0e111d] px-2 py-2.5">
                  <p className="text-sm font-bold text-white tracking-tight">{network.network}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">NETWORK</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-white/10 shadow-xl">
            <CardHeader title="How to Deposit" icon={<ShieldCheck className="size-5" />} />
            <ol className="space-y-3.5 font-sans">
              {[
                ['Send crypto to the wallet address.', 'Copy the address above or scan the QR code from your wallet.'],
                ['Submit the transaction hash (TxID).', 'Paste your transfer hash above so our system can detect your payment.'],
                ['Start earning daily profits.', 'Once confirmed, your deposit starts earning 1.2% every day automatically.'],
              ].map(([t, s], i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-brand-400/30 bg-brand-400/10 font-mono text-xs font-bold text-brand-400">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-display font-bold text-white">{t}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{s}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}