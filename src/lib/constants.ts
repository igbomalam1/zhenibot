export const BRAND = {
  name: 'Zhenbot',
  tagline: 'Automated Multi-Asset Trading',
  dailyRate: 0.012,
  cycleTarget: 0.02,
  riskStop: 0.05,
  tier1Rate: 0.15,
  tier2Rate: 0.05,
  minDeposit: 50,
  maxDeposit: 50000,
  minWithdrawal: 10,
}

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Zhenbot'
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@zhenbot.io'
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@zhenbot.io'
export const REFERRAL_BASE_URL =
  import.meta.env.VITE_REFERRAL_BASE_URL ?? 'http://localhost:5173'

export type NetworkId = 'trc20' | 'erc20' | 'bep20' | 'btc'

export interface DepositNetwork {
  id: NetworkId
  asset: string
  network: string
  label: string
  address: string
  min: number
  accent: string
  confirmations: number
}

export const DEPOSIT_NETWORKS: DepositNetwork[] = [
  {
    id: 'trc20',
    asset: 'USDT',
    network: 'TRC20',
    label: 'USDT · Tron (TRC20)',
    address: 'TN9ZhenBot9TresorW4llet8Xq7R2pLk3D1',
    min: 10,
    accent: '#10B981',
    confirmations: 19,
  },
  {
    id: 'erc20',
    asset: 'USDT',
    network: 'ERC20',
    label: 'USDT · Ethereum (ERC20)',
    address: '0x7C3a9bZhenbotERC20Vault4F51c8A2eD90bE',
    min: 20,
    accent: '#627EEA',
    confirmations: 12,
  },
  {
    id: 'bep20',
    asset: 'USDT',
    network: 'BEP20',
    label: 'USDT · BNB Chain (BEP20)',
    address: '0x9F1dZhenbotBEP20Vault7B4c3A8eD1f2C6aB5',
    min: 10,
    accent: '#F0B90B',
    confirmations: 15,
  },
  {
    id: 'btc',
    asset: 'BTC',
    network: 'Bitcoin',
    label: 'BTC · Bitcoin Network',
    address: 'bc1qzhenbotbtcvault8k3m2n4p6q8r0s5t7u9v2w4x',
    min: 50,
    accent: '#F7931A',
    confirmations: 2,
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
