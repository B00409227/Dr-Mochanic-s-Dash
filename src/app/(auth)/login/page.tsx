'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { signInWithGoogle, signInWithApple, signInWithFacebook, signInWithEmail, getFirebaseAuthInstance } from '@/lib/auth'
import { createOrUpdateUserProfile } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [showPhone, setShowPhone] = useState(false)
  const [confirmResult, setConfirmResult] = useState<unknown>(null)

  async function handleSocial(method: 'google' | 'apple' | 'facebook') {
    setLoading(method)
    try {
      if (method === 'google') await signInWithGoogle()
      else if (method === 'apple') await signInWithApple()
      else await signInWithFacebook()
      const auth = getFirebaseAuthInstance()
      if (auth.currentUser) {
        await createOrUpdateUserProfile(auth.currentUser)
      }
      router.replace('/dash')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign in failed'
      if (msg.includes('popup-closed')) { /* user closed */ }
      else toast.error('Sign in failed — try again')
    } finally { setLoading(null) }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Enter email and password'); return }
    setLoading('email')
    try {
      await signInWithEmail(email, password)
      router.replace('/dash')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) toast.error('Incorrect email or password')
      else if (msg.includes('user-not-found')) toast.error('No account with that email')
      else toast.error('Sign in failed — try again')
    } finally { setLoading(null) }
  }

  async function handleSendOTP() {
    if (!phone.trim()) { toast.error('Enter your phone number'); return }
    setLoading('phone')
    try {
      const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth')
      const auth = getFirebaseAuthInstance()
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' })
      const result = await signInWithPhoneNumber(auth, phone, verifier)
      setConfirmResult(result)
      toast.success('Code sent!')
    } catch {
      toast.error('Failed to send code — check number')
    } finally { setLoading(null) }
  }

  async function handleVerifyOTP() {
    if (!otp.trim()) { toast.error('Enter the code'); return }
    setLoading('otp')
    try {
      const result = confirmResult as { confirm: (otp: string) => Promise<unknown> }
      await result.confirm(otp)
      router.replace('/dash')
    } catch {
      toast.error('Invalid code — try again')
    } finally { setLoading(null) }
  }

  const btnBase = 'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-rajdhani font-bold text-base transition-all hover:opacity-85 active:scale-98 disabled:opacity-40'

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Image src="/favicon.ico" alt="Dr Mochanic" width={56} height={56} />
        </div>
        <h1 className="font-orbitron text-xl font-bold" style={{ color: 'var(--cyan)', textShadow: '0 0 20px rgba(0,220,240,0.4)' }}>
          Dr Mochanic&apos;s Dash
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Glasgow&apos;s AI Garage — sign in to save your vehicles and history
        </p>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocial('google')}
          disabled={!!loading}
          className={btnBase}
          style={{ background: '#fff', color: '#1f1f1f', border: '1px solid #dadce0' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
        </button>

        <button
          onClick={() => handleSocial('apple')}
          disabled={!!loading}
          className={btnBase}
          style={{ background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <svg width="20" height="20" viewBox="0 0 814 1000" fill="white">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-109.2C67.3 734.3 0 584.3 0 440.8c0-236.2 154.4-360.9 306.4-360.9 76 0 139.1 49.9 185.6 49.9 44.8 0 115.7-52.6 201.1-52.6 32.7 0 133.7 2.6 204.6 85zM522.2 82.4c31.3-38.7 53.6-92.1 53.6-145.4 0-7.4-.6-14.9-1.9-21.1-50.4 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135-65.3z"/>
          </svg>
          {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
        </button>

        <button
          onClick={() => handleSocial('facebook')}
          disabled={!!loading}
          className={btnBase}
          style={{ background: '#1877F2', color: '#fff' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {loading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
        </button>

        <button
          onClick={() => setShowPhone(!showPhone)}
          disabled={!!loading}
          className={btnBase}
          style={{ background: 'var(--cyan)', color: '#010312' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5"/></svg>
          {showPhone ? 'Hide phone sign in' : 'Continue with Phone'}
        </button>
      </div>

      {/* Phone Sign In */}
      {showPhone && (
        <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div id="recaptcha-container" />
          {!confirmResult ? (
            <>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <button onClick={handleSendOTP} disabled={!!loading} className="btn-cyan w-full py-2.5 text-sm disabled:opacity-40">
                {loading === 'phone' ? 'Sending...' : 'Send Code'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>Enter the 6-digit code sent to {phone}</p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-center font-mono tracking-widest"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <button onClick={handleVerifyOTP} disabled={!!loading} className="btn-cyan w-full py-2.5 text-sm disabled:opacity-40">
                {loading === 'otp' ? 'Verifying...' : 'Verify Code'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>or sign in with email</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmail} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <button type="submit" disabled={!!loading} className="btn-red w-full py-3 disabled:opacity-40">
          {loading === 'email' ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--cyan)' }}>Sign Up</Link>
      </p>
    </div>
  )
}
