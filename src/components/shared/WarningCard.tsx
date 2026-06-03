'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { WarningLight } from '@/types'

interface WarningCardProps {
  light: WarningLight
  defaultExpanded?: boolean
}

export default function WarningCard({ light, defaultExpanded = false }: WarningCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const colors = {
    CRITICAL: { border: '#ff2429', bg: 'rgba(255,36,41,0.08)', badge: 'bg-red-900 text-red-300' },
    WARNING: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', badge: 'bg-amber-900 text-amber-300' },
    INFO: { border: '#00dcf0', bg: 'rgba(0,220,240,0.08)', badge: 'bg-cyan-900 text-cyan-300' },
  }
  const c = colors[light.severity]

  return (
    <div
      className={`rounded-xl overflow-hidden ${light.severity === 'CRITICAL' ? 'animate-criticalPulse' : ''}`}
      style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, border: `1px solid ${c.border}33` }}
    >
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-rajdhani font-bold text-base" style={{ color: 'var(--text)' }}>
            {light.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${c.badge}`}>
            {light.severity}
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
            {light.estimatedCostGBP}
          </span>
        </div>
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--muted)', flexShrink: 0 }}
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fadeSlideUp">
          <p style={{ color: 'var(--text)', opacity: 0.9 }} className="text-sm">{light.meaning}</p>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              {light.urgency}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${light.canFixYourself ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
              {light.canFixYourself ? 'DIY Possible' : 'Garage Recommended'}
            </span>
          </div>

          {light.fixSteps.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)' }}>STEPS:</p>
              <ol className="space-y-1">
                {light.fixSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>
                    <span className="font-bold flex-shrink-0" style={{ color: c.border }}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {light.relatedOBD2Codes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {light.relatedOBD2Codes.map(code => (
                <Link
                  key={code}
                  href={`/dash/obd2?code=${code}`}
                  className="text-xs px-2 py-0.5 rounded font-mono hover:opacity-80 transition-opacity"
                  style={{ background: 'rgba(0,220,240,0.15)', color: 'var(--cyan)', border: '1px solid rgba(0,220,240,0.3)' }}
                >
                  {code}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
