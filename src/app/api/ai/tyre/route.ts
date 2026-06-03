import { NextRequest } from 'next/server'
import { getGeminiClient, safeParseJSON, MODEL, checkAuth, makeImagePart } from '../_helpers'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const user = await checkAuth(request)
  if (!user) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  try {
    const { imageBase64, position } = await request.json()
    const client = getGeminiClient()
    const model = client.getGenerativeModel({ model: MODEL })
    const prompt = `Analyse this ${position} tyre photo. Estimate tread depth using the 20p coin as reference if visible (outer band = 2mm). JSON only, no other text: { "estimatedTreadMM": number, "status": "SAFE"|"WARNING"|"ILLEGAL"|"BALD", "recommendation": string, "estimatedMilesLeft": number, "replacementCostGBP": string, "unevenWear": boolean, "unevenWearCause": string }`
    const result = await model.generateContent([prompt, makeImagePart(imageBase64)])
    const parsed = safeParseJSON<object>(result.response.text())
    return Response.json({ ...parsed, position })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return Response.json({ error: msg }, { status: msg.includes('not configured') ? 503 : 500 })
  }
}
