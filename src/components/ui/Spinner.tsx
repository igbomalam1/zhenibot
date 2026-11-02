import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-5 animate-spin text-[#459F34]', className)} />
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Loader2 className="size-8 animate-spin text-[#459F34]" />
    </div>
  )
}
