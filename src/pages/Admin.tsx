import { useEffect, useState } from 'react'
import {
  Users,
  MessageSquare,
  ArrowDownToLine,
  Search,
  RefreshCw,
  Send,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Wallet,
  Plus,
  Link2,
  Loader2,
  ExternalLink,
  CheckCheck,
  XCircle,
  CheckCircle2,
  Mail,
} from 'lucide-react'
import { supabase, TABLE } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency, formatDate } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import {
  sendDepositApprovedEmail,
  sendDepositRejectedEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
  sendReferralRewardEmail,
  sendDirectClientMessageEmail,
} from '@/lib/email'
import type {
  ZhenbotUser,
  ZhenbotTransaction,
  ZhenbotChatThread,
  ZhenbotChatMessage,
  ZhenbotWallet,
} from '@/types/database'
import { cn } from '@/lib/utils'

type Tab = 'users' | 'transactions' | 'chats' | 'wallets'

export function AdminDashboard() {
  const { profile } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState<Tab>('users')
  const [users, setUsers] = useState<ZhenbotUser[]>([])
  const [transactions, setTransactions] = useState<ZhenbotTransaction[]>([])
  const [threads, setThreads] = useState<ZhenbotChatThread[]>([])
  const [wallets, setWallets] = useState<ZhenbotWallet[]>([])
  const [search, setSearch] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Wallet Management State
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const [walletType, setWalletType] = useState<'evm' | 'btc' | 'trc20'>('evm')
  const [selectedChains, setSelectedChains] = useState<string[]>(['ETH', 'BSC', 'BASE', 'ARBITRUM', 'POLYGON'])
  const [rawWalletsInput, setRawWalletsInput] = useState('')
  const [walletNotes, setWalletNotes] = useState('')
  const [addingWallets, setAddingWallets] = useState(false)

  // Wallet Manual Assign Modal State
  const [assigningWallet, setAssigningWallet] = useState<ZhenbotWallet | null>(null)
  const [assignUserId, setAssignUserId] = useState('')
  const [assigning, setAssigning] = useState(false)

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<ZhenbotUser | null>(null)
  const [userBalance, setUserBalance] = useState('')
  const [userDeposit, setUserDeposit] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  // Direct Client Message Modal State
  const [messagingUser, setMessagingUser] = useState<ZhenbotUser | null>(null)
  const [messageSubject, setMessageSubject] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [sendingDirectMsg, setSendingDirectMsg] = useState(false)

  // Chat filter & management state
  const [chatFilter, setChatFilter] = useState<'all' | 'open' | 'resolved' | 'closed'>('all')

  // Helper to resolve the correct blockchain explorer / scanner for a deposit/withdrawal
  const getExplorerUrl = (tx: ZhenbotTransaction) => {
    const hash = tx.tx_hash?.trim()
    const address = tx.wallet_address?.trim()
    const net = (tx.network || '').toLowerCase()

    // 1. BSC (BNB Smart Chain / BEP20)
    if (net.includes('bsc') || net.includes('bep20') || net.includes('bnb')) {
      if (hash && hash !== '—' && hash.startsWith('0x')) {
        return { name: 'BscScan', url: `https://bscscan.com/tx/${hash}` }
      }
      if (address && address.startsWith('0x')) {
        return { name: 'BscScan (Address)', url: `https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955?a=${address}` }
      }
      return { name: 'BscScan USDT', url: 'https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955' }
    }

    // 2. Tron (TRC20)
    if (net.includes('tron') || net.includes('trc20') || (address && address.startsWith('T'))) {
      if (hash && hash !== '—' && !hash.startsWith('0x')) {
        return { name: 'TronScan', url: `https://tronscan.org/#/transaction/${hash}` }
      }
      if (address) {
        return { name: 'TronScan (Address)', url: `https://tronscan.org/#/address/${address}` }
      }
      return { name: 'TronScan USDT', url: 'https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' }
    }

    // 3. Ethereum (ERC20)
    if (net.includes('eth') || net.includes('erc20')) {
      if (hash && hash !== '—' && hash.startsWith('0x')) {
        return { name: 'Etherscan', url: `https://etherscan.io/tx/${hash}` }
      }
      if (address && address.startsWith('0x')) {
        return { name: 'Etherscan (Address)', url: `https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7?a=${address}` }
      }
      return { name: 'Etherscan USDT', url: 'https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7' }
    }

    // 4. Fallback based on hash or address format
    if (hash && hash !== '—') {
      if (hash.startsWith('0x')) {
        return { name: 'EVM Explorer', url: `https://bscscan.com/tx/${hash}` }
      }
      return { name: 'TronScan', url: `https://tronscan.org/#/transaction/${hash}` }
    }

    if (address) {
      if (address.startsWith('0x')) {
        return { name: 'BscScan (Address)', url: `https://bscscan.com/address/${address}` }
      }
      if (address.startsWith('T')) {
        return { name: 'TronScan (Address)', url: `https://tronscan.org/#/address/${address}` }
      }
    }

    return null
  }

  // Active Chat management
  const [selectedThread, setSelectedThread] = useState<ZhenbotChatThread | null>(null)
  const [chatMessages, setChatMessages] = useState<ZhenbotChatMessage[]>([])
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  // Load data
  const fetchData = async () => {
    setRefreshing(true)
    try {
      const [usersRes, txRes, threadsRes, walletsRes] = await Promise.all([
        supabase.from(TABLE.users).select('*').order('created_at', { ascending: false }),
        supabase
          .from(TABLE.transactions)
          .select('*, user:zhenbot_users(id, email, full_name)')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from(TABLE.chatThreads).select('*').order('last_message_at', { ascending: false }),
        supabase.from(TABLE.wallets).select('*, assigned_user:zhenbot_users(id, email, full_name)').order('created_at', { ascending: false }),
      ])

      if (usersRes.data) setUsers(usersRes.data)
      if (txRes.data) setTransactions(txRes.data)
      if (threadsRes.data) setThreads(threadsRes.data)
      if (walletsRes.data) setWallets(walletsRes.data)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  // Load chat messages when thread is selected
  useEffect(() => {
    if (!selectedThread?.id) return

    const loadThreadMessages = async () => {
      const { data } = await supabase
        .from(TABLE.chatMessages)
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })

      if (data) setChatMessages(data)

      // Mark unread_by_admin = false
      await supabase
        .from(TABLE.chatThreads)
        .update({ unread_by_admin: false })
        .eq('id', selectedThread.id)
    }

    void loadThreadMessages()

    const channel = supabase
      .channel(`admin_thread_${selectedThread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLE.chatMessages,
          filter: `thread_id=eq.${selectedThread.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ZhenbotChatMessage
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [selectedThread?.id])

  // Approve Transaction
  const handleApproveTx = async (tx: ZhenbotTransaction) => {
    if (tx.status === 'completed' || tx.status === 'approved') return

    setActionLoadingId('approve_' + tx.id)
    try {
      const { error } = await supabase
        .from(TABLE.transactions)
        .update({ status: 'completed' })
        .eq('id', tx.id)

      if (error) {
        toast.error('Failed to update transaction.')
        return
      }

      if (tx.type === 'deposit') {
        // Credit user active_deposit
        const userObj = users.find((u) => u.id === tx.user_id)
        if (userObj) {
          await supabase
            .from(TABLE.users)
            .update({
              active_deposit: (userObj.active_deposit || 0) + tx.amount,
            })
            .eq('id', tx.user_id)

          // Email 1: Deposit Approved & Deployed to trading
          void sendDepositApprovedEmail({
            userId: tx.user_id,
            amount: tx.amount,
            network: tx.network || undefined,
            txHash: tx.tx_hash || undefined,
          })

          // Email 2: Instant Referral Commission for Upline
          if (userObj.referrer_id) {
            const referrer = users.find((u) => u.id === userObj.referrer_id)
            const tier1Bonus = Math.round(tx.amount * 0.15 * 100) / 100
            if (referrer && tier1Bonus > 0) {
              await supabase
                .from(TABLE.users)
                .update({
                  wallet_balance: (referrer.wallet_balance || 0) + tier1Bonus,
                  total_earned: (referrer.total_earned || 0) + tier1Bonus,
                })
                .eq('id', referrer.id)

              void sendReferralRewardEmail({
                userId: referrer.id,
                amount: tier1Bonus,
                tier: 1,
                downlineName: userObj.full_name || userObj.email || undefined,
              })

              // Tier 2: Grandparent upline (2%)
              if (referrer.referrer_id) {
                const grandparent = users.find((u) => u.id === referrer.referrer_id)
                const tier2Bonus = Math.round(tx.amount * 0.02 * 100) / 100
                if (grandparent && tier2Bonus > 0) {
                  await supabase
                    .from(TABLE.users)
                    .update({
                      wallet_balance: (grandparent.wallet_balance || 0) + tier2Bonus,
                      total_earned: (grandparent.total_earned || 0) + tier2Bonus,
                    })
                    .eq('id', grandparent.id)

                  void sendReferralRewardEmail({
                    userId: grandparent.id,
                    amount: tier2Bonus,
                    tier: 2,
                    downlineName: userObj.full_name || userObj.email || undefined,
                  })
                }
              }
            }
          }
        }
      } else if (tx.type === 'withdrawal') {
        // Email 3: Withdrawal Approved & Dispatched
        void sendWithdrawalApprovedEmail({
          userId: tx.user_id,
          amount: tx.amount,
          walletAddress: tx.wallet_address || undefined,
        })
      }

      toast.success(`Transaction ${tx.id.slice(0, 8)} approved and completed.`)
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Reject Transaction
  const handleRejectTx = async (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId)

    setActionLoadingId('reject_' + txId)
    try {
      const { error } = await supabase
        .from(TABLE.transactions)
        .update({ status: 'rejected' })
        .eq('id', txId)

      if (error) {
        toast.error('Failed to reject transaction.')
        return
      }

      if (targetTx?.type === 'withdrawal') {
        // Restore user balance
        const userObj = users.find((u) => u.id === targetTx.user_id)
        if (userObj) {
          await supabase
            .from(TABLE.users)
            .update({
              wallet_balance: (userObj.wallet_balance || 0) + targetTx.amount,
            })
            .eq('id', targetTx.user_id)
        }

        // Email: Withdrawal Cancelled / Rejected notice
        void sendWithdrawalRejectedEmail({
          userId: targetTx.user_id,
          amount: targetTx.amount,
          reason: 'Administrative risk verification or invalid destination wallet address.',
        })
      } else if (targetTx?.type === 'deposit') {
        // Email: Deposit Rejected notice
        void sendDepositRejectedEmail({
          userId: targetTx.user_id,
          amount: targetTx.amount,
          network: targetTx.network || undefined,
          reason: 'Deposit transaction could not be confirmed on blockchain or invalid transfer parameters.',
        })
      }

      toast.success('Transaction marked as rejected.')
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Save User Balance Edit
  const handleSaveUser = async () => {
    if (!editingUser) return
    setUserSaving(true)

    const { error } = await supabase
      .from(TABLE.users)
      .update({
        wallet_balance: parseFloat(userBalance) || 0,
        active_deposit: parseFloat(userDeposit) || 0,
      })
      .eq('id', editingUser.id)

    setUserSaving(false)
    if (error) {
      toast.error('Failed to update user balances.')
      return
    }

    toast.success('User updated successfully.')
    setEditingUser(null)
    void fetchData()
  }

  // Send Direct Message / Email to Client
  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messagingUser || !messageBody.trim()) return

    setSendingDirectMsg(true)
    try {
      await sendDirectClientMessageEmail({
        userId: messagingUser.id,
        to: messagingUser.email || undefined,
        name: messagingUser.full_name || messagingUser.email || undefined,
        subject: messageSubject.trim() || undefined,
        message: messageBody.trim(),
      })

      toast.success(`Message sent directly to ${messagingUser.email}`)
      setMessagingUser(null)
      setMessageSubject('')
      setMessageBody('')
    } catch (err) {
      toast.error('Failed to send message: ' + (err as Error).message)
    } finally {
      setSendingDirectMsg(false)
    }
  }

  // Toggle Block / Unblock User
  const handleToggleBlock = async (u: ZhenbotUser) => {
    const nextState = !u.is_blocked
    setActionLoadingId('block_' + u.id)
    try {
      const { error } = await supabase
        .from(TABLE.users)
        .update({ is_blocked: nextState })
        .eq('id', u.id)

      if (error) {
        toast.error(`Failed to update user block status: ${error.message}`)
        return
      }

      toast.success(nextState ? 'User has been blocked.' : 'User has been unblocked.')
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Delete User
  const handleDeleteUser = async (u: ZhenbotUser) => {
    if (!confirm(`Are you sure you want to permanently delete user ${u.email}?`)) return

    setActionLoadingId('del_user_' + u.id)
    try {
      const { error } = await supabase.from(TABLE.users).delete().eq('id', u.id)
      if (error) {
        toast.error(`Failed to delete user: ${error.message}`)
        return
      }

      toast.success('User deleted.')
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Add Multiple / Batch Wallets
  const handleAddWallets = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rawWalletsInput.trim()) return

    setAddingWallets(true)

    // Parse wallets separated by commas, spaces, or newlines
    const addresses = rawWalletsInput
      .split(/[\s,]+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 10)

    if (addresses.length === 0) {
      toast.error('No valid wallet addresses found in input.')
      setAddingWallets(false)
      return
    }

    const rows = addresses.map((addr) => ({
      wallet_type: walletType,
      address: addr,
      chains: walletType === 'evm' ? selectedChains : walletType === 'btc' ? ['BTC'] : ['TRC20'],
      notes: walletNotes.trim() || null,
      is_active: true,
    }))

    const { error } = await supabase.from(TABLE.wallets).insert(rows)

    setAddingWallets(false)
    if (error) {
      toast.error(`Failed to add wallets: ${error.message}`)
      return
    }

    toast.success(`Successfully added ${addresses.length} wallet(s) to the pool.`)
    setRawWalletsInput('')
    setWalletNotes('')
    setIsAddWalletOpen(false)
    void fetchData()
  }

  // Delete Wallet from pool
  const handleDeleteWallet = async (w: ZhenbotWallet) => {
    if (!confirm(`Are you sure you want to delete wallet ${w.address}?`)) return

    setActionLoadingId('del_wallet_' + w.id)
    try {
      const { error } = await supabase.from(TABLE.wallets).delete().eq('id', w.id)
      if (error) {
        toast.error(`Failed to delete wallet: ${error.message}`)
        return
      }

      toast.success('Wallet removed from pool.')
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Assign Wallet to User
  const handleAssignWallet = async () => {
    if (!assigningWallet || !assignUserId) return

    setAssigning(true)

    // Update wallet row
    const { error } = await supabase
      .from(TABLE.wallets)
      .update({
        assigned_to_user_id: assignUserId,
        assigned_at: new Date().toISOString(),
      })
      .eq('id', assigningWallet.id)

    if (error) {
      toast.error(`Failed to assign wallet: ${error.message}`)
      setAssigning(false)
      return
    }

    // Also update target user's dedicated column
    const colName =
      assigningWallet.wallet_type === 'evm'
        ? 'assigned_evm_wallet'
        : assigningWallet.wallet_type === 'btc'
        ? 'assigned_btc_wallet'
        : 'assigned_trc20_wallet'

    await supabase
      .from(TABLE.users)
      .update({ [colName]: assigningWallet.address })
      .eq('id', assignUserId)

    setAssigning(false)
    setAssigningWallet(null)
    setAssignUserId('')
    toast.success('Wallet successfully assigned to user.')
    void fetchData()
  }

  // Unassign Wallet
  const handleUnassignWallet = async (w: ZhenbotWallet) => {
    if (!w.assigned_to_user_id) return

    setActionLoadingId('unassign_' + w.id)
    try {
      const colName =
        w.wallet_type === 'evm'
          ? 'assigned_evm_wallet'
          : w.wallet_type === 'btc'
          ? 'assigned_btc_wallet'
          : 'assigned_trc20_wallet'

      await supabase
        .from(TABLE.users)
        .update({ [colName]: null })
        .eq('id', w.assigned_to_user_id)

      await supabase
        .from(TABLE.wallets)
        .update({ assigned_to_user_id: null, assigned_at: null })
        .eq('id', w.id)

      toast.success('Wallet unassigned.')
      void fetchData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Send Admin Chat Reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedThread?.id || sendingReply) return

    const text = replyText.trim()
    setReplyText('')
    setSendingReply(true)

    const { error } = await supabase.from(TABLE.chatMessages).insert({
      thread_id: selectedThread.id,
      sender_role: 'admin',
      sender_id: profile?.id ?? null,
      sender_name: 'Admin Support',
      message: text,
    })

    if (!error) {
      await supabase
        .from(TABLE.chatThreads)
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
          unread_by_user: true,
        })
        .eq('id', selectedThread.id)

      // Send email alert to user if thread has a user email
      const targetEmail = selectedThread.user_email?.trim()
      if (targetEmail) {
        void sendDirectClientMessageEmail({
          userId: selectedThread.user_id || undefined,
          to: targetEmail,
          name: selectedThread.user_name || undefined,
          subject: 'New Reply from Zhenbot Support Agent',
          message: text,
        })
      }
    }

    setSendingReply(false)
  }

  // Update thread status (open / resolved / closed)
  const handleUpdateThreadStatus = async (threadId: string, status: 'open' | 'resolved' | 'closed') => {
    setActionLoadingId('status_' + threadId)
    try {
      const { error } = await supabase
        .from(TABLE.chatThreads)
        .update({ status })
        .eq('id', threadId)

      if (error) {
        toast.error('Failed to update chat status.')
        return
      }

      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, status } : t)),
      )
      if (selectedThread?.id === threadId) {
        setSelectedThread((prev) => (prev ? { ...prev, status } : null))
      }
      toast.success(`Chat marked as ${status}.`)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Toggle thread read/unread
  const handleToggleThreadUnread = async (thread: ZhenbotChatThread) => {
    const newUnread = !thread.unread_by_admin
    setActionLoadingId('unread_' + thread.id)
    try {
      const { error } = await supabase
        .from(TABLE.chatThreads)
        .update({ unread_by_admin: newUnread })
        .eq('id', thread.id)

      if (error) {
        toast.error('Failed to update read state.')
        return
      }

      setThreads((prev) =>
        prev.map((t) => (t.id === thread.id ? { ...t, unread_by_admin: newUnread } : t)),
      )
      if (selectedThread?.id === thread.id) {
        setSelectedThread((prev) => (prev ? { ...prev, unread_by_admin: newUnread } : null))
      }
      toast.success(newUnread ? 'Marked as unread.' : 'Marked as read.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Delete chat thread and messages
  const handleDeleteThread = async (threadId: string) => {
    if (!confirm('Are you sure you want to permanently delete this chat thread and its entire conversation history?')) {
      return
    }

    setActionLoadingId('del_thread_' + threadId)
    try {
      const { error } = await supabase
        .from(TABLE.chatThreads)
        .delete()
        .eq('id', threadId)

      if (error) {
        toast.error(`Failed to delete chat: ${error.message}`)
        return
      }

      setThreads((prev) => prev.filter((t) => t.id !== threadId))
      if (selectedThread?.id === threadId) {
        setSelectedThread(null)
        setChatMessages([])
      }
      toast.success('Chat thread deleted.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Filter lists
  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.referral_code?.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredTransactions = transactions.filter(
    (t) => {
      const userObj = t.user || users.find((u) => u.id === t.user_id)
      return (
        t.tx_hash?.toLowerCase().includes(search.toLowerCase()) ||
        t.wallet_address?.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.network?.toLowerCase().includes(search.toLowerCase()) ||
        (userObj?.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (userObj?.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    },
  )

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.user_name.toLowerCase().includes(search.toLowerCase()) ||
      (t.user_email?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (t.last_message?.toLowerCase() ?? '').includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (chatFilter === 'all') return true
    return t.status === chatFilter
  })

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-300">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/8 bg-[#090b12]/90 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-brand-400/30 bg-[#0d121f]">
            <img src="/logo.svg" alt="Logo" className="size-6 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-white tracking-tight flex items-center gap-2">
              Zhenbot Admin Control Panel
              <span className="rounded bg-brand-400/15 border border-brand-400/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-brand-400">
                MASTER
              </span>
            </h1>
            <p className="font-mono text-[10px] text-slate-500 uppercase">
              Full CRUD · User Management · Financial Ledger · Live Chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => void fetchData()} loading={refreshing}>
            <RefreshCw className={cn('size-3.5 mr-1', refreshing && 'animate-spin')} /> Refresh
          </Button>
          <a
            href="/dashboard"
            className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:border-white/25 transition-colors"
          >
            ← Back to App
          </a>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
          <div className="flex gap-2">
            {[
              { id: 'users', label: 'Users & Balances', icon: Users, count: users.length },
              { id: 'transactions', label: 'Transactions & Approvals', icon: ArrowDownToLine, count: transactions.length },
              { id: 'wallets', label: 'Manage Wallets', icon: Wallet, count: wallets.length },
              {
                id: 'chats',
                label: 'Live Chat Management',
                icon: MessageSquare,
                count: threads.filter((t) => t.unread_by_admin).length,
              },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as Tab)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all',
                  activeTab === t.id
                    ? 'border border-brand-400/40 bg-brand-400/15 text-brand-400 font-bold shadow-sm'
                    : 'border border-white/8 bg-[#0c0f18] text-slate-400 hover:border-white/20 hover:text-white',
                )}
              >
                <t.icon className="size-4" />
                <span>{t.label}</span>
                {t.count > 0 && (
                  <span
                    className={cn(
                      'ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono',
                      activeTab === t.id ? 'bg-brand-400 text-obsidian-950 font-bold' : 'bg-white/10 text-white',
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs sm:w-auto">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search records…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0c0f18] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>

        {/* TAB 1: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-2xl border border-white/8 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/8 pb-3">
              <h2 className="text-base font-display font-bold text-white">Registered Users ({filteredUsers.length})</h2>
              <span className="font-mono text-xs text-slate-500">Edit balances, deposits, and account permissions</span>
            </div>

            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[800px] text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">USER</th>
                    <th className="pb-3 pr-4 font-semibold">BALANCE</th>
                    <th className="pb-3 pr-4 font-semibold">ACTIVE DEPOSIT</th>
                    <th className="pb-3 pr-4 font-semibold">TOTAL WITHDRAWN</th>
                    <th className="pb-3 pr-4 font-semibold">REF CODE</th>
                    <th className="pb-3 pr-4 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4">
                        <p className="font-display font-bold text-white text-sm">{u.full_name || 'No Name'}</p>
                        <p className="font-mono text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-brand-400">
                        {formatCurrency(u.wallet_balance)}
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-white">
                        {formatCurrency(u.active_deposit)}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-slate-400">
                        {formatCurrency(u.total_withdrawn)}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-xs text-slate-400">{u.referral_code || '—'}</td>
                      <td className="py-3.5 pr-4">
                        <Badge tone={u.is_blocked ? 'danger' : 'success'}>
                          {u.is_blocked ? 'BLOCKED' : 'ACTIVE'}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(u)
                            setUserBalance(String(u.wallet_balance))
                            setUserDeposit(String(u.active_deposit))
                          }}
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:border-brand-400 hover:text-brand-400 transition-colors"
                          title="Edit Balance / Deposit"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMessagingUser(u)
                            setMessageSubject('Important Update Regarding Your Zhenbot Account')
                            setMessageBody('')
                          }}
                          className="rounded-lg border border-brand-400/30 bg-brand-400/10 p-1.5 text-brand-400 hover:bg-brand-400/20 transition-colors"
                          title="Send direct email / message to user"
                        >
                          <Mail className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === 'block_' + u.id}
                          onClick={() => void handleToggleBlock(u)}
                          className={cn(
                            'rounded-lg border p-1.5 transition-colors disabled:opacity-50',
                            u.is_blocked
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
                          )}
                          title={u.is_blocked ? 'Unblock user' : 'Block user'}
                        >
                          {actionLoadingId === 'block_' + u.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : u.is_blocked ? (
                            <Unlock className="size-3.5" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === 'del_user_' + u.id}
                          onClick={() => void handleDeleteUser(u)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {actionLoadingId === 'del_user_' + u.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSACTIONS APPROVAL */}
        {activeTab === 'transactions' && (
          <div className="glass-card rounded-2xl border border-white/8 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/8 pb-3">
              <h2 className="text-base font-display font-bold text-white">
                Transaction Ledger & Approvals ({filteredTransactions.length})
              </h2>
              <span className="font-mono text-xs text-slate-500">Approve pending deposits and verify payouts</span>
            </div>

            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[850px] text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">INVESTOR</th>
                    <th className="pb-3 pr-4 font-semibold">TYPE</th>
                    <th className="pb-3 pr-4 font-semibold">AMOUNT</th>
                    <th className="pb-3 pr-4 font-semibold">STATUS</th>
                    <th className="pb-3 pr-4 font-semibold">NETWORK / WALLET</th>
                    <th className="pb-3 pr-4 font-semibold">TX HASH</th>
                    <th className="pb-3 pr-4 font-semibold">DATE</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => {
                    const investor = tx.user || users.find((u) => u.id === tx.user_id)
                    return (
                    <tr key={tx.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4">
                        <div className="max-w-[170px]">
                          <p className="font-display font-bold text-xs text-white truncate">
                            {investor?.full_name || 'Anonymous Investor'}
                          </p>
                          <p className="font-mono text-[10px] text-slate-500 truncate">
                            {investor?.email || tx.user_id}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge tone={tx.type === 'deposit' ? 'brand' : tx.type === 'withdrawal' ? 'warning' : 'neutral'}>
                          {tx.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <Badge
                          tone={
                            tx.status === 'completed' || tx.status === 'approved'
                              ? 'success'
                              : tx.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {tx.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-[11px] text-slate-400">
                        {tx.network || '—'}
                        {tx.wallet_address && (
                          <span className="block text-slate-500 truncate max-w-[160px]">
                            {tx.wallet_address}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-[11px] text-slate-400">
                        {tx.tx_hash ? (
                          <span className="truncate max-w-[140px] block" title={tx.tx_hash}>
                            {tx.tx_hash}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">Not provided</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* On-Chain Scanner / Check Button */}
                        {(() => {
                          const scanner = getExplorerUrl(tx)
                          if (!scanner) return null
                          return (
                            <a
                              href={scanner.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 font-mono text-xs font-semibold text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/50 transition-colors inline-flex items-center gap-1"
                              title={`Verify on ${scanner.name}`}
                            >
                              <ExternalLink className="size-3" />
                              <span>Check</span>
                            </a>
                          )
                        })()}

                        {/* Message Client Button */}
                        {investor && (
                          <button
                            type="button"
                            onClick={() => {
                              const foundUser = users.find((u) => u.id === tx.user_id) || ({
                                id: tx.user_id,
                                email: investor.email || '',
                                full_name: investor.full_name || '',
                              } as ZhenbotUser)
                              setMessagingUser(foundUser)
                              setMessageSubject(`Notice Regarding Your ${tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} (${formatCurrency(tx.amount)})`)
                              setMessageBody('')
                            }}
                            className="rounded-lg border border-brand-400/30 bg-brand-400/10 px-2 py-1 font-mono text-xs font-semibold text-brand-400 hover:bg-brand-400/20 transition-colors inline-flex items-center gap-1"
                            title={`Send direct email/message to ${investor.full_name || investor.email}`}
                          >
                            <Mail className="size-3" />
                            <span>Message</span>
                          </button>
                        )}

                        {tx.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={actionLoadingId === 'approve_' + tx.id || actionLoadingId === 'reject_' + tx.id}
                              onClick={() => void handleApproveTx(tx)}
                              className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              {actionLoadingId === 'approve_' + tx.id && <Loader2 className="size-3 animate-spin shrink-0" />}
                              {actionLoadingId === 'approve_' + tx.id ? 'Approving…' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === 'approve_' + tx.id || actionLoadingId === 'reject_' + tx.id}
                              onClick={() => void handleRejectTx(tx.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/15 px-2.5 py-1 font-mono text-xs font-bold text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              {actionLoadingId === 'reject_' + tx.id && <Loader2 className="size-3 animate-spin shrink-0" />}
                              {actionLoadingId === 'reject_' + tx.id ? 'Rejecting…' : 'Reject'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CHAT MANAGEMENT */}
        {activeTab === 'chats' && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1.8fr]">
            {/* Conversation Threads List */}
            <div className="glass-card rounded-2xl border border-white/8 p-4 shadow-2xl flex flex-col h-[640px]">
              <div className="border-b border-white/8 pb-3 mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-white">Live Chat Threads</h3>
                  <span className="font-mono text-[10px] text-slate-500">
                    {filteredThreads.length} of {threads.length}
                  </span>
                </div>
                {/* Status Filter Tabs */}
                <div className="mt-2.5 flex items-center gap-1">
                  {(['all', 'open', 'resolved', 'closed'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setChatFilter(filterKey)}
                      className={cn(
                        'flex-1 rounded-lg py-1 text-[10px] font-mono font-bold uppercase transition-all',
                        chatFilter === filterKey
                          ? 'bg-brand-400 text-obsidian-950 shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10',
                      )}
                    >
                      {filterKey}
                      {filterKey === 'open' && (
                        <span className="ml-1 opacity-75">
                          ({threads.filter((t) => t.status === 'open').length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-12 px-3 text-slate-500 font-mono text-xs">
                    <MessageSquare className="size-6 mx-auto mb-2 opacity-30 text-slate-400" />
                    No chat threads found in this view.
                  </div>
                ) : (
                  filteredThreads.map((t) => {
                    const isSelected = selectedThread?.id === t.id
                    return (
                      <div
                        key={t.id}
                        className={cn(
                          'group relative rounded-xl p-3 border transition-all',
                          isSelected
                            ? 'border-brand-400/50 bg-brand-400/10'
                            : 'border-white/6 bg-[#0c0f18] hover:border-white/15',
                        )}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedThread(t)}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-display font-bold text-xs text-white truncate max-w-[150px]">
                              {t.user_name}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={cn(
                                  'rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase',
                                  t.status === 'open'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                    : t.status === 'resolved'
                                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                                    : 'bg-slate-500/15 text-slate-400 border border-slate-500/25',
                                )}
                              >
                                {t.status}
                              </span>
                              {t.unread_by_admin && (
                                <span className="size-2 rounded-full bg-brand-400 animate-pulse" title="Unread" />
                              )}
                            </div>
                          </div>

                          <p className="font-mono text-[10px] text-slate-400 truncate mt-1">
                            {t.last_message || 'No messages yet'}
                          </p>

                          <span className="font-mono text-[9px] text-slate-600 block mt-1">
                            {formatDate(t.last_message_at)}
                          </span>
                        </div>

                        {/* Thread Quick Actions Strip */}
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              void handleToggleThreadUnread(t)
                            }}
                            className="text-slate-400 hover:text-brand-400 transition-colors inline-flex items-center gap-1"
                            title={t.unread_by_admin ? 'Mark as read' : 'Mark as unread'}
                          >
                            <CheckCheck className="size-3" />
                            <span>{t.unread_by_admin ? 'Mark Read' : 'Unread'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {t.status !== 'closed' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  void handleUpdateThreadStatus(t.id, 'closed')
                                }}
                                className="text-amber-400/80 hover:text-amber-300 transition-colors inline-flex items-center gap-0.5"
                                title="Close chat thread"
                              >
                                <XCircle className="size-3" />
                                <span>Close</span>
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={actionLoadingId === 'del_thread_' + t.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                void handleDeleteThread(t.id)
                              }}
                              className="text-red-400/70 hover:text-red-400 transition-colors inline-flex items-center gap-0.5"
                              title="Delete conversation"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Conversation Messages Feed & Reply */}
            <div className="glass-card rounded-2xl border border-white/8 p-5 shadow-2xl flex flex-col h-[640px]">
              {selectedThread ? (
                <>
                  <div className="border-b border-white/8 pb-3 mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-display font-bold text-white">
                          {selectedThread.user_name}
                        </h3>
                        <Badge
                          tone={
                            selectedThread.status === 'open'
                              ? 'success'
                              : selectedThread.status === 'resolved'
                              ? 'brand'
                              : 'neutral'
                          }
                        >
                          {selectedThread.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                        {selectedThread.user_email || 'Guest Visitor'}
                      </p>
                    </div>

                    {/* Chat Action Header Toolbar */}
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {selectedThread.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => void handleUpdateThreadStatus(selectedThread.id, 'resolved')}
                          className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-sky-400 hover:bg-sky-500/20 transition-colors inline-flex items-center gap-1"
                          title="Mark inquiry as resolved"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}

                      {selectedThread.status !== 'closed' ? (
                        <button
                          type="button"
                          onClick={() => void handleUpdateThreadStatus(selectedThread.id, 'closed')}
                          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-400 hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1"
                          title="Close chat thread"
                        >
                          <XCircle className="size-3.5" />
                          <span>Close</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleUpdateThreadStatus(selectedThread.id, 'open')}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-400 hover:bg-emerald-500/20 transition-colors inline-flex items-center gap-1"
                          title="Reopen chat thread"
                        >
                          <RefreshCw className="size-3.5" />
                          <span>Reopen</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => void handleToggleThreadUnread(selectedThread)}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:bg-white/10 transition-colors inline-flex items-center gap-1"
                        title={selectedThread.unread_by_admin ? 'Mark as read' : 'Mark as unread'}
                      >
                        <CheckCheck className="size-3.5" />
                        <span>{selectedThread.unread_by_admin ? 'Mark Read' : 'Unread'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={actionLoadingId === 'del_thread_' + selectedThread.id}
                        onClick={() => void handleDeleteThread(selectedThread.id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Delete this entire chat"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 p-2">
                    {chatMessages.length === 0 ? (
                      <p className="text-center text-slate-500 font-mono text-xs py-10">
                        No messages in this conversation yet. Send a message below to start chatting.
                      </p>
                    ) : (
                      chatMessages.map((m) => {
                        const isAdmin = m.sender_role === 'admin'
                        return (
                          <div
                            key={m.id}
                            className={cn(
                              'flex flex-col max-w-[80%]',
                              isAdmin ? 'ml-auto items-end' : 'mr-auto items-start',
                            )}
                          >
                            <span className="font-mono text-[9px] text-slate-500 mb-0.5 px-1">
                              {m.sender_name} ({formatDate(m.created_at)})
                            </span>
                            <div
                              className={cn(
                                'rounded-2xl px-4 py-2.5 text-xs leading-relaxed',
                                isAdmin
                                  ? 'bg-brand-400 text-obsidian-950 font-medium'
                                  : 'border border-white/8 bg-[#121624] text-slate-200',
                              )}
                            >
                              {m.message}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendAdminReply} className="border-t border-white/8 pt-3 mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type reply as Admin…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-[#121624] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || sendingReply}
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-400 text-obsidian-950 hover:bg-brand-300 transition-colors disabled:opacity-40"
                      >
                        {sendingReply ? <Loader2 className="size-4 animate-spin text-obsidian-950" /> : <Send className="size-4" />}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-6 text-slate-500 font-mono text-xs">
                  <MessageSquare className="size-8 mb-2 opacity-30 text-slate-400" />
                  Select a chat thread from the left to view messages and reply.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE WALLETS */}
        {activeTab === 'wallets' && (
          <div className="glass-card rounded-2xl border border-white/8 p-5 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
              <div>
                <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                  Deposit Wallets Pool ({wallets.length})
                </h2>
                <p className="font-mono text-xs text-slate-500">
                  Add multi-chain deposit addresses, parse batch wallets, and assign unique dedicated wallets per user
                </p>
              </div>
              <Button onClick={() => setIsAddWalletOpen(true)}>
                <Plus className="size-4 mr-1.5" /> Add Wallets
              </Button>
            </div>

            {/* Wallets Pool Table */}
            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[850px] text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-white/8 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4 font-semibold">TYPE</th>
                    <th className="pb-3 pr-4 font-semibold">WALLET ADDRESS</th>
                    <th className="pb-3 pr-4 font-semibold">SUPPORTED CHAINS</th>
                    <th className="pb-3 pr-4 font-semibold">ASSIGNED USER</th>
                    <th className="pb-3 pr-4 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center font-mono text-xs text-slate-500">
                        No deposit wallets in pool yet. Click "Add Wallets" above to paste your addresses.
                      </td>
                    </tr>
                  ) : (
                    wallets.map((w) => (
                      <tr key={w.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                        <td className="py-3.5 pr-4">
                          <Badge tone={w.wallet_type === 'evm' ? 'brand' : w.wallet_type === 'btc' ? 'warning' : 'neutral'}>
                            {w.wallet_type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3.5 pr-4 font-mono text-xs text-white">
                          <span className="break-all">{w.address}</span>
                          {w.notes && <span className="block text-[10px] text-slate-500">{w.notes}</span>}
                        </td>
                        <td className="py-3.5 pr-4 font-mono text-[10px] text-slate-300">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {w.chains?.map((c) => (
                              <span key={c} className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4">
                          {w.assigned_user ? (
                            <div>
                              <p className="font-display font-bold text-xs text-brand-400">
                                {w.assigned_user.full_name || 'Assigned User'}
                              </p>
                              <p className="font-mono text-[10px] text-slate-500">{w.assigned_user.email}</p>
                            </div>
                          ) : (
                            <span className="font-mono text-[10px] text-slate-500 uppercase bg-white/5 px-2 py-0.5 rounded">
                              Unassigned (Available)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4">
                          <Badge tone={w.assigned_to_user_id ? 'success' : 'neutral'}>
                            {w.assigned_to_user_id ? 'IN USE' : 'READY'}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-right space-x-1.5">
                          {w.assigned_to_user_id ? (
                            <button
                              type="button"
                              disabled={actionLoadingId === 'unassign_' + w.id}
                              onClick={() => void handleUnassignWallet(w)}
                              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                              title="Unassign from current user"
                            >
                              {actionLoadingId === 'unassign_' + w.id && <Loader2 className="size-3 animate-spin shrink-0" />}
                              {actionLoadingId === 'unassign_' + w.id ? 'Unassigning…' : 'Unassign'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setAssigningWallet(w)
                                setAssignUserId(users[0]?.id || '')
                              }}
                              className="rounded-lg border border-brand-400/30 bg-brand-400/10 px-2.5 py-1 font-mono text-xs font-bold text-brand-400 hover:bg-brand-400/20 transition-colors"
                              title="Assign to specific user"
                            >
                              Assign User
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={actionLoadingId === 'del_wallet_' + w.id}
                            onClick={() => void handleDeleteWallet(w)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            title="Delete wallet"
                          >
                            {actionLoadingId === 'del_wallet_' + w.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Edit User Modal */}
      <Modal open={!!editingUser} onClose={() => setEditingUser(null)}>
        {editingUser && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">
              Edit User: {editingUser.full_name || editingUser.email}
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Directly adjust balances or active deposits for this investor.
            </p>

            <Input
              name="balance"
              type="number"
              step="0.01"
              label="Wallet Available Balance (USD)"
              value={userBalance}
              onChange={(e) => setUserBalance(e.target.value)}
            />

            <Input
              name="deposit"
              type="number"
              step="0.01"
              label="Active Deployed Deposit (USD)"
              value={userDeposit}
              onChange={(e) => setUserDeposit(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={() => void handleSaveUser()} loading={userSaving}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Wallets Modal */}
      <Modal open={isAddWalletOpen} onClose={() => setIsAddWalletOpen(false)}>
        <form onSubmit={handleAddWallets} className="space-y-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Plus className="size-5 text-brand-400" /> Add Wallets to System Pool
            </h3>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Deposit addresses added here will be automatically or manually assigned to investors.
            </p>
          </div>

          <div>
            <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
              Wallet Architecture / Family
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'evm' as const, label: 'EVM (0x...)', desc: 'BSC, Base, ETH, Arb, Poly' },
                { type: 'btc' as const, label: 'Bitcoin (BTC)', desc: 'Native BTC Network' },
                { type: 'trc20' as const, label: 'Tron (TRC20)', desc: 'TRC20 USDT' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setWalletType(item.type)
                    if (item.type === 'btc') setSelectedChains(['BTC'])
                    else if (item.type === 'trc20') setSelectedChains(['TRC20'])
                    else setSelectedChains(['ETH', 'BSC', 'BASE', 'ARBITRUM', 'POLYGON'])
                  }}
                  className={cn(
                    'rounded-xl border p-2.5 text-left transition-all',
                    walletType === item.type
                      ? 'border-brand-400 bg-brand-400/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20',
                  )}
                >
                  <p className="font-display font-bold text-xs">{item.label}</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {walletType === 'evm' && (
            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
                Multi-Currency Chain Support (Selected chains share this EVM 0x address)
              </label>
              <div className="flex flex-wrap gap-2">
                {['ETH', 'BSC', 'BASE', 'ARBITRUM', 'POLYGON'].map((chain) => {
                  const isSelected = selectedChains.includes(chain)
                  return (
                    <button
                      key={chain}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (selectedChains.length > 1) {
                            setSelectedChains(selectedChains.filter((c) => c !== chain))
                          }
                        } else {
                          setSelectedChains([...selectedChains, chain])
                        }
                      }}
                      className={cn(
                        'rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition-all',
                        isSelected
                          ? 'border-brand-400 bg-brand-400/20 text-brand-400'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20',
                      )}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {chain}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
              Wallet Addresses (Paste multiple separated by comma, space, or newline)
            </label>
            <textarea
              required
              rows={4}
              value={rawWalletsInput}
              onChange={(e) => setRawWalletsInput(e.target.value)}
              placeholder="0x71C...b82, 0x3A2...9F1&#10;0x91F...22A"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-white placeholder-slate-600 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <p className="font-mono text-[10px] text-slate-500 mt-1">
              Detected:{' '}
              {
                rawWalletsInput
                  .split(/[\s,]+/)
                  .map((a) => a.trim())
                  .filter((a) => a.length > 10).length
              }{' '}
              address(es)
            </p>
          </div>

          <Input
            name="notes"
            label="Internal Notes / Origin (Optional)"
            placeholder="e.g. Cold storage vault #3, Binance hot #2"
            value={walletNotes}
            onChange={(e) => setWalletNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
            <Button variant="ghost" type="button" onClick={() => setIsAddWalletOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={addingWallets}>
              Add Wallets to Pool
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Wallet Modal */}
      <Modal open={!!assigningWallet} onClose={() => setAssigningWallet(null)}>
        {assigningWallet && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Link2 className="size-5 text-brand-400" /> Assign Wallet to User
              </h3>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Dedicate this address to a specific investor. No two users will share the same address.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase text-slate-500">Selected Wallet</span>
              <p className="font-mono text-xs font-bold text-white break-all">{assigningWallet.address}</p>
              <div className="flex gap-1.5 pt-1">
                <span className="font-mono text-[10px] text-brand-400 uppercase bg-brand-400/10 px-1.5 py-0.5 rounded">
                  {assigningWallet.wallet_type.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                  {assigningWallet.chains?.join(', ')}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
                Select Investor User
              </label>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0d121f] p-3 font-mono text-xs text-white focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              >
                <option value="" disabled>
                  Select a user...
                </option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || 'No Name'} — {u.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
              <Button variant="ghost" onClick={() => setAssigningWallet(null)}>
                Cancel
              </Button>
              <Button onClick={() => void handleAssignWallet()} loading={assigning} disabled={!assignUserId}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Direct Client Messaging Modal */}
      <Modal open={!!messagingUser} onClose={() => setMessagingUser(null)}>
        {messagingUser && (
          <form onSubmit={handleSendDirectMessage} className="space-y-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Mail className="size-5 text-brand-400" /> Message Investor Directly
              </h3>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Dispatches an official email notification directly to the investor's inbox.
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#0c101c] p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400">Recipient:</span>
                <span className="font-display font-bold text-white">{messagingUser.full_name || 'Investor'}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-slate-400">Email Address:</span>
                <span className="font-mono font-semibold text-brand-400">{messagingUser.email}</span>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
                Email Subject
              </label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Important Notice from Zhenbot Management"
                className="w-full rounded-xl border border-white/10 bg-[#0d121f] p-3 font-sans text-xs text-white focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-300 mb-1.5 uppercase font-semibold">
                Message Body
              </label>
              <textarea
                required
                rows={5}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Type your official message or instructions to this investor..."
                className="w-full rounded-xl border border-white/10 bg-[#0d121f] p-3 font-sans text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
              <Button variant="ghost" type="button" onClick={() => setMessagingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={sendingDirectMsg} disabled={!messageBody.trim()}>
                <Send className="size-3.5 mr-1.5" />
                Send Email to Investor
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
