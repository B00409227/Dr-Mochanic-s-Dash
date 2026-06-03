'use client'
import { useState, useEffect } from 'react'
import { getScanHistory, deleteScan } from '@/lib/storage'
import type { ScanResult } from '@/types'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanResult[]>([])
  const [filter, setFilter] = useState<'all' | 'CRITICAL' | 'WARNING' | 'INFO'>('all')

  useEffect(() => { setScans(getScanHistory()) }, [])

  function handleDelete(id: string) {
    if (!window.confirm('Delete this scan?')) return
    deleteScan(id)
    setScans(getScanHistory())
    toast.success('Deleted')
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(scans, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'dr-mochanic-history.json'
    a.click()
  }

  const filtered = scans.filter(s => {
    if (filter === 'all') return true
    return s.lights.some(l => l.severity === filter)
  })

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Scan History</h1>
        {scans.length > 0 && <button onClick={handleExport} className="text-xs font-rajdhani font-bold px-3 py-1.5 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cyan)' }}>Export JSON</button>}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'CRITICAL', 'WARNING', 'INFO'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className="text-xs px-3 py-1.5 rounded-full font-rajdhani font-bold capitalize transition-all"
            style={{ background: filter === f ? 'var(--cyan)' : 'var(--surface)', color: filter === f ? '#010312' : 'var(--muted)', border: '1px solid var(--border)' }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card rounded-xl p-8 text-center">
          <p className="text-3xl mb-3">📋</p>
          <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>No scans yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Use the scan feature to check your dashboard</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(scan => {
            const hasCritical = scan.lights.some(l => l.severity === 'CRITICAL')
            const hasWarning = scan.lights.some(l => l.severity === 'WARNING')
            const borderColor = hasCritical ? '#ff2429' : hasWarning ? '#f59e0b' : '#00dcf0'
            return (
              <details key={scan.id} className="card rounded-xl overflow-hidden" style={{ borderLeft: `3px solid ${borderColor}` }}>
                <summary className="p-4 cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>
                        {new Date(scan.timestamp).toLocaleString('en-GB')}
                        {scan.vehicleReg && ` · ${scan.vehicleReg}`}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {scan.lights.length} light{scan.lights.length !== 1 ? 's' : ''} · Score: {scan.healthScore}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm"
                        style={{ background: `${borderColor}22`, color: borderColor }}>{scan.healthScore}</div>
                      <button onClick={e => { e.preventDefault(); handleDelete(scan.id) }} className="text-xs p-1" style={{ color: '#ff2429' }}>✕</button>
                    </div>
                  </div>
                </summary>
                <div className="px-4 pb-4 space-y-2">
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{scan.summary}</p>
                  {scan.lights.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs p-2 rounded" style={{ background: 'rgba(0,220,240,0.05)', border: '1px solid var(--border)' }}>
                      <span className="font-bold" style={{ color: l.severity === 'CRITICAL' ? '#ff2429' : l.severity === 'WARNING' ? '#f59e0b' : 'var(--cyan)' }}>{l.severity}</span>
                      <span style={{ color: 'var(--text)' }}>{l.name}</span>
                    </div>
                  ))}
                </div>
              </details>
            )
          })}
        </div>
      )}

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
