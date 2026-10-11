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
  import.meta.env.VITE_REFERRAL_BASE_URL ?? 'http://localhost:5173'

export type NetworkId = 'bep20' | 'erc20' | 'base' | 'arbitrum' | 'polygon' | 'btc' | 'trc20'

export interface DepositNetwork {
  id: NetworkId
  asset: string
  network: string
  label: string
  chainFamily: 'evm' | 'btc' | 'trc20'
  min: number
  accent: string
  confirmations: number
}

export const DEPOSIT_NETWORKS: DepositNetwork[] = [
  {
    id: 'bep20',
    asset: 'USDT',
    network: 'BNB Chain (BEP20)',
    label: 'USDT · BNB Chain (BSC)',
    chainFamily: 'evm',
    min: 20,
    accent: '#F0B90B',
    confirmations: 15,
  },
  {
    id: 'base',
    asset: 'USDT',
    network: 'Base',
    label: 'USDT · Base Network',
    chainFamily: 'evm',
    min: 20,
    accent: '#0052FF',
    confirmations: 10,
  },
  {
    id: 'erc20',
    asset: 'USDT',
    network: 'Ethereum (ERC20)',
    label: 'USDT · Ethereum',
    chainFamily: 'evm',
    min: 20,
    accent: '#627EEA',
    confirmations: 12,
  },
  {
    id: 'arbitrum',
    asset: 'USDT',
    network: 'Arbitrum One',
    label: 'USDT · Arbitrum',
    chainFamily: 'evm',
    min: 20,
    accent: '#28A0F0',
    confirmations: 12,
  },
  {
    id: 'polygon',
    asset: 'USDT',
    network: 'Polygon',
    label: 'USDT · Polygon',
    chainFamily: 'evm',
    min: 20,
    accent: '#8247E5',
    confirmations: 15,
  },
  {
    id: 'btc',
    asset: 'BTC',
    network: 'Bitcoin',
    label: 'BTC · Bitcoin Network',
    chainFamily: 'btc',
    min: 20,
    accent: '#F7931A',
    confirmations: 2,
  },
  {
    id: 'trc20',
    asset: 'USDT',
    network: 'Tron (TRC20)',
    label: 'USDT · Tron',
    chainFamily: 'trc20',
    min: 20,
    accent: '#10B981',
    confirmations: 19,
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
