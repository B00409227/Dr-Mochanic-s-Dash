import Link from 'next/link'
import Image from 'next/image'

export default function WebsiteFooter() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/favicon.ico" alt="Dr Mochanic" width={32} height={32} />
              <span className="font-orbitron font-bold" style={{ color: 'var(--cyan)' }}>Dr Mochanic</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Glasgow&apos;s AI-Powered Garage</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Expert repairs and the most advanced vehicle diagnostic app in the UK.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-rajdhani font-bold text-sm mb-3 uppercase" style={{ color: 'var(--text)' }}>Quick Links</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/services', 'Services'], ['/book', 'Book a Service'], ['/app', 'Dr Mochanic\'s Dash App'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-rajdhani font-bold text-sm mb-3 uppercase" style={{ color: 'var(--text)' }}>Services</h3>
            <ul className="space-y-2">
              {['Oil Change', 'Brake Replacement', 'Tyre Fitting', 'MOT Preparation', 'Full Service', 'AI Diagnostics', 'Battery Replacement', 'Clutch Replacement'].map(s => (
                <li key={s}>
                  <Link href="/services" className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted)' }}>{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="font-rajdhani font-bold text-sm mb-3 uppercase" style={{ color: 'var(--text)' }}>Contact & Hours</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li>Glasgow, G1 [Address Placeholder]</li>
              <li>Phone: [PLACEHOLDER]</li>
              <li>WhatsApp: [PLACEHOLDER]</li>
              <li>
                <a href="mailto:info@drmochanic.co.uk" style={{ color: 'var(--cyan)' }}>info@drmochanic.co.uk</a>
              </li>
            </ul>
            <div className="mt-4 space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
              <p>Mon–Fri: 8am–6pm</p>
              <p>Sat: 9am–4pm</p>
              <p>Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t text-center text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          © 2025 Dr Mochanic. All rights reserved. | Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
        </div>
      </div>
    </footer>
  )
}
