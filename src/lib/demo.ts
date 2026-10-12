import type { Trade } from '@/types/database'

const PAIRS = [
  { symbol: 'BTC', pair: 'BTC/USDT', exchange: 'Bybit' },
  { symbol: 'ETH', pair: 'ETH/USDT', exchange: 'Binance' },
  { symbol: 'SOL', pair: 'SOL/USDT', exchange: 'Bybit' },
  { symbol: 'BNB', pair: 'BNB/USDT', exchange: 'Bitget' },
  { symbol: 'XRP', pair: 'XRP/USDT', exchange: 'MEXC' },
  { symbol: 'NVDA', pair: 'NVDA/USD', exchange: 'Bybit' },
  { symbol: 'TSLA', pair: 'TSLA/USD', exchange: 'MEXC' },
  { symbol: 'AAPL', pair: 'AAPL/USD', exchange: 'Binance' },
  { symbol: 'MSFT', pair: 'MSFT/USD', exchange: 'Bybit' },
  { symbol: 'XAU', pair: 'XAU/USD', exchange: 'Bitget' },
  { symbol: 'XAG', pair: 'XAG/USD', exchange: 'Bitget' },
  { symbol: 'OIL', pair: 'WTI/USD', exchange: 'MEXC' },
]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildTrades(): Trade[] {
  const rand = seededRandom(20260101)
  const now = Date.now()
  const trades: Trade[] = []
  for (let i = 0; i < 48; i++) {
    const p = PAIRS[Math.floor(rand() * PAIRS.length)]
    let profitPct = 0.12 + rand() * 0.38
    if (rand() < 0.28) profitPct = 0.1 + rand() * 0.18
    const side = rand() < 0.55 ? 'LONG' : 'SHORT'
    const entry = 20 + rand() * 1400
    const dir = side === 'LONG' ? 1 : -1
    trades.push({
      id: `tx-${now - i}`,
      symbol: p.symbol,
      pair: p.pair,
      exchange: p.exchange,
      side,
      entry: Number(entry.toFixed(2)),
      exit: Number((entry * (1 + dir * profitPct / 100)).toFixed(2)),
      profitPct: Number(profitPct.toFixed(2)),
      at: now - i * (1000 * 60 * 7),
    })
  }
  return trades
}

const seed = buildTrades()

export function getTrades(count = 12): Trade[] {
  return seed.slice(0, count)
}

export function getEquitySeries(days = 30) {
  const rand = seededRandom(20260102)
  const out: { day: string; value: number }[] = []
  let value = 100000
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let i = days; i >= 0; i--) {
    value *= 1 + 0.008 + rand() * 0.016
    const d = new Date(Date.now() - i * 86400000)
    out.push({ day: `${labels[d.getDay()]} ${d.getDate()}`, value: Number(value.toFixed(0)) })
  }
  return out
}

export const FUND_METRICS = {
  aum: 48_252_000,
  activeInvestors: 3824,
  avgDailyVolume: 218_740,
  winRate: 94.6,
  totalPayout: 11_405_220,
  executions: 1_842_391,
  running: 1284,
}

export function maskReferralCode(code: string): string {
  if (code.length <= 2) return code
  return code.slice(0, 2) + '•'.repeat(Math.max(code.length - 2, 4))
}