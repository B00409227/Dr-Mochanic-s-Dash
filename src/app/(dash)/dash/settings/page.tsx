'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { getMapsKey, saveMapsKey, clearAllData } from '@/lib/storage'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [mapsKey, setMapsKey] = useState('')
  const [showMaps, setShowMaps] = useState(false)

  useEffect(() => {
    setMapsKey(getMapsKey())
  }, [])

  function handleSaveMaps() {
    saveMapsKey(mapsKey.trim())
    toast.success('Maps API key saved')
  }

  function handleClearAll() {
    if (!window.confirm('Delete ALL app data? This cannot be undone.')) return
    clearAllData()
    setMapsKey('')
    toast.success('All data cleared')
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Settings</h1>

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
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Google Maps API Key</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Optional — enables the nearby garage finder map. Get a free key from{' '}
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>
            console.cloud.google.com
          </a>
        </p>
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
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            {showMaps ? 'Hide' : 'Show'}
          </button>
        </div>
        <button onClick={handleSaveMaps} className="btn-cyan w-full py-2 text-sm">Save Maps Key</button>
        {mapsKey && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs" style={{ color: '#22c55e' }}>Key saved</span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Device Status</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'AI Diagnostics', available: true, note: 'Server-powered' },
            { label: 'OBD2 Bluetooth', available: typeof window !== 'undefined' && !!(navigator as unknown as { bluetooth?: unknown }).bluetooth, note: 'Chrome required' },
            { label: 'Camera Access', available: typeof window !== 'undefined' && !!navigator.mediaDevices, note: 'HTTPS required' },
            { label: 'Garage Finder Map', available: !!mapsKey, note: mapsKey ? 'Key saved' : 'Add Maps key above' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <span style={{ color: 'var(--muted)' }}>{item.label}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--muted)', opacity: 0.6 }}>{item.note}</span>
              </div>
              <span className={`text-xs font-bold ${item.available ? 'text-green-300' : 'text-red-300'}`}>
                {item.available ? 'Ready' : 'Not available'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,36,41,0.06)', border: '1px solid rgba(255,36,41,0.2)' }}>
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: '#ff2429' }}>Danger Zone</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Delete all stored scans, vehicles, service history, and chat history from this device.
        </p>
        <button onClick={handleClearAll} className="btn-red w-full py-3">Clear All App Data</button>
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
