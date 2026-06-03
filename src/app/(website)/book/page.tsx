'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

const SERVICES_LIST = ['Oil Change', 'Brake Replacement', 'Tyre Fitting', 'MOT Preparation', 'Full Service', 'Timing Belt', 'Air Con Regas', 'Battery Replacement', 'Clutch Replacement', 'AI Diagnostics', 'Other']
const HEAR_ABOUT = ['Google', 'Facebook', 'Instagram', 'Word of mouth', 'Dr Mochanic App', 'Returning customer']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

interface Booking {
  name: string
  phone: string
  email: string
  reg: string
  service: string
  date: string
  time: string
  notes: string
  hearAbout: string
  id: string
  createdAt: number
}

export default function BookPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', reg: '', service: '', date: '', time: '', notes: '', hearAbout: '' })
  const [submitted, setSubmitted] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  function setField(k: string, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const required = ['name', 'phone', 'email', 'reg', 'service', 'date', 'time'] as const
    for (const f of required) {
      if (!form[f]) { toast.error(`Please fill in ${f}`); return }
    }
    const newBooking: Booking = { ...form, id: crypto.randomUUID(), createdAt: Date.now() }
    try {
      const existing = JSON.parse(localStorage.getItem('drm_bookings') || '[]')
      existing.unshift(newBooking)
      localStorage.setItem('drm_bookings', JSON.stringify(existing))
    } catch {}
    setBooking(newBooking)
    setSubmitted(true)
    toast.success('Booking confirmed!')
  }

  if (submitted && booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card rounded-2xl p-8 max-w-md w-full space-y-5 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(0,220,240,0.1)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--cyan)' }}>
              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-orbitron text-2xl" style={{ color: 'var(--cyan)' }}>Booking Confirmed!</h2>
          <div className="text-left space-y-2 text-sm" style={{ color: 'var(--text)' }}>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Vehicle:</strong> {booking.reg}</p>
            <p><strong>Service:</strong> {booking.service}</p>
            <p><strong>Date:</strong> {booking.date} at {booking.time}</p>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>We will confirm your booking by phone or email shortly.</p>
          <a
            href={`https://wa.me/PLACEHOLDER?text=Hi+Dr+Mochanic,+I've+just+booked+for+${booking.service}+on+${booking.date}+at+${booking.time}+for+${booking.reg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan block"
          >
            Confirm via WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="font-orbitron text-3xl mb-3" style={{ color: 'var(--text)' }}>
            Book a <span style={{ color: 'var(--cyan)' }}>Service</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Glasgow&apos;s AI garage — honest pricing, expert technicians, same-day slots available.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Full Name *</label>
                <input className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Phone *</label>
                <input className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="07700 000000" type="tel" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Email *</label>
              <input className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@email.com" type="email" />
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Vehicle Registration *</label>
              <input
                className="w-full px-4 py-3 rounded-lg text-sm outline-none font-bold tracking-wider uppercase"
                style={{ background: '#FFC612', border: '2px solid black', color: 'black', fontFamily: 'Rajdhani, sans-serif' }}
                value={form.reg}
                onChange={e => setField('reg', e.target.value.toUpperCase())}
                placeholder="AB12 CDE"
                maxLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Service Required *</label>
              <select className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.service} onChange={e => setField('service', e.target.value)}>
                <option value="">Select a service...</option>
                {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Preferred Date *</label>
                <input className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.date} onChange={e => setField('date', e.target.value)} type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Time Slot *</label>
                <select className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.time} onChange={e => setField('time', e.target.value)}>
                  <option value="">Select time...</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>Additional Notes</label>
              <textarea className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.notes} onChange={e => setField('notes', e.target.value)} placeholder="Describe any issues, symptoms, or special requests..." rows={3} />
            </div>

            <div>
              <label className="block text-sm font-rajdhani font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>How did you hear about us?</label>
              <select className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} value={form.hearAbout} onChange={e => setField('hearAbout', e.target.value)}>
                <option value="">Select...</option>
                {HEAR_ABOUT.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-red w-full py-4 text-base">Confirm Booking</button>
          </form>

          <div className="space-y-5">
            <div className="card rounded-xl p-5 space-y-3">
              <h3 className="font-rajdhani font-bold text-lg" style={{ color: 'var(--cyan)' }}>Contact Us</h3>
              <div className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
                <p>📍 Glasgow, G1 [Address Placeholder]</p>
                <p>📞 [PLACEHOLDER]</p>
                <p>💬 WhatsApp: [PLACEHOLDER]</p>
                <p>✉️ info@drmochanic.co.uk</p>
              </div>
            </div>
            <div className="card rounded-xl p-5 space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <h3 className="font-rajdhani font-bold text-base" style={{ color: 'var(--text)' }}>Opening Hours</h3>
              <p>Mon–Fri: 8am–6pm</p>
              <p>Sat: 9am–4pm</p>
              <p>Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-xs" style={{ color: 'var(--muted)' }}>
          Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
        </div>
      </div>
    </div>
  )
}
