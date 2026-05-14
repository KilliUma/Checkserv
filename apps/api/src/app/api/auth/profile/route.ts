import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

function normalizePreferences(value: unknown) {
  const fallback = {
    notifications: { email: true, inApp: true },
    language: 'pt',
    timezone: 'Africa/Luanda',
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fallback
  }

  const preferences = value as {
    notifications?: { email?: boolean; inApp?: boolean }
    language?: string
    timezone?: string
  }

  return {
    notifications: {
      email: preferences.notifications?.email ?? true,
      inApp: preferences.notifications?.inApp ?? true,
    },
    language: preferences.language || 'pt',
    timezone: preferences.timezone || 'Africa/Luanda',
  }
}

export async function GET() {
  try {
    const decoded = getAuthTokenPayload()

    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        customerId: true,
        preferences: true,
        createdAt: true,
        lastLoginAt: true,
        customer: {
          select: {
            name: true,
            tradingName: true,
            email: true,
            phone: true,
            city: true,
            country: true,
            status: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      data: {
        ...user,
        preferences: normalizePreferences(user.preferences),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const decoded = getAuthTokenPayload()

    if (!decoded) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const preferences = normalizePreferences(body.preferences)

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name,
        phone: phone || null,
        preferences,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        customerId: true,
        preferences: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        preferences: normalizePreferences(user.preferences),
      },
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 })
  }
}
