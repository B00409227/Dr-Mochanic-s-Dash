import Link from 'next/link'

const POSTS = [
  { slug: 'check-engine-light-explained', title: 'Check Engine Light: What It Actually Means', date: '2025-05-01', category: 'Diagnostics', excerpt: 'That dreaded orange glow on your dashboard. Is it serious? Should you pull over? Here is everything you need to know, explained in plain English.' },
  { slug: 'tyre-tread-20p-test', title: 'The 20p Tyre Test: How to Check Your Tread at Home', date: '2025-04-22', category: 'Safety', excerpt: 'Your tyres are the only thing between you and the road. Here is the quick 20p coin test you can do in your driveway right now.' },
  { slug: 'obd2-explained', title: 'OBD2 Explained: Read Your Car\'s Mind with a £15 Dongle', date: '2025-04-10', category: 'Technology', excerpt: 'Every car built after 1996 has an OBD2 port hiding under the dashboard. Here\'s how to use it to diagnose your own car.' },
  { slug: 'brake-replacement-signs', title: '5 Signs Your Brakes Need Replacing Right Now', date: '2025-03-28', category: 'Safety', excerpt: 'Squealing, grinding, pulling to one side — your brakes are trying to tell you something. Do not ignore these warning signs.' },
  { slug: 'oil-change-frequency', title: 'How Often Should You Actually Change Your Oil?', date: '2025-03-15', category: 'Maintenance', excerpt: 'Every 3,000 miles? Every 10,000? The answer depends on your car, oil type, and driving style. Here is what you need to know.' },
  { slug: 'mot-preparation-checklist', title: 'MOT Preparation: 10-Point Checklist to Pass First Time', date: '2025-03-01', category: 'MOT', excerpt: '35% of cars fail their MOT on simple, preventable issues. Here is how to get your car MOT-ready without spending a penny.' },
]

const CATEGORIES = ['All', 'Diagnostics', 'Safety', 'Technology', 'Maintenance', 'MOT']

const categoryColors: Record<string, string> = {
  Diagnostics: 'var(--cyan)',
  Safety: '#ff2429',
  Technology: '#a855f7',
  Maintenance: '#f59e0b',
  MOT: '#22c55e',
}

export default function BlogPage() {
  return (
    <div>
      <section className="py-12 text-center" style={{ background: 'var(--surface)' }}>
        <h1 className="font-orbitron text-3xl mb-3" style={{ color: 'var(--text)' }}>
          Dr Mochanic&apos;s <span style={{ color: 'var(--cyan)' }}>Blog</span>
        </h1>
        <p style={{ color: 'var(--muted)' }}>Car tips, guides, and advice from Glasgow&apos;s AI mechanic</p>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <span key={c} className="px-3 py-1.5 rounded-full text-sm font-rajdhani font-semibold cursor-pointer" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {c}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card rounded-xl p-5 space-y-3 hover:-translate-y-1 transition-transform block">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs px-2 py-1 rounded font-rajdhani font-bold"
                  style={{ background: `${categoryColors[p.category] || 'var(--cyan)'}22`, color: categoryColors[p.category] || 'var(--cyan)' }}
                >
                  {p.category}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{p.date}</span>
              </div>
              <h2 className="font-rajdhani font-bold text-lg leading-snug" style={{ color: 'var(--text)' }}>{p.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{p.excerpt}</p>
              <span style={{ color: 'var(--cyan)' }} className="text-sm font-rajdhani font-semibold">Read more →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
        Visit Dr Mochanic — Glasgow&apos;s AI Garage | drmochanic.co.uk
      </div>
    </div>
  )
}
