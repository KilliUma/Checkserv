import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload, isAdminRole } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (!isAdminRole(decoded.role)) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    // Buscar usuários pendentes
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING',
        role: 'CUSTOMER_USER',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            tradingName: true,
            email: true,
            phone: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      users: pendingUsers.map((user: (typeof pendingUsers)[number]) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        customer: user.customer,
      })),
    })
  } catch (error) {
    console.error('Erro ao buscar usuários pendentes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}
