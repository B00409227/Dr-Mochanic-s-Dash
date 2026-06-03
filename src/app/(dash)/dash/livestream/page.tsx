'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LivestreamPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/dash/obd2') }, [router])
  return (
    <div className="flex items-center justify-center h-64">
      <p style={{ color: 'var(--muted)' }}>Redirecting to OBD2 Live Tuning...</p>
    </div>
  )
}
