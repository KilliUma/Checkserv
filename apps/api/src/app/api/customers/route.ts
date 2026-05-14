import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload, isAdminRole } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (!isAdminRole(decoded.role)) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            users: true,
            equipment: true,
            samples: true,
            reports: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: customers,
      count: customers.length,
    })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}
