import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { symptoms, waveformSummary } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `You are Dr Mochanic audio diagnostic AI. A car owner recorded their engine sound. Waveform characteristics: ${waveformSummary}. Owner-selected symptoms: ${(symptoms as string[]).join(', ')}. JSON only, no other text: { "possibleCauses": [{ "cause": string, "confidence": 0-100, "severity": "CRITICAL"|"WARNING"|"INFO", "description": string, "fixSteps": string[], "estimatedCostGBP": string }], "summary": string, "urgency": string, "recommendation": string }`
    const result = await model.generateContent(prompt)
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
