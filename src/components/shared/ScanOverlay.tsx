'use client'

export default function ScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-0.5 animate-scanLine"
        style={{ background: 'linear-gradient(90deg, transparent, #ff2429, transparent)', boxShadow: '0 0 8px #ff2429' }}
      />

      {/* Corner brackets */}
      {/* Top left */}
      <div className="absolute top-4 left-4">
        <div style={{ width: 24, height: 3, background: 'var(--cyan)' }} />
        <div style={{ width: 3, height: 24, background: 'var(--cyan)', marginTop: -3 }} />
      </div>
      {/* Top right */}
      <div className="absolute top-4 right-4 flex flex-col items-end">
        <div style={{ width: 24, height: 3, background: 'var(--cyan)' }} />
        <div style={{ width: 3, height: 24, background: 'var(--cyan)', marginTop: -3 }} />
      </div>
      {/* Bottom left */}
      <div className="absolute bottom-4 left-4 flex flex-col">
        <div style={{ width: 3, height: 24, background: 'var(--cyan)' }} />
        <div style={{ width: 24, height: 3, background: 'var(--cyan)', marginTop: -3 }} />
      </div>
      {/* Bottom right */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end">
        <div style={{ width: 3, height: 24, background: 'var(--cyan)' }} />
        <div style={{ width: 24, height: 3, background: 'var(--cyan)', marginTop: -3 }} />
      </div>

      {/* Pulsing border */}
      <div
        className="absolute inset-2 rounded-lg"
        style={{ border: '1px solid rgba(0,220,240,0.3)', animation: 'criticalPulse 2s ease-in-out infinite' }}
      />
    </div>
  )
}
