import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, KeyRound, Mail, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/landing/Navbar'
import { QuantRadarCanvas } from '@/components/landing/QuantRadarCanvas'
import { sendWelcomeEmail } from '@/lib/email'

type Mode = 'login' | 'register'

const YEAR = new Date().getFullYear()

function SidePanel() {
  return (
    <div className="relative hidden overflow-hidden border-r border-white/8 bg-[#070b14] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Background Quant Radar Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <QuantRadarCanvas className="w-full h-full" />
      </div>

      <div className="grid-pattern absolute inset-0 pointer-events-none" aria-hidden />

      <div className="relative z-10">
        <Logo />
      </div>

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-[#0d1424] px-3.5 py-1 font-mono text-[11px] text-brand-300">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>AUTONOMOUS OPERATIONS ENGINE</span>
        </div>

        <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white font-display">
          Run Your Business Operations on <span className="text-gradient block mt-1">100% Autopilot.</span>
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
          Join high-growth companies automating email triage, on-demand courier booking, 24/7 customer care reps, and invoice reconciliation with zero manual effort.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Tasks Automated', value: '4.8M+' },
            { label: 'Hours Saved/Wk', value: '18.5 hrs' },
            { label: 'Avg Latency', value: '1.2s' },
            { label: 'Cluster Uptime', value: '99.98%' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-[#0c1220]/80 p-3.5 backdrop-blur-sm">
              <p className="font-mono text-lg font-bold text-white tracking-tight">{s.value}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-500/25 bg-brand-500/10 p-3.5">
          <span className="flex size-2 rounded-full bg-emerald-400" />
          <p className="text-xs font-mono text-slate-300">
            <span className="font-semibold text-brand-300">SYSTEM STATUS:</span> All 14 automation clusters operational.
          </p>
        </div>
      </div>

      <p className="relative z-10 text-[11px] font-mono text-slate-500">
        © {YEAR} Zhen Automation Inc. · Autonomous AI Business Operations
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
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr] bg-[#090d16] text-slate-300">
      <SidePanel />

      <div className="flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between lg:hidden mb-8">
          <Logo />
        </div>

        <div className="mx-auto w-full max-w-sm my-auto">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-[#0c1220] p-1 mb-8">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                'rounded-lg py-2 font-mono text-xs font-bold transition-all cursor-pointer',
                mode === 'login'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={cn(
                'rounded-lg py-2 font-mono text-xs font-bold transition-all cursor-pointer',
                mode === 'register'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              Start Free Pilot
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white font-display">
              {mode === 'login' ? 'Access Operations Studio' : 'Create Business Account'}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {mode === 'login'
                ? 'Sign in to monitor your active workflows and telemetry.'
                : '14-day free pilot. Automate emails, dispatches, and care reps.'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Full Name / Business Name
                </label>
                <Input
                  icon={<User className="size-4" />}
                  placeholder="e.g. Acme Logistics or Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Business Email Address
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
              <label className="block text-xs font-semibold text-white mb-1">
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
                <label className="block text-xs font-semibold text-white mb-1">
                  Agency Partner Referral Code (Optional)
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
              className="w-full bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 text-white font-bold shadow-lg shadow-brand-500/25 mt-2"
            >
              {mode === 'login' ? 'Sign In to Studio' : 'Launch My First Automation'}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/6 text-center text-xs text-slate-400">
            <span className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand-400" /> Enterprise-grade 256-bit AES encryption
            </span>
          </div>
        </div>

        <div className="text-center text-[11px] font-mono text-slate-500">
          <Link to="/" className="hover:text-slate-300">← Back to Zhen Automation Homepage</Link>
        </div>
      </div>
    </div>
  )
}
