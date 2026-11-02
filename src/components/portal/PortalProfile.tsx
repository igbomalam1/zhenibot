import { useState } from 'react'
import {
  Building2,
  Users2,
  Plus,
  X,
  Lock,
} from 'lucide-react'
import type { ClientPortalUser, ClientUserRole } from '@/lib/portalStore'
import { portalStore } from '@/lib/portalStore'
import type { Client } from '@/lib/businessStore'
import { businessStore } from '@/lib/businessStore'
import { useToast } from '@/contexts/ToastContext'

interface PortalProfileProps {
  client: Client
  user: ClientPortalUser
  teamMembers: ClientPortalUser[]
  onRefresh: () => void
  defaultTab?: 'profile' | 'team' | 'security'
}

export function PortalProfile({
  client,
  user,
  teamMembers,
  onRefresh,
  defaultTab = 'profile',
}: PortalProfileProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'security'>(defaultTab)

  // Company Profile form state
  const [companyName, setCompanyName] = useState(client.company_name)
  const [contactPerson, setContactPerson] = useState(client.contact_person)
  const [email, setEmail] = useState(client.email)
  const [phone, setPhone] = useState(client.phone)
  const [address, setAddress] = useState(client.address || '')
  const [industry, setIndustry] = useState(client.industry)

  // Invite member state
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState<ClientUserRole>('admin')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    businessStore.updateClient(client.id, {
      company_name: companyName.trim(),
      contact_person: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      industry: industry.trim(),
    })
    toast.success('Company profile updated successfully!')
    onRefresh()
  }

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !inviteName.trim()) {
      toast.error('Please enter name and valid email address.')
      return
    }

    portalStore.addUser({
      client_id: client.id,
      email: inviteEmail.trim(),
      full_name: inviteName.trim(),
      role: inviteRole,
      status: 'active',
      last_login: undefined,
    })

    toast.success(`Invitation sent to ${inviteEmail.trim()}!`)
    setIsInviteOpen(false)
    setInviteEmail('')
    setInviteName('')
    onRefresh()
  }

  const handleRevoke = (memberId: string, memberName: string) => {
    if (memberId === user.id) {
      toast.error('You cannot revoke your own account.')
      return
    }
    portalStore.revokeUserAccess(memberId)
    toast.success(`Access for ${memberName} has been revoked.`)
    onRefresh()
  }

  const roleBadges: Record<ClientUserRole, { label: string; color: string }> = {
    owner: { label: 'Account Owner', color: 'bg-[#F0FDF4] text-[#00B82E]' },
    admin: { label: 'Administrator', color: 'bg-[#EFF6FF] text-[#0090FE]' },
    finance: { label: 'Billing & Finance', color: 'bg-[#FFFBEB] text-[#F59E0B]' },
    viewer: { label: 'Project Viewer', color: 'bg-[#F1F5F9] text-[#64748B]' },
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <Building2 className="size-4" />
          <span>Company Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'team'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <Users2 className="size-4" />
          <span>Team Members ({teamMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-[#00B82E] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]'
          }`}
        >
          <Lock className="size-4" />
          <span>Security & Access</span>
        </button>
      </div>

      {/* 1. COMPANY PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white p-7 rounded-2xl border border-[#E5E7EB] shadow-xs max-w-2xl">
          <div className="mb-6">
            <h3 className="text-base font-bold text-[#111827]">Business Information</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage your company contact details and primary representatives
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Company Legal Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Primary Representative</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Official Business Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">WhatsApp / Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Industry / Market</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Physical / Operating Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. TEAM MEMBERS TAB */}
      {activeTab === 'team' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Authorized Team Members</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Staff members authorized to monitor projects, review automations, or access billing
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="py-3 px-5 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role & Permissions</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Last Active</th>
                    <th className="py-3 px-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {teamMembers.map((m) => {
                    const badge = roleBadges[m.role] || roleBadges.viewer
                    return (
                      <tr key={m.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-[#F0FDF4] text-[#00B82E] font-bold text-xs flex items-center justify-center">
                              {m.full_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#111827]">{m.full_name}</div>
                              <div className="text-[11px] text-[#64748B]">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              m.status === 'active'
                                ? 'bg-[#F0FDF4] text-[#00B82E]'
                                : 'bg-[#FEF2F2] text-[#EF4444]'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B] font-mono">
                          {m.last_login ? new Date(m.last_login).toLocaleDateString() : 'Invited'}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {m.role !== 'owner' && m.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(m.id, m.full_name)}
                              className="text-xs text-[#EF4444] hover:underline cursor-pointer"
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="bg-white p-7 rounded-2xl border border-[#E5E7EB] shadow-xs max-w-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Security & Password</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Secure your account credentials and workspace sessions
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111827]">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => toast.success('Password updated successfully!')}
                className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#111827]">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Work Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Role & Access Scope</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                >
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="finance">Billing & Finance (Invoices, Receipts)</option>
                  <option value="viewer">Project Viewer (Read Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
