import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { history, vehicle } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `Dr Mochanic AI. Based on service history: ${JSON.stringify(history)}. What is due next for a ${vehicle.year} ${vehicle.make} ${vehicle.model}? JSON only, no other text: { "recommendations": [{ "service": string, "reason": string, "urgency": string, "estimatedCostGBP": string }] }`
    const result = await model.generateContent(prompt)
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
