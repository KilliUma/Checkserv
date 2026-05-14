import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

    const where = {
      userId: decoded.id,
      ...(unreadOnly ? { read: false } : {}),
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: {
          userId: decoded.id,
          read: false,
        },
      }),
    ])

    return NextResponse.json({
      data: notifications,
      count: notifications.length,
      unreadCount,
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Erro ao buscar notificações' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const decoded = getAuthTokenPayload()
    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const now = new Date()

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: {
          userId: decoded.id,
          read: false,
        },
        data: {
          read: true,
          readAt: now,
        },
      })

      return NextResponse.json({ success: true })
    }

    if (!body.id) {
      return NextResponse.json({ error: 'ID da notificação em falta' }, { status: 400 })
    }

    const notification = await prisma.notification.updateMany({
      where: {
        id: body.id,
        userId: decoded.id,
      },
      data: {
        read: true,
        readAt: now,
      },
    })

    if (notification.count === 0) {
      return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json({ error: 'Erro ao atualizar notificação' }, { status: 500 })
  }
}
