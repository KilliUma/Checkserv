import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@wearcheck/auth'
import { prisma } from '@wearcheck/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const report = await prisma.report.findFirst({
      where: {
        id: params.id,
        sample: {
          customerId: (session.user as any).customerId,
        },
      },
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
