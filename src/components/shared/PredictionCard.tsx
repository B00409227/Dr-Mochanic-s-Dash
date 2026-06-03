'use client'

interface PredictionCardProps {
  issue: string
  confidence: number
  timeframe: string
  recommendation: string
}

export default function PredictionCard({ issue, confidence, timeframe, recommendation }: PredictionCardProps) {
  const color = confidence >= 71 ? '#00dcf0' : confidence >= 41 ? '#f59e0b' : '#ff2429'

  return (
    <div className="card rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-rajdhani font-bold text-base" style={{ color: 'var(--text)' }}>{issue}</p>
        <span className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
          {timeframe}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>Confidence</span>
          <span style={{ color }}>{confidence}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${confidence}%`, background: color, boxShadow: `0 0 6px ${color}` }}
          />
        </div>
      </div>

      <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.8 }}>{recommendation}</p>
    </div>
  )
}
