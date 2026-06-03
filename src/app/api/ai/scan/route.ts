import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth, makeImagePart } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { imageBase64, mimeType } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `You are Dr Mochanic expert diagnostic AI. Analyse this car dashboard photo carefully. Identify EVERY warning light visible. JSON only: { "healthScore": 0-100, "summary": string, "immediateActions": string[], "lights": [{ "name": string, "symbolDescription": string, "severity": "CRITICAL"|"WARNING"|"INFO", "meaning": string, "urgency": string, "fixSteps": [string, string, string], "estimatedCostGBP": string, "canFixYourself": boolean, "relatedOBD2Codes": string[] }] }`
    const result = await model.generateContent([prompt, makeImagePart(imageBase64, mimeType)])
    const parsed = safeParseJSON<object>(result.response.text())
    return Response.json({ ...parsed, id: crypto.randomUUID(), timestamp: Date.now() })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
