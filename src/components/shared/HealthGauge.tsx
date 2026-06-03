'use client'
import { useEffect, useRef } from 'react'

interface HealthGaugeProps {
  score: number
  size?: number
}

export default function HealthGauge({ score, size = 200 }: HealthGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null)

  const radius = size * 0.38
  const cx = size / 2
  const cy = size * 0.55
  const circumference = Math.PI * radius
  const color = score >= 71 ? '#00dcf0' : score >= 41 ? '#f59e0b' : '#ff2429'

  useEffect(() => {
    if (!circleRef.current) return
    const offset = circumference - (score / 100) * circumference
    circleRef.current.style.transition = 'none'
    circleRef.current.style.strokeDashoffset = String(circumference)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (circleRef.current) {
          circleRef.current.style.transition = 'stroke-dashoffset 1.2s ease'
          circleRef.current.style.strokeDashoffset = String(offset)
        }
      })
    })
  }, [score, circumference])

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={size * 0.06}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(180 ${cx} ${cy})`}
        />
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.06}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(180 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text
          x={cx}
          y={cy + size * 0.06}
          textAnchor="middle"
          fill={color}
          fontSize={size * 0.2}
          fontFamily="Orbitron, sans-serif"
          fontWeight="900"
        >
          {score}
        </text>
      </svg>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Rajdhani, sans-serif' }}>
        Health Score
      </p>
    </div>
  )
}
