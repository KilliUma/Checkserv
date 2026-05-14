import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload, isAdminRole } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin
    if (!isAdminRole(decoded.role)) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const userId = params.id

    // Buscar usuário com customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Ativar usuário
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    })

    // Ativar customer também se existir
    if (user.customerId) {
      await prisma.customer.update({
        where: { id: user.customerId },
        data: { status: 'ACTIVE' },
      })
    }

    return NextResponse.json({
      message: 'Usuário ativado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: 'ACTIVE',
      },
    })
  } catch (error) {
    console.error('Erro ao ativar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao ativar usuário' },
      { status: 500 }
    )
  }
}
