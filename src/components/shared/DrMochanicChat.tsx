'use client'
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ChatMessage } from '@/types'
import { chatWithDrMochanic } from '@/lib/gemini'
import { getChatHistory, saveChatMessage, clearChatHistory } from '@/lib/storage'

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Alright, I'm Dr Mochanic! Got a warning light on, strange noise, or just want to know if your car is safe to drive? Fire away — I'm here to help.",
  timestamp: Date.now(),
}

const QUICK_REPLIES = ['Warning light on', 'OBD2 code lookup', 'Strange noise', 'Is this quote fair?', 'App help']

export default function DrMochanicChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [hasUnread, setHasUnread] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const [userHasMessaged, setUserHasMessaged] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const history = getChatHistory()
    if (history.length === 0) {
      setMessages([WELCOME])
    } else {
      setMessages(history)
      const hasUser = history.some(m => m.role === 'user')
      setUserHasMessaged(hasUser)
    }
    const timer = setTimeout(() => setShowPulse(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  async function handleSend(text?: string) {
    const content = (text || inputValue).trim()
    if (!content) return

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    saveChatMessage(userMsg)
    setInputValue('')
    setIsTyping(true)
    setUserHasMessaged(true)

    try {
      const context = buildContext()
      const response = await chatWithDrMochanic(updatedMessages, context)
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: Date.now() }
      setMessages(prev => [...prev, assistantMsg])
      saveChatMessage(assistantMsg)
      if (!isOpen) setHasUnread(true)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      let content = "Something went wrong on my end — give it another try in a sec."
      if (errMsg === 'NO_API_KEY') {
        content = "You'll need to add your free Gemini API key in Settings before I can chat with you. Head to Settings and paste it in — takes about 2 minutes to get one from aistudio.google.com."
      }
      const errorMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content, timestamp: Date.now() }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  function buildContext(): string {
    const parts: string[] = [`Current page: ${pathname}`]
    try {
      const lastScan = sessionStorage.getItem('drm_last_scan')
      if (lastScan) parts.push(`Last scan: ${lastScan.slice(0, 500)}`)
      const lastObd2 = sessionStorage.getItem('drm_last_obd2')
      if (lastObd2) parts.push(`Last OBD2 code: ${lastObd2}`)
      const vehicles = localStorage.getItem('drm_vehicles')
      if (vehicles) {
        const parsed = JSON.parse(vehicles)
        if (parsed.length > 0) parts.push(`Saved vehicles: ${parsed.slice(0, 3).map((v: { year: string; make: string; model: string }) => `${v.year} ${v.make} ${v.model}`).join(', ')}`)
      }
    } catch {}
    return parts.join('. ')
  }

  function handleClearChat() {
    if (window.confirm('Clear all chat history?')) {
      clearChatHistory()
      setMessages([WELCOME])
      setUserHasMessaged(false)
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-[9999]" style={{ zIndex: 9999 }}>
        {showPulse && !isOpen && (
          <>
            <div className="absolute inset-0 rounded-full animate-pulseRing" style={{ background: 'var(--cyan)', opacity: 0.3 }} />
            <div className="absolute inset-0 rounded-full animate-pulseRing" style={{ background: 'var(--cyan)', opacity: 0.2, animationDelay: '0.5s' }} />
          </>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: 'var(--cyan)', color: '#010312' }}
          title="Chat with Dr Mochanic"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: '#ff2429' }} />
          )}
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9998] flex flex-col"
            style={{
              bottom: '96px',
              right: '24px',
              width: '384px',
              height: '520px',
              background: '#010312',
              border: '1px solid rgba(0,220,240,0.2)',
              borderRadius: '16px',
              boxShadow: '0 0 40px rgba(0,220,240,0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--cyan)', color: '#010312' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-rajdhani font-bold text-base" style={{ color: 'var(--text)' }}>Dr Mochanic</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Online · 12 yrs experience</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={handleClearChat} className="p-1.5 rounded hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }} title="Clear chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[80%] px-4 py-2 text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'user' ? 'var(--cyan)' : 'var(--surface)',
                      color: msg.role === 'user' ? '#010312' : 'var(--text)',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {!userHasMessaged && messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_REPLIES.map(reply => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                      style={{ background: 'var(--surface2)', color: 'var(--cyan)', border: '1px solid rgba(0,220,240,0.2)' }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center" style={{ background: 'var(--surface)' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--cyan)', animationDelay: `${d}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask Dr Mochanic anything..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                  style={{ background: 'var(--cyan)', color: '#010312' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
