'use client'
import { useEffect, useState } from 'react'
import { getDb } from '@/lib/firebase'
import type { CommunityFault } from '@/types'

interface VehicleGroup {
  key: string
  make: string
  model: string
  count: number
  lastReported: number
  codes: string[]
}

interface FaultGroup {
  code: string
  count: number
  vehicles: string[]
  lastReported: number
}

export default function FaultsPage() {
  const [faults, setFaults] = useState<CommunityFault[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [view, setView] = useState<'vehicles' | 'codes'>('codes')

  useEffect(() => {
    loadFaults()
  }, [])

  async function loadFaults() {
    setLoading(true)
    try {
      const db = getDb()
      if (!db) { setLoading(false); return }
      const { getDocs, collection, query, orderBy } = await import('firebase/firestore')
      const snap = await getDocs(query(collection(db, 'community_faults'), orderBy('timestamp', 'desc')))
      setFaults(snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityFault)))
    } catch (e) {
      console.warn('Load faults error:', e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = faults.filter(f => {
    if (filterDateFrom && f.timestamp < new Date(filterDateFrom).getTime()) return false
    if (filterDateTo && f.timestamp > new Date(filterDateTo).getTime() + 86400000) return false
    return true
  })

  const vehicleGroups: VehicleGroup[] = Object.values(
    filtered.reduce((acc, f) => {
      const key = `${f.make}_${f.model}`
      if (!acc[key]) acc[key] = { key, make: f.make, model: f.model, count: 0, lastReported: 0, codes: [] }
      acc[key].count++
      if (f.timestamp > acc[key].lastReported) acc[key].lastReported = f.timestamp
      if (!acc[key].codes.includes(f.code)) acc[key].codes.push(f.code)
      return acc
    }, {} as Record<string, VehicleGroup>)
  ).sort((a, b) => b.count - a.count).slice(0, 10)

  const faultGroups: FaultGroup[] = Object.values(
    filtered.reduce((acc, f) => {
      if (!acc[f.code]) acc[f.code] = { code: f.code, count: 0, vehicles: [], lastReported: 0 }
      acc[f.code].count++
      if (f.timestamp > acc[f.code].lastReported) acc[f.code].lastReported = f.timestamp
      const veh = `${f.make} ${f.model}`
      if (!acc[f.code].vehicles.includes(veh)) acc[f.code].vehicles.push(veh)
      return acc
    }, {} as Record<string, FaultGroup>)
  ).sort((a, b) => b.count - a.count).slice(0, 10)

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl font-bold" style={{ color: 'var(--text)' }}>Fault Intelligence</h1>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>{filtered.length} reports</span>
      </div>

      {/* Filters */}
      <div className="card rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>to</span>
        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <div className="flex gap-2 ml-auto">
          {(['codes', 'vehicles'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="text-sm px-3 py-1.5 rounded-lg font-bold capitalize"
              style={{
                background: view === v ? 'var(--cyan)' : 'var(--surface2)',
                color: view === v ? '#010312' : 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              By {v}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="card rounded-xl p-8 text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: 'var(--cyan)', borderTopColor: 'transparent' }} />
        </div>
      ) : view === 'codes' ? (
        /* Fault Codes View */
        <div className="card rounded-xl overflow-hidden">
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-rajdhani font-bold" style={{ color: 'var(--cyan)' }}>Top 10 Fault Codes</h2>
          </div>
          {faultGroups.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No fault data for this period</p>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--surface2)' }}>
                <tr>
                  {['Rank', 'Code', 'Reports', 'Vehicles', 'Last Reported'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-rajdhani font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faultGroups.map((fg, i) => (
                  <tr key={fg.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 font-orbitron text-xs font-bold" style={{ color: 'var(--muted)' }}>#{i + 1}</td>
                    <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--cyan)' }}>{fg.code}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>{fg.count}x</span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--muted)' }}>{fg.vehicles.slice(0, 3).join(', ')}{fg.vehicles.length > 3 ? ` +${fg.vehicles.length - 3}` : ''}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{formatDate(fg.lastReported)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Vehicles View */
        <div className="card rounded-xl overflow-hidden">
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-rajdhani font-bold" style={{ color: 'var(--cyan)' }}>Top 10 Most Reported Vehicles</h2>
          </div>
          {vehicleGroups.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No vehicle data for this period</p>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: 'var(--surface2)' }}>
                <tr>
                  {['Rank', 'Make', 'Model', 'Reports', 'Common Codes', 'Last Reported'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-rajdhani font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleGroups.map((vg, i) => (
                  <tr key={vg.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 font-orbitron text-xs font-bold" style={{ color: 'var(--muted)' }}>#{i + 1}</td>
                    <td className="px-4 py-3 font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{vg.make}</td>
                    <td className="px-4 py-3 font-rajdhani" style={{ color: 'var(--text)' }}>{vg.model}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,36,41,0.1)', color: '#ff2429' }}>{vg.count}x</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--muted)' }}>{vg.codes.slice(0, 3).join(', ')}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{formatDate(vg.lastReported)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Recent Faults Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-rajdhani font-bold" style={{ color: 'var(--cyan)' }}>Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--surface2)' }}>
              <tr>
                {['Make', 'Model', 'Year', 'Code', 'Symptom', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-rajdhani font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-2.5 font-rajdhani font-bold text-xs" style={{ color: 'var(--text)' }}>{f.make}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{f.model}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{f.year}</td>
                  <td className="px-4 py-2.5 font-mono text-xs font-bold" style={{ color: 'var(--cyan)' }}>{f.code}</td>
                  <td className="px-4 py-2.5 text-xs max-w-xs truncate" style={{ color: 'var(--muted)' }}>{f.symptom}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--muted)' }}>{formatDate(f.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
