import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { twin } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `Dr Mochanic AI. Based on vehicle history over ${twin.scans?.length ?? 0} scans: ${JSON.stringify({ scans: (twin.scans ?? []).slice(-10), obd2History: (twin.obd2History ?? []).slice(-20) })}. What patterns do you see? JSON only, no other text: { "healthTrend": "IMPROVING"|"STABLE"|"DECLINING", "keyInsights": string[], "predictedFailures": [{ "component": string, "confidence": number, "timeframe": string, "preventionSteps": string[] }], "maintenanceRecommendations": string[], "overallAssessment": string }`
    const result = await model.generateContent(prompt)
    return Response.json(safeParseJSON(result.response.text()))
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
