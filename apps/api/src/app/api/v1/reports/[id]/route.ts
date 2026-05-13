import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../../lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const reportWhere: any = {
      id: params.id,
      sample: {},
    }

    if (decoded.customerId) {
      reportWhere.sample.customerId = decoded.customerId
    }

    const report = await prisma.report.findFirst({
      where: reportWhere,
      include: {
        sample: {
          include: {
            equipment: true,
            component: true,
            customer: {
              select: {
                name: true,
              },
            },
            testResults: {
              orderBy: { testType: 'asc' },
            },
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ data: report })
  } catch (error) {
    console.error('Erro ao buscar relatório:', error)
    return NextResponse.json({ error: 'Erro ao buscar relatório' }, { status: 500 })
  }
}
