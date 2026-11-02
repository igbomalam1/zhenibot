import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { portalStore } from '@/lib/portalStore'
import { useToast } from '@/contexts/ToastContext'

export function PortalLogin() {
  const navigate = useNavigate()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your business email.')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const result = portalStore.login(email.trim(), password)
      setIsLoading(false)

      if (result) {
        toast.success(`Welcome back!`)
        navigate('/portal')
      } else {
        toast.error('Account not found or invalid credentials.')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#00B82E]/20 selection:text-[#111827]">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <ZhenbotLogo variant="full" size="md" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-[#64748B]">
          Enter your credentials to access your dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111827]">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#111827]">Password</label>
                <a
                  href="mailto:automate@zhenibot.com?subject=Password%20Reset%20Request"
                  className="text-[11px] font-semibold text-[#00B82E] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        {/* Footer Support */}
        <div className="text-center mt-6 text-xs text-[#64748B] space-y-2">
          <div>
            <a href="/" className="text-[#64748B] hover:text-[#111827] hover:underline">
              ← Return to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
