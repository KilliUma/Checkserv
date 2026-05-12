import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Verificar autenticação
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'secret') as any

    // Verificar se é admin
    if (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN') {
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
      users: pendingUsers.map(user => ({
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
