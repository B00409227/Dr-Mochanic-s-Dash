import Link from 'next/link'

const FEATURES = [
  { icon: '📷', title: 'Dashboard Scanner', desc: 'Point your camera at your dashboard. AI identifies every warning light and tells you exactly what it means, how urgent it is, and what to do.' },
  { icon: '🔌', title: 'OBD2 Bluetooth', desc: 'Connect your ELM327 dongle via Bluetooth. Read live sensor data, pull and clear fault codes, monitor fuel trims and engine health in real time.' },
  { icon: '🤖', title: 'Digital Twin', desc: 'Build a complete digital model of your vehicle. AI learns from your scan history and predicts failures before they happen.' },
  { icon: '🔊', title: 'Sound Diagnosis', desc: 'Record 15 seconds of engine or brake noise. AI analyses the waveform and your described symptoms to identify the most likely cause.' },
  { icon: '🔄', title: 'Tyre Tread Check', desc: 'Photo your tyres using the 20p coin test. AI estimates tread depth and tells you if they are safe, worn, or illegal.' },
  { icon: '📊', title: 'Live Dashboard', desc: 'Real-time RPM, speed, coolant temperature, throttle, fuel level and more — displayed as animated gauges with historical graphs.' },
  { icon: '👥', title: 'Community Intelligence', desc: 'Anonymous fault reporting from UK drivers. See what problems other owners of your exact model are experiencing right now.' },
  { icon: '🛠️', title: "Mechanic's Eye", desc: 'Multi-photo inspection tool. Upload up to 12 photos for AI to perform a full visual inspection — MOT readiness score included.' },
  { icon: '⚙️', title: 'Service History', desc: 'Log all your services in one place. AI tracks what is due and gives personalised maintenance recommendations for your vehicle.' },
  { icon: '💬', title: 'Dr Mochanic AI Chat', desc: 'Chat with your AI mechanic 24/7. Diagnose problems, understand repairs, check if quotes are fair — all in plain English.' },
]

const FAQS = [
  { q: 'Is it free?', a: 'Yes, completely free. You need a free Gemini API key from aistudio.google.com to unlock AI features — it takes 2 minutes and costs nothing.' },
  { q: 'Do I need an account?', a: 'No account needed. All data is stored locally on your device. Nothing is sent to our servers without your consent.' },
  { q: 'Which OBD2 dongles are compatible?', a: 'Any ELM327 Bluetooth dongle works. We recommend the Veepeak or BAFX products available on Amazon for under £20.' },
  { q: 'Does it work on all cars?', a: 'The dashboard scanner and AI chat work on any car. OBD2 features require a 1996+ UK/EU car with an OBD2 port (under the dashboard, driver side).' },
  { q: 'Is my data private?', a: 'All scans and vehicle data stay on your device. Community fault reports are anonymous — no personal data is shared.' },
  { q: 'Can it replace a proper diagnostic?', a: 'It is a powerful first line of diagnosis. For serious faults, we always recommend bringing your car to Dr Mochanic, Glasgow for a full professional diagnostic.' },
]

export default function AppPage() {
  return (
    <div>
      <section className="py-16 text-center" style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto px-4 space-y-5">
          <h1 className="font-orbitron text-3xl sm:text-4xl" style={{ color: 'var(--text)' }}>
            Dr Mochanic&apos;s <span style={{ color: 'var(--cyan)' }}>Dash</span>
          </h1>
          <p className="font-rajdhani text-xl" style={{ color: 'var(--muted)' }}>
            The most advanced free vehicle diagnostic app in the UK
          </p>
          <Link href="/dash" className="btn-cyan inline-block text-lg py-3 px-8">Try it Free Now</Link>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-orbitron text-2xl text-center mb-10" style={{ color: 'var(--text)' }}>10 Powerful Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="card rounded-xl p-5 space-y-3">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-orbitron text-2xl text-center mb-8" style={{ color: 'var(--text)' }}>How it Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Get API Key', desc: 'Grab your free Gemini key from aistudio.google.com in 2 minutes.' },
              { step: '2', title: 'Add to Settings', desc: 'Paste it in Settings inside the app. Takes 10 seconds.' },
              { step: '3', title: 'Scan Your Car', desc: 'Point camera at dashboard or connect OBD2 dongle. AI does the rest.' },
            ].map(s => (
              <div key={s.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto font-orbitron font-bold text-xl" style={{ background: 'var(--cyan)', color: '#010312' }}>{s.step}</div>
                <h3 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--text)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="font-orbitron text-2xl text-center mb-8" style={{ color: 'var(--text)' }}>FAQs</h2>
        <div className="space-y-3">
          {FAQS.map(f => (
            <details key={f.q} className="card rounded-xl group">
              <summary className="p-4 cursor-pointer font-rajdhani font-bold text-base list-none flex justify-between items-center" style={{ color: 'var(--text)' }}>
                {f.q}
                <span style={{ color: 'var(--cyan)' }}>+</span>
              </summary>
              <div className="px-4 pb-4 text-sm" style={{ color: 'var(--muted)' }}>{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="py-12 text-center" style={{ background: 'var(--surface)' }}>
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="font-orbitron text-2xl" style={{ color: 'var(--text)' }}>Ready to try it?</h2>
          <Link href="/dash" className="btn-cyan inline-block text-lg py-3 px-8">Open Dr Mochanic&apos;s Dash</Link>
        </div>
      </section>

      <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
