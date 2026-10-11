import type { SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function UsdtIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        d="M17.922 17.383c-.088.006-.312.02-.674.02-.684 0-1.637-.043-1.928-.052-.027-.001-.055 0-.082 0-.324.01-1.282.052-1.933.052-.36 0-.585-.014-.672-.02-3.834-.18-6.697-1.1-6.697-2.222 0-1.121 2.863-2.042 6.697-2.222.087-.006.311-.02.672-.02.65 0 1.609.042 1.933.052.027 0 .055 0 .082 0 .291-.01 1.244-.052 1.928-.052.362 0 .586.014.674.02 3.834.18 6.697 1.1 6.697 2.222 0 1.122-2.863 2.042-6.697 2.222z"
        fill="#FFFFFF"
      />
      <path
        d="M17.848 18.064c3.424-.16 5.922-.924 6.55-1.897-.936 2.032-4.664 3.493-9.066 3.528-4.402-.035-8.13-1.496-9.066-3.528.628.973 3.126 1.737 6.55 1.897v5.936h5.032v-5.936z"
        fill="#FFFFFF"
      />
      <path
        d="M18.848 10.667v-3.334H13.152v3.334H7v3.08h6.152v.942c.489.027 1.348.063 2.268.063.92 0 1.779-.036 2.268-.063v-.942H25v-3.08h-6.152z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function BscIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#F0B90B" />
      <path
        d="M16 6.8l2.9 2.9-4.8 4.8-2.9-2.9L16 6.8zm6.7 6.7l2.9 2.9-2.9 2.9-2.9-2.9 2.9-2.9zM9.3 13.5l2.9 2.9-2.9 2.9-2.9-2.9 2.9-2.9zm6.7 3.8l2.9 2.9-2.9 2.9-2.9-2.9 2.9-2.9zm3.8-3.8l4.8 4.8-4.8 4.8-1.9-1.9 2.9-2.9-2.9-2.9 1.9-1.9zm-7.6 0l1.9 1.9-2.9 2.9 2.9 2.9-1.9 1.9-4.8-4.8 4.8-4.8zm3.8 8.6l4.8-4.8 2.9 2.9L16 25.2l-7.7-7.7 2.9-2.9 4.8 4.8z"
        fill="#1E2026"
      />
    </svg>
  )
}

export function TronIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#EF0027" />
      <path
        d="M7 8l16.8 4.6L19.2 24 7 8zm14.8 4.3L8.8 8.8l10.8 13.2 2.2-9.7zm-9.3 3.6l7.8 7.4-9.8-10.4 2 3z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

export function EthIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-8 shrink-0', className)}
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFFFFF">
        <path d="M16 5.5v7.86l6.63 2.98L16 5.5z" fillOpacity="0.6" />
        <path d="M16 5.5L9.37 16.34 16 13.36V5.5z" />
        <path d="M16 20.44v6.06l6.64-9.25L16 20.44z" fillOpacity="0.6" />
        <path d="M16 26.5v-6.06L9.37 17.25 16 26.5z" />
        <path d="M16 19.38l6.63-3.04L16 13.36v6.02z" fillOpacity="0.2" />
        <path d="M9.37 16.34L16 19.38v-6.02l-6.63 3z" fillOpacity="0.6" />
      </g>
    </svg>
  )
}

interface DualTokenBadgeProps {
  networkId: 'bep20' | 'trc20' | 'erc20' | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DualTokenBadge({ networkId, size = 'md', className }: DualTokenBadgeProps) {
  const sizeMap = {
    sm: { main: 'size-7', sub: 'size-4 -bottom-1 -right-1' },
    md: { main: 'size-10', sub: 'size-5 -bottom-1 -right-1' },
    lg: { main: 'size-14', sub: 'size-6 -bottom-1.5 -right-1.5' },
  }

  const currentSize = sizeMap[size]

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)}>
      <UsdtIcon className={currentSize.main} />
      <div className={cn('absolute rounded-full ring-2 ring-[#08090e] shadow-md', currentSize.sub)}>
        {networkId === 'bep20' && <BscIcon className="size-full" />}
        {networkId === 'trc20' && <TronIcon className="size-full" />}
        {networkId === 'erc20' && <EthIcon className="size-full" />}
      </div>
    </div>
  )
}
