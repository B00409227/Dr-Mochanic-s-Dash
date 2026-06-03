'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthState, logout } from '@/lib/auth'
import { getMapsKey, saveMapsKey, clearAllData } from '@/lib/storage'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuthState()
  const [mapsKey, setMapsKey] = useState(() => typeof window !== 'undefined' ? getMapsKey() : '')
  const [showMaps, setShowMaps] = useState(false)

  async function handleLogout() {
    if (!window.confirm("Sign out of Dr Mochanic's Dash?")) return
    await logout()
    router.replace('/login')
  }

  function handleSaveMaps() {
    saveMapsKey(mapsKey.trim())
    toast.success('Maps key saved')
  }

  function handleClearData() {
    if (!window.confirm('Delete all local app data? This cannot be undone.')) return
    clearAllData()
    toast.success('Local data cleared')
  }

  const signInMethod = user?.providerData?.[0]?.providerId || 'email'
  const methodLabel = signInMethod.includes('google')
    ? 'Google'
    : signInMethod.includes('apple')
    ? 'Apple'
    : signInMethod.includes('facebook')
    ? 'Facebook'
    : signInMethod.includes('phone')
    ? 'Phone'
    : 'Email'

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Settings</h1>

      {/* Profile */}
      {user && (
        <div className="card rounded-xl p-5 space-y-4">
          <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Your Profile</h2>
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <Image src={user.photoURL} alt="Profile" width={56} height={56} className="rounded-full" />
            ) : (
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-orbitron font-bold text-xl" style={{ background: 'var(--surface2)', color: 'var(--cyan)' }}>
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-rajdhani font-bold text-base" style={{ color: 'var(--text)' }}>{user.displayName || 'User'}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.email || user.phoneNumber}</p>
              <span className="text-xs px-2 py-0.5 rounded font-bold mt-1 inline-block" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
                {methodLabel}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-outline w-full py-2.5 text-sm" style={{ border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '0.5rem', background: 'transparent', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      )}

      {/* AI Status */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>AI Diagnostics</h2>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
          <div>
            <p className="text-sm font-rajdhani font-bold" style={{ color: 'var(--text)' }}>Dr Mochanic AI — Online</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Powered by Gemini 1.5 Flash · No setup required</p>
          </div>
        </div>
      </div>

      {/* Maps Key */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Google Maps Key</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Optional — enables nearby garage map.</p>
        <div className="flex gap-2">
          <input
            type={showMaps ? 'text' : 'password'}
            value={mapsKey}
            onChange={e => setMapsKey(e.target.value)}
            placeholder="AIza..."
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none font-mono"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <button
            onClick={() => setShowMaps(!showMaps)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
          >
            {showMaps ? 'Hide' : 'Show'}
          </button>
        </div>
        <button onClick={handleSaveMaps} className="btn-cyan w-full py-2 text-sm">Save</button>
      </div>

      {/* Device Status */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Device Status</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'AI Diagnostics', available: true, note: 'Server-powered' },
            { label: 'OBD2 Bluetooth', available: typeof window !== 'undefined' && !!(navigator as unknown as { bluetooth?: unknown }).bluetooth, note: 'Chrome required' },
            { label: 'Camera', available: typeof window !== 'undefined' && !!navigator.mediaDevices, note: 'HTTPS required' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span style={{ color: 'var(--muted)' }}>{item.label} <span style={{ opacity: 0.5 }}>— {item.note}</span></span>
              <span className={`text-xs font-bold ${item.available ? 'text-green-300' : 'text-red-300'}`}>{item.available ? 'Ready' : 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,36,41,0.06)', border: '1px solid rgba(255,36,41,0.2)' }}>
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: '#ff2429' }}>Data</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Clear locally cached scans and history from this device.</p>
        <button onClick={handleClearData} className="btn-red w-full py-3">Clear Local Data</button>
      </div>

      {/* About */}
      <div className="card rounded-xl p-5 space-y-2 text-sm text-center" style={{ color: 'var(--muted)' }}>
        <p className="font-orbitron font-bold" style={{ color: 'var(--cyan)' }}>Dr Mochanic&apos;s Dash v2.0</p>
        <p>AI-powered vehicle diagnostics — free for everyone</p>
        <p>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</p>
      </div>
    </div>
  )
}
