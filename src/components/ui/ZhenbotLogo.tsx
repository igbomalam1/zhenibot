import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface ZhenbotLogoProps {
  variant?: 'full' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
  href?: string
}

const SIZE_CONFIGS = {
  sm: {
    wordmark: 'text-xl tracking-tight leading-none',
    tagline: 'text-[9px] tracking-[0.24em] mt-1',
  },
  md: {
    wordmark: 'text-2xl sm:text-[26px] tracking-tight leading-none',
    tagline: 'text-[10px] tracking-[0.26em] mt-1.5',
  },
  lg: {
    wordmark: 'text-3xl sm:text-4xl tracking-tight leading-none',
    tagline: 'text-xs tracking-[0.28em] mt-2',
  },
}

export function ZhenbotLogo({
  variant = 'full',
  size = 'md',
  showTagline,
  className,
  href = '/',
}: ZhenbotLogoProps) {
  const isCompact = variant === 'compact'
  const displayTagline = showTagline !== undefined ? showTagline : !isCompact
  const currentSize = SIZE_CONFIGS[size] || SIZE_CONFIGS.md

  const content = (
    <div
      className={cn(
        'inline-flex flex-col items-start select-none font-sans',
        className
      )}
    >
      {/* Primary Wordmark: "Zhen" in dark charcoal, "bot" in brand green (#00B82E) */}
      <div className={cn('flex items-baseline font-bold font-display', currentSize.wordmark)}>
        <span className="text-[#111827]">Zhen</span>
        <span className="text-[#00B82E]">bot</span>
      </div>

      {/* Subtitle Tagline: "ZHEN AUTOMATION" */}
      {displayTagline && (
        <span
          className={cn(
            'font-semibold uppercase text-[#64748B] tracking-[0.25em] w-full block',
            currentSize.tagline
          )}
        >
          ZHEN AUTOMATION
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        to={href}
        className="inline-flex transition-opacity hover:opacity-90 focus:outline-none"
        aria-label="Zhenbot Automation Home"
      >
        {content}
      </Link>
    )
  }

  return content
}

export const Logo = ZhenbotLogo
