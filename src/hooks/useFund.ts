import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, TABLE } from '@/lib/supabase'
import type {
  ZhenbotReferral,
  ZhenbotTransaction,
} from '@/types/database'

export function useTransactions(refreshKey?: number) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<ZhenbotTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)

    supabase
      .from(TABLE.transactions)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!mounted) return
        if (!error && data) setTransactions(data as ZhenbotTransaction[])
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [user, refreshKey])

  return { transactions, loading }
}

export function useReferrals(refreshKey?: number) {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState<ZhenbotReferral[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReferrals = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return []
    }
    const { data, error } = await supabase
      .from(TABLE.referrals)
      .select('*, referee:zhenbot_users!referee_id(id, email, full_name, created_at)')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('[zhenbot] Failed to load referrals', error.message)
      return []
    }
    return data as unknown as ZhenbotReferral[]
  }, [user])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    void fetchReferrals().then((d) => {
      if (mounted) setReferrals(d)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [fetchReferrals, refreshKey])

  return { referrals, loading }
}

export interface DashboardStats {
  walletBalance: number
  activeDeposit: number
  totalEarned: number
  totalWithdrawn: number
  todayEarnings: number
  affiliateCommission: number
  depositCount: number
}

export function useDashboardStats(refreshKey?: number) {
  const { user, profile } = useAuth()
  const { transactions, loading: txLoading } = useTransactions(refreshKey)

  const stats: DashboardStats = {
    walletBalance: profile?.wallet_balance ?? 0,
    activeDeposit: profile?.active_deposit ?? 0,
    totalEarned: profile?.total_earned ?? 0,
    totalWithdrawn: profile?.total_withdrawn ?? 0,
    todayEarnings: 0,
    affiliateCommission: 0,
    depositCount: 0,
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  let todayEarnings = 0
  let affiliateCommission = 0
  let depositCount = 0

  for (const t of transactions) {
    if (t.status !== 'completed' && t.status !== 'approved') continue
    if (t.type === 'dividend' && new Date(t.created_at) >= startOfToday) {
      todayEarnings += t.amount
    }
    if (t.type === 'referral_bonus') affiliateCommission += t.amount
    if (t.type === 'deposit') depositCount += 1
  }

  stats.todayEarnings = todayEarnings
  stats.affiliateCommission = affiliateCommission
  stats.depositCount = depositCount

  void user
  return { stats, loading: txLoading }
}