'use client'
import { useState, useEffect, useRef } from 'react'
import type { ChatMessage } from '@/types'
import { chatWithDrMochanic } from '@/lib/gemini'
import { getChatHistory, saveChatMessage, clearChatHistory } from '@/lib/storage'
import NoApiKey from '@/components/shared/NoApiKey'

const SUGGESTED = [
  'My check engine light is on',
  'How do I know if my brakes need replacing?',
  'What does P0420 mean?',
  'Is my repair quote fair?',
  'When should I service my car?',
  'What is an OBD2 dongle?',
  'My car is making a knocking noise',
  'How do I check tyre tread?',
]

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Alright, I'm Dr Mochanic! Ask me anything about your car — warning lights, strange noises, repair costs, DIY fixes. I'm here to help.",
  timestamp: Date.now(),
}

export default function DashChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const history = getChatHistory()
    setMessages(history.length > 0 ? history : [WELCOME])
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  async function sendMessage(text?: string) {
    const content = (text || input).trim()
    if (!content) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    saveChatMessage(userMsg)
    setInput('')
    setIsTyping(true)
    setNoKey(false)
    try {
      const response = await chatWithDrMochanic(updated, 'Dr Mochanic Dash app - chat page')
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: Date.now() }
      setMessages(prev => [...prev, assistantMsg])
      saveChatMessage(assistantMsg)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'NO_API_KEY') {
        setNoKey(true)
        const m: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: "Add your free Gemini API key in Settings to chat with me.", timestamp: Date.now() }
        setMessages(prev => [...prev, m])
      } else {
        const m: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: "Something went wrong — try again in a sec.", timestamp: Date.now() }
        setMessages(prev => [...prev, m])
      }
    } finally { setIsTyping(false) }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] px-4 pt-4 pb-0 gap-4 max-w-4xl mx-auto">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-48 flex-shrink-0 gap-2 pt-1">
        <p className="text-xs font-rajdhani font-bold uppercase" style={{ color: 'var(--muted)' }}>Ask about...</p>
        {SUGGESTED.map(q => (
          <button key={q} onClick={() => sendMessage(q)} className="text-left text-xs p-2 rounded-lg hover:opacity-80 transition-opacity" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {noKey && <div className="mb-3"><NoApiKey compact /></div>}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--cyan)', color: '#010312' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>Dr Mochanic</p>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><p className="text-xs" style={{ color: 'var(--muted)' }}>Online</p></div>
            </div>
          </div>
          <button onClick={() => { if (window.confirm('Clear chat?')) { clearChatHistory(); setMessages([WELCOME]) } }} className="text-xs p-1.5 rounded" style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>Clear</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 py-2">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%] px-4 py-2 text-sm leading-relaxed"
                style={{
                  background: m.role === 'user' ? 'var(--cyan)' : 'var(--surface)',
                  color: m.role === 'user' ? '#010312' : 'var(--text)',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {[0, 0.2, 0.4].map((d, i) => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--cyan)', animationDelay: `${d}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Dr Mochanic anything..."
              className="flex-1 text-sm px-3 py-2.5 rounded-lg outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-40" style={{ background: 'var(--cyan)', color: '#010312' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
