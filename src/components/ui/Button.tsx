import { useState, type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#00B82E] text-white font-semibold hover:bg-[#008F27] active:bg-[#007A21] shadow-xs border border-transparent',
  secondary:
    'bg-white text-[#111827] border border-[#E5E7EB] font-semibold hover:bg-[#F0FDF4] hover:border-[#00B82E]/40 active:bg-[#DCFCE7]',
  outline:
    'bg-transparent text-[#111827] border border-[#E5E7EB] font-semibold hover:bg-black/[0.03] active:bg-black/[0.06]',
  ghost:
    'bg-transparent text-[#64748B] hover:text-[#111827] hover:bg-black/[0.04] active:bg-black/[0.07]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-xs rounded-[10px] gap-2',
  md: 'h-12 px-6 text-sm rounded-[12px] gap-2.5',
  lg: 'h-[52px] px-7 text-base rounded-[12px] gap-2.5',
}

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(
    'inline-flex items-center justify-center font-sans tracking-normal transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B82E]/50 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
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
      setInternalLoading(true)
      await onClick(e)
    } finally {
      setInternalLoading(false)
    }
  }

  return (
    <button
      {...props}
      disabled={disabled || isBusy}
      onClick={handleClick}
      className={buttonClass(variant, size, className)}
    >
      {isBusy && <Loader2 className="size-4 animate-spin shrink-0" />}
      {children}
    </button>
  )
}
