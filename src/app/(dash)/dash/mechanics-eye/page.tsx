'use client'
import { useState } from 'react'
import { analyseInspectionPhotos } from '@/lib/gemini'
import type { InspectionResult } from '@/types'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import TypewriterText from '@/components/shared/TypewriterText'
import toast from 'react-hot-toast'

const SLOTS = ['Front', 'Rear', 'Driver Side', 'Passenger Side', 'Engine Bay', 'FL Tyre', 'FR Tyre', 'RL Tyre', 'RR Tyre', 'Brake Disc', 'Exhaust', 'Underbody']

function severityColor(s: string) {
  if (s === 'CRITICAL') return '#ff2429'
  if (s === 'WARNING') return '#f59e0b'
  if (s === 'PASS') return '#22c55e'
  return 'var(--cyan)'
}

export default function MechanicsEyePage() {
  const [photos, setPhotos] = useState<(string | null)[]>(Array(12).fill(null))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InspectionResult | null>(null)
  const [noKey, setNoKey] = useState(false)

  const captured = photos.filter(Boolean).length

  function handleFile(index: number, file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const b64 = (e.target?.result as string).replace(/^data:[^;]+;base64,/, '')
      setPhotos(prev => prev.map((p, i) => i === index ? b64 : p))
    }
    reader.readAsDataURL(file)
  }

  async function analyse() {
    const validPhotos = photos.filter((p): p is string => p !== null)
    if (validPhotos.length < 4) { toast.error('Add at least 4 photos'); return }
    setLoading(true)
    setNoKey(false)
    try {
      const r = await analyseInspectionPhotos(validPhotos)
      setResult(r)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else toast.error('Analysis failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {loading && <LoadingRadar text="Inspecting vehicle..." />}
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Mechanic&apos;s Eye</h1>
        <span className="text-sm font-rajdhani font-bold" style={{ color: 'var(--cyan)' }}>{captured}/12</span>
      </div>

      <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${(captured / 12) * 100}%`, background: 'var(--cyan)' }} />
      </div>

      {noKey && <NoApiKey compact />}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {SLOTS.map((slot, i) => (
          <div key={slot} className="relative" onClick={() => document.getElementById(`slot-${i}`)?.click()}>
            <input id={`slot-${i}`} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(i, f) }} />
            <div
              className="aspect-square rounded-xl cursor-pointer flex flex-col items-center justify-center overflow-hidden"
              style={{
                background: photos[i] ? 'transparent' : 'var(--surface)',
                border: photos[i] ? 'none' : '1px dashed var(--border)',
              }}
            >
              {photos[i] ? (
                <img src={`data:image/jpeg;base64,${photos[i]}`} alt={slot} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <span className="text-lg mb-1">+</span>
                  <span className="text-[9px] text-center px-1" style={{ color: 'var(--muted)' }}>{slot}</span>
                </>
              )}
            </div>
            {photos[i] && (
              <div className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-bold" style={{ color: '#000', background: 'rgba(255,255,255,0.7)', borderRadius: 4 }}>{slot}</div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={analyse}
        disabled={captured < 4}
        className="btn-cyan w-full py-4 text-base font-bold disabled:opacity-40"
      >
        Analyse All ({captured} photos)
      </button>

      {result && (
        <div className="space-y-5">
          <div className="card rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-rajdhani font-bold text-xl" style={{ color: 'var(--text)' }}>Inspection Report</h2>
              <span className={`text-xs px-2 py-1 rounded font-bold ${result.readyForMOT ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
                MOT Ready: {result.readyForMOT ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Overall</p>
                <p className="font-orbitron font-bold text-xl" style={{ color: 'var(--cyan)' }}>{result.overallCondition}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>MOT Risk Score</p>
                <p className="font-orbitron font-bold text-xl" style={{ color: result.motRiskScore > 50 ? '#ff2429' : result.motRiskScore > 25 ? '#f59e0b' : '#22c55e' }}>{result.motRiskScore}/100</p>
              </div>
            </div>
            {result.summary && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', opacity: 0.85 }}>
                <TypewriterText text={result.summary} />
              </p>
            )}
          </div>

          {result.immediateActions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-rajdhani font-bold" style={{ color: '#ff2429' }}>IMMEDIATE ACTIONS</p>
              {result.immediateActions.map((a, i) => (
                <div key={i} className="p-3 rounded-lg text-sm" style={{ background: 'rgba(255,36,41,0.08)', border: '1px solid rgba(255,36,41,0.2)', color: 'var(--text)' }}>{a}</div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>FINDINGS ({result.findings.length})</p>
            {[...result.findings].sort((a, b) => {
              const o: Record<string, number> = { CRITICAL: 0, WARNING: 1, INFO: 2, PASS: 3 }
              return (o[a.severity] ?? 4) - (o[b.severity] ?? 4)
            }).map((f, i) => (
              <div key={i} className="card rounded-xl p-4 space-y-2" style={{ borderLeft: `3px solid ${severityColor(f.severity)}` }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{f.area}</span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${severityColor(f.severity)}22`, color: severityColor(f.severity) }}>{f.severity}</span>
                    {f.willFailMOT && <span className="text-xs px-1.5 py-0.5 rounded bg-red-900/30 text-red-300 font-bold">MOT FAIL</span>}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>{f.finding}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{f.recommendation} — {f.estimatedCostGBP}</p>
              </div>
            ))}
          </div>

          <a href="https://drmochanic.co.uk/book" target="_blank" rel="noopener noreferrer" className="btn-red block text-center py-3">
            Book MOT at Dr Mochanic Glasgow
          </a>
          <button onClick={() => window.print()} className="btn-outline w-full py-3">Export as PDF</button>
        </div>
      )}

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
