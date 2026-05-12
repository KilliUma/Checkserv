import { prisma } from '@wearcheck/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sample = await prisma.sample.findUnique({
      where: { id: params.id },
      include: {
        equipment: true,
        component: true,
        customer: true,
        testResults: true,
        report: true,
      },
    })

    if (!sample) {
      return NextResponse.json(
        { success: false, error: 'Sample not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: sample,
    })
  } catch (error) {
    console.error('Error fetching sample:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sample' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const sample = await prisma.sample.update({
      where: { id: params.id },
      data: body,
      include: {
        equipment: true,
        customer: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      data: sample,
    })
  } catch (error) {
    console.error('Error updating sample:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sample' },
      { status: 500 }
    )
  }
}
