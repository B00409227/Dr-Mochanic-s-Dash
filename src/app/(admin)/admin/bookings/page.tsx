'use client'
import { useEffect, useState } from 'react'
import { getDb } from '@/lib/firebase'

interface Booking {
  id: string
  name: string
  phone: string
  email: string
  vehicleReg: string
  service: string
  date: string
  time: string
  status: string
  notes: string
  createdAt?: unknown
}

const SERVICE_TYPES = ['All Services', 'MOT', 'Service', 'Diagnostics', 'Tyres', 'Brakes', 'Other']
const STATUSES = ['All Statuses', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterService, setFilterService] = useState('All Services')
  const [filterStatus, setFilterStatus] = useState('All Statuses')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const db = getDb()
      if (!db) { setLoading(false); return }
      const { getDocs, collection, query, orderBy } = await import('firebase/firestore')
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const list: Booking[] = snap.docs.map(d => ({
        id: d.id,
        name: d.data().name || '',
        phone: d.data().phone || '',
        email: d.data().email || '',
        vehicleReg: d.data().vehicleReg || d.data().reg || '',
        service: d.data().service || d.data().serviceType || '',
        date: d.data().date || '',
        time: d.data().time || '',
        status: d.data().status || 'Pending',
        notes: d.data().notes || '',
        createdAt: d.data().createdAt,
      }))
      setBookings(list)
    } catch (e) {
      console.warn('Load bookings error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const db = getDb()
      if (!db) return
      const { doc, updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'bookings', id), { status })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (e) {
      console.warn('Update status error:', e)
    }
  }

  function exportCSV() {
    const headers = ['Name', 'Phone', 'Email', 'Reg', 'Service', 'Date', 'Time', 'Status', 'Notes']
    const rows = filtered.map(b => [b.name, b.phone, b.email, b.vehicleReg, b.service, b.date, b.time, b.status, b.notes].map(v => `"${v}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dr-mochanic-bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = bookings.filter(b => {
    if (filterService !== 'All Services' && !b.service.toLowerCase().includes(filterService.toLowerCase())) return false
    if (filterStatus !== 'All Statuses' && b.status !== filterStatus) return false
    if (filterDateFrom && b.date < filterDateFrom) return false
    if (filterDateTo && b.date > filterDateTo) return false
    return true
  })

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Confirmed: 'var(--cyan)',
    Completed: '#22c55e',
    Cancelled: '#ff2429',
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl font-bold" style={{ color: 'var(--text)' }}>Bookings</h1>
        <button onClick={exportCSV} className="btn-cyan px-4 py-2 text-sm rounded-lg">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="card rounded-xl p-4 flex flex-wrap gap-3">
        <select
          value={filterService}
          onChange={e => setFilterService(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={e => setFilterDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={e => setFilterDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <span className="text-sm self-center" style={{ color: 'var(--muted)' }}>{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: 'var(--cyan)', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                <tr>
                  {['Name', 'Phone', 'Email', 'Reg', 'Service', 'Date', 'Time', 'Status', 'Notes'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-rajdhani font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{booking.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{booking.phone}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{booking.email}</td>
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--cyan)' }}>{booking.vehicleReg}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{booking.service}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{booking.date}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>{booking.time}</td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={e => updateStatus(booking.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded font-bold outline-none cursor-pointer"
                        style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: statusColors[booking.status] || 'var(--muted)' }}
                      >
                        {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--muted)' }}>{booking.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
