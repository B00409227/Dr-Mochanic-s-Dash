'use client'
import { useState, useRef, useEffect } from 'react'
import { analyseSoundDiagnosis } from '@/lib/gemini'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import toast from 'react-hot-toast'

const SYMPTOMS = ['Knocking/tapping', 'Rattling', 'Squealing', 'Grinding', 'Hissing', 'Clicking', 'Rumbling', 'High-pitched whine']
const WHEN = ['On startup', 'While idling', 'While accelerating', 'While braking', 'Always']

type Result = { possibleCauses: Array<{ cause: string; confidence: number; severity: string; description: string; fixSteps: string[]; estimatedCostGBP: string }>; summary: string; urgency: string; recommendation: string }

export default function SoundPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedWhen, setSelectedWhen] = useState<string[]>([])
  const [recording, setRecording] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [waveformDesc, setWaveformDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [noKey, setNoKey] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); if (timerRef.current) clearInterval(timerRef.current) } }, [])

  function drawWaveform() {
    const analyser = analyserRef.current
    const canvas = canvasRef.current
    if (!analyser || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const buf = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteTimeDomainData(buf)
    ctx.fillStyle = '#0a1628'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#00dcf0'
    ctx.beginPath()
    const slice = canvas.width / buf.length
    let x = 0
    buf.forEach((v, i) => {
      const y = (v / 128.0) * (canvas.height / 2)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      x += slice
    })
    ctx.stroke()
    rafRef.current = requestAnimationFrame(drawWaveform)
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioUrl(URL.createObjectURL(blob))
        const waveStats = `Duration: 15s, Audio detected with ${selectedSymptoms.length} selected symptoms`
        setWaveformDesc(waveStats)
        cancelAnimationFrame(rafRef.current)
      }
      mr.start()
      setRecording(true)
      setCountdown(15)
      drawWaveform()
      let count = 15
      timerRef.current = setInterval(() => {
        count--
        setCountdown(count)
        if (count <= 0) { mr.stop(); stream.getTracks().forEach(t => t.stop()); setRecording(false); if (timerRef.current) clearInterval(timerRef.current) }
      }, 1000)
    } catch { toast.error('Microphone access required') }
  }

  async function handleAnalyse() {
    if (!waveformDesc && selectedSymptoms.length === 0) { toast.error('Record audio or select symptoms first'); return }
    setLoading(true)
    setNoKey(false)
    const allSymptoms = [...selectedSymptoms, ...selectedWhen.map(w => `Occurs: ${w}`)]
    try {
      const r = await analyseSoundDiagnosis(allSymptoms, waveformDesc || 'Owner-described symptoms only')
      setResult(r)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else toast.error('Analysis failed')
    } finally { setLoading(false) }
  }

  const toggleSymptom = (s: string) => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleWhen = (s: string) => setSelectedWhen(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {loading && <LoadingRadar text="Diagnosing sound..." />}
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Sound Diagnosis</h1>
      {noKey && <NoApiKey compact />}

      <div className="card rounded-xl p-4 space-y-3">
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>SELECT SYMPTOMS</p>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(s => (
            <button key={s} onClick={() => toggleSymptom(s)} className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ background: selectedSymptoms.includes(s) ? 'var(--cyan)' : 'var(--surface2)', color: selectedSymptoms.includes(s) ? '#010312' : 'var(--text)', border: '1px solid var(--border)' }}>
              {s}
            </button>
          ))}
        </div>
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>WHEN DOES IT HAPPEN?</p>
        <div className="flex flex-wrap gap-2">
          {WHEN.map(s => (
            <button key={s} onClick={() => toggleWhen(s)} className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ background: selectedWhen.includes(s) ? '#f59e0b' : 'var(--surface2)', color: selectedWhen.includes(s) ? '#010312' : 'var(--text)', border: '1px solid var(--border)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card rounded-xl p-4 space-y-3">
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>RECORD ENGINE SOUND</p>
        <canvas ref={canvasRef} width={400} height={80} className="w-full rounded-lg" style={{ background: '#0a1628' }} />
        {recording ? (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-orbitron text-sm" style={{ color: '#ff2429' }}>Recording... {countdown}s</span>
          </div>
        ) : (
          <button onClick={startRecording} className="btn-red w-full py-3">Record 15 Seconds</button>
        )}
        {audioUrl && <audio controls src={audioUrl} className="w-full" />}
      </div>

      <button onClick={handleAnalyse} disabled={selectedSymptoms.length === 0 && !waveformDesc} className="btn-cyan w-full py-4 text-base font-bold disabled:opacity-40">
        Analyse Sound
      </button>

      {result && (
        <div className="space-y-4">
          <div className="card rounded-xl p-4 space-y-2">
            <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>{result.summary}</p>
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{result.urgency}</span>
          </div>
          {result.possibleCauses.map((c, i) => (
            <div key={i} className="card rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{c.cause}</p>
                <span className="text-xs font-bold" style={{ color: c.severity === 'CRITICAL' ? '#ff2429' : c.severity === 'WARNING' ? '#f59e0b' : 'var(--cyan)' }}>{c.severity}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-2 rounded-full" style={{ width: `${c.confidence}%`, background: 'var(--cyan)' }} />
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{c.description}</p>
              <p className="text-xs" style={{ color: 'var(--cyan)' }}>{c.estimatedCostGBP}</p>
            </div>
          ))}
          <a href="https://drmochanic.co.uk/book" target="_blank" rel="noopener noreferrer" className="btn-red block text-center py-3">
            Book Diagnostic at Dr Mochanic
          </a>
        </div>
      )}
      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
