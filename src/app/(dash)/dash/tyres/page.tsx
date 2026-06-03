'use client'
import { useState } from 'react'
import { analyseTyrePhoto } from '@/lib/gemini'
import type { TyreResult } from '@/types'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import toast from 'react-hot-toast'

const TYRE_POSITIONS = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right']

function statusColor(s: TyreResult['status']) {
  if (s === 'SAFE') return '#22c55e'
  if (s === 'WARNING') return '#f59e0b'
  if (s === 'ILLEGAL' || s === 'BALD') return '#ff2429'
  return 'var(--cyan)'
}

export default function TyresPage() {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null])
  const [results, setResults] = useState<(TyreResult | null)[]>([null, null, null, null])
  const [loading, setLoading] = useState<boolean[]>([false, false, false, false])
  const [noKey, setNoKey] = useState(false)

  function handleFile(index: number, file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const b64 = (e.target?.result as string).replace(/^data:[^;]+;base64,/, '')
      setPhotos(prev => prev.map((p, i) => i === index ? b64 : p))
    }
    reader.readAsDataURL(file)
  }

  async function analyseOne(index: number) {
    const photo = photos[index]
    if (!photo) { toast.error('Add a photo first'); return }
    setLoading(prev => prev.map((l, i) => i === index ? true : l))
    setNoKey(false)
    try {
      const r = await analyseTyrePhoto(photo, TYRE_POSITIONS[index])
      setResults(prev => prev.map((res, i) => i === index ? r : res))
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else toast.error('Analysis failed')
    } finally {
      setLoading(prev => prev.map((l, i) => i === index ? false : l))
    }
  }

  const allDone = results.every(r => r !== null)
  const anyLoading = loading.some(Boolean)

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {anyLoading && <LoadingRadar text="Analysing tyre..." />}
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Tyre Tread Check</h1>
      {noKey && <NoApiKey compact />}

      <div className="card rounded-xl p-3 text-sm" style={{ color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--cyan)' }}>20p Coin Test:</strong> Insert a 20p coin into the tread groove. If you can see the outer band (~2mm), your tyres may need attention.
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TYRE_POSITIONS.map((pos, i) => (
          <div key={pos} className="card rounded-xl p-3 space-y-3">
            <p className="font-rajdhani font-bold text-sm text-center" style={{ color: 'var(--text)' }}>{pos}</p>

            <div
              className="aspect-square rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              style={{ background: 'var(--surface2)', border: '1px dashed var(--border)' }}
              onClick={() => document.getElementById(`tyre-${i}`)?.click()}
            >
              {photos[i] ? (
                <img src={`data:image/jpeg;base64,${photos[i]}`} alt={pos} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center p-2">
                  <p className="text-2xl">📸</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Tap to add</p>
                </div>
              )}
            </div>
            <input id={`tyre-${i}`} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(i, f) }} />

            {photos[i] && !results[i] && (
              <button onClick={() => analyseOne(i)} className="btn-cyan w-full py-2 text-sm">Analyse</button>
            )}

            {results[i] && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: statusColor(results[i]!.status) }}>{results[i]!.status}</span>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{results[i]!.estimatedTreadMM}mm</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{results[i]!.recommendation}</p>
                {results[i]!.unevenWear && (
                  <p className="text-xs" style={{ color: '#f59e0b' }}>Uneven: {results[i]!.unevenWearCause}</p>
                )}
                <p className="text-xs" style={{ color: 'var(--cyan)' }}>{results[i]!.replacementCostGBP}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {allDone && (
        <div className="card rounded-xl p-4 space-y-3">
          <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Summary</h2>
          <div className="grid grid-cols-4 gap-2">
            {results.map((r, i) => r && (
              <div key={i} className="text-center p-2 rounded-lg" style={{ background: `${statusColor(r.status)}15`, border: `1px solid ${statusColor(r.status)}44` }}>
                <p className="text-xs font-bold" style={{ color: statusColor(r.status) }}>{TYRE_POSITIONS[i].split(' ')[0][0]+TYRE_POSITIONS[i].split(' ')[1][0]}</p>
                <p className="text-xs font-bold" style={{ color: statusColor(r.status) }}>{r.status}</p>
              </div>
            ))}
          </div>
          <a href="https://drmochanic.co.uk/book" target="_blank" rel="noopener noreferrer" className="btn-red block text-center py-3">
            Replace Tyres at Dr Mochanic Glasgow
          </a>
        </div>
      )}

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
