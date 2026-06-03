import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': '' },
        body: JSON.stringify(body),
      }
    )
    const data = await response.json()
    return Response.json(data, { status: response.status })
  } catch {
    return Response.json({ error: 'DVLA lookup failed' }, { status: 500 })
  }
}
