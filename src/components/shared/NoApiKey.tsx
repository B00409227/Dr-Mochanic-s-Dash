'use client'
import Link from 'next/link'

interface NoApiKeyProps {
  compact?: boolean
}

export default function NoApiKey({ compact = false }: NoApiKeyProps) {
  if (compact) {
    return (
      <div
        className="flex items-center justify-between gap-3 p-3 rounded-lg text-sm"
        style={{ background: 'rgba(0,220,240,0.06)', border: '1px solid rgba(0,220,240,0.2)' }}
      >
        <p style={{ color: 'var(--muted)' }}>
          Add your free Gemini API key to unlock AI features.
        </p>
        <Link
          href="/dash/settings"
          className="font-rajdhani font-bold text-sm flex-shrink-0 px-3 py-1 rounded"
          style={{ background: 'var(--cyan)', color: '#010312' }}
        >
          Settings
        </Link>
      </div>
    )
  }

  return (
    <div
      className="card rounded-xl p-6 text-center space-y-4 max-w-md mx-auto"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(0,220,240,0.1)', border: '1px solid var(--border)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--cyan)' }}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h3 className="font-rajdhani font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
          AI Features Need a Key
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          To use AI features you need a free Gemini API key. Get yours free at{' '}
          <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
            aistudio.google.com
          </a>{' '}
          — it takes 2 minutes.
        </p>
      </div>
      <Link
        href="/dash/settings"
        className="btn-cyan inline-block"
      >
        Go to Settings
      </Link>
    </div>
  )
}
