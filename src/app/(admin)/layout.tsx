'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthState } from '@/lib/auth'
import { getUserProfile } from '@/lib/firebase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState()
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      if (!loading) {
        if (!user) { router.replace('/login'); return }
        const profile = await getUserProfile(user.uid)
        if (profile?.role !== 'admin') { router.replace('/dash'); return }
        setIsAdmin(true)
        setChecking(false)
      }
    }
    check()
  }, [user, loading, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <p className="font-orbitron text-sm" style={{ color: 'var(--cyan)' }}>Checking access...</p>
      </div>
    )
  }

  if (!isAdmin) return null

  const navLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/blog', label: 'Blog' },
    { href: '/admin/faults', label: 'Fault Intel' },
    { href: '/dash', label: '← Back to App' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Admin Nav */}
      <nav className="sticky top-0 z-40 px-4 h-14 flex items-center gap-4 overflow-x-auto" style={{ background: 'rgba(1,3,18,0.95)', borderBottom: '1px solid rgba(255,36,41,0.2)', backdropFilter: 'blur(16px)' }}>
        <span className="font-orbitron text-sm font-bold mr-4 shrink-0" style={{ color: '#ff2429' }}>ADMIN</span>
        {navLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm font-rajdhani font-bold transition-colors hover:opacity-80 shrink-0"
            style={{ color: pathname === l.href ? 'var(--cyan)' : 'var(--muted)' }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}
