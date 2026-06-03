import type { Vehicle } from '@/types'

export async function lookupReg(reg: string): Promise<Vehicle> {
  const clean = reg.toUpperCase().replace(/\s+/g, '')
  const res = await fetch('/api/dvla/vehicle-enquiry/v1/vehicles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationNumber: clean }),
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error('Vehicle not found. Check the registration number.')
    throw new Error(`DVLA lookup failed: ${res.status}`)
  }
  const d = await res.json()
  return {
    reg: clean,
    make: d.make || 'Unknown',
    model: d.model || '',
    year: String(d.yearOfManufacture || ''),
    colour: d.colour || '',
    fuelType: d.fuelType || '',
    motStatus: d.motStatus || 'Unknown',
    taxStatus: d.taxStatus || 'Unknown',
    addedAt: Date.now(),
  }
}
