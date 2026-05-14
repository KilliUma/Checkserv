import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { notifyAdmins } from '../../../../lib/notifications'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    })

    if (user) {
      await notifyAdmins({
        title: 'Pedido de recuperação de senha',
        message: `${user.name} solicitou recuperação de senha.`,
        actionUrl: '/admin/usuarios',
        data: {
          userId: user.id,
          email: user.email,
          status: user.status,
          customer: user.customer?.name,
        },
        type: 'SYSTEM_ALERT',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Se o email existir, a equipa de suporte receberá o pedido de recuperação.',
    })
  } catch (error) {
    console.error('Erro no pedido de recuperação de senha:', error)
    return NextResponse.json({ error: 'Erro ao solicitar recuperação de senha' }, { status: 500 })
  }
}
