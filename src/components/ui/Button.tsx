import { useState, type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-400 text-obsidian-950 font-bold shadow-md shadow-brand-400/15 hover:bg-brand-300 hover:shadow-brand-400/25 active:brightness-95',
  secondary:
    'border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 active:bg-white/[0.03]',
  outline:
    'border border-brand-400/35 text-brand-400 hover:bg-brand-400/10 hover:border-brand-400/60 active:bg-brand-400/15',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  danger:
    'bg-risk-500 text-white shadow-md shadow-risk-500/20 hover:bg-risk-400 active:bg-risk-600',
  success:
    'bg-profit-500 text-obsidian-950 font-bold shadow-md shadow-profit-500/20 hover:bg-profit-400',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm font-semibold rounded-xl gap-2',
  lg: 'h-12 px-6 text-sm font-bold rounded-xl gap-2.5',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(
    'inline-flex items-center justify-center tracking-tight transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
    'active:scale-[0.985] whitespace-nowrap cursor-pointer select-none',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading: externalLoading = false,
  className,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false)
  const isBusy = Boolean(externalLoading || internalLoading)

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (isBusy || disabled) {
      e.preventDefault()
      return
    }
    if (!onClick) return

    try {
      const result = onClick(e) as unknown
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        setInternalLoading(true)
        await result
      }
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <button
      className={cn(
        buttonClass(variant, size, className),
        isBusy && 'opacity-80 pointer-events-none cursor-wait',
      )}
      disabled={disabled || isBusy}
      onClick={handleClick}
      {...props}
    >
      {isBusy && <Loader2 className="size-4 animate-spin shrink-0" />}
      {children}
    </button>
  )
}
