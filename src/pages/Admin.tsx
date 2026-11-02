import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, TABLE } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { businessStore } from '@/lib/businessStore'
import type {
  Client,
  Project,
  Invoice,
  Expense,
  LeadEnquiry,
  EmailItem,
  NotificationItem,
  ActivityLogItem,
} from '@/lib/businessStore'
import type {
  ZhenbotUser,
  ZhenbotTransaction,
  ZhenbotChatThread,
  ZhenbotWallet,
} from '@/types/database'
import {
  sendDepositApprovedEmail,
  sendDepositRejectedEmail,
  sendWithdrawalApprovedEmail,
  sendWithdrawalRejectedEmail,
  sendReferralRewardEmail,
} from '@/lib/email'

import { AdminSidebar, type AdminSection } from '@/components/admin/AdminSidebar'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { AdminDashboardOverview } from '@/components/admin/AdminDashboardOverview'
import { AdminProjects } from '@/components/admin/AdminProjects'
import { AdminClients } from '@/components/admin/AdminClients'
import { AdminLeads } from '@/components/admin/AdminLeads'
import { AdminChats } from '@/components/admin/AdminChats'
import { AdminEmails } from '@/components/admin/AdminEmails'
import { AdminInvoices } from '@/components/admin/AdminInvoices'
import { AdminFinance } from '@/components/admin/AdminFinance'
import { AdminSystem } from '@/components/admin/AdminSystem'

