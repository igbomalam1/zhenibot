import { supabase } from '@/lib/supabase'

export async function sendWelcomeEmail(params: {
  userId?: string
  to?: string
  name?: string
  referralCode?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'welcome',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          referral_code: params.referralCode,
        },
      },
    })
  } catch (err) {
    console.warn('sendWelcomeEmail notice:', err)
  }
}

export async function sendDepositReceivedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  network: string
  txHash?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'deposit_received',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          network: params.network,
          tx_hash: params.txHash,
        },
      },
    })
  } catch (err) {
    console.warn('sendDepositReceivedEmail notice:', err)
  }
}

export async function sendDepositApprovedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  network?: string
  txHash?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'deposit_approved',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          network: params.network,
          tx_hash: params.txHash,
        },
      },
    })
  } catch (err) {
    console.warn('sendDepositApprovedEmail notice:', err)
  }
}

export async function sendWithdrawalApprovedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  walletAddress?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'withdrawal_approved',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          wallet_address: params.walletAddress,
        },
      },
    })
  } catch (err) {
    console.warn('sendWithdrawalApprovedEmail notice:', err)
  }
}

export async function sendWithdrawalRejectedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  reason?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'withdrawal_rejected',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          reason: params.reason,
        },
      },
    })
  } catch (err) {
    console.warn('sendWithdrawalRejectedEmail notice:', err)
  }
}

export async function sendReferralRewardEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  tier: number
  downlineName?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'referral_reward',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          tier: params.tier,
          downline_name: params.downlineName,
        },
      },
    })
  } catch (err) {
    console.warn('sendReferralRewardEmail notice:', err)
  }
}
