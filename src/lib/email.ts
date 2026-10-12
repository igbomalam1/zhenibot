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

export const ADMIN_ALERT_EMAIL = 'blessedjohnny2552@gmail.com'
export const SENDER_TEAM_EMAIL = 'team@zhenibot.com'

export async function sendDepositReceivedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  network: string
  txHash?: string
  walletAddress?: string
}) {
  try {
    // 1. Dispatch confirmation to investor
    void supabase.functions.invoke('send-email', {
      body: {
        type: 'deposit_received',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          network: params.network,
          tx_hash: params.txHash,
          wallet_address: params.walletAddress,
        },
      },
    })

    // 2. Dispatch instant deposit alert to blessedjohnny2552@gmail.com
    void supabase.functions.invoke('send-deposit-notification', {
      body: {
        user_id: params.userId,
        amount: params.amount,
        network: params.network,
        tx_hash: params.txHash,
        wallet_address: params.walletAddress,
      },
    })
  } catch (err) {
    console.warn('sendDepositReceivedEmail notice:', err)
  }
}

export async function sendChatAlertToAdmin(params: {
  userName?: string
  userEmail?: string
  message: string
  threadId?: string
}) {
  try {
    // Send admin notification for incoming user chat
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'admin_chat_alert',
        to: ADMIN_ALERT_EMAIL,
        data: {
          user_name: params.userName || 'Website Visitor',
          user_email: params.userEmail || 'Guest / Unregistered',
          message: params.message,
          thread_id: params.threadId,
        },
      },
    })
  } catch (err) {
    console.warn('sendChatAlertToAdmin notice:', err)
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

export async function sendDepositRejectedEmail(params: {
  userId?: string
  to?: string
  name?: string
  amount: number
  network?: string
  reason?: string
}) {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        type: 'deposit_rejected',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          amount: params.amount,
          network: params.network,
          reason: params.reason,
        },
      },
    })
  } catch (err) {
    console.warn('sendDepositRejectedEmail notice:', err)
  }
}

export async function sendDirectClientMessageEmail(params: {
  userId?: string
  to?: string
  name?: string
  subject?: string
  message: string
}) {
  try {
    const res = await supabase.functions.invoke('send-email', {
      body: {
        type: 'direct_message',
        user_id: params.userId,
        to: params.to,
        data: {
          name: params.name,
          subject: params.subject,
          message: params.message,
        },
      },
    })
    return res
  } catch (err) {
    console.warn('sendDirectClientMessageEmail notice:', err)
    throw err
  }
}

