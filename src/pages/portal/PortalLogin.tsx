import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { portalStore } from '@/lib/portalStore'
import { businessStore } from '@/lib/businessStore'
import { useToast } from '@/contexts/ToastContext'

export function PortalLogin() {
  const navigate = useNavigate()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const clients = businessStore.getClients()

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
        toast.success(`Welcome to ${result.client.company_name} Workspace!`)
        navigate('/portal')
      } else {
        toast.error('No client account found with this email. Please check with Zhenbot support.')
      }
    }, 600)
  }

  const handleQuickLogin = (clientId: string) => {
    const session = portalStore.switchClientForPreview(clientId)
    if (session) {
      toast.success(`Signed in as ${session.client.company_name}`)
      navigate('/portal')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#00B82E]/20 selection:text-[#111827]">
      {/* Brand Center */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <ZhenbotLogo variant="full" size="md" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#00B82E] text-xs font-bold border border-[#00B82E]/30">
          <ShieldCheck className="size-3.5" />
          <span>Client Operations Portal</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
          Access Your Business Workspace
        </h2>
        <p className="text-xs text-[#64748B]">
          Private portal for companies with custom automations built by Zhenbot
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Business Email</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10"
              />
            </div>

            <div className="space-y-1">
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
              className="w-full h-11 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Quick One-Click Switcher for Demo & Admin Testing */}
          <div className="pt-5 border-t border-[#E5E7EB] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold text-center">
              Quick Client Workspace Access
            </div>
            <div className="space-y-2">
              {clients.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleQuickLogin(c.id)}
                  className="w-full p-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#00B82E]/40 hover:bg-[#F0FDF4]/30 text-left flex items-center justify-between text-xs transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-[#111827] truncate group-hover:text-[#00B82E]">
                      {c.company_name}
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate">{c.email}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00B82E] shrink-0">Open →</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="text-center mt-6 text-xs text-[#64748B] space-y-1">
          <div>
            Need an activation link? Contact your assigned manager at{' '}
            <a href="mailto:automate@zhenibot.com" className="text-[#00B82E] font-semibold underline">
              automate@zhenibot.com
            </a>
          </div>
          <div>
            <a href="/" className="hover:underline">
              ← Return to Zhenbot Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
