'use client'
import { useState, useEffect, useRef } from 'react'
import type { ChatMessage } from '@/types'
import { chatWithDrMochanic } from '@/lib/gemini'
import { getChatHistory, saveChatMessage, clearChatHistory } from '@/lib/storage'
import Link from 'next/link'

const SUGGESTED = [
  'My check engine light is on — what should I do?',
  'How do I know if my brakes need replacing?',
  "What does the oil pressure warning light mean?",
  'Is it safe to drive with a flashing warning light?',
  'How often should I service my car?',
  'What is an OBD2 code?',
  "My car is making a knocking noise — what could it be?",
  "Can I check my tyre tread at home?",
]

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Alright, I'm Dr Mochanic! Got a warning light on, strange noise, or want advice on your car? Ask me anything — I'm here to help.",
  timestamp: Date.now(),
}

export default function WebsiteChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
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
    try {
      const response = await chatWithDrMochanic(updated, `Website chat page`)
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: Date.now() }
      setMessages(prev => [...prev, assistantMsg])
      saveChatMessage(assistantMsg)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      const content = msg === 'NO_API_KEY'
        ? "To use the chat you need a free Gemini API key. Open Dr Mochanic's Dash app and add your key in Settings. Get one free at aistudio.google.com."
        : "Something went wrong — try again in a sec."
      const errorMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content, timestamp: Date.now() }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-6">
        <h1 className="font-orbitron text-2xl sm:text-3xl mb-2" style={{ color: 'var(--text)' }}>
          Meet <span style={{ color: 'var(--cyan)' }}>Dr Mochanic</span>
        </h1>
        <p className="font-rajdhani text-lg" style={{ color: 'var(--muted)' }}>Your AI Mechanic — Available 24/7</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block space-y-3">
          <p className="text-xs font-rajdhani font-bold uppercase" style={{ color: 'var(--muted)' }}>Suggested Questions</p>
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="w-full text-left text-xs p-3 rounded-lg hover:opacity-80 transition-opacity"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              {q}
            </button>
          ))}
          <div className="pt-2">
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Need a proper repair?</p>
            <Link href="/book" className="btn-red block text-center text-sm py-2">Book at Dr Mochanic</Link>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-3 flex flex-col" style={{ height: '60vh' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 rounded-t-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] px-4 py-2 text-sm leading-relaxed"
                  style={{
                    background: m.role === 'user' ? 'var(--cyan)' : 'var(--surface2)',
                    color: m.role === 'user' ? '#010312' : 'var(--text)',
                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--cyan)', animationDelay: `${d}s` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex gap-2 p-3 rounded-b-xl" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Dr Mochanic anything..."
              className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 rounded-lg font-rajdhani font-bold text-sm disabled:opacity-40"
              style={{ background: 'var(--cyan)', color: '#010312' }}
            >
              Send
            </button>
            <button
              onClick={() => { if (window.confirm('Clear chat?')) { clearChatHistory(); setMessages([WELCOME]) } }}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
