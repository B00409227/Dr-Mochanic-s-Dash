import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, doc, setDoc, getDoc } from 'firebase/firestore'
import type { CommunityFault, DigitalTwin } from '@/types'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getApp() {
  if (getApps().length === 0) return initializeApp(firebaseConfig)
  return getApps()[0]
}

export function getDb() {
  try {
    return getFirestore(getApp())
  } catch {
    return null
  }
}

export async function saveCommunityFault(fault: Omit<CommunityFault, 'id'>): Promise<void> {
  try {
    const db = getDb()
    if (!db) return
    await addDoc(collection(db, 'community_faults'), fault)
  } catch (e) {
    console.warn('Firebase saveCommunityFault failed:', e)
  }
}

export async function getCommunityFaults(make: string, model: string): Promise<CommunityFault[]> {
  try {
    const db = getDb()
    if (!db) return []
    const q = query(
      collection(db, 'community_faults'),
      where('make', '==', make.toUpperCase()),
      where('model', '==', model.toUpperCase()),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CommunityFault))
  } catch (e) {
    console.warn('Firebase getCommunityFaults failed:', e)
    return []
  }
}

export async function saveDigitalTwin(twin: DigitalTwin): Promise<void> {
  try {
    const db = getDb()
    if (!db) return
    const id = `${twin.deviceId}_${twin.reg}`
    await setDoc(doc(db, 'vehicle_twins', id), twin)
  } catch (e) {
    console.warn('Firebase saveDigitalTwin failed:', e)
  }
}

export async function getDigitalTwin(deviceId: string, reg: string): Promise<DigitalTwin | null> {
  try {
    const db = getDb()
    if (!db) return null
    const id = `${deviceId}_${reg}`
    const snap = await getDoc(doc(db, 'vehicle_twins', id))
    if (!snap.exists()) return null
    return snap.data() as DigitalTwin
  } catch (e) {
    console.warn('Firebase getDigitalTwin failed:', e)
    return null
  }
}
