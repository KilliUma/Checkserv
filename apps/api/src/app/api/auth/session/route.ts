import { NextResponse } from 'next/server'
import { prisma } from '@wearcheck/database'
import { getAuthTokenPayload } from '../../../../lib/auth'
import { getCorsHeaders } from '@/lib/cors'

export const dynamic = 'force-dynamic'

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  })
}

export async function GET(request: Request) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))

  try {
    const decoded = getAuthTokenPayload()

    if (!decoded) {
      return NextResponse.json(null, { headers: corsHeaders })
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
      return NextResponse.json(null, { headers: corsHeaders })
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
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(null, { headers: corsHeaders })
  }
}
