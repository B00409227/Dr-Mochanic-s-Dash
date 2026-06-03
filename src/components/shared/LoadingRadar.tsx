'use client'

interface LoadingRadarProps {
  text?: string
}

export default function LoadingRadar({ text }: LoadingRadarProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'rgba(1,3,18,0.92)', backdropFilter: 'blur(4px)' }}>
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        {/* Rings */}
        {[0, 0.5, 1].map((delay, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-radarRing"
            style={{
              width: 80,
              height: 80,
              border: '2px solid var(--cyan)',
              animationDelay: `${delay}s`,
            }}
          />
        ))}
        {/* Spinning element */}
        <div
          className="absolute animate-radarSpin"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 270deg, rgba(0,220,240,0.6) 360deg)',
          }}
        />
        {/* Center dot */}
        <div className="absolute w-3 h-3 rounded-full" style={{ background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan)' }} />
      </div>

      {text && (
        <p className="mt-6 font-rajdhani text-lg" style={{ color: 'var(--cyan)' }}>{text}</p>
      )}
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>Dr Mochanic is analysing...</p>
    </div>
  )
}
