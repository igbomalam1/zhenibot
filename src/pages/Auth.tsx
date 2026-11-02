import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, KeyRound, Mail, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { ZhenbotLogo as Logo } from '@/components/ui/ZhenbotLogo'
import { QuantRadarCanvas } from '@/components/landing/QuantRadarCanvas'
import { sendWelcomeEmail } from '@/lib/email'

type Mode = 'login' | 'register'

const YEAR = new Date().getFullYear()

function SidePanel() {
  return (
    <div className="relative hidden overflow-hidden border-r border-white/8 bg-[#081106] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Background Architectural Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <QuantRadarCanvas className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <Logo />
      </div>

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1a0b] px-3 py-1 font-mono text-[11px] text-[#8F95A3]">
          <span className="size-1.5 rounded-full bg-[#459F34]" />
          <span className="tracking-wider uppercase">Autonomous operations engine</span>
        </div>

        <h2 className="max-w-md text-3xl font-bold leading-tight text-[#F4F5F7] tracking-tight">
          Run your business operations on complete autopilot.
        </h2>
        <p className="mt-3.5 max-w-md text-sm leading-relaxed text-[#8F95A3]">
          Connect your Gmail, WhatsApp, and dispatch fleets. Zhen Automation handles triage, on-demand courier booking, customer queries, and invoice settlement without manual intervention.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Tasks automated', value: '4.8M+' },
            { label: 'Hours saved / wk', value: '18.5 hrs' },
            { label: 'Avg dispatch time', value: '1.2s' },
            { label: 'Cluster uptime', value: '99.98%' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/8 bg-[#0e1a0b] p-3.5">
              <p className="font-mono text-lg font-bold text-[#F4F5F7] tracking-tight tnum">{s.value}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#545A67]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-white/8 bg-[#0e1a0b] p-3.5">
          <span className="flex size-2 rounded-full bg-emerald-400" />
          <p className="text-xs font-mono text-[#8F95A3]">
            <span className="font-semibold text-[#F4F5F7]">System status:</span> All 14 automation clusters operational.
          </p>
        </div>
      </div>

      <p className="relative z-10 text-[11px] font-mono text-[#545A67]">
        © {YEAR} Zhen Automation Inc. · Autonomous business operations
      </p>
    </div>
  )
}

export function Auth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { signIn, signUp, session } = useAuth()
  const toast = useToast()

  const mode: Mode = (searchParams.get('mode') as Mode) ?? 'login'
  const refParam = searchParams.get('ref') ?? ''

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState(refParam)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({})

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true })
  }, [session, navigate])

  const setMode = (m: Mode) => {
    setErrors({})
    setReferralCode(refParam)
    setSearchParams({ mode: m })
  }

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (mode === 'register' && fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name or company name.'
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Enter a valid business email address.'
    }
    if (password.length < 6) {
      next.password = 'Password must be at least 6 characters.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error(error === 'Invalid login credentials' ? 'Invalid email or password.' : error)
        setLoading(false)
        return
      }
      navigate('/dashboard')
    } else {
      const { error } = await signUp({
        fullName,
        email,
        password,
        referralCode: referralCode.trim() || undefined,
      })
      if (error) {
        toast.error(error)
        setLoading(false)
        return
      }

      void sendWelcomeEmail({
        to: email,
        name: fullName,
        referralCode: referralCode.trim() || undefined,
      })

      navigate('/dashboard')
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr] bg-[#081106] text-[#8F95A3]">
      <SidePanel />

      <div className="flex flex-col justify-between p-6 sm:p-12 bg-[#081106]">
        <div className="flex items-center justify-between lg:hidden mb-8">
          <Logo />
        </div>

        <div className="mx-auto w-full max-w-sm my-auto">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/8 bg-[#0e1a0b] p-1 mb-8">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'rounded-md py-2 font-mono text-xs font-semibold transition-colors cursor-pointer',
                mode === 'login'
                  ? 'bg-[#459F34] text-white'
                  : 'text-[#8F95A3] hover:text-[#F4F5F7]',
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'rounded-md py-2 font-mono text-xs font-semibold transition-colors cursor-pointer',
                mode === 'register'
                  ? 'bg-[#459F34] text-white'
                  : 'text-[#8F95A3] hover:text-[#F4F5F7]',
              )}
            >
              Start free pilot
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#F4F5F7] tracking-tight">
              {mode === 'login' ? 'Access operations console' : 'Create enterprise workspace'}
            </h1>
            <p className="mt-1 text-xs text-[#8F95A3]">
              {mode === 'login'
                ? 'Sign in to monitor active automation workflows and telemetry.'
                : '14-day free pilot. Automate emails, dispatches, and care reps.'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#8F95A3] mb-1.5">
                  Full name or business legal name
                </label>
                <Input
                  icon={<User className="size-4" />}
                  placeholder="Acme Logistics or Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#8F95A3] mb-1.5">
                Work email address
              </label>
              <Input
                type="email"
                icon={<Mail className="size-4" />}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8F95A3] mb-1.5">
                Password
              </label>
              <Input
                type="password"
                icon={<KeyRound className="size-4" />}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#8F95A3] mb-1.5">
                  Agency partner code (optional)
                </label>
                <Input
                  placeholder="Optional partner code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full bg-[#459F34] hover:bg-[#3a862b] text-white font-semibold mt-2"
            >
              {mode === 'login' ? 'Sign in to console' : 'Launch operations workspace'}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/6 text-center text-xs text-[#8F95A3]">
            <span className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#459F34]" /> Enterprise-grade 256-bit AES encryption
            </span>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-[#545A67]">
          <Link to="/" className="hover:text-[#8F95A3]">← Back to Zhen Automation homepage</Link>
        </div>
      </div>
    </div>
  )
}
