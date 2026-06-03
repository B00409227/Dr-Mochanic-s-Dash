'use client'

interface CommunityAlertProps {
  make: string
  model: string
  faultCount: number
  faultDescription: string
}

export default function CommunityAlert({ make, model, faultCount, faultDescription }: CommunityAlertProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{ background: 'rgba(255,36,41,0.08)', border: '1px solid rgba(255,36,41,0.3)' }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: '#ff2429', flexShrink: 0 }}>
        <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14" r="0.75" fill="currentColor" />
      </svg>
      <p className="text-sm" style={{ color: 'var(--text)' }}>
        <span style={{ color: '#ff2429', fontWeight: 700 }}>{faultCount} {make} {model} owners</span> reported {faultDescription} recently
      </p>
    </div>
  )
}
