import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../lib/auth'

export async function GET() {
  try {
    const decoded = getAuthTokenPayload()

    if (!decoded) {
      return NextResponse.json(null, { status: 401 })
    }

    // Buscar usuário atualizado
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        customerId: true,
        status: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerId: user.customerId,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(null, { status: 401 })
  }
}
