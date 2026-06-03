'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { signInWithGoogle, signInWithApple, signInWithFacebook, signUpWithEmail, getFirebaseAuthInstance } from '@/lib/auth'
import { createOrUpdateUserProfile } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

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
      else toast.error('Sign up failed — try again')
    } finally { setLoading(null) }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) { toast.error('Enter your first and last name'); return }
    if (!email) { toast.error('Enter your email address'); return }
    if (!password) { toast.error('Enter a password'); return }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading('email')
    try {
      await signUpWithEmail(email, password)
      const auth = getFirebaseAuthInstance()
      if (auth.currentUser) {
        // Update display name
        const { updateProfile } = await import('firebase/auth')
        await updateProfile(auth.currentUser, { displayName: `${firstName.trim()} ${lastName.trim()}` })
        await createOrUpdateUserProfile({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: `${firstName.trim()} ${lastName.trim()}`,
          photoURL: auth.currentUser.photoURL,
        })
      }
      toast.success('Account created!')
      router.replace('/dash')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('weak-password')) toast.error('Password is too weak — use at least 6 characters')
      else if (msg.includes('email-already-in-use')) toast.error('An account already exists with that email')
      else if (msg.includes('invalid-email')) toast.error('Invalid email address')
      else toast.error('Sign up failed — try again')
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
          Create Account
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Join Dr Mochanic&apos;s Dash — Glasgow&apos;s AI Garage
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
          {loading === 'google' ? 'Signing up...' : 'Continue with Google'}
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
          {loading === 'apple' ? 'Signing up...' : 'Continue with Apple'}
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
          {loading === 'facebook' ? 'Signing up...' : 'Continue with Facebook'}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>or create with email</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Email Sign Up Form */}
      <form onSubmit={handleSignUp} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
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
          placeholder="Password (min 6 characters)"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
        <button type="submit" disabled={!!loading} className="btn-cyan w-full py-3 disabled:opacity-40">
          {loading === 'email' ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: 'var(--muted)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--cyan)' }}>Sign In</Link>
      </p>
    </div>
  )
}
