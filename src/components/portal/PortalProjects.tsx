import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Calendar,
  User,
  MessageSquare,
  ThumbsUp,
  X,
  FileCheck,
  Send,
} from 'lucide-react'
import type { Project, ProjectMilestone } from '@/lib/businessStore'
import { useToast } from '@/contexts/ToastContext'

interface PortalProjectsProps {
  projects: Project[]
  companyName: string
}

export function PortalProjects({ projects, companyName }: PortalProjectsProps) {
  const toast = useToast()
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  )
  const [isApprovalOpen, setIsApprovalOpen] = useState(false)
  const [approvalMilestone, setApprovalMilestone] = useState<ProjectMilestone | null>(null)
  const [feedbackNote, setFeedbackNote] = useState('')

  // Project conversation
  const [projectMessages, setProjectMessages] = useState<
    { sender: string; text: string; time: string; role: 'client' | 'admin' }[]
  >([
    {
      sender: 'Usman B. (Lead Dev)',
      text: 'Good day! All webhook listeners for Paystack and WhatsApp Cloud API have passed integration testing in staging.',
      time: 'Yesterday at 4:15 PM',
      role: 'admin',
    },
    {
      sender: companyName,
      text: 'Thank you! We tested the automated message response and it worked within 2 seconds. Looking forward to live deployment.',
      time: 'Yesterday at 5:30 PM',
      role: 'client',
    },
  ])
  const [replyText, setReplyText] = useState('')

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0]

  const handleSendProjectMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setProjectMessages([
      ...projectMessages,
      {
        sender: companyName,
        text: replyText.trim(),
        time: 'Just now',
        role: 'client',
      },
    ])
    setReplyText('')
    toast.success('Message sent to project manager!')
  }

  const handleApproveMilestone = () => {
    toast.success(`Milestone "${approvalMilestone?.title}" approved!`)
    setIsApprovalOpen(false)
    setFeedbackNote('')
  }

  const handleRequestRevision = () => {
    if (!feedbackNote.trim()) {
      toast.error('Please describe what revisions or adjustments you need.')
      return
    }
    toast.success('Feedback submitted to the engineering team!')
    setIsApprovalOpen(false)
    setFeedbackNote('')
  }

  if (!activeProject) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#64748B]">
        No projects assigned to your account yet.
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    planning: 'bg-[#EFF6FF] text-[#0090FE]',
    in_progress: 'bg-[#F0FDF4] text-[#00B82E]',
    awaiting_client: 'bg-[#FFFBEB] text-[#F59E0B]',
    testing: 'bg-[#FDF4FF] text-[#A855F7]',
    completed: 'bg-[#F0FDF4] text-[#00B82E]',
    on_hold: 'bg-[#F1F5F9] text-[#64748B]',
  }

  return (
    <div className="space-y-6">
      {/* Project Switcher Bar if multiple projects */}
      {projects.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedProjectId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                p.id === activeProject.id
                  ? 'bg-[#00B82E] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-[#64748B] hover:text-[#111827]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Project Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  statusColors[activeProject.status] || 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {activeProject.status.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-[#64748B]">
                {activeProject.category}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              {activeProject.name}
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {activeProject.description}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-[11px] font-semibold text-[#64748B]">Project Progress</div>
            <div className="text-3xl font-extrabold text-[#00B82E]">
              {activeProject.progress}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#00B82E] h-full rounded-full transition-all duration-700"
            style={{ width: `${activeProject.progress}%` }}
          />
        </div>

        {/* Project Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5E7EB] text-xs">
          <div className="space-y-1">
            <span className="text-[#94A3B8] text-[11px]">Assigned Lead Engineer</span>
            <div className="font-bold text-[#111827] flex items-center gap-1.5">
              <User className="size-3.5 text-[#00B82E]" />
              <span>{activeProject.assigned_to}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#94A3B8] text-[11px]">Start Date</span>
            <div className="font-bold text-[#111827] flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#64748B]" />
              <span>{activeProject.start_date}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#94A3B8] text-[11px]">Target Delivery</span>
            <div className="font-bold text-[#111827] flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#64748B]" />
              <span>{activeProject.expected_delivery}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#94A3B8] text-[11px]">Priority</span>
            <div className="font-bold text-[#111827] capitalize">
              {activeProject.priority} Priority
            </div>
          </div>
        </div>
      </div>

      {/* 2. MILESTONES & DELIVERABLES WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Milestones & Approvals (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Milestone Delivery Timeline</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Structured stages of implementation, verification, and live rollout
            </p>
          </div>

          <div className="space-y-3.5">
            {activeProject.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                      m.status === 'completed'
                        ? 'bg-[#00B82E] text-white'
                        : m.status === 'in_progress'
                        ? 'bg-[#0090FE] text-white'
                        : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {m.status === 'completed' ? <CheckCircle2 className="size-4" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]">{m.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B]">
                      <span>Target: {m.due_date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      m.status === 'completed'
                        ? 'bg-[#F0FDF4] text-[#00B82E]'
                        : m.status === 'in_progress'
                        ? 'bg-[#EFF6FF] text-[#0090FE]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>

                  {m.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setApprovalMilestone(m)
                        setIsApprovalOpen(true)
                      }}
                      className="h-7 px-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[11px] font-semibold text-[#111827] flex items-center gap-1 cursor-pointer"
                    >
                      <FileCheck className="size-3 text-[#00B82E]" />
                      <span>Review</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Project Deliverables Checklist */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Deliverables & Integration Checks
            </h4>
            <div className="space-y-2">
              {activeProject.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-white text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`size-4 ${
                        task.completed ? 'text-[#00B82E]' : 'text-[#CBD5E1]'
                      }`}
                    />
                    <span className={task.completed ? 'text-[#111827]' : 'text-[#64748B]'}>
                      {task.title}
                    </span>
                  </div>
                  {task.completed && (
                    <span className="text-[10px] font-bold text-[#00B82E] bg-[#F0FDF4] px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Conversation & QA (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Project Communication</h3>
                <p className="text-xs text-[#64748B]">Direct updates with assigned lead engineer</p>
              </div>
              <MessageSquare className="size-4 text-[#00B82E]" />
            </div>

            {/* Conversation Log */}
            <div className="py-4 space-y-3.5 max-h-80 overflow-y-auto">
              {projectMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl text-xs space-y-1 ${
                    msg.role === 'client'
                      ? 'bg-[#F0FDF4] border border-[#00B82E]/20 ml-4'
                      : 'bg-[#F8FAFC] border border-[#E5E7EB] mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <span className="font-bold text-[#111827]">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-[#334155] leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Input */}
          <form onSubmit={handleSendProjectMessage} className="pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask a question or request adjustment..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-10 px-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
              />
              <button
                type="submit"
                className="size-10 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Review / Approval Modal */}
      {isApprovalOpen && approvalMilestone && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Review Milestone Deliverable
                </h3>
                <p className="text-xs text-[#64748B]">{approvalMilestone.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsApprovalOpen(false)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] leading-relaxed">
              This milestone has been completed and verified by Zhenbot engineers.
              You can accept this deliverable to proceed with deployment, or submit feedback for further revisions.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111827]">
                Client Feedback / Revision Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Write any changes or specific requests here..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRequestRevision}
                className="h-10 px-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] cursor-pointer"
              >
                Request Revisions
              </button>
              <button
                type="button"
                onClick={handleApproveMilestone}
                className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ThumbsUp className="size-3.5" />
                <span>Approve Deliverable</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
