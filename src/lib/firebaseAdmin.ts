import type { App } from 'firebase-admin/app'

let adminApp: App | null = null

function getAdminApp(): App {
  if (adminApp) return adminApp

  const { initializeApp, getApps, cert } = require('firebase-admin/app') as typeof import('firebase-admin/app')

  if (getApps().length > 0) {
    adminApp = getApps()[0]
    return adminApp!
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountJson) {
    // Allow running without admin SDK — auth verification will be skipped
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
    })
    return adminApp
  }

  const serviceAccount = JSON.parse(serviceAccountJson)
  adminApp = initializeApp({ credential: cert(serviceAccount) })
  return adminApp
}

export async function verifyIdToken(token: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const { getAuth } = require('firebase-admin/auth') as typeof import('firebase-admin/auth')
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token)
    return { uid: decoded.uid, email: decoded.email }
  } catch {
    return null
  }
}

export async function getAuthFromRequest(request: Request): Promise<{ uid: string; email?: string } | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  return verifyIdToken(token)
}
