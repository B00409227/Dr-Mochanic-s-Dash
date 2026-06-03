'use client'
import { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { scanDashboard } from '@/lib/gemini'
import ScanOverlay from '@/components/shared/ScanOverlay'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import toast from 'react-hot-toast'

function ScanPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') === 'upload' ? 'upload' : 'live'
  const [tab, setTab] = useState<'live' | 'upload'>(mode)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null)
  const [capturedMime, setCapturedMime] = useState('image/jpeg')
  const [loading, setLoading] = useState(false)
  const [noCamera, setNoCamera] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const [dragging, setDragging] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
      setStream(s)
      if (videoRef.current) videoRef.current.srcObject = s
    } catch {
      setNoCamera(true)
    }
  }, [])

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
  }, [stream])

  useEffect(() => {
    if (tab === 'live') startCamera()
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  function captureFrame() {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current
    const c = canvasRef.current
    c.width = v.videoWidth
    c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    const dataUrl = c.toDataURL('image/jpeg', 0.8)
    setCapturedBase64(dataUrl.replace('data:image/jpeg;base64,', ''))
    setCapturedMime('image/jpeg')
  }

  async function analyse() {
    if (!capturedBase64) return
    setNoKey(false)
    setLoading(true)
    try {
      const result = await scanDashboard(capturedBase64, capturedMime)
      sessionStorage.setItem('drm_last_scan', JSON.stringify(result))
      router.push('/dash/results')
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') { setNoKey(true) }
      else toast.error('Analysis failed — try again')
    } finally {
      setLoading(false)
    }
  }

  function handleFile(file: File) {
    setCapturedMime(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const base64 = result.replace(/^data:[^;]+;base64,/, '')
      setCapturedBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      {loading && <LoadingRadar text="Analysing dashboard..." />}

      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Dashboard Scanner</h1>

      {/* Tab switcher */}
      <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {(['live', 'upload'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setCapturedBase64(null) }}
            className="flex-1 py-3 font-rajdhani font-bold text-sm transition-all"
            style={{
              background: tab === t ? 'var(--cyan)' : 'transparent',
              color: tab === t ? '#010312' : 'var(--muted)',
            }}
          >
            {t === 'live' ? 'Live Scan' : 'Upload Photo'}
          </button>
        ))}
      </div>

      {noKey && <NoApiKey />}

      {tab === 'live' && (
        <div className="space-y-4">
          {noCamera ? (
            <div className="card rounded-xl p-6 text-center space-y-3">
              <p className="text-lg">📷</p>
              <p className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>Camera not available</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Allow camera access in your browser settings, or use the Upload tab instead.</p>
              <button onClick={() => setTab('upload')} className="btn-outline">Upload Photo Instead</button>
            </div>
          ) : (
            <>
              <div className="relative rounded-xl overflow-hidden" style={{ background: '#000', aspectRatio: '16/9' }}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <ScanOverlay />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              {capturedBase64 ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img src={`data:image/jpeg;base64,${capturedBase64}`} alt="Captured" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCapturedBase64(null)} className="btn-outline flex-1">Retake</button>
                    <button onClick={analyse} className="btn-cyan flex-1">Analyse Now</button>
                  </div>
                </div>
              ) : (
                <button onClick={captureFrame} className="btn-red w-full py-4 text-base font-bold">
                  Scan Now
                </button>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'upload' && (
        <div className="space-y-4">
          <div
            className={`rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'opacity-80' : ''}`}
            style={{
              border: `2px dashed ${dragging ? 'var(--cyan)' : 'var(--border)'}`,
              background: dragging ? 'rgba(0,220,240,0.05)' : 'var(--surface)',
            }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="text-4xl mb-3">📸</div>
            <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Drop photo here or tap to select</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Photo of your dashboard showing warning lights</p>
          </div>
          <input id="file-input" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

          {capturedBase64 && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <img src={`data:${capturedMime};base64,${capturedBase64}`} alt="Preview" className="w-full max-h-64 object-contain" style={{ background: '#000' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCapturedBase64(null)} className="btn-outline flex-1">Remove</button>
                <button onClick={analyse} className="btn-cyan flex-1">Analyse Now</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 text-center" style={{ color: 'var(--muted)' }}>Loading scanner...</div>}>
      <ScanPageInner />
    </Suspense>
  )
}
