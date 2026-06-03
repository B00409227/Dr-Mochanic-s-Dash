import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In — Dr Mochanic's Dash",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
