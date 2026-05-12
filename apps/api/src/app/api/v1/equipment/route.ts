import { prisma } from '@wearcheck/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    const where: any = {}
    
    if (customerId) {
      where.customerId = customerId
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        site: true,
        components: true,
        _count: {
          select: {
            samples: true,
          },
        },
      },
      orderBy: {
        equipmentNo: 'asc',
      },
    })

    return NextResponse.json({ 
      success: true,
      data: equipment,
      count: equipment.length,
    })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const equipment = await prisma.equipment.create({
      data: {
        equipmentNo: body.equipmentNo,
        description: body.description,
        manufacturer: body.manufacturer,
        model: body.model,
        year: body.year,
        serialNumber: body.serialNumber,
        customerId: body.customerId,
        siteId: body.siteId,
        currentReading: body.currentReading,
        readingUnit: body.readingUnit,
        tags: body.tags || [],
      },
      include: {
        customer: true,
        site: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      data: equipment,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}
