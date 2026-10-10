import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

export function formatCurrency(value: number, maximumFractionDigits = 2): string {
  const v = Number.isFinite(value) ? value : 0
  const max = Math.min(Math.max(0, maximumFractionDigits), 2)
  const min = Math.min(max, 2)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(v)
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  const v = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.min(Math.max(0, maximumFractionDigits), 2),
  }).format(v)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatPercent(value: number, digits = 2): string {
  const v = Number.isFinite(value) ? value : 0
  return `${v >= 0 ? '+' : ''}${v.toFixed(digits)}%`
}

export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return '—'
  const date = typeof input === 'string' ? parseISO(input) : input
  return format(date, 'MMM d, yyyy · HH:mm')
}

export function timeAgo(input: string | Date | null | undefined): string {
  if (!input) return '—'
  const date = typeof input === 'string' ? parseISO(input) : input
  return formatDistanceToNowStrict(date, { addSuffix: true })
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const visible = name.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`
}

export function shortId(id: string): string {
  if (id.length <= 10) return id
  return `${id.slice(0, 6)}…${id.slice(-4)}`
}

export function truncateMiddle(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 1) return value
  return `${value.slice(0, head)}…${value.slice(-tail)}`
}
