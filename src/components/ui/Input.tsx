import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string | null
  icon?: ReactNode
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, icon, suffix, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name
  return (
    <label className="block text-left" htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-slate-400">
          <span>{label}</span>
          {hint && <span className="text-[11px] font-normal normal-case tracking-normal text-slate-500">{hint}</span>}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border border-white/10 bg-[#0d0f17] px-4 text-sm text-white placeholder:text-slate-500',
            'transition-all duration-150 focus:border-brand-400/80 focus:bg-[#10131e] focus:outline-none focus:ring-1 focus:ring-brand-400/50',
            icon && 'pl-11',
            suffix && 'pr-24',
            error
              ? 'border-risk-500/70 focus:border-risk-500 focus:ring-risk-500/30'
              : '',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-risk-400">{error}</span>}
    </label>
  )
})
