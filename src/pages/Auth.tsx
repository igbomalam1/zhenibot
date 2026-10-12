import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, KeyRound, Mail, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { FUND_METRICS } from '@/lib/demo'
import { formatCompact, formatCurrency } from '@/lib/format'
import { Logo } from '@/components/landing/Navbar'
import { QuantRadarCanvas } from '@/components/landing/QuantRadarCanvas'
import { sendWelcomeEmail } from '@/lib/email'

type Mode = 'login' | 'register'

const YEAR = new Date().getFullYear()

function SidePanel() {
  return (
    <div className="relative hidden overflow-hidden border-r border-white/8 bg-[#06080d] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* Background Quant Radar Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <QuantRadarCanvas className="w-full h-full" />
      </div>

      <div className="grid-pattern absolute inset-0 pointer-events-none" aria-hidden />

      <div className="relative z-10">
        <Logo />
      </div>

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-brand-400/30 bg-[#0d121c] px-3 py-1 font-mono text-[11px] text-brand-400">
          <span className="size-1.5 rounded-full bg-brand-400 animate-pulse" />
          <span>AUTOMATED TRADING BOT</span>
        </div>

        <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white font-display">
          Smart Automated Trading. <span className="text-gradient block mt-1">1.6% Daily Profit.</span>
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
          Join thousands of members earning a steady 1.6% daily profit powered by automated crypto trading
          with over {formatCompact(FUND_METRICS.aum)} in active funds.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Total Managed', value: formatCurrency(FUND_METRICS.aum) },
            { label: 'Active Members', value: formatCompact(FUND_METRICS.activeInvestors) },
            { label: 'Daily Profit', value: '1.6% / day' },
            { label: 'Loss Protection', value: '5.0% Stop' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-[#0b0e18]/80 p-3.5 backdrop-blur-sm">
              <p className="font-mono text-lg font-bold text-white tracking-tight">{s.value}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-400/20 bg-brand-400/5 p-3.5">
          <span className="flex size-2 rounded-full bg-brand-400" />
          <p className="text-xs font-mono text-slate-300">
            <span className="font-semibold text-brand-400">BOT STATUS:</span> Trading active. Progressing toward today's 2.0% target.
          </p>
        </div>
      </div>

      <p className="relative z-10 text-[11px] font-mono text-slate-500">
        © {YEAR} Zhenbot · Automated Crypto Trading
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
      next.fullName = 'Please enter your full name.'
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Enter a valid email address.'
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

      // Send Welcome confirmation email via Resend
      void sendWelcomeEmail({
        to: email,
        name: fullName,
        referralCode: referralCode.trim() || undefined,
      })

      toast.success(
        session
          ? 'Account created. Welcome to Zhenbot.'
          : 'Account created. Check your email to confirm your account.',
      )
      if (session) navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-[#08090e]">
      <SidePanel />

      <div className="relative flex flex-1 flex-col px-4 py-8 sm:px-8 lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="glass-card absolute left-1/2 top-8 -translate-x-1/2 rounded-xl px-4 py-2 border border-white/10">
            <Logo />
          </div>
        </div>

        <div className="w-full max-w-md animate-fade-up lg:mt-0 mt-20">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            {/* Mode Selector */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-white/8 bg-[#090b12] p-1">
              {(
                [
                  ['login', 'Sign in'],
                  ['register', 'Create account'],
                ] as [Mode, string][]
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-lg py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all',
                    mode === m
                      ? 'bg-brand-400 text-obsidian-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <h1 className="text-2xl font-extrabold text-white font-display">
              {mode === 'login' ? 'Sign In' : 'Create Free Account'}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              {mode === 'login'
                ? 'Sign in to access your dashboard and balances.'
                : 'Create an account to start earning 1.6% daily profit.'}
            </p>

            {mode === 'register' && refParam && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-brand-400/30 bg-brand-400/10 px-3.5 py-2.5 text-xs text-brand-300 font-mono">
                <ArrowRight className="size-3.5 shrink-0" />
                <span>
                  Invited by: <strong className="text-brand-400 font-bold">{refParam}</strong>
                </span>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              {mode === 'register' && (
                <Input
                  name="fullName"
                  label="Full name"
                  placeholder="John Doe"
                  icon={<User className="size-4" />}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                />
              )}

              <Input
                name="email"
                type="email"
                label="Email address"
                placeholder="name@example.com"
                autoComplete="email"
                icon={<Mail className="size-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="Minimum 6 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                icon={<KeyRound className="size-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              {mode === 'register' && (
                <Input
                  name="referralCode"
                  label="Referral code"
                  hint="Optional"
                  placeholder="ZBTR-XXXX"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              )}

              <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                {loading ? (mode === 'login' ? 'Signing In…' : 'Creating Account…') : (mode === 'login' ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="size-4 ml-1" />}
              </Button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
              By proceeding you agree to our{' '}
              <a className="text-slate-400 hover:text-brand-400 underline underline-offset-2" href="#">Terms of Service</a> and{' '}
              <a className="text-slate-400 hover:text-brand-400 underline underline-offset-2" href="#">Privacy Policy</a>.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 font-mono">
            Return to home?{' '}
            <Link to="/" className="font-semibold text-brand-400 hover:text-brand-300 underline underline-offset-2">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}