export function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  // Navigation & Layout State
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Operational Business Data (Reactive Store)
  const [clients, setClients] = useState<Client[]>(businessStore.getClients())
  const [projects, setProjects] = useState<Project[]>(businessStore.getProjects())
  const [invoices, setInvoices] = useState<Invoice[]>(businessStore.getInvoices())
  const [expenses, setExpenses] = useState<Expense[]>(businessStore.getExpenses())
  const [enquiries, setEnquiries] = useState<LeadEnquiry[]>(businessStore.getEnquiries())
  const [emails, setEmails] = useState<EmailItem[]>(businessStore.getEmails())
  const [notifications, setNotifications] = useState<NotificationItem[]>(businessStore.getNotifications())
  const [logs, setLogs] = useState<ActivityLogItem[]>(businessStore.getLogs())

  // Supabase Backend Data
  const [users, setUsers] = useState<ZhenbotUser[]>([])
  const [transactions, setTransactions] = useState<ZhenbotTransaction[]>([])
  const [threads, setThreads] = useState<ZhenbotChatThread[]>([])
  const [_wallets, setWallets] = useState<ZhenbotWallet[]>([])

  // Quick compose state
  const [composeInitialTo, setComposeInitialTo] = useState('')
  const [composeInitialSubject, setComposeInitialSubject] = useState('')

  // Sync business store data
  const refreshLocalData = () => {
    setClients(businessStore.getClients())
    setProjects(businessStore.getProjects())
    setInvoices(businessStore.getInvoices())
    setExpenses(businessStore.getExpenses())
    setEnquiries(businessStore.getEnquiries())
    setEmails(businessStore.getEmails())
    setNotifications(businessStore.getNotifications())
    setLogs(businessStore.getLogs())
  }

  // Fetch Supabase data
  const fetchSupabaseData = async () => {
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
        supabase
          .from(TABLE.wallets)
          .select('*, assigned_user:zhenbot_users(id, email, full_name)')
          .order('created_at', { ascending: false }),
      ])

      if (usersRes.data) setUsers(usersRes.data)
      if (txRes.data) setTransactions(txRes.data)
      if (threadsRes.data) setThreads(threadsRes.data)
      if (walletsRes.data) setWallets(walletsRes.data)
    } catch (err) {
      console.warn('Supabase fetch notice:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefreshAll = () => {
    void businessStore.initSupabaseSync().then(() => {
      refreshLocalData()
    })
    void fetchSupabaseData()
    toast.success('System data synchronized with live database.')
  }

  useEffect(() => {
    void businessStore.initSupabaseSync().then(() => {
      refreshLocalData()
    })
    void fetchSupabaseData()

    // Listen to local operational store broadcasts
    const onOpsUpdate = () => {
      refreshLocalData()
    }
    window.addEventListener('zhenbot_ops_update', onOpsUpdate)

    // Realtime subscription for incoming website chat threads
    const chatChannel = supabase
      .channel('admin_global_threads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE.chatThreads },
        () => {
          void fetchSupabaseData()
        },
      )
      .subscribe()

    return () => {
      window.removeEventListener('zhenbot_ops_update', onOpsUpdate)
      void supabase.removeChannel(chatChannel)
    }
  }, [])

  // Helper to resolve blockchain scanner for deposits/withdrawals
  const getExplorerUrl = (tx: ZhenbotTransaction) => {
    const hash = tx.tx_hash?.trim()
    const address = tx.wallet_address?.trim()
    const net = (tx.network || '').toLowerCase()

    if (net.includes('bsc') || net.includes('bep20') || net.includes('bnb')) {
      if (hash && hash !== '—' && hash.startsWith('0x')) {
        return { name: 'BscScan', url: `https://bscscan.com/tx/${hash}` }
      }
      return { name: 'BscScan USDT', url: 'https://bscscan.com/token/0x55d398326f99059ff775485246999027b3197955' }
    }

    if (net.includes('tron') || net.includes('trc20') || (address && address.startsWith('T'))) {
      if (hash && hash !== '—' && !hash.startsWith('0x')) {
        return { name: 'TronScan', url: `https://tronscan.org/#/transaction/${hash}` }
      }
      return { name: 'TronScan USDT', url: 'https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' }
    }

    if (net.includes('eth') || net.includes('erc20')) {
      if (hash && hash !== '—' && hash.startsWith('0x')) {
        return { name: 'Etherscan', url: `https://etherscan.io/tx/${hash}` }
      }
      return { name: 'Etherscan USDT', url: 'https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7' }
    }

    return null
  }

  // Approve Transaction (Preserved legacy logic)
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
        const userObj = users.find((u) => u.id === tx.user_id)
        if (userObj) {
          await supabase
            .from(TABLE.users)
            .update({
              active_deposit: (userObj.active_deposit || 0) + tx.amount,
            })
            .eq('id', tx.user_id)

          void sendDepositApprovedEmail({
            userId: tx.user_id,
            amount: tx.amount,
            network: tx.network || undefined,
            txHash: tx.tx_hash || undefined,
          })

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
            }
          }
        }
      } else if (tx.type === 'withdrawal') {
        void sendWithdrawalApprovedEmail({
          userId: tx.user_id,
          amount: tx.amount,
          walletAddress: tx.wallet_address || undefined,
        })
      }

      toast.success(`Transaction ${tx.id.slice(0, 8)} approved and completed.`)
      void fetchSupabaseData()
    } finally {
      setActionLoadingId(null)
    }
  }

  // Reject Transaction (Preserved legacy logic)
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
        const userObj = users.find((u) => u.id === targetTx.user_id)
        if (userObj) {
          await supabase
            .from(TABLE.users)
            .update({
              wallet_balance: (userObj.wallet_balance || 0) + targetTx.amount,
            })
            .eq('id', targetTx.user_id)
        }
        void sendWithdrawalRejectedEmail({
          userId: targetTx.user_id,
          amount: targetTx.amount,
          reason: 'Administrative risk verification or invalid destination wallet address.',
        })
      } else if (targetTx?.type === 'deposit') {
        void sendDepositRejectedEmail({
          userId: targetTx.user_id,
          amount: targetTx.amount,
          network: targetTx.network || undefined,
          reason: 'Deposit transaction could not be confirmed on blockchain or invalid transfer parameters.',
        })
      }

      toast.success('Transaction marked as rejected.')
      void fetchSupabaseData()
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleQuickCreate = (type: 'project' | 'client' | 'invoice' | 'expense' | 'email') => {
    switch (type) {
      case 'project':
        setCurrentSection('projects')
        break
      case 'client':
        setCurrentSection('clients')
        break
      case 'invoice':
        setCurrentSection('invoices')
        break
      case 'expense':
        setCurrentSection('expenses')
        break
      case 'email':
        setCurrentSection('emails')
        break
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/auth')
  }

  const unreadCounts = {
    leads: enquiries.filter((e) => e.status === 'new' || e.status === 'unread').length,
    chats: threads.filter((t) => t.unread_by_admin).length,
    emails: emails.filter((e) => e.folder === 'inbox' && !e.is_read).length,
    notifications: notifications.filter((n) => !n.is_read).length,
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] antialiased flex">
      {/* 1. Left Vertical Sidebar (Desktop fixed, responsive collapse) */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        unreadCounts={unreadCounts}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <AdminTopBar
          currentSection={currentSection}
          collapsed={sidebarCollapsed}
          onRefresh={handleRefreshAll}
          refreshing={refreshing}
          notifications={notifications}
          onOpenNotifications={() => setCurrentSection('notifications')}
          onQuickCreate={handleQuickCreate}
          onLogout={handleLogout}
          adminName={profile?.full_name || 'Usman Bello'}
          adminEmail={profile?.email || 'automate@zhenibot.com'}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />

        {/* Dynamic Workspace Content */}
        <main
          className={`flex-1 p-6 md:p-8 transition-all duration-300 max-w-[1600px] ${
            sidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          {/* Section: Dashboard Overview */}
          {currentSection === 'dashboard' && (
            <AdminDashboardOverview
              clients={clients}
              projects={projects}
              invoices={invoices}
              expenses={expenses}
              enquiries={enquiries}
              chatThreads={threads}
              onNavigate={(sec) => setCurrentSection(sec as AdminSection)}
            />
          )}

          {/* Section: Projects */}
          {currentSection === 'projects' && (
            <AdminProjects
              projects={projects}
              clients={clients}
              onRefresh={refreshLocalData}
            />
          )}

          {/* Section: Clients & CRM */}
          {currentSection === 'clients' && (
            <AdminClients
              clients={clients}
              projects={projects}
              invoices={invoices}
              onRefresh={refreshLocalData}
            />
          )}

          {/* Section: Leads & Enquiries */}
          {currentSection === 'leads' && (
            <AdminLeads
              enquiries={enquiries}
              onRefresh={refreshLocalData}
              onOpenEmailComposer={(to, subj) => {
                setComposeInitialTo(to)
                setComposeInitialSubject(subj)
                setCurrentSection('emails')
              }}
            />
          )}

          {/* Section: Chat Management */}
          {currentSection === 'chats' && (
            <AdminChats
              threads={threads}
              onRefresh={() => void fetchSupabaseData()}
            />
          )}

          {/* Section: Email Inbox & Follow-ups */}
          {(currentSection === 'emails' || currentSection === 'followups') && (
            <AdminEmails
              emails={emails}
              onRefresh={refreshLocalData}
              initialComposeTo={composeInitialTo}
              initialComposeSubject={composeInitialSubject}
            />
          )}

          {/* Section: Notifications */}
          {currentSection === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Central Notification Center</h3>
                  <p className="text-xs text-[#64748B]">Real-time system events, leads, and payment alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    businessStore.markAllNotificationsRead()
                    refreshLocalData()
                    toast.success('All marked as read.')
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] cursor-pointer"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border border-[#E5E7EB] flex items-start justify-between gap-4 transition-colors ${
                      n.is_read ? 'bg-[#F8FAFC] text-[#64748B]' : 'bg-[#F0FDF4] border-[#00B82E]/30 text-[#111827]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111827]">{n.title}</span>
                        {!n.is_read && (
                          <span className="size-2 rounded-full bg-[#00B82E]" />
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] font-mono text-[#64748B] mt-2 block">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>

                    {n.link_tab && (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(n.link_tab as AdminSection)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#00B82E] text-xs font-bold text-[#00B82E] cursor-pointer shrink-0"
                      >
                        View
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Invoices */}
          {currentSection === 'invoices' && (
            <AdminInvoices
              invoices={invoices}
              clients={clients}
              projects={projects}
              onRefresh={refreshLocalData}
            />
          )}

          {/* Section: Finance, Expenses, Transactions, Cashflow Reports */}
          {(currentSection === 'transactions' ||
            currentSection === 'expenses' ||
            currentSection === 'reports') && (
            <AdminFinance
              expenses={expenses}
              invoices={invoices}
              transactions={transactions}
              onApproveTx={handleApproveTx}
              onRejectTx={handleRejectTx}
              actionLoadingId={actionLoadingId}
              getExplorerUrl={getExplorerUrl}
              onRefresh={refreshLocalData}
            />
          )}

          {/* Section: Website Content */}
          {currentSection === 'content' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Website Content & Published Workflows</h3>
                <p className="text-xs text-[#64748B]">All 6 core service modules and 8 industry presets are active on the public landing page</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { name: 'Multi-Channel & Social Automation', desc: 'WhatsApp, Telegram, X, Instagram DMs' },
                  { name: 'Ad Campaigns & Lead Routing', desc: 'Facebook & Google Ads to instant conversation' },
                  { name: 'Payment Verification & Invoicing', desc: 'Paystack, Flutterwave & direct webhooks' },
                  { name: 'Orders, Fulfillment & Logistics', desc: 'Warehouse & courier dispatcher assigning' },
                  { name: 'Spreadsheet & CRM Synchronization', desc: 'Live Google Sheets & Excel database sync' },
                  { name: 'Custom Operations Workflows', desc: 'Tailored enterprise business automations' },
                ].map((s, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
                    <div className="font-bold text-xs text-[#111827]">{s.name}</div>
                    <div className="text-[11px] text-[#64748B] mt-1">{s.desc}</div>
                    <span className="mt-2 inline-block text-[10px] font-mono font-bold text-[#00B82E]">● Published Live</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Subsections: Integrations, Team, Logs, Settings */}
          {(currentSection === 'integrations' ||
            currentSection === 'team' ||
            currentSection === 'logs' ||
            currentSection === 'settings') && (
            <AdminSystem section={currentSection} logs={logs} />
          )}
        </main>
      </div>
    </div>
  )
}
