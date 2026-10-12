export const BRAND = {
  name: 'Zhenbot',
  tagline: 'Automated Multi-Asset Trading',
  dailyRate: 0.012,
  cycleTarget: 0.02,
  riskStop: 0.05,
  tier1Rate: 0.15,
  tier2Rate: 0.02,
  minDeposit: 20,
  maxDeposit: 50000,
  minWithdrawal: 10,
}

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Zhenbot'
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@zhenbot.io'
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@zhenbot.io'
export const REFERRAL_BASE_URL =
  import.meta.env.VITE_REFERRAL_BASE_URL ??
  (typeof window !== 'undefined' ? window.location.origin : 'https://zhenibot.com')

export type NetworkId = 'bep20' | 'trc20' | 'erc20'

export interface DepositNetwork {
  id: NetworkId
  asset: string
  network: string
  shortName: string
  label: string
  chainFamily: 'evm' | 'trc20'
  min: number
  accent: string
  badgeBg: string
  confirmations: number
  popular?: boolean
  feeNote: string
}

export const DEPOSIT_NETWORKS: DepositNetwork[] = [
  {
    id: 'bep20',
    asset: 'USDT',
    network: 'BNB Smart Chain (BEP20)',
    shortName: 'BSC / BEP20',
    label: 'USDT · BNB Smart Chain (BEP20)',
    chainFamily: 'evm',
    min: 20,
    accent: '#F0B90B',
    badgeBg: 'rgba(240, 185, 11, 0.12)',
    confirmations: 15,
    popular: true,
    feeNote: 'Lowest Network Fees · Fast (~15s)',
  },
  {
    id: 'trc20',
    asset: 'USDT',
    network: 'Tron (TRC20)',
    shortName: 'TRON / TRC20',
    label: 'USDT · Tron (TRC20)',
    chainFamily: 'trc20',
    min: 20,
    accent: '#EF0027',
    badgeBg: 'rgba(239, 0, 39, 0.12)',
    confirmations: 19,
    popular: true,
    feeNote: 'Global Standard · Low Gas Fees',
  },
  {
    id: 'erc20',
    asset: 'USDT',
    network: 'Ethereum (ERC20)',
    shortName: 'ETH / ERC20',
    label: 'USDT · Ethereum (ERC20)',
    chainFamily: 'evm',
    min: 20,
    accent: '#627EEA',
    badgeBg: 'rgba(98, 126, 234, 0.12)',
    confirmations: 12,
    popular: false,
    feeNote: 'High Security · Standard ERC-20',
  },
]

export const EXCHANGES = [
  { name: 'Bybit', latency: '12ms', uptime: '99.99%' },
  { name: 'Binance', latency: '18ms', uptime: '99.98%' },
  { name: 'Bitget', latency: '21ms', uptime: '99.97%' },
  { name: 'MEXC', latency: '16ms', uptime: '99.99%' },
]

export function getNetwork(id: string): DepositNetwork | undefined {
  return DEPOSIT_NETWORKS.find((n) => n.id === id)
}
