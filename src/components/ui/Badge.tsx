import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone =
  | 'brand'
  | 'success'
  | 'danger'
  | 'warning'
  | 'neutral'
  | 'telemetry'

const tones: Record<BadgeTone, string> = {
  brand: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25',
  success: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25',
  danger: 'bg-red-500/10 text-red-400 ring-red-500/25',
  warning: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
  neutral: 'bg-white/[0.05] text-slate-300 ring-white/10',
  telemetry: 'bg-sky-500/10 text-sky-400 ring-sky-500/25',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  pulse?: boolean
}

export function Badge({ tone = 'neutral', pulse = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider ring-1 ring-inset uppercase',
        tones[tone],
        className,
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  )
}

export function statusTone(status: string): BadgeTone {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'credited':
    case 'paid':
      return 'success'
    case 'pending':
      return 'warning'
    case 'failed':
    case 'rejected':
      return 'danger'
    default:
      return 'neutral'
  }
}
