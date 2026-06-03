import Link from 'next/link'

const SERVICES = [
  { icon: '🛢️', name: 'Oil Change', desc: 'Fresh oil and filter for optimal engine performance and longevity.', price: 'from £39', category: 'Maintenance' },
  { icon: '🛑', name: 'Brake Replacement', desc: 'Pads, discs, and callipers — full brake system inspection and replacement.', price: 'from £79', category: 'Safety' },
  { icon: '🔄', name: 'Tyre Fitting', desc: 'Tyre supply and fitting with wheel balancing. All major brands stocked.', price: 'from £49', category: 'Safety' },
  { icon: '✅', name: 'MOT Preparation', desc: 'Pre-MOT inspection to identify and fix issues before your test.', price: 'from £29', category: 'MOT' },
  { icon: '🔧', name: 'Full Service', desc: 'Comprehensive 60-point vehicle inspection and service.', price: 'from £149', category: 'Maintenance' },
  { icon: '⚙️', name: 'Timing Belt', desc: 'Timing belt and water pump replacement — specialist job, done right.', price: 'from £299', category: 'Engine' },
  { icon: '❄️', name: 'Air Con Regas', desc: 'Air conditioning recharge to restore full cooling performance.', price: 'from £59', category: 'Comfort' },
  { icon: '🔋', name: 'Battery Replacement', desc: 'Battery test and replacement with warranty. Free health check.', price: 'from £69', category: 'Electrical' },
  { icon: '🔩', name: 'Clutch Replacement', desc: 'Clutch kit supply and fit — single plate, dual mass flywheel.', price: 'from £349', category: 'Drivetrain' },
  { icon: '🔌', name: 'AI Diagnostics', desc: 'Full OBD2 diagnostic scan with our AI-powered reporting system.', price: 'from £49', category: 'Diagnostics' },
]

export default function ServicesPage() {
  return (
    <div>
      <section className="py-16 text-center" style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-orbitron text-3xl sm:text-4xl mb-4" style={{ color: 'var(--text)' }}>
            Our <span style={{ color: 'var(--cyan)' }}>Services</span>
          </h1>
          <p className="font-rajdhani text-lg" style={{ color: 'var(--muted)' }}>
            Everything your car needs — expert technicians, honest pricing, AI diagnostics.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map(s => (
            <div key={s.name} className="card rounded-xl p-5 space-y-3 hover:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs px-2 py-1 rounded font-rajdhani font-semibold" style={{ background: 'rgba(0,220,240,0.1)', color: 'var(--cyan)' }}>
                  {s.category}
                </span>
              </div>
              <h3 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>{s.name}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-orbitron font-bold text-sm" style={{ color: 'var(--cyan)' }}>{s.price}</span>
                <Link href="/book" className="btn-red text-sm py-1.5 px-4">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="font-orbitron text-2xl" style={{ color: 'var(--text)' }}>
            Not sure what&apos;s wrong? <span style={{ color: 'var(--cyan)' }}>Use our AI</span>
          </h2>
          <p style={{ color: 'var(--muted)' }}>Dr Mochanic&apos;s Dash app can diagnose your car from a photo of your dashboard or OBD2 scan — free, no account needed.</p>
          <Link href="/dash" className="btn-cyan inline-block">Try the App Free</Link>
        </div>
      </section>

      <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
