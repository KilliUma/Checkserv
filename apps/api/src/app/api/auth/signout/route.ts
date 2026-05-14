import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCorsHeaders } from '@/lib/cors'

export const dynamic = 'force-dynamic'

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  })
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'))

  try {
    const cookieStore = cookies()
    const isProduction = process.env.NODE_ENV === 'production'

    cookieStore.set('auth-token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 0,
      path: '/',
    })

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: corsHeaders }
    )
  }
}
