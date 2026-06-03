'use client'
import { useState, useEffect } from 'react'
import { getCommunityFaults, saveCommunityFault } from '@/lib/firebase'
import { getDeviceId } from '@/lib/deviceId'
import type { CommunityFault } from '@/types'
import toast from 'react-hot-toast'

export default function CommunityPage() {
  const [faults, setFaults] = useState<CommunityFault[]>([])
  const [search, setSearch] = useState({ make: '', model: '' })
  const [form, setForm] = useState({ make: '', model: '', year: '', symptom: '', code: '' })
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!search.make || !search.model) { toast.error('Enter make and model'); return }
    setLoading(true)
    try {
      const results = await getCommunityFaults(search.make, search.model)
      setFaults(results)
    } catch { toast.error('Firebase not configured — community data unavailable') }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.make || !form.model || !form.symptom) { toast.error('Fill in required fields'); return }
    const deviceId = getDeviceId()
    try {
      await saveCommunityFault({ ...form, timestamp: Date.now(), deviceId })
      toast.success('Fault reported — thank you!')
      setForm({ make: '', model: '', year: '', symptom: '', code: '' })
    } catch { toast.error('Firebase not configured') }
  }

  const grouped = faults.reduce((acc, f) => {
    const key = `${f.make} ${f.model}`
    if (!acc[key]) acc[key] = []
    acc[key].push(f)
    return acc
  }, {} as Record<string, CommunityFault[]>)

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Community Faults</h1>

      <div className="card rounded-xl p-4 space-y-3">
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>SEARCH FAULTS</p>
        <div className="flex gap-2">
          <input value={search.make} onChange={e => setSearch(prev => ({ ...prev, make: e.target.value }))} placeholder="Make (e.g. FORD)" className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <input value={search.model} onChange={e => setSearch(prev => ({ ...prev, model: e.target.value }))} placeholder="Model (e.g. FOCUS)" className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        <button onClick={handleSearch} disabled={loading} className="btn-cyan w-full py-2 text-sm">{loading ? 'Searching...' : 'Search'}</button>
      </div>

      {faults.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>COMMUNITY REPORTS ({faults.length})</p>
          {Object.entries(grouped).map(([key, items]) => (
            <div key={key} className="card rounded-xl p-4 space-y-2">
              <p className="font-rajdhani font-bold" style={{ color: 'var(--cyan)' }}>{key} — {items.length} report{items.length !== 1 ? 's' : ''}</p>
              {items.slice(0, 5).map(f => (
                <div key={f.id} className="text-sm p-2 rounded" style={{ background: 'rgba(0,220,240,0.05)', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text)' }}>{f.symptom}</p>
                  {f.code && <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--cyan)' }}>{f.code}</p>}
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{new Date(f.timestamp).toLocaleDateString('en-GB')}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card rounded-xl p-4 space-y-3">
        <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>REPORT A FAULT ANONYMOUSLY</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.make} onChange={e => setForm(prev => ({ ...prev, make: e.target.value.toUpperCase() }))} placeholder="Make *" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <input value={form.model} onChange={e => setForm(prev => ({ ...prev, model: e.target.value.toUpperCase() }))} placeholder="Model *" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.year} onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))} placeholder="Year" className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          <input value={form.code} onChange={e => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))} placeholder="OBD2 Code (optional)" className="px-3 py-2 rounded-lg text-sm outline-none font-mono" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--cyan)' }} />
        </div>
        <textarea value={form.symptom} onChange={e => setForm(prev => ({ ...prev, symptom: e.target.value }))} placeholder="Describe the symptom *" rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Reports are completely anonymous. No personal data is collected.</p>
        <button type="submit" className="btn-cyan w-full py-2 text-sm">Submit Report</button>
      </form>

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
