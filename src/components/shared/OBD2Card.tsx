'use client'
import { useState } from 'react'
import type { OBD2Result } from '@/types'

interface OBD2CardProps {
  result: OBD2Result
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t" style={{ borderColor: 'var(--border)' }}>
      <button
        className="w-full flex justify-between items-center py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-bold font-rajdhani uppercase" style={{ color: 'var(--muted)' }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s', color: 'var(--muted)' }}>
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

export default function OBD2Card({ result }: OBD2CardProps) {
  const severityColors = {
    CRITICAL: '#ff2429',
    WARNING: '#f59e0b',
    INFO: '#00dcf0',
  }
  const color = severityColors[result.severity]

  return (
    <div className="card rounded-xl overflow-hidden">
      <div className="p-1" style={{ background: color }} />
      <div className="p-5 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <span className="font-orbitron text-2xl font-bold" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }}>
            {result.code}
          </span>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
              {result.system}
            </span>
            <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: `${color}22`, color }}>
              {result.severity}
            </span>
          </div>
        </div>
        <p className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>{result.fullName}</p>
      </div>

      <div className="px-5 pb-5 space-y-0">
        <Section title="What it means">
          <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>{result.whatItMeans}</p>
        </Section>

        <Section title="Symptoms">
          <ul className="space-y-1">
            {result.symptoms.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>
                <span style={{ color }}>•</span>{s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Common causes">
          <ul className="space-y-1">
            {result.commonCauses.map((c, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>
                <span style={{ color: '#f59e0b' }}>•</span>{c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Fix steps">
          <ol className="space-y-2">
            {result.fixSteps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>
                <span className="font-bold flex-shrink-0" style={{ color }}>{i + 1}.</span>{step}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Parts needed">
          <div className="flex flex-wrap gap-2">
            {result.partsNeeded.map((p, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,220,240,0.08)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                {p}
              </span>
            ))}
          </div>
        </Section>

        <Section title="How urgent">
          <p className="text-sm" style={{ color: 'var(--text)', opacity: 0.85 }}>{result.howUrgent}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
              {result.estimatedCostGBP}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${result.canFixYourself ? 'text-green-300 bg-green-900/30' : 'text-red-300 bg-red-900/30'}`}>
              {result.canFixYourself ? 'DIY Possible' : 'Garage Recommended'}
            </span>
          </div>
        </Section>

        <Section title="Worst case if ignored">
          <p className="text-sm" style={{ color: '#f59e0b', opacity: 0.9 }}>{result.worstCaseIfIgnored}</p>
        </Section>

        {result.relatedCodes.length > 0 && (
          <Section title="Related codes">
            <div className="flex flex-wrap gap-1.5">
              {result.relatedCodes.map(code => (
                <span key={code} className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(0,220,240,0.15)', color: 'var(--cyan)', border: '1px solid rgba(0,220,240,0.3)' }}>
                  {code}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}
