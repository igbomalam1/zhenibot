import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-5 animate-spin text-brand-400', className)} />
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#08090e]">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-400/20" />
        <img
          src="/logo.svg"
          alt="Zhenbot"
          className="relative size-12 rounded-xl object-contain shadow-lg shadow-brand-400/20"
        />
      </div>
      <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Loading Zhenbot…</p>
    </div>
  )
}
