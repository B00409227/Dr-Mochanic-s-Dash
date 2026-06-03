'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dash', label: 'Home', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinejoin="round" />
    </svg>
  )},
  { href: '/dash/obd2', label: 'OBD2', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
    </svg>
  )},
  { href: '/dash/scan', label: 'Scan', icon: () => null, isScan: true },
  { href: '/dash/digital-twin', label: 'Twin', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" />
      <path d="M7 8h2M11 8h2M15 8h2M7 11h4M13 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
  { href: '/dash/history', label: 'History', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )},
  { href: '/dash/chat', label: 'Chat', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )},
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end justify-around px-2 h-16">
        {NAV.map(item => {
          const active = pathname === item.href

          if (item.isScan) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-end pb-2 relative"
                style={{ marginBottom: '8px' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: '#ff2429',
                    boxShadow: '0 0 20px rgba(255,36,41,0.4)',
                    transform: 'translateY(-12px)',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ color: '#fff' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-[10px] font-rajdhani font-bold -mt-1" style={{ color: '#ff2429' }}>Scan</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
              style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
            >
              {item.icon(active)}
              <span className="text-[10px] font-rajdhani font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
