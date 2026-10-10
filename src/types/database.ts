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
  is_admin?: boolean
  is_blocked?: boolean
  assigned_evm_wallet?: string | null
  assigned_btc_wallet?: string | null
  assigned_trc20_wallet?: string | null
  last_sign_in_at?: string | null
  created_at: string
  updated_at: string
}

export interface ZhenbotWallet {
  id: string
  wallet_type: 'evm' | 'btc' | 'trc20'
  address: string
  chains: string[]
  assigned_to_user_id: string | null
  assigned_at: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  assigned_user?: Pick<ZhenbotUser, 'id' | 'email' | 'full_name'> | null
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
  user?: Pick<ZhenbotUser, 'email' | 'full_name'> | null
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

export interface ZhenbotChatThread {
  id: string
  user_id: string | null
  user_name: string
  user_email: string | null
  status: 'open' | 'resolved' | 'closed'
  last_message: string | null
  last_message_at: string
  unread_by_admin: boolean
  unread_by_user: boolean
  created_at: string
}

export interface ZhenbotChatMessage {
  id: string
  thread_id: string
  sender_role: 'user' | 'admin'
  sender_id: string | null
  sender_name: string
  message: string
  created_at: string
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
