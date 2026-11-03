import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MessageSquare, X, Send, Minimize2, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { supabase, TABLE } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { ZhenbotChatMessage, ZhenbotChatThread } from '@/types/database'
import { cn } from '@/lib/utils'
import { sendChatAlertToAdmin } from '@/lib/email'
import { trackClick } from '@/lib/analytics'

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
      const existingThreadId = localStorage.getItem('zhenbot_chat_thread_id')

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

  const startConversation = async (e: FormEvent) => {
    e.preventDefault()

    const name = profile?.full_name || guestName || 'Guest User'
    const email = profile?.email || guestEmail || null

    // Create a new thread
    const { data: newThread, error } = await supabase
      .from(TABLE.chatThreads)
      .insert({
        user_id: user?.id || null,
        user_name: name,
        user_email: email,
        status: 'open',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !newThread) {
      console.error('Failed to start chat thread:', error)
      return
    }

    // Set initial welcome message from admin
    await supabase.from(TABLE.chatMessages).insert({
      thread_id: newThread.id,
      sender_name: 'Zhenbot Automation',
      sender_role: 'admin',
      message: `Hello ${name}! Welcome to Zhenbot. What business process would you like to automate today?`,
    })

    setThread(newThread)
    localStorage.setItem('zhenbot_chat_thread_id', newThread.id)
    setHasStarted(true)
    void trackClick('chat_conversation_started', {
      section: 'live_chat',
      metadata: { name, email },
    })
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !thread?.id || sending) return

    setSending(true)
    const messageText = text.trim()
    setText('')

    const senderName = profile?.full_name || thread.user_name || 'Guest'

    // Optimistic UI could be added, but Supabase insert is fast enough
    const { error } = await supabase.from(TABLE.chatMessages).insert({
      thread_id: thread.id,
      sender_name: senderName,
      sender_role: 'user',
      message: messageText,
    })

    if (!error) {
      // Update thread last_message_at
      await supabase
        .from(TABLE.chatThreads)
        .update({ last_message_at: new Date().toISOString(), status: 'open' })
        .eq('id', thread.id)

      // Alert admin email
      void sendChatAlertToAdmin({
        userName: senderName,
        userEmail: profile?.email || thread.user_email || undefined,
        message: messageText,
        threadId: thread.id,
      })

      void trackClick('chat_message_sent', {
        section: 'live_chat',
        metadata: { thread_id: thread.id },
      })
    }

    setSending(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Pill / Bubble - Redesigned to Match Zhenbot Design Sense */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true)
            void trackClick('click_open_live_chat_bubble', { section: 'floating_chat' })
          }}
          className="group relative flex items-center gap-3 h-13 pl-3 pr-4.5 rounded-full bg-white text-[#111827] shadow-[0_10px_35px_rgba(0,184,46,0.18),0_2px_8px_rgba(0,0,0,0.06)] border border-[#E5E7EB] hover:border-[#00B82E]/50 hover:bg-[#F0FDF4]/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          aria-label="Open Live Chat"
        >
          {/* Green Pulse Orb */}
          <div className="relative flex size-8 items-center justify-center rounded-full bg-[#00B82E] text-white shrink-0 shadow-xs">
            <MessageSquare className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B82E] opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#00B82E] ring-2 ring-white" />
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold leading-tight text-[#111827] group-hover:text-[#00B82E] transition-colors">
              Chat with Zhenbot
            </span>
            <span className="text-[10px] text-[#64748B] leading-tight flex items-center gap-1 mt-0.5">
              <span className="size-1.5 rounded-full bg-[#00B82E] inline-block animate-pulse" />
              <span>We reply in minutes</span>
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-[#00B82E] text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="flex h-[550px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_20px_60px_rgba(17,24,39,0.14)] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header - Zhenbot Modern Clean Design */}
          <div className="border-b border-[#E5E7EB] bg-white text-[#111827] px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#00B82E] border border-[#00B82E]/20">
                  <Sparkles className="size-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#00B82E] ring-2 ring-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827] leading-tight">
                    Zhenbot Automation Support
                  </h4>
                  <p className="text-xs text-[#00B82E] font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block size-1.5 rounded-full bg-[#00B82E]" />
                    <span>Live · Replies in minutes</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827] transition-colors cursor-pointer"
                  aria-label="Minimize Chat"
                >
                  <Minimize2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827] transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Quick Telegram Jump */}
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
              <span className="text-[#64748B] text-[11px]">Need 24/7 assistance?</span>
              <a
                href="https://t.me/zhenautomation_bot"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void trackClick('click_chat_header_telegram', { section: 'chat_header' })}
                className="inline-flex items-center gap-1.5 text-[#00B82E] hover:text-[#008F27] font-semibold text-[11px] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#00B82E]/20 transition-colors"
              >
                <Send className="size-3" />
                <span>Telegram Bot</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* Body Content */}
          {!hasStarted ? (
            <div className="flex flex-1 flex-col justify-center p-6 text-center bg-[#F8FAFC]">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#00B82E] border border-[#00B82E]/20 mb-3.5">
                <MessageSquare className="size-6" />
              </div>
              <h5 className="text-base font-bold text-[#111827]">
                Start a Conversation
              </h5>
              <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed max-w-[280px] mx-auto">
                Have questions about automating your business processes, social channels, or workflows? Chat directly with our team.
              </p>

              <form onSubmit={startConversation} className="mt-6 space-y-3.5 text-left bg-white p-5 rounded-xl border border-[#E5E7EB]">
                {!user && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Alex Bello"
                        className="w-full h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs text-[#111827] placeholder:text-[#64748B]/50 focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs text-[#111827] placeholder:text-[#64748B]/50 focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#00B82E] hover:bg-[#008F27] text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                >
                  Start Conversation
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                {messages.map((m) => {
                  const isUser = m.sender_role === 'user'
                  return (
                    <div
                      key={m.id}
                      className={cn('flex flex-col max-w-[82%]', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}
                    >
                      <span className="text-[10px] text-[#64748B] mb-1 px-1">
                        {m.sender_name}
                      </span>
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs',
                          isUser
                            ? 'bg-[#00B82E] text-white font-medium rounded-tr-xs'
                            : 'border border-[#E5E7EB] bg-white text-[#111827] rounded-tl-xs',
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
              <form onSubmit={handleSendMessage} className="border-t border-[#E5E7EB] bg-white p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 h-10 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs text-[#111827] placeholder:text-[#64748B]/60 focus:border-[#00B82E] focus:ring-2 focus:ring-[#00B82E]/10 focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#00B82E] hover:bg-[#008F27] text-white transition-all disabled:opacity-40 shadow-xs cursor-pointer"
                  >
                    {sending ? <Loader2 className="size-4 animate-spin text-white" /> : <Send className="size-4" />}
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
