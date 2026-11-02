import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'

interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let nextId = 0

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = ++nextId
      setToasts((prev) => [...prev.slice(-3), { id, kind, message }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: push,
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error'),
      info: (m) => push(m, 'info'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-5 right-5 z-[100] flex w-[min(92vw,380px)] flex-col gap-2.5">
        {toasts.map((t) => {
          const Icon = icons[t.kind]
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200 transition-all bg-white',
                t.kind === 'success' &&
                  'border-[#00B82E]/30 bg-white text-[#111827]',
                t.kind === 'error' &&
                  'border-[#EF4444]/30 bg-white text-[#111827]',
                t.kind === 'info' &&
                  'border-[#0090FE]/30 bg-white text-[#111827]',
              )}
            >
              <div
                className={cn(
                  'size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  t.kind === 'success' && 'bg-[#F0FDF4] text-[#00B82E]',
                  t.kind === 'error' && 'bg-[#FEF2F2] text-[#EF4444]',
                  t.kind === 'info' && 'bg-[#EFF6FF] text-[#0090FE]',
                )}
              >
                <Icon className="size-4.5" />
              </div>
              <p className="flex-1 text-xs sm:text-[13px] font-semibold leading-relaxed text-[#111827] pt-1">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-[#9CA3AF] transition-colors hover:text-[#111827] p-1 rounded-lg hover:bg-[#F3F4F6] cursor-pointer text-xs shrink-0"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}