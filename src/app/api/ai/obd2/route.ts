import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { code } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `You are Dr Mochanic diagnostic AI. Explain OBD2 code ${String(code).toUpperCase()} in detail. JSON only, no other text: { "code": string, "fullName": string, "system": string, "severity": "CRITICAL"|"WARNING"|"INFO", "whatItMeans": string, "symptoms": string[], "commonCauses": string[], "fixSteps": string[], "partsNeeded": string[], "estimatedCostGBP": string, "canFixYourself": boolean, "relatedCodes": string[], "howUrgent": string, "worstCaseIfIgnored": string }`
    const result = await model.generateContent(prompt)
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
