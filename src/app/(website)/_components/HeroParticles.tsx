'use client'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 13 + 7) % 100}%`,
  top: `${(i * 17 + 11) % 100}%`,
  delay: `${(i * 0.3) % 3}s`,
  size: i % 3 === 0 ? 4 : 2,
}))

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: 'var(--cyan)',
            opacity: 0.4,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
