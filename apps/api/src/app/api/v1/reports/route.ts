import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@wearcheck/auth'
import { prisma } from '@wearcheck/database'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const equipmentId = searchParams.get('equipmentId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    const where: any = {
      sample: {
        customerId: (session.user as any).customerId,
      },
    }

    if (status) {
      where.status = status
    }

    if (equipmentId) {
      where.sample = {
        ...where.sample,
        equipmentId,
      }
    }

    if (startDate || endDate) {
      where.reportDate = {}
      if (startDate) {
        where.reportDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.reportDate.lte = new Date(endDate)
      }
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reportDate: 'desc' },
        include: {
          sample: {
            include: {
              equipment: {
                select: {
                  equipmentNo: true,
                  description: true,
                },
              },
              component: {
                select: {
                  componentNo: true,
                  type: true,
                },
              },
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ])

    return NextResponse.json({
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar relatórios:', error)
    return NextResponse.json({ error: 'Erro ao buscar relatórios' }, { status: 500 })
  }
}
