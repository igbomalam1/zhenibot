export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'dividend'
  | 'referral_bonus'

export type TransactionStatus =
  | 'pending'
  | 'approved'
  | 'completed'
  | 'failed'
  | 'rejected'

export type ReferralStatus = 'pending' | 'credited' | 'paid'

export interface ZhenbotUser {
  id: string
  full_name: string | null
  email: string | null
  wallet_balance: number
  active_deposit: number
  total_earned: number
  total_withdrawn: number
  referral_code: string | null
  referrer_id: string | null
  created_at: string
  updated_at: string
}

export interface ZhenbotTransaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  network: string | null
  wallet_address: string | null
  tx_hash: string | null
  note: string | null
  created_at: string
}

export interface ZhenbotReferral {
  id: string
  referrer_id: string
  referee_id: string
  tier: 1 | 2
  commission_amount: number
  status: ReferralStatus
  created_at: string
  referee?: Pick<ZhenbotUser, 'email' | 'full_name'> | null
}

export interface Trade {
  id: string
  symbol: string
  pair: string
  exchange: string
  side: 'LONG' | 'SHORT'
  entry: number
  exit: number
  profitPct: number
  at: number
}
