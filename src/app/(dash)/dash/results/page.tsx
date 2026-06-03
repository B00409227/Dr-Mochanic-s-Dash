'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ScanResult } from '@/types'
import { saveScan } from '@/lib/storage'
import HealthGauge from '@/components/shared/HealthGauge'
import WarningCard from '@/components/shared/WarningCard'
import TypewriterText from '@/components/shared/TypewriterText'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScanResult | null>(null)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('drm_last_scan')
      if (!raw) { router.push('/dash/scan'); return }
      const data = JSON.parse(raw) as ScanResult
      setResult(data)
      saveScan(data)
    } catch {
      router.push('/dash/scan')
    }
  }, [router])

  async function handleShare() {
    if (!shareRef.current) return
    try {
      // @ts-ignore
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareRef.current, { backgroundColor: '#010312', scale: 2 })
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'rgba(0,220,240,0.5)'
        ctx.font = '14px Rajdhani'
        ctx.fillText('Diagnosed by Dr Mochanic\'s Dash | drmochanic.co.uk', 12, canvas.height - 12)
      }
      const link = document.createElement('a')
      link.download = 'dr-mochanic-scan.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Image saved!')
    } catch {
      toast.error('Share failed — try again')
    }
  }

  if (!result) return null

  const sorted = [...(result.lights || [])].sort((a, b) => {
    const order = { CRITICAL: 0, WARNING: 1, INFO: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div ref={shareRef} className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Scan Results</h1>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(result.timestamp).toLocaleString('en-GB')}</span>
        </div>

        <div className="card rounded-xl p-5 text-center">
          <HealthGauge score={result.healthScore} size={180} />
        </div>

        {result.summary && (
          <div className="card rounded-xl p-4">
            <p className="text-xs font-rajdhani font-bold mb-2" style={{ color: 'var(--muted)' }}>DR MOCHANIC SAYS:</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
              <TypewriterText text={result.summary} speed={20} />
            </p>
          </div>
        )}

        {result.immediateActions && result.immediateActions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-rajdhani font-bold" style={{ color: '#ff2429' }}>IMMEDIATE ACTIONS</p>
            {result.immediateActions.map((action, i) => (
              <div key={i} className="flex gap-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,36,41,0.08)', border: '1px solid rgba(255,36,41,0.2)', color: 'var(--text)' }}>
                <span style={{ color: '#ff2429', flexShrink: 0 }}>!</span>{action}
              </div>
            ))}
          </div>
        )}

        {sorted.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>WARNING LIGHTS ({sorted.length})</p>
            {sorted.map((light, i) => <WarningCard key={i} light={light} defaultExpanded={i === 0 && light.severity === 'CRITICAL'} />)}
          </div>
        )}

        {sorted.length === 0 && (
          <div className="card rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>No warning lights detected</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={handleShare} className="btn-outline w-full py-3">
          Share Results (Save as Image)
        </button>
        <a
          href="https://drmochanic.co.uk/book"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-red block text-center py-3"
        >
          Book a Repair at Dr Mochanic, Glasgow
        </a>
        <Link href="/dash/scan" className="btn-outline block text-center py-3">
          Scan Again
        </Link>
      </div>

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
