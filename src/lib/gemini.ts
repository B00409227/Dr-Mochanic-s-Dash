import type { ScanResult, OBD2Result, CommonProblem, TyreResult, InspectionResult, PredictionInsight, ServiceEntry, Vehicle, DigitalTwin, ChatMessage, LiveOBD2Data } from '@/types'

async function callGemini<T>(action: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  })
  if (res.status === 503) throw new Error('AI service not configured')
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error((err as { error?: string }).error || 'Request failed')
  }
  return res.json() as Promise<T>
}

export async function scanDashboard(imageBase64: string, mimeType: string): Promise<ScanResult> {
  return callGemini<ScanResult>('scan', { imageBase64, mimeType })
}

export async function lookupOBD2Code(code: string): Promise<OBD2Result> {
  return callGemini<OBD2Result>('obd2', { code })
}

export async function getCommonProblems(make: string, model: string, year: string, fuelType: string): Promise<CommonProblem[]> {
  return callGemini<CommonProblem[]>('problems', { make, model, year, fuelType })
}

export async function analyseTyrePhoto(imageBase64: string, position: string): Promise<TyreResult> {
  return callGemini<TyreResult>('tyre', { imageBase64, position })
}

export async function analyseInspectionPhotos(images: string[]): Promise<InspectionResult> {
  return callGemini<InspectionResult>('inspection', { images })
}

export async function analyseSoundDiagnosis(symptoms: string[], waveformSummary: string): Promise<{ possibleCauses: Array<{ cause: string; confidence: number; severity: string; description: string; fixSteps: string[]; estimatedCostGBP: string }>; summary: string; urgency: string; recommendation: string }> {
  return callGemini('sound', { symptoms, waveformSummary })
}

export async function getLiveStreamInsights(readings: Partial<LiveOBD2Data>[], baseline: Partial<LiveOBD2Data>): Promise<PredictionInsight> {
  return callGemini<PredictionInsight>('livestream', { readings, baseline })
}

export async function getServiceRecommendations(history: ServiceEntry[], vehicle: Vehicle): Promise<{ recommendations: Array<{ service: string; reason: string; urgency: string; estimatedCostGBP: string }> }> {
  return callGemini('service', { history, vehicle })
}

export async function getDigitalTwinAnalysis(twin: DigitalTwin): Promise<{ healthTrend: string; keyInsights: string[]; predictedFailures: Array<{ component: string; confidence: number; timeframe: string; preventionSteps: string[] }>; maintenanceRecommendations: string[]; overallAssessment: string }> {
  return callGemini('twin', { twin })
}

export async function chatWithDrMochanic(messages: ChatMessage[], context: string): Promise<string> {
  const result = await callGemini<{ text: string }>('chat', { messages, context })
  return result.text
}
