'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book' },
  { href: '/app', label: 'App' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function WebsiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-200"
      style={{
        background: scrolled ? 'rgba(1,3,18,0.95)' : 'rgba(1,3,18,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(0,220,240,0.1)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Dr Mochanic" width={32} height={32} />
          <span
            className="font-orbitron font-bold text-base hidden sm:block"
            style={{ color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,220,240,0.5)' }}
          >
            Dr Mochanic
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-rajdhani font-semibold transition-colors relative"
              style={{
                color: pathname === link.href ? 'var(--cyan)' : 'var(--text)',
                opacity: pathname === link.href ? 1 : 0.75,
              }}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded" style={{ background: 'var(--cyan)' }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link href="/book" className="btn-red text-sm py-2 px-4 hidden sm:block">
            Book Now
          </Link>
          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded"
            style={{ color: 'var(--text)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                : <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-4 space-y-1">
            {LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 rounded-lg font-rajdhani font-semibold text-base"
                style={{
                  color: pathname === link.href ? 'var(--cyan)' : 'var(--text)',
                  background: pathname === link.href ? 'rgba(0,220,240,0.06)' : 'transparent',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="btn-red block text-center mt-3" onClick={() => setMenuOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
