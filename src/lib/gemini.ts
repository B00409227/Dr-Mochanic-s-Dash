import type { ScanResult, OBD2Result, CommonProblem, TyreResult, InspectionResult, PredictionInsight, ServiceEntry, Vehicle, DigitalTwin, ChatMessage, LiveOBD2Data } from '@/types'
import { getIdToken } from '@/lib/auth'

async function callAI<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const token = await getIdToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`/api/ai/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (res.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('Authentication required')
  }
  if (res.status === 503) throw new Error('AI service not configured')
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error((err as { error?: string }).error || 'Request failed')
  }
  return res.json() as Promise<T>
}

export async function scanDashboard(imageBase64: string, mimeType: string): Promise<ScanResult> {
  return callAI<ScanResult>('scan', { imageBase64, mimeType })
}

export async function lookupOBD2Code(code: string): Promise<OBD2Result> {
  return callAI<OBD2Result>('obd2', { code })
}

export async function getCommonProblems(make: string, model: string, year: string, fuelType: string): Promise<CommonProblem[]> {
  return callAI<CommonProblem[]>('problems', { make, model, year, fuelType })
}

export async function analyseTyrePhoto(imageBase64: string, position: string): Promise<TyreResult> {
  return callAI<TyreResult>('tyre', { imageBase64, position })
}

export async function analyseInspectionPhotos(images: string[]): Promise<InspectionResult> {
  return callAI<InspectionResult>('inspection', { images })
}

export async function analyseSoundDiagnosis(symptoms: string[], waveformSummary: string): Promise<{ possibleCauses: Array<{ cause: string; confidence: number; severity: string; description: string; fixSteps: string[]; estimatedCostGBP: string }>; summary: string; urgency: string; recommendation: string }> {
  return callAI('sound', { symptoms, waveformSummary })
}

export async function getLiveStreamInsights(readings: Partial<LiveOBD2Data>[], baseline: Partial<LiveOBD2Data>): Promise<PredictionInsight> {
  return callAI<PredictionInsight>('livestream', { readings, baseline })
}

export async function getServiceRecommendations(history: ServiceEntry[], vehicle: Vehicle): Promise<{ recommendations: Array<{ service: string; reason: string; urgency: string; estimatedCostGBP: string }> }> {
  return callAI('service', { history, vehicle })
}

export async function getDigitalTwinAnalysis(twin: DigitalTwin): Promise<{ healthTrend: string; keyInsights: string[]; predictedFailures: Array<{ component: string; confidence: number; timeframe: string; preventionSteps: string[] }>; maintenanceRecommendations: string[]; overallAssessment: string }> {
  return callAI('twin', { twin })
}

export async function chatWithDrMochanic(messages: ChatMessage[], context: string): Promise<string> {
  const result = await callAI<{ reply: string }>('chat', { messages, context })
  return result.reply
}
