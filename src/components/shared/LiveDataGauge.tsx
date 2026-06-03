'use client'
import { useEffect, useRef } from 'react'

interface LiveDataGaugeProps {
  label: string
  value: number
  unit: string
  min: number
  max: number
  warning?: number
  critical?: number
}

export default function LiveDataGauge({ label, value, unit, min, max, warning, critical }: LiveDataGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const size = 120
  const radius = 44
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius * 0.75

  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)))

  let color = '#00dcf0'
  if (critical !== undefined && value >= critical) color = '#ff2429'
  else if (warning !== undefined && value >= warning) color = '#f59e0b'

  useEffect(() => {
    if (!circleRef.current) return
    const offset = circumference - pct * circumference
    circleRef.current.style.strokeDashoffset = String(offset)
  }, [pct, circumference])

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          strokeDashoffset={circumference * 0.125}
          strokeLinecap="round"
          style={{ transform: 'rotate(135deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
        <circle
          ref={circleRef}
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{ transform: 'rotate(135deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease', filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={size * 0.15} fontFamily="Orbitron, sans-serif" fontWeight="bold">
          {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
        </text>
        <text x={cx} y={cy + 17} textAnchor="middle" fill="var(--muted)" fontSize={size * 0.1} fontFamily="Rajdhani, sans-serif">
          {unit}
        </text>
      </svg>
      <p className="text-xs text-center mt-1" style={{ color: 'var(--muted)', fontFamily: 'Rajdhani, sans-serif' }}>{label}</p>
    </div>
  )
}
