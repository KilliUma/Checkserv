import { prisma } from '@wearcheck/database'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthTokenPayload } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

async function generateSampleNumber(year: number, offset = 1) {
  const prefix = `WCK-${year}-`
  const latest = await prisma.sample.findFirst({
    where: {
      sampleNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      sampleNumber: 'desc',
    },
    select: {
      sampleNumber: true,
    },
  })

  const latestSequence = latest?.sampleNumber
    ? Number(latest.sampleNumber.replace(prefix, ''))
    : 0
  const nextSequence = Number.isFinite(latestSequence) ? latestSequence + offset : offset

  return `${prefix}${String(nextSequence).padStart(6, '0')}`
}

export async function GET(request: NextRequest) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (decoded.customerId) {
      where.customerId = decoded.customerId
    } else if (customerId) {
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
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const submittedBy = decoded.id || body.submittedBy
    const sampleTypeMap: Record<string, string> = {
      ROUTINE: 'ROUTINE',
      RESAMPLE: 'RESAMPLE',
      NEW_EQUIPMENT: 'NEW_EQUIPMENT',
      INVESTIGATION: 'INVESTIGATION',
      POST_MAINTENANCE: 'POST_MAINTENANCE',
      EMERGENCY: 'INVESTIGATION',
      CORRECTIVE: 'INVESTIGATION',
      COMMISSIONING: 'NEW_EQUIPMENT',
    }
    const priorityMap: Record<string, string> = {
      NORMAL: 'NORMAL',
      HIGH: 'HIGH',
      URGENT: 'URGENT',
      LOW: 'NORMAL',
    }
    const sampleType = sampleTypeMap[body.type] || 'ROUTINE'
    const priority = priorityMap[body.priority] || 'NORMAL'
    const equipmentReading = body.equipmentReading ?? body.reading
    const parsedEquipmentReading = equipmentReading !== undefined && equipmentReading !== ''
      ? Number(equipmentReading)
      : undefined
    const parsedHoursSinceChange = body.hoursSinceChange !== undefined && body.hoursSinceChange !== ''
      ? Number(body.hoursSinceChange)
      : undefined
    
    if (!body.equipmentId || !submittedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: body.equipmentId },
      select: {
        id: true,
        customerId: true,
      },
    })

    if (!equipment) {
      return NextResponse.json(
        { success: false, error: 'Equipamento não encontrado' },
        { status: 404 }
      )
    }

    if (decoded.customerId && equipment.customerId !== decoded.customerId) {
      return NextResponse.json(
        { success: false, error: 'Equipamento não pertence ao cliente autenticado' },
        { status: 403 }
      )
    }

    const customerId = decoded.customerId || body.customerId || equipment.customerId

    const year = new Date().getFullYear()
    const sampleData = {
        customerId,
        equipmentId: body.equipmentId,
        componentId: body.componentId || undefined,
        siteId: body.siteId,
        type: sampleType as any,
        priority: priority as any,
        equipmentReading: Number.isFinite(parsedEquipmentReading) ? parsedEquipmentReading : undefined,
        fluidType: body.fluidType,
        fluidGrade: body.fluidGrade,
        hoursSinceChange: Number.isFinite(parsedHoursSinceChange) ? parsedHoursSinceChange : undefined,
        customerComment: body.customerComment,
        submittedBy,
    }

    let sample
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        sample = await prisma.sample.create({
          data: {
            sampleNumber: await generateSampleNumber(year, attempt),
            ...sampleData,
          },
          include: {
            equipment: true,
            customer: true,
          },
        })
        break
      } catch (error: any) {
        if (error?.code !== 'P2002' || attempt === 3) {
          throw error
        }
      }
    }

    if (!sample) {
      throw new Error('Não foi possível gerar número único para a amostra')
    }

    return NextResponse.json({ 
      success: true,
      data: sample,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating sample:', error)
    const message = error instanceof Error ? error.message : 'Failed to create sample'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
