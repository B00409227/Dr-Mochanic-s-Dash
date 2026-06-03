'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { getGeminiKey, saveGeminiKey, getMapsKey, saveMapsKey, clearAllData } from '@/lib/storage'
import { lookupOBD2Code } from '@/lib/gemini'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('')
  const [mapsKey, setMapsKey] = useState('')
  const [showGemini, setShowGemini] = useState(false)
  const [showMaps, setShowMaps] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    setGeminiKey(getGeminiKey())
    setMapsKey(getMapsKey())
  }, [])

  function handleSaveGemini() {
    saveGeminiKey(geminiKey.trim())
    toast.success('Gemini API key saved')
  }

  function handleSaveMaps() {
    saveMapsKey(mapsKey.trim())
    toast.success('Maps API key saved')
  }

  async function handleTestKey() {
    if (!geminiKey.trim()) { toast.error('Add a key first'); return }
    saveGeminiKey(geminiKey.trim())
    setTesting(true)
    try {
      await lookupOBD2Code('P0420')
      toast.success('API key works!')
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') toast.error('Key not saved correctly')
      else toast.success('API key appears valid')
    } finally { setTesting(false) }
  }

  function handleClearAll() {
    if (!window.confirm('Delete ALL app data? This cannot be undone.')) return
    clearAllData()
    setGeminiKey('')
    setMapsKey('')
    toast.success('All data cleared')
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Settings</h1>

      {/* Gemini */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Gemini API Key</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Required for all AI features. Get your free key at{' '}
          <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>aistudio.google.com</a>
        </p>
        <div className="flex gap-2">
          <input
            type={showGemini ? 'text' : 'password'}
            value={geminiKey}
            onChange={e => setGeminiKey(e.target.value)}
            placeholder="AIza..."
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none font-mono"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <button onClick={() => setShowGemini(!showGemini)} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {showGemini ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveGemini} className="btn-cyan flex-1 py-2 text-sm">Save Key</button>
          <button onClick={handleTestKey} disabled={testing} className="btn-outline flex-1 py-2 text-sm disabled:opacity-40">
            {testing ? 'Testing...' : 'Test Key'}
          </button>
        </div>
        {geminiKey && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="text-xs" style={{ color: '#22c55e' }}>Key saved</span></div>}
      </div>

      {/* Maps Key */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Google Maps API Key</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Optional. Enables nearby garage finder. Get from{' '}
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)' }}>console.cloud.google.com</a>
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
          <button onClick={() => setShowMaps(!showMaps)} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {showMaps ? 'Hide' : 'Show'}
          </button>
        </div>
        <button onClick={handleSaveMaps} className="btn-cyan w-full py-2 text-sm">Save Maps Key</button>
      </div>

      {/* Status */}
      <div className="card rounded-xl p-5 space-y-3">
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Status</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: 'OBD2 Bluetooth', available: typeof window !== 'undefined' && !!(navigator as unknown as { bluetooth?: unknown }).bluetooth },
            { label: 'Camera Access', available: typeof window !== 'undefined' && !!navigator.mediaDevices },
            { label: 'AI (Gemini)', available: !!geminiKey },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span style={{ color: 'var(--muted)' }}>{item.label}</span>
              <span className={`text-xs font-bold ${item.available ? 'text-green-300' : 'text-red-300'}`}>{item.available ? 'Available' : 'Not available'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,36,41,0.06)', border: '1px solid rgba(255,36,41,0.2)' }}>
        <h2 className="font-rajdhani font-bold text-lg" style={{ color: '#ff2429' }}>Danger Zone</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Delete all stored scans, vehicles, API keys, and chat history from this device.</p>
        <button onClick={handleClearAll} className="btn-red w-full py-3">Clear All App Data</button>
      </div>

      {/* About */}
      <div className="card rounded-xl p-5 space-y-2 text-sm text-center" style={{ color: 'var(--muted)' }}>
        <p className="font-orbitron font-bold" style={{ color: 'var(--cyan)' }}>Dr Mochanic&apos;s Dash v2.0</p>
        <p>AI-powered vehicle diagnostics</p>
        <p>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</p>
      </div>
    </div>
  )
}
