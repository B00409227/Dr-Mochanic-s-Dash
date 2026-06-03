export type Severity = 'CRITICAL' | 'WARNING' | 'INFO'

export interface WarningLight {
  name: string
  symbolDescription: string
  severity: Severity
  meaning: string
  urgency: string
  fixSteps: string[]
  estimatedCostGBP: string
  canFixYourself: boolean
  relatedOBD2Codes: string[]
}

export interface ScanResult {
  id: string
  timestamp: number
  healthScore: number
  summary: string
  immediateActions: string[]
  lights: WarningLight[]
  vehicleReg?: string
}

export interface OBD2Result {
  code: string
  fullName: string
  system: string
  severity: Severity
  whatItMeans: string
  symptoms: string[]
  commonCauses: string[]
  fixSteps: string[]
  partsNeeded: string[]
  estimatedCostGBP: string
  canFixYourself: boolean
  relatedCodes: string[]
  howUrgent: string
  worstCaseIfIgnored: string
}

export interface Vehicle {
  reg: string
  make: string
  model: string
  year: string
  colour: string
  fuelType: string
  motStatus: string
  taxStatus: string
  addedAt: number
  lastScanDate?: number
  lastHealthScore?: number
}

export interface CommonProblem {
  name: string
  howToIdentify: string
  estimatedCostGBP: string
  severity: Severity
  canFixYourself: boolean
  fixSteps: string[]
  partsNeeded: string[]
  relatedOBD2Codes: string[]
}

export interface LiveOBD2Data {
  rpm: number
  speed: number
  coolantTemp: number
  intakeTemp: number
  throttle: number
  engineLoad: number
  fuelLevel: number
  batteryVoltage: number
  ambientTemp: number
  shortFuelTrim: number
  longFuelTrim: number
  timestamp: number
}

export interface PredictionInsight {
  status: 'HEALTHY' | 'MONITOR' | 'ALERT'
  insights: string[]
  warnings: string[]
  tuningTips: string[]
  predictedIssues: Array<{
    issue: string
    confidence: number
    timeframe: string
    recommendation: string
  }>
  baselineDeviations: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface TyreResult {
  position: string
  estimatedTreadMM: number
  status: 'SAFE' | 'WARNING' | 'ILLEGAL' | 'BALD'
  recommendation: string
  estimatedMilesLeft: number
  replacementCostGBP: string
  unevenWear: boolean
  unevenWearCause: string
}

export interface InspectionFinding {
  area: string
  finding: string
  severity: Severity | 'PASS'
  detail: string
  recommendation: string
  estimatedCostGBP: string
  willFailMOT: boolean
}

export interface InspectionResult {
  overallCondition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  motRiskScore: number
  findings: InspectionFinding[]
  immediateActions: string[]
  readyForMOT: boolean
  summary: string
}

export interface CommunityFault {
  id: string
  make: string
  model: string
  year: string
  code: string
  symptom: string
  timestamp: number
  deviceId: string
}

export interface DigitalTwin {
  deviceId: string
  reg: string
  make: string
  model: string
  year: string
  scans: ScanResult[]
  obd2History: LiveOBD2Data[]
  serviceHistory: ServiceEntry[]
  baselineReadings: Partial<LiveOBD2Data>
  predictedIssues: PredictionInsight['predictedIssues']
  createdAt: number
  updatedAt: number
}

export interface ServiceEntry {
  id: string
  reg: string
  date: string
  mileage: number
  serviceType: string
  cost: number
  garage: string
  notes: string
}
