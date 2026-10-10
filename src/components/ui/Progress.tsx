import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  tone?: 'brand' | 'success' | 'warning'
}

const tones = {
  brand: 'from-brand-500 to-brand-400',
  success: 'from-profit-600 to-profit-400',
  warning: 'from-amber-500 to-amber-400',
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  tone = 'brand',
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div
      className={cn(
        'h-2.5 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-inset ring-white/10',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
          tones[tone],
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
