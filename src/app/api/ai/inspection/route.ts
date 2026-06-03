import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth, makeImagePart } from '../_helpers'
import type { Part } from '@google/generative-ai'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { images } = await request.json() as { images: string[] }
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const imageParts: Part[] = images.map((img: string) => makeImagePart(img))
    const prompt = `You are Dr Mochanic performing a thorough visual vehicle inspection. Inspect bodywork, tyres, brakes, exhaust, engine bay, suspension. JSON only, no other text: { "overallCondition": "EXCELLENT"|"GOOD"|"FAIR"|"POOR", "motRiskScore": 0-100, "findings": [{ "area": string, "finding": string, "severity": "CRITICAL"|"WARNING"|"INFO"|"PASS", "detail": string, "recommendation": string, "estimatedCostGBP": string, "willFailMOT": boolean }], "immediateActions": string[], "readyForMOT": boolean, "summary": string }`
    const result = await model.generateContent([prompt, ...imageParts])
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
