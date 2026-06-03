'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { lookupOBD2Code } from '@/lib/gemini'
import { localOBD2Lookup } from '@/lib/obd2Codes'
import { initELM327, readAllPIDs, readDTCs, clearDTCs } from '@/lib/obd2PIDs'
import type { OBD2Result, LiveOBD2Data } from '@/types'
import OBD2Card from '@/components/shared/OBD2Card'
import LiveDataGauge from '@/components/shared/LiveDataGauge'
import LoadingRadar from '@/components/shared/LoadingRadar'
import NoApiKey from '@/components/shared/NoApiKey'
import toast from 'react-hot-toast'

function OBD2PageInner() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'lookup' | 'bluetooth' | 'tuning'>('lookup')
  const [codeInput, setCodeInput] = useState('')
  const [result, setResult] = useState<OBD2Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [noKey, setNoKey] = useState(false)
  const [history, setHistory] = useState<OBD2Result[]>([])
  const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null)
  const [btChar, setBtChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null)
  const [liveData, setLiveData] = useState<LiveOBD2Data | null>(null)
  const [dtcs, setDtcs] = useState<string[]>([])
  const [polling, setPolling] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem('drm_obd2_history') || '[]')) } catch {}
    const code = searchParams.get('code')
    if (code) { setCodeInput(code); handleLookupCode(code) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLookupCode(code?: string) {
    const c = (code || codeInput).trim().toUpperCase()
    if (!c) return
    setLoading(true)
    setNoKey(false)
    sessionStorage.setItem('drm_last_obd2', c)

    const local = localOBD2Lookup(c)
    if (local) {
      setResult({
        code: local.code, fullName: local.name, system: 'OBD2', severity: local.severity,
        whatItMeans: local.description, symptoms: [], commonCauses: [], fixSteps: [],
        partsNeeded: [], estimatedCostGBP: 'See AI for estimate', canFixYourself: false,
        relatedCodes: [], howUrgent: 'Use AI for full detail', worstCaseIfIgnored: 'Use AI for full detail',
      })
    }
    try {
      const full = await lookupOBD2Code(c)
      setResult(full)
      const h = [full, ...history.filter(x => x.code !== full.code)].slice(0, 20)
      setHistory(h)
      localStorage.setItem('drm_obd2_history', JSON.stringify(h))
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg === 'NO_API_KEY') setNoKey(true)
      else if (!local) toast.error('Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  async function connectBluetooth() {
    if (!navigator.bluetooth) { toast.error('Web Bluetooth requires Chrome on Android or Desktop'); return }
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb', 'fff0'],
      })
      setBtDevice(device)
      const server = await device.gatt?.connect()
      if (!server) throw new Error('GATT connect failed')
      const services = await server.getPrimaryServices()
      let char: BluetoothRemoteGATTCharacteristic | null = null
      for (const svc of services) {
        try {
          const chars = await svc.getCharacteristics()
          char = chars[0]
          break
        } catch {}
      }
      if (!char) throw new Error('No characteristic found')
      await char.startNotifications()
      setBtChar(char)
      await initELM327(char)
      toast.success(`Connected to ${device.name || 'OBD2 Dongle'}`)
      const data = await readAllPIDs(char)
      setLiveData(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Bluetooth failed')
    }
  }

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    setPolling(false)
  }, [])

  const startPolling = useCallback(() => {
    if (!btChar) return
    setPolling(true)
    pollRef.current = setInterval(async () => {
      try {
        const data = await readAllPIDs(btChar)
        setLiveData(data)
      } catch { stopPolling() }
    }, 2000)
  }, [btChar, stopPolling])

  useEffect(() => { return () => { if (pollRef.current) clearInterval(pollRef.current) } }, [])

  async function handleReadDTCs() {
    if (!btChar) return
    try {
      const codes = await readDTCs(btChar)
      setDtcs(codes)
      if (codes.length === 0) toast.success('No fault codes found')
    } catch { toast.error('DTC read failed') }
  }

  async function handleClearDTCs() {
    if (!btChar || !window.confirm('Clear all fault codes? This cannot be undone.')) return
    try { await clearDTCs(btChar); setDtcs([]); toast.success('Fault codes cleared') }
    catch { toast.error('Clear failed') }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">
      {loading && <LoadingRadar text="Looking up code..." />}

      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>OBD2 Diagnostics</h1>

      <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {(['lookup', 'bluetooth', 'tuning'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 text-xs font-rajdhani font-bold transition-all capitalize"
            style={{ background: tab === t ? 'var(--cyan)' : 'transparent', color: tab === t ? '#010312' : 'var(--muted)' }}>
            {t === 'lookup' ? 'Code Lookup' : t === 'bluetooth' ? 'Bluetooth' : 'Live Tuning'}
          </button>
        ))}
      </div>

      {tab === 'lookup' && (
        <div className="space-y-4">
          {noKey && <NoApiKey compact />}
          <div className="flex gap-2">
            <input value={codeInput} onChange={e => setCodeInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleLookupCode()}
              placeholder="P0420" className="flex-1 px-4 py-3 rounded-lg font-mono text-lg outline-none tracking-wider"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--cyan)' }} maxLength={6} />
            <button onClick={() => handleLookupCode()} className="btn-cyan px-5">Look Up</button>
          </div>
          {result && <OBD2Card result={result} />}
          {history.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-rajdhani font-bold" style={{ color: 'var(--muted)' }}>RECENT ({history.length})</p>
                <button onClick={() => { setHistory([]); localStorage.removeItem('drm_obd2_history') }} className="text-xs" style={{ color: '#ff2429' }}>Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map(h => (
                  <button key={h.code} onClick={() => { setCodeInput(h.code); handleLookupCode(h.code) }}
                    className="text-xs px-3 py-1.5 rounded-full font-mono" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    {h.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'bluetooth' && (
        <div className="space-y-4">
          {!btDevice ? (
            <div className="card rounded-xl p-6 text-center space-y-3">
              <div className="text-3xl">🔌</div>
              <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>Connect OBD2 Dongle</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Requires Chrome browser and an ELM327 Bluetooth OBD2 adapter</p>
              <button onClick={connectBluetooth} className="btn-cyan">Connect via Bluetooth</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{btDevice.name || 'OBD2 Dongle'}</span>
                </div>
                <button onClick={() => { btDevice.gatt?.disconnect(); setBtDevice(null); setBtChar(null); setLiveData(null); stopPolling() }} className="text-xs" style={{ color: '#ff2429' }}>Disconnect</button>
              </div>
              {liveData && (
                <div className="grid grid-cols-3 gap-4">
                  <LiveDataGauge label="RPM" value={liveData.rpm} unit="rpm" min={0} max={8000} warning={6000} critical={7500} />
                  <LiveDataGauge label="Speed" value={liveData.speed} unit="km/h" min={0} max={240} />
                  <LiveDataGauge label="Coolant" value={liveData.coolantTemp} unit="°C" min={0} max={130} warning={100} critical={115} />
                  <LiveDataGauge label="Throttle" value={liveData.throttle} unit="%" min={0} max={100} />
                  <LiveDataGauge label="Fuel" value={liveData.fuelLevel} unit="%" min={0} max={100} warning={20} critical={10} />
                  <LiveDataGauge label="Load" value={liveData.engineLoad} unit="%" min={0} max={100} warning={80} critical={95} />
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <button onClick={handleReadDTCs} className="btn-outline flex-1 py-2 text-sm">Scan Fault Codes</button>
                <button onClick={handleClearDTCs} className="flex-1 py-2 text-sm rounded-lg font-rajdhani font-bold" style={{ background: 'rgba(255,36,41,0.1)', border: '1px solid rgba(255,36,41,0.3)', color: '#ff2429' }}>Clear Codes</button>
              </div>
              {dtcs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-rajdhani font-bold" style={{ color: '#ff2429' }}>FAULT CODES ({dtcs.length})</p>
                  {dtcs.map(code => (
                    <div key={code} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,36,41,0.08)', border: '1px solid rgba(255,36,41,0.2)' }}>
                      <span className="font-mono font-bold" style={{ color: '#ff2429' }}>{code}</span>
                      <button onClick={() => { setTab('lookup'); setCodeInput(code); handleLookupCode(code) }} className="text-xs" style={{ color: 'var(--cyan)' }}>Look up →</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'tuning' && (
        <div className="space-y-4">
          {!btDevice ? (
            <div className="card rounded-xl p-6 text-center">
              <p style={{ color: 'var(--muted)' }}>Connect OBD2 dongle in the Bluetooth tab first.</p>
              <button onClick={() => setTab('bluetooth')} className="btn-outline mt-3">Go to Bluetooth</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${polling ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-sm font-rajdhani font-bold" style={{ color: polling ? '#22c55e' : 'var(--muted)' }}>
                    {polling ? 'AI Co-Pilot Active' : 'Paused'}
                  </span>
                </div>
                <button onClick={polling ? stopPolling : startPolling} className={polling ? 'btn-outline text-sm py-1.5 px-4' : 'btn-cyan text-sm py-1.5 px-4'}>
                  {polling ? 'Pause' : 'Start'}
                </button>
              </div>
              {liveData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <LiveDataGauge label="RPM" value={liveData.rpm} unit="rpm" min={0} max={8000} warning={6000} critical={7500} />
                  <LiveDataGauge label="Speed" value={liveData.speed} unit="km/h" min={0} max={240} />
                  <LiveDataGauge label="Coolant" value={liveData.coolantTemp} unit="°C" min={0} max={130} warning={100} critical={115} />
                  <LiveDataGauge label="Throttle" value={liveData.throttle} unit="%" min={0} max={100} />
                  <LiveDataGauge label="Fuel" value={liveData.fuelLevel} unit="%" min={0} max={100} warning={20} critical={10} />
                  <LiveDataGauge label="Battery" value={liveData.batteryVoltage} unit="V" min={10} max={15} warning={11.5} critical={11} />
                  <LiveDataGauge label="S.Trim" value={liveData.shortFuelTrim} unit="%" min={-25} max={25} warning={15} critical={20} />
                  <LiveDataGauge label="L.Trim" value={liveData.longFuelTrim} unit="%" min={-25} max={25} warning={15} critical={20} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-center text-xs pt-2" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}

export default function OBD2Page() {
  return (
    <Suspense fallback={<div className="px-4 py-6 text-center" style={{ color: 'var(--muted)' }}>Loading OBD2...</div>}>
      <OBD2PageInner />
    </Suspense>
  )
}
