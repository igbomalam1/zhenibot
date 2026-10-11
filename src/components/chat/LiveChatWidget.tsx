import { useEffect, useRef, useState } from 'react'
import { MessageSquare, X, Send, Bot, Minimize2, Loader2 } from 'lucide-react'
import { supabase, TABLE } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ZhenbotChatMessage, ZhenbotChatThread } from '@/types/database'
import { cn } from '@/lib/utils'

export function LiveChatWidget() {
  const { user, profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [thread, setThread] = useState<ZhenbotChatThread | null>(null)
  const [messages, setMessages] = useState<ZhenbotChatMessage[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Guest fields if user not logged in
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [hasStarted, setHasStarted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setUnreadCount(0)
    }
  }, [isOpen, messages])

  // Look for existing thread in localStorage or by user_id
  useEffect(() => {
    const initThread = async () => {
      let existingThreadId = localStorage.getItem('zhenbot_chat_thread_id')

      if (user?.id) {
        const { data } = await supabase
          .from(TABLE.chatThreads)
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (data) {
          setThread(data)
          localStorage.setItem('zhenbot_chat_thread_id', data.id)
          setHasStarted(true)
          return
        }
      }

      if (existingThreadId) {
        const { data } = await supabase
          .from(TABLE.chatThreads)
          .select('*')
          .eq('id', existingThreadId)
          .maybeSingle()

        if (data) {
          setThread(data)
          setHasStarted(true)
        }
      }
    }

    void initThread()
  }, [user?.id])

  // Fetch messages and subscribe to real-time updates
  useEffect(() => {
    if (!thread?.id) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from(TABLE.chatMessages)
        .select('*')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    void fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`chat_thread_${thread.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: TABLE.chatMessages,
          filter: `thread_id=eq.${thread.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ZhenbotChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          if (!isOpen && newMsg.sender_role === 'admin') {
            setUnreadCount((c) => c + 1)
          }
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [thread?.id, isOpen])

  const startConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = profile?.full_name || guestName.trim() || 'Visitor'
    const email = profile?.email || guestEmail.trim() || null

    const { data, error } = await supabase
      .from(TABLE.chatThreads)
      .insert({
        user_id: user?.id ?? null,
        user_name: name,
        user_email: email,
        last_message: 'Conversation started',
        unread_by_admin: true,
      })
      .select('*')
      .single()

    if (error || !data) return

    setThread(data)
    localStorage.setItem('zhenbot_chat_thread_id', data.id)
    setHasStarted(true)

    // Automated welcome bot message
    await supabase.from(TABLE.chatMessages).insert({
      thread_id: data.id,
      sender_role: 'admin',
      sender_name: 'Zhenbot Support',
      message: `Hello ${name}! Welcome to Zhenbot support. An agent or automated system is here to help with your deposits, withdrawals, and questions.`,
    })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !thread?.id || sending) return

    const messageText = text.trim()
    setText('')
    setSending(true)

    const senderName = profile?.full_name || thread.user_name || 'User'

    const { error } = await supabase.from(TABLE.chatMessages).insert({
      thread_id: thread.id,
      sender_role: 'user',
      sender_id: user?.id ?? null,
      sender_name: senderName,
      message: messageText,
    })

    if (!error) {
      await supabase
        .from(TABLE.chatThreads)
        .update({
          last_message: messageText,
          last_message_at: new Date().toISOString(),
          unread_by_admin: true,
        })
        .eq('id', thread.id)
    }

    setSending(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex size-14 items-center justify-center rounded-2xl border border-brand-400/40 bg-[#090b12] text-brand-400 shadow-2xl transition-all hover:scale-105 hover:border-brand-400 hover:shadow-brand-400/20"
          aria-label="Open Live Chat"
        >
          <MessageSquare className="size-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 flex size-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full bg-brand-400" />
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-emerald-500 font-mono text-[10px] font-extrabold text-obsidian-950">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#090b12] shadow-2xl animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-[#0c0f18] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-xl border border-brand-400/30 bg-[#121624] text-brand-400">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-brand-400 ring-2 ring-[#0c0f18]" />
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white tracking-tight">
                  Zhenbot Live Support
                </h4>
                <p className="font-mono text-[10px] text-brand-400 font-semibold uppercase">
                  Online · Instant Response
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Minimize Chat"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!hasStarted ? (
            <div className="flex flex-1 flex-col justify-center p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-brand-400/30 bg-brand-400/10 text-brand-400 mb-3">
                <MessageSquare className="size-6" />
              </div>
              <h5 className="text-base font-display font-bold text-white">Start a Conversation</h5>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Have questions about deposits, trading returns, or need technical help? Let us know.
              </p>

              <form onSubmit={startConversation} className="mt-5 space-y-3 text-left">
                {!user && (
                  <>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Alex Smith"
                        className="w-full rounded-lg border border-white/10 bg-[#121624] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="Optional"
                        className="w-full rounded-lg border border-white/10 bg-[#121624] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-400 py-2.5 font-display text-xs font-bold text-obsidian-950 transition-all hover:bg-brand-300"
                >
                  Start Live Chat
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isUser = m.sender_role === 'user'
                  return (
                    <div
                      key={m.id}
                      className={cn('flex flex-col max-w-[80%]', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}
                    >
                      <span className="font-mono text-[9px] text-slate-500 mb-1 px-1">
                        {m.sender_name}
                      </span>
                      <div
                        className={cn(
                          'rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                          isUser
                            ? 'bg-brand-400 text-obsidian-950 font-medium rounded-br-xs'
                            : 'border border-white/8 bg-[#121624] text-slate-200 rounded-bl-xs',
                        )}
                      >
                        {m.message}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="border-t border-white/8 bg-[#0c0f18] p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 rounded-xl border border-white/10 bg-[#121624] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-400 text-obsidian-950 transition-all hover:bg-brand-300 disabled:opacity-40"
                  >
                    {sending ? <Loader2 className="size-4 animate-spin text-obsidian-950" /> : <Send className="size-4" />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  )
}
