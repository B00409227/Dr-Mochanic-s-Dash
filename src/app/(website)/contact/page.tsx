'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill in all required fields'); return }
    try {
      const msgs = JSON.parse(localStorage.getItem('drm_contact_msgs') || '[]')
      msgs.push({ ...form, id: crypto.randomUUID(), timestamp: Date.now() })
      localStorage.setItem('drm_contact_msgs', JSON.stringify(msgs))
    } catch {}
    setSent(true)
    toast.success('Message sent! We will be in touch shortly.')
  }

  return (
    <div>
      <section className="py-12 text-center" style={{ background: 'var(--surface)' }}>
        <h1 className="font-orbitron text-3xl mb-3" style={{ color: 'var(--text)' }}>
          Get in <span style={{ color: 'var(--cyan)' }}>Touch</span>
        </h1>
        <p style={{ color: 'var(--muted)' }}>Glasgow&apos;s AI garage — we are always happy to help</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-10">
        {/* Map placeholder */}
        <div>
          <div
            className="rounded-xl overflow-hidden mb-6"
            style={{ height: 300, background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18741.02!2d-4.2518!3d55.8642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488846a2e7777777%3A0x0!2sGlasgow%2C+UK!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="card rounded-xl p-5 space-y-4">
            <h3 className="font-rajdhani font-bold text-xl" style={{ color: 'var(--cyan)' }}>Dr Mochanic, Glasgow</h3>
            <div className="space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
              <div className="flex gap-2"><span>📍</span><span>Glasgow, G1 [Address Placeholder]</span></div>
              <div className="flex gap-2"><span>📞</span><a href="tel:PLACEHOLDER" style={{ color: 'var(--cyan)' }}>[PLACEHOLDER]</a></div>
              <div className="flex gap-2"><span>💬</span><a href="https://wa.me/PLACEHOLDER" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>WhatsApp: [PLACEHOLDER]</a></div>
              <div className="flex gap-2"><span>✉️</span><a href="mailto:info@drmochanic.co.uk" style={{ color: 'var(--cyan)' }}>info@drmochanic.co.uk</a></div>
            </div>
            <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="font-rajdhani font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>Opening Hours</p>
              <div className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
                <p>Mon–Fri: 8am–6pm</p>
                <p>Sat: 9am–4pm</p>
                <p>Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="card rounded-xl p-8 text-center space-y-4">
              <div className="text-4xl">✅</div>
              <h3 className="font-rajdhani font-bold text-xl" style={{ color: 'var(--cyan)' }}>Message Sent!</h3>
              <p style={{ color: 'var(--muted)' }}>We&apos;ll get back to you within one business day. For urgent enquiries please call or WhatsApp us directly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-rajdhani font-bold text-xl mb-4" style={{ color: 'var(--text)' }}>Send us a message</h3>
              {[
                { key: 'name', label: 'Your Name *', placeholder: 'Full name', type: 'text' },
                { key: 'email', label: 'Email *', placeholder: 'you@email.com', type: 'email' },
                { key: 'phone', label: 'Phone', placeholder: '07700 000000', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>{f.label}</label>
                  <input
                    type={f.type}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Message *</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  rows={5}
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-cyan w-full py-3">Send Message</button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
