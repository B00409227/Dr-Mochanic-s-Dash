import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { make, model: carModel, year, fuelType } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `You are Dr Mochanic AI. This is a ${year} ${make} ${carModel} ${fuelType}. List the 10 most common problems with this exact model reported by UK owners. JSON only, no other text: { "commonProblems": [{ "name": string, "howToIdentify": string, "estimatedCostGBP": string, "severity": "CRITICAL"|"WARNING"|"INFO", "canFixYourself": boolean, "fixSteps": string[], "partsNeeded": string[], "relatedOBD2Codes": string[] }] }`
    const result = await model.generateContent(prompt)
    const parsed = safeParseJSON<{ commonProblems: unknown[] }>(result.response.text())
    return Response.json(parsed.commonProblems)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
