'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthState } from '@/lib/auth'

export default function DashHeader() {
  const { user } = useAuthState()

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
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
            <span className="text-xs hidden sm:block" style={{ color: 'var(--muted)' }}>AI Online</span>
          </div>

          {/* User Avatar / Settings */}
          <Link href="/dash/settings" className="p-1" style={{ color: 'var(--muted)' }}>
            {user?.photoURL ? (
              <Image src={user.photoURL} alt="Profile" width={28} height={28} className="rounded-full" />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--surface2)', color: 'var(--cyan)' }}
              >
                {(user?.displayName || user?.email || '?')[0]?.toUpperCase() ?? '?'}
              </div>
            )}
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
