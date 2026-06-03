'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function DashHeader() {
  const [hasKey, setHasKey] = useState(false)

  useEffect(() => {
    const key = localStorage.getItem('drm_gemini_key')
    setHasKey(!!key)
  }, [])

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(1,3,18,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/dash" className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Dr Mochanic" width={28} height={28} />
          <span
            className="font-orbitron font-bold text-sm"
            style={{ color: 'var(--cyan)', textShadow: '0 0 12px rgba(0,220,240,0.4)' }}
          >
            Dr Mochanic&apos;s Dash
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* AI status */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-400' : 'bg-red-500'}`} />
            <span className="text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>
              {hasKey ? 'AI Ready' : 'No API Key'}
            </span>
          </div>

          {/* Settings */}
          <Link href="/dash/settings" className="p-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>

          {/* Chat */}
          <Link href="/dash/chat" className="p-2 rounded-lg hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
