'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/lib/auth'
import Image from 'next/image'

export default function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, loading } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="relative mb-6">
          <Image src="/favicon.ico" alt="Dr Mochanic" width={56} height={56} className="animate-float" />
          <div className="absolute inset-0 rounded-full animate-pulseRing" style={{ background: 'rgba(0,220,240,0.2)' }} />
        </div>
        <p className="font-orbitron text-sm" style={{ color: 'var(--cyan)' }}>Dr Mochanic&apos;s Dash</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
