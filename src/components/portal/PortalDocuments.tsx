import { useState } from 'react'
import {
  FileText,
  Download,
  Upload,
  Search,
  X,
  Lock,
} from 'lucide-react'
import type { ClientDocument } from '@/lib/portalStore'
import { portalStore } from '@/lib/portalStore'
import { useToast } from '@/contexts/ToastContext'

interface PortalDocumentsProps {
  documents: ClientDocument[]
  clientId: string
  companyName: string
  onRefresh: () => void
}

export function PortalDocuments({
  documents,
  clientId,
  companyName,
  onRefresh,
}: PortalDocumentsProps) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [docCategory, setDocCategory] = useState<ClientDocument['category']>('Specification')
  const [fileName, setFileName] = useState('')

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!docTitle.trim() || !fileName.trim()) {
      toast.error('Please enter a document title and file name.')
      return
    }

    portalStore.addDocument({
      client_id: clientId,
      title: docTitle.trim(),
      category: docCategory,
      file_name: fileName.trim(),
      file_size: '1.2 MB',
      uploaded_by: companyName,
    })

    toast.success('Document uploaded and shared with Zhenbot team!')
    setIsUploadOpen(false)
    setDocTitle('')
    setFileName('')
    onRefresh()
  }

  const handleDownload = (doc: ClientDocument) => {
    toast.success(`Downloading "${doc.file_name}"...`)
  }

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.file_name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || d.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Contract">Contracts & Legal</option>
            <option value="Specification">Technical Specs</option>
            <option value="Deliverable">Project Deliverables</option>
            <option value="Guide">User & Staff Guides</option>
            <option value="Proposal">Proposals</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="h-9 px-4 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <Upload className="size-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#00B82E]/30 flex items-center gap-2.5 text-xs text-[#15803D]">
        <Lock className="size-4 shrink-0" />
        <span>
          End-to-end encrypted repository. All contracts, technical specifications, and files are isolated strictly to {companyName}.
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#00B82E]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="size-10 rounded-xl bg-[#EFF6FF] text-[#0090FE] flex items-center justify-center">
                  <FileText className="size-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                  {doc.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2">
                  {doc.title}
                </h3>
                <div className="text-xs text-[#64748B] font-mono mt-1 truncate">
                  {doc.file_name}
                </div>
              </div>

              <div className="text-[11px] text-[#94A3B8] space-y-0.5">
                <div>Uploaded by: {doc.uploaded_by}</div>
                <div>Size: {doc.file_size} • {new Date(doc.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => handleDownload(doc)}
                className="w-full h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="size-3.5 text-[#00B82E]" />
                <span>Download Secure File</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-[#E5E7EB] text-center text-xs text-[#64748B]">
          No documents match your query.
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#111827]">Upload to Workspace</h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="size-7 rounded-lg hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Brand Assets & Logo Pack"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                >
                  <option value="Specification">Technical Specification</option>
                  <option value="Contract">Contract & SLA</option>
                  <option value="Deliverable">Project Deliverable</option>
                  <option value="Guide">User Guide</option>
                  <option value="Report">Report</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111827]">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. brand_assets_2026.zip or specs.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs text-[#111827] focus:outline-none focus:border-[#00B82E]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
