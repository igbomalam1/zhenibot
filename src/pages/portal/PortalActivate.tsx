import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ZhenbotLogo } from '@/components/ui/ZhenbotLogo'
import { portalStore } from '@/lib/portalStore'
import { useToast } from '@/contexts/ToastContext'

export function PortalActivate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()

  const token = searchParams.get('token') || ''
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !password.trim()) {
      toast.error('Please enter your full name and choose a secure password.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const result = portalStore.activateInvitation(token, fullName, password)
      setIsSubmitting(false)

      if (result) {
        toast.success(`Account activated! Welcome to ${result.client.company_name}.`)
        navigate('/portal')
      } else {
        toast.error('Invalid or expired invitation token. Please request a new link.')
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#00B82E]/20 selection:text-[#111827]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <ZhenbotLogo variant="full" size="md" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#00B82E] text-xs font-bold border border-[#00B82E]/30">
          <ShieldCheck className="size-3.5" />
          <span>Client Account Activation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
          Activate Your Portal Workspace
        </h2>
        <p className="text-xs text-[#64748B]">
          Complete your profile setup to access your custom automation dashboard
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E5E7EB] shadow-xl space-y-6">
          <form onSubmit={handleActivate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Babajide Fashola"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Create Password</label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>{isSubmitting ? 'Activating Workspace...' : 'Activate & Enter Dashboard'}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <a href="/portal/login" className="text-xs text-[#64748B] hover:text-[#111827]">
              Already have an active account? Sign In →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
