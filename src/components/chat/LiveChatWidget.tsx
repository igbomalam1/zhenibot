import { useEffect, useRef, useState } from 'react'
import { MessageSquare, X, Send, Bot, Minimize2, Loader2 } from 'lucide-react'
import { supabase, TABLE } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ZhenbotChatMessage, ZhenbotChatThread } from '@/types/database'
import { cn } from '@/lib/utils'
import { sendChatAlertToAdmin } from '@/lib/email'

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

      // Alert admin email blessedjohnny2552@gmail.com
      void sendChatAlertToAdmin({
        userName: senderName,
        userEmail: profile?.email || thread.user_email || undefined,
        message: messageText,
        threadId: thread.id,
      })
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
          className="group relative flex size-12 items-center justify-center rounded-xl border border-white/10 bg-[#13151A] text-[#FF5416] shadow-xl transition-all hover:border-[#FF5416]/50"
          aria-label="Open Live Chat"
        >
          <MessageSquare className="size-5 transition-transform group-hover:scale-105" />
          <span className="absolute -top-1 -right-1 flex size-2.5">
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 flex size-4 items-center justify-center rounded-full bg-[#FF5416] font-mono text-[9px] font-bold text-white tnum">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B0C0E] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-[#13151A] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#181A21] text-[#FF5416]">
                <Bot className="size-4" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-[#13151A]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F4F5F7] tracking-tight">
                  Zhen Operations AI
                </h4>
                <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">
                  Online · 24/7 Operations triage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded text-[#8F95A3] hover:bg-white/5 hover:text-[#F4F5F7] transition-colors"
                aria-label="Minimize Chat"
              >
                <Minimize2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-7 items-center justify-center rounded text-[#8F95A3] hover:bg-white/5 hover:text-[#F4F5F7] transition-colors"
                aria-label="Close Chat"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!hasStarted ? (
            <div className="flex flex-1 flex-col justify-center p-6 text-center">
              <div className="mx-auto flex size-11 items-center justify-center rounded-lg border border-white/10 bg-[#13151A] text-[#FF5416] mb-3">
                <MessageSquare className="size-5" />
              </div>
              <h5 className="text-sm font-semibold text-[#F4F5F7]">Consult operations AI</h5>
              <p className="mt-1 text-xs text-[#8F95A3] leading-relaxed">
                Have questions about email triage, dispatching local bike couriers, or configuring custom automations? Chat with our team.
              </p>

              <form onSubmit={startConversation} className="mt-5 space-y-3 text-left">
                {!user && (
                  <>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8F95A3] mb-1">
                        Your name
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Alex Smith"
                        className="w-full rounded-lg border border-white/10 bg-[#13151A] px-3 py-2 text-xs text-[#F4F5F7] placeholder-[#545A67] focus:border-[#FF5416] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8F95A3] mb-1">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full rounded-lg border border-white/10 bg-[#13151A] px-3 py-2 text-xs text-[#F4F5F7] placeholder-[#545A67] focus:border-[#FF5416] focus:outline-none"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#FF5416] hover:bg-[#E0480F] py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Start conversation
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
                      <span className="font-mono text-[9px] text-[#545A67] mb-1 px-1">
                        {m.sender_name}
                      </span>
                      <div
                        className={cn(
                          'rounded-lg px-3.5 py-2.5 text-xs leading-relaxed',
                          isUser
                            ? 'bg-[#FF5416] text-white font-medium'
                            : 'border border-white/8 bg-[#13151A] text-[#F4F5F7]',
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
              <form onSubmit={handleSendMessage} className="border-t border-white/8 bg-[#13151A] p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-xs text-[#F4F5F7] placeholder-[#545A67] focus:border-[#FF5416] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#FF5416] hover:bg-[#E0480F] text-white transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {sending ? <Loader2 className="size-4 animate-spin text-white" /> : <Send className="size-3.5" />}
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
