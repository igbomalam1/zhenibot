import { useState } from 'react'
import {
  Plus,
  Search,
  Kanban,
  List,
  CheckCircle2,
  X,
} from 'lucide-react'
import { businessStore } from '@/lib/businessStore'
import type { Project, Client } from '@/lib/businessStore'
import { useToast } from '@/contexts/ToastContext'

interface AdminProjectsProps {
  projects: Project[]
  clients: Client[]
  onRefresh: () => void
}

export function AdminProjects({ projects, clients, onRefresh }: AdminProjectsProps) {
  const toast = useToast()
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // New Project Form State
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [category, setCategory] = useState<Project['category']>('WhatsApp Automation')
  const [budget, setBudget] = useState(750000)
  const [expectedDelivery, setExpectedDelivery] = useState('')
  const [priority, setPriority] = useState<Project['priority']>('high')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a project name.')
      return
    }

    const client = clients.find((c) => c.id === clientId) || clients[0]

    setCreating(true)
    businessStore.addProject({
      name: name.trim(),
      client_id: client ? client.id : 'cli-gen',
      client_name: client ? client.company_name : 'General Client',
      category,
      budget: Number(budget) || 500000,
      status: 'planning',
      priority,
      start_date: new Date().toISOString().split('T')[0],
      expected_delivery: expectedDelivery || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assigned_to: 'Usman B. (Lead Dev)',
      progress: 10,
      description: description.trim() || 'Custom business automation system.',
      tasks: [
        { id: 't1', title: 'Process mapping & architecture signoff', completed: true },
        { id: 't2', title: 'Webhook & core workflow development', completed: false },
        { id: 't3', title: 'User acceptance testing & deployment', completed: false },
      ],
      milestones: [
        { id: 'm1', title: 'Specification Signoff', status: 'completed', due_date: expectedDelivery || '2026-04-15' },
        { id: 'm2', title: 'Live Beta Deployment', status: 'in_progress', due_date: expectedDelivery || '2026-04-20' },
      ],
    })

    setCreating(false)
    setIsCreateOpen(false)
    setName('')
    setDescription('')
    toast.success('Project created successfully!')
    onRefresh()
  }

  const handleStatusChange = (projectId: string, newStatus: Project['status']) => {
    businessStore.updateProject(projectId, { status: newStatus })
    toast.success('Project status updated')
    onRefresh()
  }

  const handleProgressChange = (projectId: string, progress: number) => {
    businessStore.updateProject(projectId, { progress })
    toast.success('Progress updated')
    onRefresh()
  }

  // Filtering
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const KANBAN_COLUMNS: { status: Project['status']; title: string; color: string }[] = [
    { status: 'planning', title: 'Planning', color: 'border-blue-400 text-blue-700 bg-blue-50' },
    { status: 'in_progress', title: 'In Progress', color: 'border-amber-400 text-amber-700 bg-amber-50' },
    { status: 'testing', title: 'Testing & QA', color: 'border-purple-400 text-purple-700 bg-purple-50' },
    { status: 'completed', title: 'Live & Completed', color: 'border-emerald-400 text-emerald-700 bg-emerald-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] font-semibold focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="WhatsApp Automation">WhatsApp Automation</option>
            <option value="Payment & Invoicing">Payment & Invoicing</option>
            <option value="Logistics & Dispatch">Logistics & Dispatch</option>
            <option value="Social & Ads">Social & Ads</option>
            <option value="Spreadsheet & CRM Sync">Spreadsheet & CRM Sync</option>
            <option value="Custom Workflow">Custom Workflow</option>
          </select>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* View Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <Kanban className="size-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white text-[#111827] shadow-xs' : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <List className="size-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {KANBAN_COLUMNS.map((col) => {
            const colProjects = filtered.filter((p) => p.status === col.status)
            return (
              <div key={col.status} className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E5E7EB] flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111827]">{col.title}</span>
                    <span className="size-5 rounded-full bg-white border border-[#E5E7EB] text-[10px] font-mono font-bold flex items-center justify-center text-[#64748B]">
                      {colProjects.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px]">
                  {colProjects.map((prj) => (
                    <div
                      key={prj.id}
                      onClick={() => setSelectedProject(prj)}
                      className="bg-white p-4 rounded-xl border border-[#E5E7EB] hover:border-[#00B82E]/50 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#00B82E] font-bold">
                          {prj.category}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            prj.priority === 'urgent'
                              ? 'bg-red-50 text-red-600'
                              : prj.priority === 'high'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {prj.priority}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#111827] leading-snug">{prj.name}</h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{prj.client_name}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
                          <span>Progress</span>
                          <span className="font-bold text-[#00B82E]">{prj.progress}%</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#00B82E] h-full rounded-full transition-all"
                            style={{ width: `${prj.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                        <span className="font-bold text-[#111827]">₦{prj.budget.toLocaleString()}</span>
                        <span>Due {prj.expected_delivery}</span>
                      </div>
                    </div>
                  ))}

                  {colProjects.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#94A3B8]">
                      No projects here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW 2: TABLE LIST */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] font-mono text-[10px] uppercase">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Client</th>
                <th className="p-4">Category</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4 font-bold text-[#111827]">{p.name}</td>
                  <td className="p-4 text-[#64748B]">{p.client_name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#00B82E] font-bold text-[10px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-[#111827]">₦{p.budget.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#00B82E] h-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[#00B82E]">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as Project['status'])}
                      className="px-2 py-1 rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-semibold text-[#111827]"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="testing">Testing</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </td>
                  <td className="p-4 font-mono text-[#64748B]">{p.expected_delivery}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(p)}
                      className="text-xs font-semibold text-[#00B82E] hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#111827]">Create New Automation Project</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="size-7 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meta Ads to Telegram Auto-Funnel"
                  className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3.5 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Project['category'])}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="WhatsApp Automation">WhatsApp Automation</option>
                    <option value="Payment & Invoicing">Payment & Invoicing</option>
                    <option value="Logistics & Dispatch">Logistics & Dispatch</option>
                    <option value="Social & Ads">Social & Ads</option>
                    <option value="Spreadsheet & CRM Sync">Spreadsheet & CRM Sync</option>
                    <option value="Custom Workflow">Custom Workflow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Budget (₦) *</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Project['priority'])}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E5E7EB] px-3 text-xs font-mono text-[#111827] focus:border-[#00B82E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">Scope Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the operational workflow, webhooks, and deliverables..."
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:border-[#00B82E] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {creating ? 'Creating...' : 'Launch Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT DETAILS & MANAGE MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#00B82E] font-bold">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs font-bold text-[#64748B]">{selectedProject.client_name}</span>
                </div>
                <h3 className="text-lg font-bold text-[#111827] mt-1">{selectedProject.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="size-8 rounded-lg text-[#64748B] hover:text-[#111827] flex items-center justify-center cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs">
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-mono">Budget</span>
                <div className="font-mono font-bold text-sm text-[#111827]">₦{selectedProject.budget.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-mono">Status</span>
                <div className="font-bold text-[#00B82E] capitalize">{selectedProject.status.replace('_', ' ')}</div>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-mono">Delivery Due</span>
                <div className="font-mono font-bold text-[#111827]">{selectedProject.expected_delivery}</div>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#111827]">Implementation Progress</span>
                <span className="text-[#00B82E] font-mono">{selectedProject.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedProject.progress}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setSelectedProject({ ...selectedProject, progress: val })
                  handleProgressChange(selectedProject.id, val)
                }}
                className="w-full accent-[#00B82E] cursor-pointer"
              />
            </div>

            {/* Tasks & Milestones */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
                Key Deliverables & Milestones
              </h4>
              <div className="space-y-2">
                {selectedProject.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] bg-white text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`size-4 ${m.status === 'completed' ? 'text-[#00B82E]' : 'text-slate-300'}`}
                      />
                      <span className="font-semibold text-[#111827]">{m.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B]">Due {m.due_date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="text-xs text-[#64748B]">
                Assigned Lead: <strong className="text-[#111827]">{selectedProject.assigned_to}</strong>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
