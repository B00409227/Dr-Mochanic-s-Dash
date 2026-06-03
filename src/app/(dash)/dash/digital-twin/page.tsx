'use client'
import { useState, useEffect } from 'react'
import { getVehicles } from '@/lib/storage'
import { getDigitalTwin } from '@/lib/firebase'
import { getDigitalTwinAnalysis } from '@/lib/gemini'
import { getDeviceId } from '@/lib/deviceId'
import type { Vehicle, DigitalTwin } from '@/types'
import PredictionCard from '@/components/shared/PredictionCard'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import toast from 'react-hot-toast'

export default function DigitalTwinPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedReg, setSelectedReg] = useState('')
  const [twin, setTwin] = useState<DigitalTwin | null>(null)
  const [analysis, setAnalysis] = useState<Awaited<ReturnType<typeof getDigitalTwinAnalysis>> | null>(null)
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)

  useEffect(() => {
    const v = getVehicles()
    setVehicles(v)
    if (v.length > 0) setSelectedReg(v[0].reg)
  }, [])

  useEffect(() => {
    if (selectedReg) loadTwin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReg])

  async function loadTwin() {
    const deviceId = getDeviceId()
    if (!deviceId || !selectedReg) return
    const t = await getDigitalTwin(deviceId, selectedReg)
    setTwin(t)
  }

  async function handleAnalyse() {
    if (!twin) { toast.error('No digital twin data available'); return }
    setLoading(true)
    setNoKey(false)
    try {
      const a = await getDigitalTwinAnalysis(twin)
      setAnalysis(a)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else toast.error('Analysis failed')
    } finally { setLoading(false) }
  }

  function exportJSON() {
    if (!twin) return
    const blob = new Blob([JSON.stringify(twin, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `twin_${selectedReg}.json`
    a.click()
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {loading && <LoadingRadar text="Analysing digital twin..." />}
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Digital Twin</h1>
      {noKey && <NoApiKey compact />}

      {vehicles.length === 0 ? (
        <div className="card rounded-xl p-6 text-center space-y-3">
          <div className="text-3xl">🤖</div>
          <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>No vehicles saved</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Look up your vehicle on the home screen, then perform scans to build your digital twin.</p>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-xs font-rajdhani font-bold mb-2" style={{ color: 'var(--muted)' }}>SELECT VEHICLE</label>
            <select className="w-full px-4 py-3 rounded-lg outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={selectedReg} onChange={e => setSelectedReg(e.target.value)}>
              {vehicles.map(v => <option key={v.reg} value={v.reg}>{v.year} {v.make} {v.model} ({v.reg})</option>)}
            </select>
          </div>

          {twin ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Scans', value: twin.scans.length },
                  { label: 'OBD2 Readings', value: twin.obd2History.length },
                  { label: 'Services', value: twin.serviceHistory.length },
                ].map(s => (
                  <div key={s.label} className="card rounded-xl p-3 text-center">
                    <p className="font-orbitron font-bold text-xl" style={{ color: 'var(--cyan)' }}>{s.value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleAnalyse} className="btn-cyan flex-1 py-3">Analyse Twin</button>
                <button onClick={exportJSON} className="btn-outline px-4 py-3">Export JSON</button>
              </div>

              {analysis && (
                <div className="space-y-4">
                  <div className="card rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron font-bold" style={{ color: analysis.healthTrend === 'IMPROVING' ? '#22c55e' : analysis.healthTrend === 'STABLE' ? 'var(--cyan)' : '#ff2429' }}>
                        {analysis.healthTrend}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>health trend</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>{analysis.overallAssessment}</p>
                    <ul className="space-y-1">
                      {analysis.keyInsights.map((k, i) => <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}><span style={{ color: 'var(--cyan)' }}>→</span>{k}</li>)}
                    </ul>
                  </div>

                  {analysis.predictedFailures.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>PREDICTED FAILURES</p>
                      {analysis.predictedFailures.map((f, i) => (
                        <PredictionCard key={i} issue={f.component} confidence={f.confidence} timeframe={f.timeframe} recommendation={f.preventionSteps[0] || ''} />
                      ))}
                    </div>
                  )}

                  {analysis.maintenanceRecommendations.length > 0 && (
                    <div className="card rounded-xl p-4 space-y-2">
                      <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>MAINTENANCE RECOMMENDATIONS</p>
                      {analysis.maintenanceRecommendations.map((r, i) => (
                        <p key={i} className="text-sm flex gap-2" style={{ color: 'var(--text)' }}><span style={{ color: '#22c55e' }}>✓</span>{r}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card rounded-xl p-6 text-center space-y-3">
              <div className="text-3xl">📊</div>
              <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>No twin data yet</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Perform dashboard scans and OBD2 readings to build your vehicle&apos;s digital twin. Data accumulates automatically after each scan.</p>
            </div>
          )}
        </>
      )}
      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
