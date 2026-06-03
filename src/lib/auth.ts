'use client'
import { useState, useEffect } from 'react'
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { getApp } from 'firebase/app'

function getFirebaseAuth() {
  try {
    return getAuth(getApp())
  } catch {
    const { initializeApp } = require('firebase/app') as typeof import('firebase/app')
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    })
    return getAuth(app)
  }
}

export function getFirebaseAuthInstance() {
  return getFirebaseAuth()
}

export async function signInWithGoogle(): Promise<void> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signInWithApple(): Promise<void> {
  const auth = getFirebaseAuth()
  const provider = new OAuthProvider('apple.com')
  await signInWithPopup(auth, provider)
}

export async function signInWithFacebook(): Promise<void> {
  const auth = getFirebaseAuth()
  const provider = new FacebookAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth()
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth()
  await createUserWithEmailAndPassword(auth, email, password)
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth()
  await sendPasswordResetEmail(auth, email)
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth()
  await signOut(auth)
}

export async function getIdToken(): Promise<string | null> {
  try {
    const auth = getFirebaseAuth()
    return await auth.currentUser?.getIdToken() ?? null
  } catch {
    return null
  }
}

export function useAuthState(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading }
}
