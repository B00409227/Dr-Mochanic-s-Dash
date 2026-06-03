import Link from 'next/link'
import HeroParticles from './_components/HeroParticles'

const SERVICES = [
  { icon: '🛢️', name: 'Oil Change' },
  { icon: '🛑', name: 'Brakes' },
  { icon: '🔄', name: 'Tyres' },
  { icon: '✅', name: 'MOT Prep' },
  { icon: '🔧', name: 'Full Service' },
  { icon: '🔌', name: 'Diagnostics' },
  { icon: '🔋', name: 'Battery' },
  { icon: '❄️', name: 'AC Regas' },
]

const REVIEWS = [
  { name: 'Jamie T.', car: 'Ford Focus 2019', text: 'Brilliant service, sorted my check engine light in an hour. The app diagnosed it before I even drove in — saved me loads of hassle.', stars: 5 },
  { name: 'Sheila M.', car: 'VW Golf 2021', text: 'Used the Dash app to check my warning lights, then brought it in to Dr Mochanic. Honest, quick, and reasonably priced. Will definitely be back.', stars: 5 },
  { name: 'Craig B.', car: 'BMW 3 Series 2018', text: 'Top-notch garage. The lads know their stuff and the app is genuinely impressive — diagnosed my misfire before the mechanic even lifted the bonnet.', stars: 5 },
  { name: 'Priya K.', car: 'Toyota Yaris 2020', text: 'As a woman going to a garage alone I was always nervous, but Dr Mochanic made me feel totally at ease. Transparent pricing, no drama. Highly recommend.', stars: 5 },
  { name: 'Robert H.', car: 'Audi A3 2017', text: 'The digital twin feature is mental — it actually predicted my coolant sensor was going before it failed. Saved me a breakdown on the motorway.', stars: 5 },
]

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center" style={{ background: 'var(--bg)' }}>
        <HeroParticles />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: 'rgba(0,220,240,0.08)', border: '1px solid rgba(0,220,240,0.2)', color: 'var(--cyan)' }}>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Glasgow&apos;s AI-Powered Garage
              </div>

              <h1 className="font-orbitron leading-tight">
                <span className="block text-4xl sm:text-5xl lg:text-6xl" style={{ color: 'var(--muted)' }}>Glasgow&apos;s</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl" style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,220,240,0.4)' }}>AI-Powered</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl text-white">Garage</span>
              </h1>

              <p className="font-rajdhani text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
                Expert repairs, servicing, and the most advanced vehicle diagnostic app in the UK — all under one roof in Glasgow.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/book" className="btn-red text-base py-3 px-6">
                  Book a Service
                </Link>
                <Link href="/dash" className="btn-outline text-base py-3 px-6">
                  Try Dr Mochanic&apos;s Dash Free
                </Link>
              </div>

              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Trusted by Glasgow drivers since 2018 · No hidden fees · Same-day diagnostics
              </p>
            </div>

            {/* Dashboard SVG mockup */}
            <div className="hidden lg:flex justify-center">
              <div
                className="relative w-80 h-52 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--surface)', border: '2px solid rgba(0,220,240,0.3)', boxShadow: '0 0 60px rgba(0,220,240,0.1)' }}
              >
                <div className="grid grid-cols-3 gap-6 p-6">
                  {['#ff2429', '#f59e0b', '#00dcf0', '#ff2429', '#00dcf0', '#f59e0b'].map((color, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center animate-blink"
                      style={{
                        borderColor: color,
                        background: `${color}22`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${1 + i * 0.2}s`,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ background: color, opacity: 0.8 }} />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center text-xs font-orbitron" style={{ color: 'var(--cyan)' }}>
                  DR MOCHANIC AI SCAN
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="py-12" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-orbitron text-xl text-center mb-8" style={{ color: 'var(--text)' }}>Our Services</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-4 lg:grid-cols-8 sm:overflow-visible">
            {SERVICES.map(s => (
              <Link
                key={s.name}
                href="/services"
                className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl text-center hover:-translate-y-1 transition-all group"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', minWidth: '80px' }}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-rajdhani font-semibold group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text)' }}>{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DR MOCHANIC */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-orbitron text-2xl text-center mb-10" style={{ color: 'var(--text)' }}>
          Why <span style={{ color: 'var(--cyan)' }}>Dr Mochanic</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🤖', title: 'AI Diagnostics', desc: 'The only garage in Glasgow using live AI diagnostics — scan your dashboard in seconds and know exactly what is wrong before you even drive in.' },
            { icon: '🔧', title: 'Expert Technicians', desc: 'Qualified mechanics with 20+ years combined experience. We have seen every problem on every car — and we fix it right first time.' },
            { icon: '📱', title: 'Free App', desc: "Dr Mochanic's Dash — free AI diagnostics for every driver in the UK. Warning light scanner, OBD2 lookup, tyre checker and more." },
          ].map(c => (
            <div key={c.title} className="card rounded-xl p-6 space-y-3 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl">{c.icon}</div>
              <h3 className="font-rajdhani font-bold text-xl" style={{ color: 'var(--cyan)' }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="py-16" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-orbitron text-2xl sm:text-3xl" style={{ color: 'var(--text)' }}>
                Your Car&apos;s AI Doctor —<br />
                <span style={{ color: 'var(--cyan)' }}>In Your Pocket</span>
              </h2>
              <ul className="space-y-3">
                {[
                  'Dashboard warning light scanner (camera AI)',
                  'OBD2 Bluetooth diagnostics',
                  'Vehicle Digital Twin',
                  'Sound diagnosis',
                  'Tyre tread check',
                  'Community fault intelligence',
                  'Free — no account needed',
                ].map(f => (
                  <li key={f} className="flex gap-3 items-start text-sm" style={{ color: 'var(--text)' }}>
                    <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/dash" className="btn-cyan inline-block">Try it free now</Link>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div
                className="w-56 h-[420px] rounded-3xl p-3 flex flex-col"
                style={{ background: '#000', border: '3px solid rgba(0,220,240,0.4)', boxShadow: '0 0 40px rgba(0,220,240,0.15)' }}
              >
                <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: 'var(--bg)' }}>
                  <div className="p-3 space-y-2">
                    <div className="h-6 rounded" style={{ background: 'var(--surface)', width: '60%' }} />
                    <div className="h-20 rounded" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }} />
                    <div className="grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(i => <div key={i} className="h-14 rounded" style={{ background: 'var(--surface)' }} />)}
                    </div>
                    <div className="h-4 rounded" style={{ background: 'rgba(0,220,240,0.2)', width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-orbitron text-2xl text-center mb-10" style={{ color: 'var(--text)' }}>
          What Glasgow Drivers Say
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {REVIEWS.map(r => (
            <div key={r.name} className="flex-shrink-0 card rounded-xl p-5 space-y-3" style={{ minWidth: '260px' }}>
              <div className="flex gap-0.5">
                {Array.from({ length: r.stars }).map((_, i) => <span key={i} style={{ color: '#f59e0b' }}>★</span>)}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', opacity: 0.85 }}>&quot;{r.text}&quot;</p>
              <div>
                <p className="font-rajdhani font-bold text-sm" style={{ color: 'var(--text)' }}>{r.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{r.car}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING BANNER */}
      <section
        className="py-16 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(0,220,240,0.15), rgba(99,12,112,0.15))' }}
      >
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="font-orbitron text-3xl" style={{ color: 'var(--text)' }}>Ready to bring your car in?</h2>
          <p className="font-rajdhani text-lg" style={{ color: 'var(--muted)' }}>Glasgow&apos;s most trusted AI garage — same-day slots available</p>
          <Link href="/book" className="btn-red text-lg py-4 px-8 inline-block">Book Your Appointment</Link>
        </div>
      </section>

      <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
