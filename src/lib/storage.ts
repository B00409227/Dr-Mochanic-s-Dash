import type { ScanResult, Vehicle, ServiceEntry, ChatMessage } from '@/types'

const PREFIX = 'drm_'

function safe<T>(fn: () => T, fallback: T): T {
  try { return fn() } catch { return fallback }
}

// Gemini API Key
export function getGeminiKey(): string {
  return safe(() => typeof window !== 'undefined' ? (localStorage.getItem(PREFIX + 'gemini_key') || '') : '', '')
}
export function saveGeminiKey(key: string): void {
  safe(() => localStorage.setItem(PREFIX + 'gemini_key', key), undefined)
}

// Maps Key
export function getMapsKey(): string {
  return safe(() => typeof window !== 'undefined' ? (localStorage.getItem(PREFIX + 'maps_key') || '') : '', '')
}
export function saveMapsKey(key: string): void {
  safe(() => localStorage.setItem(PREFIX + 'maps_key', key), undefined)
}

// Scan History
export function getScanHistory(): ScanResult[] {
  return safe(() => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(PREFIX + 'scans')
    return raw ? (JSON.parse(raw) as ScanResult[]) : []
  }, [])
}
export function saveScan(scan: ScanResult): void {
  safe(() => {
    const scans = getScanHistory()
    scans.unshift(scan)
    if (scans.length > 50) scans.splice(50)
    localStorage.setItem(PREFIX + 'scans', JSON.stringify(scans))
  }, undefined)
}
export function deleteScan(id: string): void {
  safe(() => {
    const scans = getScanHistory().filter(s => s.id !== id)
    localStorage.setItem(PREFIX + 'scans', JSON.stringify(scans))
  }, undefined)
}

// Vehicles
export function getVehicles(): Vehicle[] {
  return safe(() => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(PREFIX + 'vehicles')
    return raw ? (JSON.parse(raw) as Vehicle[]) : []
  }, [])
}
export function saveVehicle(v: Vehicle): void {
  safe(() => {
    const vehicles = getVehicles().filter(x => x.reg !== v.reg)
    vehicles.unshift(v)
    localStorage.setItem(PREFIX + 'vehicles', JSON.stringify(vehicles))
  }, undefined)
}
export function deleteVehicle(reg: string): void {
  safe(() => {
    const vehicles = getVehicles().filter(v => v.reg !== reg)
    localStorage.setItem(PREFIX + 'vehicles', JSON.stringify(vehicles))
  }, undefined)
}

// Service History
export function getServiceHistory(): ServiceEntry[] {
  return safe(() => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(PREFIX + 'service_history')
    return raw ? (JSON.parse(raw) as ServiceEntry[]) : []
  }, [])
}
export function saveServiceEntry(e: ServiceEntry): void {
  safe(() => {
    const history = getServiceHistory()
    history.unshift(e)
    localStorage.setItem(PREFIX + 'service_history', JSON.stringify(history))
  }, undefined)
}
export function deleteServiceEntry(id: string): void {
  safe(() => {
    const history = getServiceHistory().filter(e => e.id !== id)
    localStorage.setItem(PREFIX + 'service_history', JSON.stringify(history))
  }, undefined)
}

// Chat History
export function getChatHistory(): ChatMessage[] {
  return safe(() => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(PREFIX + 'chat_history')
    return raw ? (JSON.parse(raw) as ChatMessage[]) : []
  }, [])
}
export function saveChatMessage(m: ChatMessage): void {
  safe(() => {
    const msgs = getChatHistory()
    msgs.push(m)
    if (msgs.length > 200) msgs.splice(0, msgs.length - 200)
    localStorage.setItem(PREFIX + 'chat_history', JSON.stringify(msgs))
  }, undefined)
}
export function clearChatHistory(): void {
  safe(() => localStorage.removeItem(PREFIX + 'chat_history'), undefined)
}

// Settings
export function getSettings(): Record<string, string> {
  return safe(() => {
    if (typeof window === 'undefined') return {}
    const raw = localStorage.getItem(PREFIX + 'settings')
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  }, {})
}
export function saveSettings(s: Record<string, string>): void {
  safe(() => localStorage.setItem(PREFIX + 'settings', JSON.stringify(s)), undefined)
}

// Clear All
export function clearAllData(): void {
  safe(() => {
    if (typeof window === 'undefined') return
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX))
    keys.forEach(k => localStorage.removeItem(k))
  }, undefined)
}
