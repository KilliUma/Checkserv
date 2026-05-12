import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'WearCheck API v1',
    timestamp: new Date().toISOString(),
  })
}
