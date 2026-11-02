import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
} from 'lucide-react'
import { supabase, TABLE } from '@/lib/supabase'
import type { ZhenbotChatThread, ZhenbotChatMessage } from '@/types/database'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

interface AdminChatsProps {
  threads: ZhenbotChatThread[]
  onRefresh: () => void
}

export function AdminChats({ threads, onRefresh }: AdminChatsProps) {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'closed'>('all')
  const [selectedThread, setSelectedThread] = useState<ZhenbotChatThread | null>(threads[0] || null)
  const [messages, setMessages] = useState<ZhenbotChatMessage[]>([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load chat messages when thread is selected
  useEffect(() => {
    if (!selectedThread?.id) return

    const loadMessages = async () => {
      setLoadingMessages(true)
      const { data } = await supabase
        .from(TABLE.chatMessages)
        .select('*')
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
      setLoadingMessages(false)
      setTimeout(scrollToBottom, 100)

      // Mark unread_by_admin = false
      if (selectedThread.unread_by_admin) {
        await supabase
          .from(TABLE.chatThreads)
          .update({ unread_by_admin: false })
          .eq('id', selectedThread.id)
        onRefresh()
      }
    }

    void loadMessages()

    // Realtime subscription for incoming visitor messages
    const channel = supabase
      .channel(`admin_chat_${selectedThread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLE.chatMessages,
          filter: `thread_id=eq.${selectedThread.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ZhenbotChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
          setTimeout(scrollToBottom, 50)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [selectedThread?.id])

  const handleSendReply = async (e: FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedThread || sending) return

    setSending(true)
    const text = replyText.trim()
    setReplyText('')

    try {
      const { error } = await supabase.from(TABLE.chatMessages).insert({
        thread_id: selectedThread.id,
        sender_name: 'Zhenbot Admin',
        sender_role: 'admin',
        message: text,
      })

      if (error) {
        toast.error('Failed to send message: ' + error.message)
        return
      }

      await supabase
        .from(TABLE.chatThreads)
        .update({
          last_message: text,
          last_message_at: new Date().toISOString(),
          unread_by_user: true,
        })
        .eq('id', selectedThread.id)

      onRefresh()
    } finally {
      setSending(false)
    }
  }

  const handleUpdateStatus = async (status: 'open' | 'resolved' | 'closed') => {
    if (!selectedThread) return
    const { error } = await supabase
      .from(TABLE.chatThreads)
      .update({ status })
      .eq('id', selectedThread.id)

    if (!error) {
      toast.success(`Chat marked as ${status}`)
      setSelectedThread({ ...selectedThread, status })
      onRefresh()
    }
  }

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      t.last_message?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || t.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row">
      {/* LEFT PANEL: THREAD LIST (w-full md:w-80 lg:w-96) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-[#E5E7EB] flex flex-col h-full bg-[#F8FAFC]">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-[#E5E7EB] bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111827]">Live Conversations</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#00B82E] font-bold">
              {threads.filter((t) => t.unread_by_admin).length} unread
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-8.5 pr-3 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {(['all', 'open', 'resolved', 'closed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer shrink-0',
                  filter === st
                    ? 'bg-[#00B82E] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#111827]',
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
          {filteredThreads.map((t) => {
            const isSelected = selectedThread?.id === t.id
            return (
              <div
                key={t.id}
                onClick={() => setSelectedThread(t)}
                className={cn(
                  'p-4 transition-all cursor-pointer relative',
                  isSelected ? 'bg-white shadow-xs' : 'hover:bg-white/80',
                  t.unread_by_admin && 'bg-[#F0FDF4]',
                )}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#00B82E]" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-xs text-[#111827] truncate">
                      {t.user_name || 'Guest Visitor'}
                    </span>
                    {t.unread_by_admin && (
                      <span className="size-2 rounded-full bg-[#00B82E] shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                    {t.last_message_at
                      ? new Date(t.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>

                <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                  {t.last_message || 'Started a new conversation'}
                </p>

                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-[#64748B] truncate max-w-[140px]">
                    {t.user_email || 'No email provided'}
                  </span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                      t.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700'
                        : t.status === 'resolved'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            )
          })}

          {filteredThreads.length === 0 && (
            <div className="py-12 text-center text-xs text-[#64748B]">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: CHAT THREAD & COMPOSER */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {selectedThread ? (
          <>
            {/* Thread Header */}
            <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#F0FDF4] text-[#00B82E] font-bold text-sm flex items-center justify-center">
                  {(selectedThread.user_name || 'G').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">
                    {selectedThread.user_name || 'Guest Visitor'}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>{selectedThread.user_email || 'No email'}</span>
                    <span>•</span>
                    <span className="text-[#00B82E] font-medium capitalize">{selectedThread.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('resolved')}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F0FDF4] text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('closed')}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F8FAFC] text-xs font-semibold text-[#64748B] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
              {loadingMessages ? (
                <div className="py-12 text-center">
                  <Loader2 className="size-6 animate-spin text-[#00B82E] mx-auto" />
                </div>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.sender_role === 'admin'
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col max-w-[75%]',
                        isAdmin ? 'ml-auto items-end' : 'mr-auto items-start',
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#64748B]">
                        <span className="font-semibold text-[#111827]">{m.sender_name}</span>
                        <span>•</span>
                        <span>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs',
                          isAdmin
                            ? 'bg-[#00B82E] text-white font-medium rounded-tr-xs'
                            : 'bg-white border border-[#E5E7EB] text-[#111827] rounded-tl-xs',
                        )}
                      >
                        {m.message}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#E5E7EB] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type an instant reply to visitor on website..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 h-11 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 text-xs text-[#111827] focus:bg-white focus:border-[#00B82E] focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="h-11 px-5 rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  <span>Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#64748B]">
            <MessageSquare className="size-10 text-[#CBD5E1] mb-2" />
            <p className="text-xs">Select a conversation on the left to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  )
}
