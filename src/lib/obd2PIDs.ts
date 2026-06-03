export const PIDS = {
  RPM: { mode: '01', pid: '0C', name: 'RPM', unit: 'rpm', parse: (hex: string) => parseInt(hex, 16) / 4 },
  SPEED: { mode: '01', pid: '0D', name: 'Speed', unit: 'km/h', parse: (hex: string) => parseInt(hex, 16) },
  COOLANT: { mode: '01', pid: '05', name: 'Coolant Temp', unit: 'C', parse: (hex: string) => parseInt(hex, 16) - 40 },
  INTAKE: { mode: '01', pid: '0F', name: 'Intake Temp', unit: 'C', parse: (hex: string) => parseInt(hex, 16) - 40 },
  THROTTLE: { mode: '01', pid: '11', name: 'Throttle', unit: '%', parse: (hex: string) => Math.round(parseInt(hex, 16) * 100 / 255) },
  LOAD: { mode: '01', pid: '04', name: 'Engine Load', unit: '%', parse: (hex: string) => Math.round(parseInt(hex, 16) * 100 / 255) },
  FUEL_LEVEL: { mode: '01', pid: '2F', name: 'Fuel Level', unit: '%', parse: (hex: string) => Math.round(parseInt(hex, 16) * 100 / 255) },
  SHORT_FUEL_TRIM: { mode: '01', pid: '06', name: 'Short Fuel Trim', unit: '%', parse: (hex: string) => (parseInt(hex, 16) - 128) * 100 / 128 },
  LONG_FUEL_TRIM: { mode: '01', pid: '07', name: 'Long Fuel Trim', unit: '%', parse: (hex: string) => (parseInt(hex, 16) - 128) * 100 / 128 },
  RUNTIME: { mode: '01', pid: '1F', name: 'Run Time', unit: 's', parse: (hex: string) => parseInt(hex.slice(0, 2), 16) * 256 + parseInt(hex.slice(2, 4), 16) },
}

export async function sendELM327Command(
  characteristic: BluetoothRemoteGATTCharacteristic,
  cmd: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('ELM327 timeout')), 3000)
    const handler = (event: Event) => {
      const value = (event.target as BluetoothRemoteGATTCharacteristic).value
      if (!value) return
      const text = new TextDecoder().decode(value)
      clearTimeout(timeout)
      characteristic.removeEventListener('characteristicvaluechanged', handler)
      resolve(text.trim())
    }
    characteristic.addEventListener('characteristicvaluechanged', handler)
    const bytes = new TextEncoder().encode(cmd + '\r')
    characteristic.writeValue(bytes).catch(reject)
  })
}

export async function initELM327(char: BluetoothRemoteGATTCharacteristic): Promise<void> {
  await sendELM327Command(char, 'ATZ')
  await new Promise(r => setTimeout(r, 1500))
  await sendELM327Command(char, 'ATE0')
  await new Promise(r => setTimeout(r, 500))
  await sendELM327Command(char, 'ATL0')
  await new Promise(r => setTimeout(r, 500))
  await sendELM327Command(char, 'ATH0')
  await new Promise(r => setTimeout(r, 500))
  await sendELM327Command(char, 'ATSP0')
}

export async function readAllPIDs(char: BluetoothRemoteGATTCharacteristic) {
  const results: Record<string, number> = {}
  for (const [key, pid] of Object.entries(PIDS)) {
    try {
      const response = await sendELM327Command(char, `${pid.mode}${pid.pid}`)
      const hex = response.replace(/\s/g, '').slice(4)
      results[key] = pid.parse(hex)
    } catch {
      results[key] = 0
    }
  }
  return {
    rpm: results.RPM || 0,
    speed: results.SPEED || 0,
    coolantTemp: results.COOLANT || 0,
    intakeTemp: results.INTAKE || 0,
    throttle: results.THROTTLE || 0,
    engineLoad: results.LOAD || 0,
    fuelLevel: results.FUEL_LEVEL || 0,
    batteryVoltage: 12.0,
    ambientTemp: results.INTAKE || 20,
    shortFuelTrim: results.SHORT_FUEL_TRIM || 0,
    longFuelTrim: results.LONG_FUEL_TRIM || 0,
    timestamp: Date.now(),
  }
}

export async function readDTCs(char: BluetoothRemoteGATTCharacteristic): Promise<string[]> {
  const response = await sendELM327Command(char, '03')
  const codes: string[] = []
  const bytes = response.replace(/\s/g, '')
  for (let i = 0; i < bytes.length - 3; i += 4) {
    const b1 = parseInt(bytes.slice(i, i + 2), 16)
    const b2 = parseInt(bytes.slice(i + 2, i + 4), 16)
    if (b1 === 0 && b2 === 0) continue
    const prefix = ['P', 'P', 'B', 'C'][(b1 >> 6) & 3]
    const code = `${prefix}${((b1 & 0x3F) >> 4).toString()}${(b1 & 0x0F).toString(16).toUpperCase()}${b2.toString(16).padStart(2, '0').toUpperCase()}`
    codes.push(code)
  }
  return codes
}

export async function clearDTCs(char: BluetoothRemoteGATTCharacteristic): Promise<void> {
  await sendELM327Command(char, '04')
}
