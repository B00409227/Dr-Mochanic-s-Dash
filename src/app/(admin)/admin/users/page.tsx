'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getDb } from '@/lib/firebase'
import type { UserProfile } from '@/lib/firebase'

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const db = getDb()
      if (!db) { setLoading(false); return }
      const { getDocs, collection, query, orderBy } = await import('firebase/firestore')
      const snap = await getDocs(query(collection(db, 'users'), orderBy('lastSeen', 'desc')))
      setUsers(snap.docs.map(d => d.data() as UserProfile))
    } catch (e) {
      console.warn('Load users error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function promoteToAdmin(uid: string) {
    if (!window.confirm('Promote this user to admin? They will have full access to the admin dashboard.')) return
    try {
      const db = getDb()
      if (!db) return
      const { doc, updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'users', uid), { role: 'admin' })
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: 'admin' } : u))
    } catch (e) {
      console.warn('Promote to admin error:', e)
    }
  }

  function formatLastSeen(ts: unknown): string {
    if (!ts) return 'Never'
    try {
      const date = (ts as { toDate?: () => Date }).toDate?.() || new Date(ts as string)
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch { return 'Unknown' }
  }

  const signInLabel = (providerId: string) => {
    if (providerId?.includes('google')) return 'Google'
    if (providerId?.includes('apple')) return 'Apple'
    if (providerId?.includes('facebook')) return 'Facebook'
    if (providerId?.includes('phone')) return 'Phone'
    return 'Email'
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-orbitron text-xl font-bold" style={{ color: 'var(--text)' }}>Users</h1>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>{users.length} registered</span>
      </div>

      {loading ? (
        <div className="card rounded-xl p-8 text-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: 'var(--cyan)', borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="card rounded-xl p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No users registered yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.uid} className="card rounded-xl p-4 flex items-center gap-4">
              {/* Avatar */}
              {u.photoURL ? (
                <Image src={u.photoURL} alt={u.displayName} width={44} height={44} className="rounded-full shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-orbitron font-bold shrink-0" style={{ background: 'var(--surface2)', color: 'var(--cyan)' }}>
                  {(u.displayName || u.email || '?')[0]?.toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>{u.displayName || 'Anonymous'}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold" style={{
                    background: u.role === 'admin' ? 'rgba(255,36,41,0.15)' : 'rgba(0,220,240,0.1)',
                    color: u.role === 'admin' ? '#ff2429' : 'var(--cyan)',
                  }}>
                    {u.role}
                  </span>
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{u.email}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Last seen: {formatLastSeen(u.lastSeen)}</span>
                  {u.vehicles?.length > 0 && (
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{u.vehicles.length} vehicle{u.vehicles.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => promoteToAdmin(u.uid)}
                    className="text-xs px-3 py-1.5 rounded-lg font-bold transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,36,41,0.1)', color: '#ff2429', border: '1px solid rgba(255,36,41,0.2)' }}
                  >
                    Promote to Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
