import type { SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string | null
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, children, ...props },
  ref,
) {
  const selectId = id ?? props.name
  return (
    <label className="block text-left" htmlFor={selectId}>
      {label && (
        <span className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      )}
      <span className="relative block">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0d0f17] px-4 pr-10 text-sm text-white',
            'transition-all duration-150 focus:border-brand-400/80 focus:bg-[#10131e] focus:outline-none focus:ring-1 focus:ring-brand-400/50',
            error
              ? 'border-risk-500/70 focus:border-risk-500'
              : '',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </span>
      {error && <span className="mt-1.5 block text-xs font-medium text-risk-400">{error}</span>}
    </label>
  )
})
