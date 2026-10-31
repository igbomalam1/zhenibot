import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase, TABLE } from '@/lib/supabase'
import { BRAND, DEPOSIT_NETWORKS } from '@/lib/constants'
import type { DepositNetwork } from '@/lib/constants'
import { formatCurrency, formatNumber } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { sendDepositReceivedEmail } from '@/lib/email'
import { DualTokenBadge } from '@/components/ui/CryptoIcons'

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000]

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
  const estimatedTasks = Math.round(amountNumber * 125)
  const estimatedHoursSaved = Math.round((estimatedTasks * 10) / 60)

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
      toast.success('Address copied to clipboard.')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info('Select the address and copy manually.')
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentAddress || currentAddress.startsWith('Awaiting')) {
      toast.error('Please wait for an active address to be assigned.')
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
      toast.error(`Failed to submit: ${error.message}`)
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
    toast.success('Credits provision request logged.')
  }

  return (
    <div className="space-y-6 select-none max-w-4xl">
      <div className="border-b border-white/8 pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Provision automation credits
        </h1>
        <p className="mt-0.5 text-xs text-[#8F95A3]">
          Top up execution credits for email auto-responders, courier dispatches, and care reps.
        </p>
      </div>

      {submittedSuccess && (
        <div className="rounded-xl border border-[#10B981]/30 bg-[#121419] p-5 flex items-start gap-4">
          <CheckCircle2 className="size-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white">Credit request logged</h3>
            <p className="text-xs text-[#8F95A3]">
              Your top-up of <strong className="text-white">${amountNumber} USDT</strong> on {network.network} is verifying. Your compute balance updates automatically upon confirmation.
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Network Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-white">01 / Select network</span>
          <span className="font-mono text-[#8F95A3]">Min: ${BRAND.minDeposit}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {DEPOSIT_NETWORKS.map((n) => {
            const isSelected = network.id === n.id
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setNetwork(n)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-colors cursor-pointer space-y-3',
                  isSelected
                    ? 'border-[#FF5416] bg-[#16181F]'
                    : 'border-white/8 bg-[#121419] hover:bg-[#181A21]',
                )}
              >
                <div className="flex items-center justify-between">
                  <DualTokenBadge networkId={n.id} size="md" />
                  <span className="font-mono text-[10px] text-[#8F95A3]">{n.shortName}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{n.asset}</p>
                  <p className="text-[11px] text-[#8F95A3] mt-0.5">{n.feeNote}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: Amount */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-white">02 / Enter credit amount</span>
          <span className="font-mono text-[#8F95A3]">1 USD = ~125 actions</span>
        </div>

        <div className="rounded-xl border border-white/8 bg-[#121419] p-5 grid gap-6 sm:grid-cols-2 items-center">
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#8F95A3]">$</span>
              <input
                type="number"
                min={BRAND.minDeposit}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] py-2.5 pl-8 pr-16 font-mono text-lg text-white focus:border-[#FF5416] focus:outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8F95A3]">USDT</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer',
                    amountNumber === preset
                      ? 'border-[#FF5416] bg-[#FF5416] text-white'
                      : 'border-white/8 bg-[#181A21] text-[#8F95A3] hover:text-white',
                  )}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-white/8 sm:pl-6 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#8F95A3]">Estimated executions:</span>
              <span className="text-white font-medium" data-tabular="true">~{formatNumber(estimatedTasks)} tasks</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#8F95A3]">Labor time saved:</span>
              <span className="text-[#10B981] font-medium" data-tabular="true">~{estimatedHoursSaved} hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Address & Submission */}
      <div className="space-y-3">
        <span className="font-medium text-xs text-white">03 / Transfer & confirmation</span>

        <div className="rounded-xl border border-white/8 bg-[#121419] p-5 grid gap-6 sm:grid-cols-[160px_1fr] items-center">
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/6 bg-[#0B0C0E] p-3">
            {currentAddress ? (
              <div className="bg-white p-2 rounded">
                <QRCodeSVG value={currentAddress} size={110} level="M" />
              </div>
            ) : (
              <div className="h-28 w-28 flex items-center justify-center text-xs text-[#8F95A3]">Loading...</div>
            )}
            <span className="mt-2 text-[10px] font-mono text-[#8F95A3]">Scan to pay</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8F95A3] mb-1 font-mono text-[11px]">
                {network.network} address
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-[#0B0C0E] p-2.5 font-mono text-xs text-white">
                <span className="truncate flex-1 select-all">{loadingWallet ? 'Loading...' : currentAddress}</span>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="rounded bg-[#181A21] border border-white/10 px-2.5 py-1 text-xs hover:text-white cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-[#8F95A3] mb-1 font-mono text-[11px]">
                  Transaction hash / Reference ID (optional)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x... or reference code"
                  className="w-full rounded-lg border border-white/8 bg-[#0B0C0E] py-2 px-3 font-mono text-xs text-white placeholder-[#545A67] focus:border-[#FF5416] focus:outline-none"
                />
              </div>

              <Button type="submit" size="md" loading={submitting} className="w-full">
                Confirm credit top-up <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
