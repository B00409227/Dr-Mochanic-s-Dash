'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthState } from '@/lib/auth'
import { getDb } from '@/lib/firebase'

interface Booking {
  id: string
  name: string
  vehicleReg: string
  service: string
  date: string
  time: string
  status: string
  phone?: string
  email?: string
  notes?: string
}

interface StatCard {
  label: string
  value: number | string
  color: string
}

export default function AdminDashboardPage() {
  const { user } = useAuthState()
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Total Users', value: '—', color: 'var(--cyan)' },
    { label: 'Scans This Week', value: '—', color: '#a855f7' },
    { label: 'Bookings Today', value: '—', color: '#f59e0b' },
    { label: 'Community Reports', value: '—', color: '#22c55e' },
  ])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [topFaults, setTopFaults] = useState<Array<{ code: string; count: number }>>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const db = getDb()
      if (!db) {
        setLoadingStats(false)
        return
      }

      const { getDocs, collection, query, orderBy, limit, where, Timestamp } = await import('firebase/firestore')

      // Total users
      let userCount = 0
      try {
        const usersSnap = await getDocs(collection(db, 'users'))
        userCount = usersSnap.size
      } catch { /* no users collection yet */ }

      // Community faults
      let faultCount = 0
      const faultMap: Record<string, number> = {}
      try {
        const faultsSnap = await getDocs(collection(db, 'community_faults'))
        faultCount = faultsSnap.size
        faultsSnap.docs.forEach(d => {
          const data = d.data()
          const code = data.code as string
          faultMap[code] = (faultMap[code] || 0) + 1
        })
      } catch { /* no faults yet */ }

      // Top faults
      const sorted = Object.entries(faultMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code, count]) => ({ code, count }))
      setTopFaults(sorted)

      // Recent bookings
      const bookingsList: Booking[] = []
      let bookingsToday = 0
      try {
        const bookingsQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(10))
        const bookingsSnap = await getDocs(bookingsQ)
        const today = new Date().toDateString()
        bookingsSnap.docs.forEach(d => {
          const data = d.data()
          const booking: Booking = {
            id: d.id,
            name: data.name || '',
            vehicleReg: data.vehicleReg || data.reg || '',
            service: data.service || data.serviceType || '',
            date: data.date || '',
            time: data.time || '',
            status: data.status || 'Pending',
            phone: data.phone,
            email: data.email,
            notes: data.notes,
          }
          bookingsList.push(booking)
          if (new Date(data.date).toDateString() === today) bookingsToday++
        })
      } catch { /* no bookings yet */ }
      setRecentBookings(bookingsList)

      setStats([
        { label: 'Total Users', value: userCount, color: 'var(--cyan)' },
        { label: 'Scans This Week', value: '—', color: '#a855f7' },
        { label: 'Bookings Today', value: bookingsToday, color: '#f59e0b' },
        { label: 'Community Reports', value: faultCount, color: '#22c55e' },
      ])
    } catch (e) {
      console.warn('Admin dashboard load error:', e)
    } finally {
      setLoadingStats(false)
    }
  }

  async function updateBookingStatus(id: string, status: string) {
    try {
      const db = getDb()
      if (!db) return
      const { doc, updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'bookings', id), { status })
      setRecentBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    } catch (e) {
      console.warn('Update booking failed:', e)
    }
  }

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Confirmed: 'var(--cyan)',
    Completed: '#22c55e',
    Cancelled: '#ff2429',
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold" style={{ color: 'var(--text)' }}>Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Welcome back, {user?.displayName || user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/bookings" className="btn-cyan px-4 py-2 text-sm rounded-lg">View All Bookings</Link>
          <Link href="/admin/users" className="px-4 py-2 text-sm rounded-lg font-bold" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>View Users</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card rounded-xl p-5">
            <p className="text-xs font-rajdhani font-bold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>{stat.label}</p>
            {loadingStats ? (
              <div className="h-8 w-16 mt-2 rounded animate-pulse" style={{ background: 'var(--surface2)' }} />
            ) : (
              <p className="font-orbitron text-2xl font-bold mt-2" style={{ color: stat.color }}>{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs" style={{ color: 'var(--muted)' }}>View all →</Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Reg', 'Service', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left pb-2 pr-4 font-rajdhani font-bold text-xs uppercase" style={{ color: 'var(--muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(booking => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td className="py-2.5 pr-4 font-rajdhani" style={{ color: 'var(--text)' }}>{booking.name}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs" style={{ color: 'var(--cyan)' }}>{booking.vehicleReg}</td>
                      <td className="py-2.5 pr-4 text-xs" style={{ color: 'var(--muted)' }}>{booking.service}</td>
                      <td className="py-2.5 pr-4 text-xs" style={{ color: 'var(--muted)' }}>{booking.date}</td>
                      <td className="py-2.5">
                        <select
                          value={booking.status}
                          onChange={e => updateBookingStatus(booking.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded font-bold outline-none cursor-pointer"
                          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: statusColors[booking.status] || 'var(--muted)' }}
                        >
                          {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Fault Codes */}
        <div className="card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Top Fault Codes</h2>
            <Link href="/admin/faults" className="text-xs" style={{ color: 'var(--muted)' }}>View all →</Link>
          </div>
          {topFaults.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>No fault data yet</p>
          ) : (
            <div className="space-y-3">
              {topFaults.map((fault, i) => (
                <div key={fault.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-orbitron font-bold w-5" style={{ color: 'var(--muted)' }}>#{i + 1}</span>
                    <span className="font-mono font-bold text-sm" style={{ color: 'var(--cyan)' }}>{fault.code}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
                    {fault.count}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Manage Blog', href: '/admin/blog', color: '#a855f7' },
          { label: 'Fault Intelligence', href: '/admin/faults', color: '#22c55e' },
          { label: 'View All Users', href: '/admin/users', color: 'var(--cyan)' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="card rounded-xl p-4 text-center font-rajdhani font-bold text-sm transition-opacity hover:opacity-80"
            style={{ color: action.color }}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
