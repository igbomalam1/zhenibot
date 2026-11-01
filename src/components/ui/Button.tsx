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
    'bg-[#459F34] text-white font-medium hover:bg-[#3a862b] active:bg-[#26591b] shadow-xs',
  secondary:
    'border border-white/10 bg-[#142410] text-[#F3F4F6] hover:bg-[#1E212B] hover:border-white/15 active:bg-[#0e1a0b]',
  outline:
    'border border-white/15 bg-transparent text-[#F3F4F6] hover:bg-white/[0.04] hover:border-white/25 active:bg-white/[0.08]',
  ghost:
    'text-[#8F95A3] hover:text-white hover:bg-white/[0.04] active:bg-white/[0.08]',
  danger:
    'bg-[#EF4444] text-white font-medium hover:bg-[#DC2626] active:bg-[#B91C1C]',
  success:
    'bg-[#10B981] text-white font-medium hover:bg-[#059669]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-10 px-4 text-xs font-medium rounded-lg gap-2',
  lg: 'h-11 px-5 text-sm font-medium rounded-lg gap-2',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(
    'inline-flex items-center justify-center tracking-tight transition-colors duration-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#459F34]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081106]',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
    'active:scale-[0.99] whitespace-nowrap cursor-pointer select-none',
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
      {isBusy && <Loader2 className="size-3.5 animate-spin shrink-0" />}
      {children}
    </button>
  )
}
