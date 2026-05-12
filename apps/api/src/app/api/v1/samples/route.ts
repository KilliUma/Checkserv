import { prisma } from '@wearcheck/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (customerId) {
      where.customerId = customerId
    }

    const samples = await prisma.sample.findMany({
      where,
      include: {
        equipment: true,
        component: true,
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({ 
      success: true,
      data: samples,
      count: samples.length,
    })
  } catch (error) {
    console.error('Error fetching samples:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch samples' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.equipmentId || !body.customerId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Gerar número da amostra
    const year = new Date().getFullYear()
    const count = await prisma.sample.count({
      where: {
        sampleNumber: {
          startsWith: `WCK-${year}-`,
        },
      },
    })
    
    const sampleNumber = `WCK-${year}-${String(count + 1).padStart(6, '0')}`

    const sample = await prisma.sample.create({
      data: {
        sampleNumber,
        customerId: body.customerId,
        equipmentId: body.equipmentId,
        componentId: body.componentId,
        siteId: body.siteId,
        type: body.type || 'ROUTINE',
        priority: body.priority || 'NORMAL',
        equipmentReading: body.equipmentReading,
        fluidType: body.fluidType,
        fluidGrade: body.fluidGrade,
        hoursSinceChange: body.hoursSinceChange,
        customerComment: body.customerComment,
        submittedBy: body.submittedBy,
      },
      include: {
        equipment: true,
        customer: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      data: sample,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating sample:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sample' },
      { status: 500 }
    )
  }
}
