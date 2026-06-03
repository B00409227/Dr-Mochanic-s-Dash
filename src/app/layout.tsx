import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import DrMochanicChat from '@/components/shared/DrMochanicChat'

export const metadata: Metadata = {
  title: "Dr Mochanic's Dash",
  description: "AI-powered vehicle diagnostics by Dr Mochanic, Glasgow's AI Garage",
  manifest: '/manifest.json',
  themeColor: '#010312',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { background: '#031a35', color: '#f0f4ff', border: '1px solid rgba(0,220,240,0.2)' } }} />
        <DrMochanicChat />
      </body>
    </html>
  )
}
