'use client'
import Link from 'next/link'

export default function GarageFinderPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <h1 className="font-orbitron text-xl" style={{ color: 'var(--text)' }}>Garage Finder</h1>

      {/* Dr Mochanic featured first */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{ background: 'rgba(0,220,240,0.06)', border: '2px solid rgba(0,220,240,0.3)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'var(--cyan)', color: '#010312' }}>
                Our Recommended Garage
              </span>
            </div>
            <h2 className="font-rajdhani font-bold text-xl" style={{ color: 'var(--text)' }}>Dr Mochanic, Glasgow</h2>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Glasgow&apos;s AI-Powered Garage</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#f59e0b' }}>★</span>)}
          </div>
        </div>

        <div className="space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
          <p>📍 Glasgow, G1 [Address Placeholder]</p>
          <p>⏰ Mon–Fri 8am–6pm · Sat 9am–4pm</p>
          <p><a href="tel:PLACEHOLDER" style={{ color: 'var(--cyan)' }}>📞 [PLACEHOLDER]</a></p>
          <p><a href="https://wa.me/PLACEHOLDER" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>💬 WhatsApp: [PLACEHOLDER]</a></p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['AI Diagnostics', 'MOT Prep', 'Full Service', 'Brakes', 'Tyres', 'OBD2'].map(s => (
            <span key={s} className="px-2 py-1 rounded" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>{s}</span>
          ))}
        </div>

        <a href="https://drmochanic.co.uk/book" target="_blank" rel="noopener noreferrer" className="btn-red block text-center py-3">
          Book Now at Dr Mochanic
        </a>
      </div>

      {/* Map placeholder */}
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height: 300, background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="text-center space-y-2 p-4">
          <p className="text-3xl">🗺️</p>
          <p className="font-rajdhani font-bold" style={{ color: 'var(--text)' }}>Nearby Garages</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Add your Google Maps API key in Settings to see nearby garages.
          </p>
          <Link href="/dash/settings" className="btn-outline text-sm py-2 px-4 inline-block">Add Maps Key</Link>
        </div>
      </div>

      <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk</div>
    </div>
  )
}
