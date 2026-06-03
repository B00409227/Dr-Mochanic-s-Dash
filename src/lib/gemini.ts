import { GoogleGenerativeAI, type Part } from '@google/generative-ai'
import type { ScanResult, OBD2Result, CommonProblem, TyreResult, InspectionResult, PredictionInsight, ServiceEntry, Vehicle, DigitalTwin, ChatMessage, LiveOBD2Data } from '@/types'

const MODEL = 'gemini-1.5-flash'

const DR_MOCHANIC_SYSTEM_PROMPT = `You are Dr Mochanic - a friendly casual AI mechanic with 12 years hands-on garage experience based in Glasgow Scotland. You talk like a knowledgeable mate who happens to be a mechanic - warm, straightforward, no jargon unless you explain it, never condescending. Occasional Scottish warmth is fine but do not overdo it.

You work at Dr Mochanic garage in Glasgow and love what you do. You are embedded in the Dr Mochanic Dash app and website.

EXPERT IN: diagnosing car faults from descriptions symptoms warning lights sounds. Explaining every OBD2 code in plain English. Advising whether a car is safe to drive. Step by step how-to guides for things owners can do themselves. Checking if a repair quote is fair. Maintenance schedules. Car buying advice.

DO NOT DO (politely decline but give useful context): MOT testing beyond prep tips. Bodywork or paint. Timing belt replacement. Air conditioning regas. Say: That one is a specialist job - not something I would recommend DIY. Here is what you should know before you take it in. Then give useful context.

FORMATTING: conversational and concise. Short paragraphs max 3-4 sentences. Bullet points only for steps or lists. No markdown headers. Number step-by-step instructions. Always end with offer to help further or a follow-up question.

BOOKING: if user needs repair beyond DIY naturally mention: If you want it sorted properly bring it into Dr Mochanic in Glasgow - book at drmochanic.co.uk/book. Only when genuinely relevant.

NEVER: claim to be human if sincerely asked. Give advice that endangers someone. Make up specific prices - give ranges. Pretend a serious fault is minor.`

function getClient(): GoogleGenerativeAI {
  const key = typeof window !== 'undefined' ? localStorage.getItem('drm_gemini_key') : null
  if (!key) throw new Error('NO_API_KEY')
  return new GoogleGenerativeAI(key)
}

function safeParseJSON<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON found in response')
  return JSON.parse(jsonMatch[0]) as T
}

export async function scanDashboard(imageBase64: string, mimeType: string): Promise<ScanResult> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const imagePart: Part = { inlineData: { data: imageBase64, mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' } }
  const prompt = `You are Dr Mochanic expert diagnostic AI. Analyse this car dashboard photo carefully. Identify EVERY warning light visible - even partially visible ones. JSON only, no other text: { "healthScore": 0-100, "summary": string, "immediateActions": string[], "lights": [{ "name": string, "symbolDescription": string, "severity": "CRITICAL"|"WARNING"|"INFO", "meaning": string, "urgency": string, "fixSteps": [string, string, string], "estimatedCostGBP": string, "canFixYourself": boolean, "relatedOBD2Codes": string[] }] }`
  const result = await model.generateContent([prompt, imagePart])
  const text = result.response.text()
  const parsed = safeParseJSON<Omit<ScanResult, 'id' | 'timestamp'>>(text)
  return { ...parsed, id: crypto.randomUUID(), timestamp: Date.now() }
}

export async function lookupOBD2Code(code: string): Promise<OBD2Result> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const prompt = `You are Dr Mochanic diagnostic AI. Explain OBD2 code ${code.toUpperCase()} in detail. JSON only, no other text: { "code": string, "fullName": string, "system": string, "severity": "CRITICAL"|"WARNING"|"INFO", "whatItMeans": string, "symptoms": string[], "commonCauses": string[], "fixSteps": string[], "partsNeeded": string[], "estimatedCostGBP": string, "canFixYourself": boolean, "relatedCodes": string[], "howUrgent": string, "worstCaseIfIgnored": string }`
  const result = await model.generateContent(prompt)
  return safeParseJSON<OBD2Result>(result.response.text())
}

export async function getCommonProblems(make: string, model: string, year: string, fuelType: string): Promise<CommonProblem[]> {
  const client = getClient()
  const gemModel = client.getGenerativeModel({ model: MODEL })
  const prompt = `You are Dr Mochanic AI. This is a ${year} ${make} ${model} ${fuelType}. List the 10 most common problems with this exact model reported by UK owners. JSON only, no other text: { "commonProblems": [{ "name": string, "howToIdentify": string, "estimatedCostGBP": string, "severity": "CRITICAL"|"WARNING"|"INFO", "canFixYourself": boolean, "fixSteps": string[], "partsNeeded": string[], "relatedOBD2Codes": string[] }] }`
  const result = await gemModel.generateContent(prompt)
  const parsed = safeParseJSON<{ commonProblems: CommonProblem[] }>(result.response.text())
  return parsed.commonProblems
}

