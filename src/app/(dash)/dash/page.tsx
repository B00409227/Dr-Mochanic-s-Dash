'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { lookupReg } from '@/lib/dvla'
import { getCommonProblems } from '@/lib/gemini'
import { getVehicles, saveVehicle, getScanHistory } from '@/lib/storage'
import type { Vehicle, CommonProblem, ScanResult } from '@/types'
import RegPlate from '@/components/shared/RegPlate'
import NoApiKey from '@/components/shared/NoApiKey'
import LoadingRadar from '@/components/shared/LoadingRadar'
import toast from 'react-hot-toast'

function VehicleCard({ v }: { v: Vehicle }) {
  const motOk = v.motStatus?.toLowerCase() === 'valid' || v.motStatus?.toLowerCase() === 'no details held'
  const taxOk = v.taxStatus?.toLowerCase() === 'taxed'
  return (
    <div className="card rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>{v.year} {v.make} {v.model}</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{v.colour} · {v.fuelType}</p>
        </div>
        <RegPlate reg={v.reg} size="sm" />
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className={`text-xs px-2 py-1 rounded font-bold ${motOk ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
          MOT: {v.motStatus}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-bold ${taxOk ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
          TAX: {v.taxStatus}
        </span>
      </div>
    </div>
  )
}

function CommonProblemCard({ p }: { p: CommonProblem }) {
  const [open, setOpen] = useState(false)
  const c = p.severity === 'CRITICAL' ? '#ff2429' : p.severity === 'WARNING' ? '#f59e0b' : '#00dcf0'
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c}33`, borderLeft: `3px solid ${c}` }}>
      <button className="w-full flex items-center justify-between p-3 text-left" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <span className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{p.name}</span>
          <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${c}22`, color: c }}>{p.severity}</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{p.estimatedCostGBP}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s', color: 'var(--muted)', flexShrink: 0 }}>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>
          <p style={{ color: 'var(--muted)' }}><strong>How to identify:</strong> {p.howToIdentify}</p>
          {p.fixSteps.length > 0 && (
            <ol className="space-y-1">
              {p.fixSteps.slice(0, 3).map((s, i) => <li key={i} className="flex gap-1.5"><span style={{ color: c }}>{i+1}.</span>{s}</li>)}
            </ol>
          )}
          {p.relatedOBD2Codes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {p.relatedOBD2Codes.map(code => (
                <Link key={code} href={`/dash/obd2?code=${code}`} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>{code}</Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const QUICK_ACTIONS = [
  { href: '/dash/scan', label: 'Scan Dashboard', icon: '📷', desc: 'Camera AI scan' },
  { href: '/dash/scan?mode=upload', label: 'Upload Photo', icon: '🖼️', desc: 'Photo upload' },
  { href: '/dash/obd2', label: 'OBD2 Lookup', icon: '🔌', desc: 'Code lookup' },
  { href: '/dash/livestream', label: 'Live Stream', icon: '📡', desc: 'Live data' },
  { href: '/dash/mechanics-eye', label: "Mochanic's Eye", icon: '🔍', desc: 'Full inspection' },
  { href: '/dash/sound', label: 'Sound Diagnosis', icon: '🔊', desc: 'Audio AI' },
]

export default function DashHome() {
  const [reg, setReg] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [problems, setProblems] = useState<CommonProblem[]>([])
  const [noKey, setNoKey] = useState(false)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    setRecentScans(getScanHistory().slice(0, 5))
    setSavedVehicles(getVehicles().slice(0, 3))
  }, [])

  async function handleLookup() {
    if (!reg.trim()) return
    setLoading(true)
    setVehicle(null)
    setProblems([])
    setNoKey(false)
    try {
      const v = await lookupReg(reg)
      setVehicle(v)
      saveVehicle(v)
      setSavedVehicles(getVehicles().slice(0, 3))
      try {
        const probs = await getCommonProblems(v.make, v.model, v.year, v.fuelType)
        setProblems(probs)
      } catch (e) {
        const msg = e instanceof Error ? e.message : ''
        if (msg === 'NO_API_KEY') setNoKey(true)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {loading && <LoadingRadar text="Looking up vehicle..." />}

      {/* Reg search */}
      <div className="card rounded-xl p-4">
        <label className="block text-sm font-rajdhani font-bold mb-3" style={{ color: 'var(--muted)' }}>VEHICLE LOOKUP</label>
        <div className="flex gap-2">
          <input
            value={reg}
            onChange={e => setReg(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="AB12 CDE"
            className="flex-1 px-4 py-3 rounded-lg text-center font-bold tracking-wider uppercase outline-none"
            style={{ background: '#FFC612', border: '2px solid black', color: 'black', fontFamily: 'Rajdhani, sans-serif', fontSize: 18 }}
            maxLength={8}
          />
          <button onClick={handleLookup} className="btn-cyan px-5 py-3 font-bold">Search</button>
        </div>
      </div>

      {vehicle && <VehicleCard v={vehicle} />}
      {noKey && <NoApiKey compact />}
      {problems.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>COMMON ISSUES FOR {vehicle?.year} {vehicle?.make} {vehicle?.model}</p>
          {problems.map((p, i) => <CommonProblemCard key={i} p={p} />)}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-sm font-rajdhani font-bold mb-3" style={{ color: 'var(--muted)' }}>QUICK ACTIONS</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.href} href={a.href} className="card rounded-xl p-4 text-center hover:-translate-y-0.5 transition-transform space-y-1">
              <div className="text-2xl">{a.icon}</div>
              <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{a.label}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Scans', value: getScanHistory().length },
          { label: 'Vehicles Saved', value: getVehicles().length },
          { label: 'OBD2 Lookups', value: (() => { try { return JSON.parse(localStorage.getItem('drm_obd2_history') || '[]').length } catch { return 0 } })() },
        ].map(s => (
          <div key={s.label} className="card rounded-xl p-3 text-center">
            <p className="font-orbitron font-bold text-2xl" style={{ color: 'var(--cyan)' }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      {recentScans.length > 0 && (
        <div>
          <p className="text-sm font-rajdhani font-bold mb-3" style={{ color: 'var(--muted)' }}>RECENT SCANS</p>
          <div className="space-y-2">
            {recentScans.map(scan => (
              <div key={scan.id} className="card rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--text)' }}>
                    {new Date(scan.timestamp).toLocaleDateString('en-GB')} · Score: {scan.healthScore}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{scan.lights.length} light{scan.lights.length !== 1 ? 's' : ''} detected</p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm"
                  style={{
                    background: scan.healthScore >= 71 ? 'rgba(0,220,240,0.15)' : scan.healthScore >= 41 ? 'rgba(245,158,11,0.15)' : 'rgba(255,36,41,0.15)',
                    color: scan.healthScore >= 71 ? 'var(--cyan)' : scan.healthScore >= 41 ? '#f59e0b' : '#ff2429',
                  }}
                >
                  {scan.healthScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-xs pt-2" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
