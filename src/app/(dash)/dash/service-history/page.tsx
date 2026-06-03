'use client'
import { useState, useEffect } from 'react'
import { getVehicles, getServiceHistory, saveServiceEntry, deleteServiceEntry } from '@/lib/storage'
import { getServiceRecommendations } from '@/lib/gemini'
import type { Vehicle, ServiceEntry } from '@/types'
import NoApiKey from '@/components/shared/NoApiKey'
import LoadingRadar from '@/components/shared/LoadingRadar'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

const SERVICE_TYPES = ['Oil Change', 'Full Service', 'Brake Replacement', 'Tyre Fitting', 'MOT', 'Timing Belt', 'Battery', 'Clutch', 'Air Con', 'Other']

export default function ServiceHistoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedReg, setSelectedReg] = useState('')
  const [history, setHistory] = useState<ServiceEntry[]>([])
  const [form, setForm] = useState({ date: '', mileage: '', serviceType: '', cost: '', garage: 'Dr Mochanic, Glasgow', notes: '' })
  const [recommendations, setRecommendations] = useState<Array<{ service: string; reason: string; urgency: string; estimatedCostGBP: string }>>([])
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)

  useEffect(() => {
    const v = getVehicles()
    setVehicles(v)
    if (v.length > 0) setSelectedReg(v[0].reg)
  }, [])

  useEffect(() => {
    if (selectedReg) setHistory(getServiceHistory().filter(e => e.reg === selectedReg))
  }, [selectedReg])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.serviceType) { toast.error('Date and service type required'); return }
    const entry: ServiceEntry = {
      id: uuidv4(),
      reg: selectedReg,
      date: form.date,
      mileage: Number(form.mileage) || 0,
      serviceType: form.serviceType,
      cost: Number(form.cost) || 0,
      garage: form.garage,
      notes: form.notes,
    }
    saveServiceEntry(entry)
    setHistory(getServiceHistory().filter(e => e.reg === selectedReg))
    setForm({ date: '', mileage: '', serviceType: '', cost: '', garage: 'Dr Mochanic, Glasgow', notes: '' })
    toast.success('Service entry added')
  }

  async function handleRecommend() {
    const vehicle = vehicles.find(v => v.reg === selectedReg)
    if (!vehicle) return
    setLoading(true)
    setNoKey(false)
    try {
      const r = await getServiceRecommendations(history, vehicle)
      setRecommendations(r.recommendations)
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else toast.error('Recommendations failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {loading && <LoadingRadar text="Getting recommendations..." />}
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Service History</h1>
      {noKey && <NoApiKey compact />}

      {vehicles.length > 0 && (
        <select className="w-full px-4 py-3 rounded-lg outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={selectedReg} onChange={e => setSelectedReg(e.target.value)}>
          {vehicles.map(v => <option key={v.reg} value={v.reg}>{v.year} {v.make} {v.model} ({v.reg})</option>)}
        </select>
      )}

      <form onSubmit={handleAdd} className="card rounded-xl p-4 space-y-3">
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>ADD SERVICE ENTRY</p>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <input type="number" value={form.mileage} onChange={e => setForm(p => ({ ...p, mileage: e.target.value }))} placeholder="Mileage" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        <select value={form.serviceType} onChange={e => setForm(p => ({ ...p, serviceType: e.target.value }))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <option value="">Select service type *</option>
          {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="Cost £" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <input value={form.garage} onChange={e => setForm(p => ({ ...p, garage: e.target.value }))} placeholder="Garage" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" rows={2} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        <button type="submit" className="btn-cyan w-full py-2 text-sm">Add Entry</button>
      </form>

      {history.length > 0 && (
        <>
          <div className="space-y-3">
            <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>HISTORY ({history.length} entries)</p>
            {history.map(e => (
              <div key={e.id} className="card rounded-xl p-3 flex items-start justify-between">
                <div>
                  <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{e.serviceType}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{e.date} · {e.mileage.toLocaleString()} miles · £{e.cost}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{e.garage}</p>
                  {e.notes && <p className="text-xs mt-1" style={{ color: 'var(--text)', opacity: 0.7 }}>{e.notes}</p>}
                </div>
                <button onClick={() => { deleteServiceEntry(e.id); setHistory(getServiceHistory().filter(x => x.reg === selectedReg)) }} className="text-xs p-1" style={{ color: '#ff2429' }}>✕</button>
              </div>
            ))}
          </div>

          <button onClick={handleRecommend} className="btn-cyan w-full py-3">Get AI Recommendations</button>
        </>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>RECOMMENDATIONS</p>
          {recommendations.map((r, i) => (
            <div key={i} className="card rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{r.service}</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{r.urgency}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{r.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--cyan)' }}>{r.estimatedCostGBP}</span>
                <a href="https://drmochanic.co.uk/book" target="_blank" rel="noopener noreferrer" className="text-xs font-rajdhani font-bold px-3 py-1 rounded" style={{ background: '#ff2429', color: '#fff' }}>Book at Dr Mochanic</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