export async function analyseTyrePhoto(imageBase64: string, position: string): Promise<TyreResult> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const imagePart: Part = { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } }
  const prompt = `Analyse this ${position} tyre photo. Estimate tread depth using the 20p coin as reference if visible (outer band = 2mm). JSON only, no other text: { "estimatedTreadMM": number, "status": "SAFE"|"WARNING"|"ILLEGAL"|"BALD", "recommendation": string, "estimatedMilesLeft": number, "replacementCostGBP": string, "unevenWear": boolean, "unevenWearCause": string }`
  const result = await model.generateContent([prompt, imagePart])
  const parsed = safeParseJSON<Omit<TyreResult, 'position'>>(result.response.text())
  return { ...parsed, position }
}

export async function analyseInspectionPhotos(images: string[]): Promise<InspectionResult> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const imageParts: Part[] = images.map(img => ({ inlineData: { data: img, mimeType: 'image/jpeg' as const } }))
  const prompt = `You are Dr Mochanic performing a thorough visual vehicle inspection. Inspect bodywork, tyres, brakes, exhaust, engine bay, suspension. JSON only, no other text: { "overallCondition": "EXCELLENT"|"GOOD"|"FAIR"|"POOR", "motRiskScore": 0-100, "findings": [{ "area": string, "finding": string, "severity": "CRITICAL"|"WARNING"|"INFO"|"PASS", "detail": string, "recommendation": string, "estimatedCostGBP": string, "willFailMOT": boolean }], "immediateActions": string[], "readyForMOT": boolean, "summary": string }`
  const result = await model.generateContent([prompt, ...imageParts])
  return safeParseJSON<InspectionResult>(result.response.text())
}

export async function analyseSoundDiagnosis(symptoms: string[], waveformSummary: string): Promise<{ possibleCauses: Array<{ cause: string; confidence: number; severity: string; description: string; fixSteps: string[]; estimatedCostGBP: string }>; summary: string; urgency: string; recommendation: string }> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const prompt = `You are Dr Mochanic audio diagnostic AI. A car owner recorded their engine sound. Waveform characteristics: ${waveformSummary}. Owner-selected symptoms: ${symptoms.join(', ')}. JSON only, no other text: { "possibleCauses": [{ "cause": string, "confidence": 0-100, "severity": "CRITICAL"|"WARNING"|"INFO", "description": string, "fixSteps": string[], "estimatedCostGBP": string }], "summary": string, "urgency": string, "recommendation": string }`
  const result = await model.generateContent(prompt)
  return safeParseJSON(result.response.text())
}

export async function getLiveStreamInsights(readings: Partial<LiveOBD2Data>[], baseline: Partial<LiveOBD2Data>): Promise<PredictionInsight> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const prompt = `You are Dr Mochanic AI watching live sensor data in real time like a co-pilot mechanic. Last readings: ${JSON.stringify(readings)}. Vehicle baseline: ${JSON.stringify(baseline)}. Identify performance anomalies, early failure patterns, tuning opportunities. JSON only, no other text: { "status": "HEALTHY"|"MONITOR"|"ALERT", "insights": string[], "warnings": string[], "tuningTips": string[], "predictedIssues": [{ "issue": string, "confidence": 0-100, "timeframe": string, "recommendation": string }], "baselineDeviations": string[] }`
  const result = await model.generateContent(prompt)
  return safeParseJSON<PredictionInsight>(result.response.text())
}

export async function getServiceRecommendations(history: ServiceEntry[], vehicle: Vehicle): Promise<{ recommendations: Array<{ service: string; reason: string; urgency: string; estimatedCostGBP: string }> }> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const prompt = `Dr Mochanic AI. Based on service history: ${JSON.stringify(history)}. What is due next for a ${vehicle.year} ${vehicle.make} ${vehicle.model}? JSON only, no other text: { "recommendations": [{ "service": string, "reason": string, "urgency": string, "estimatedCostGBP": string }] }`
  const result = await model.generateContent(prompt)
  return safeParseJSON(result.response.text())
}

export async function getDigitalTwinAnalysis(twin: DigitalTwin): Promise<{ healthTrend: string; keyInsights: string[]; predictedFailures: Array<{ component: string; confidence: number; timeframe: string; preventionSteps: string[] }>; maintenanceRecommendations: string[]; overallAssessment: string }> {
  const client = getClient()
  const model = client.getGenerativeModel({ model: MODEL })
  const prompt = `Dr Mochanic AI. Based on vehicle history over ${twin.scans.length} scans: ${JSON.stringify({ scans: twin.scans.slice(-10), obd2History: twin.obd2History.slice(-20) })}. What patterns do you see? JSON only, no other text: { "healthTrend": "IMPROVING"|"STABLE"|"DECLINING", "keyInsights": string[], "predictedFailures": [{ "component": string, "confidence": number, "timeframe": string, "preventionSteps": string[] }], "maintenanceRecommendations": string[], "overallAssessment": string }`
  const result = await model.generateContent(prompt)
  return safeParseJSON(result.response.text())
}

export async function chatWithDrMochanic(messages: ChatMessage[], context: string): Promise<string> {
  const client = getClient()
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: DR_MOCHANIC_SYSTEM_PROMPT + (context ? `\n\nCONTEXT: ${context}` : ''),
  })
  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  })
  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.content)
  return result.response.text()
}
