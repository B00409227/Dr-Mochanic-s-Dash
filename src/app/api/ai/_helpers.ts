import { getAuthFromRequest } from '@/lib/firebaseAdmin'
import { GoogleGenerativeAI, type Part } from '@google/generative-ai'

export const MODEL = 'gemini-1.5-flash'
export const MAX_DURATION = 60

export function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('AI service not configured')
  return new GoogleGenerativeAI(key)
}

export function safeParseJSON<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON found in response')
  return JSON.parse(jsonMatch[0]) as T
}

export async function checkAuth(request: Request): Promise<{ uid: string; email?: string } | null> {
  // If no service account configured, skip auth (dev mode)
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return { uid: 'dev', email: 'dev@localhost' }
  return getAuthFromRequest(request)
}

export function makeImagePart(base64: string, mimeType = 'image/jpeg'): Part {
  return { inlineData: { data: base64, mimeType: mimeType as 'image/jpeg' } }
}
