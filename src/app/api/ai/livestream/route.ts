import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { readings, baseline } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `You are Dr Mochanic AI watching live sensor data in real time like a co-pilot mechanic. Last readings: ${JSON.stringify(readings)}. Vehicle baseline: ${JSON.stringify(baseline)}. Identify performance anomalies, early failure patterns, tuning opportunities. JSON only, no other text: { "status": "HEALTHY"|"MONITOR"|"ALERT", "insights": string[], "warnings": string[], "tuningTips": string[], "predictedIssues": [{ "issue": string, "confidence": 0-100, "timeframe": string, "recommendation": string }], "baselineDeviations": string[] }`
    const result = await model.generateContent(prompt)
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
