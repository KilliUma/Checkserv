import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getCorsHeaders } from './lib/cors'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value)
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers })
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Rotas públicas
  const publicPaths = ['/api/health', '/api/auth']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return response
  }

  // Verificar autenticação
  if (!token) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401, headers: response.headers }
    )
  }

  // Verificar status do usuário
  if (token.status !== 'ACTIVE') {
    return NextResponse.json(
      { error: 'Conta suspensa' },
      { status: 403, headers: response.headers }
    )
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
