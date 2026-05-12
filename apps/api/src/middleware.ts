import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // CORS headers
  const response = NextResponse.next()
  
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3000',
  ]
  
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return response
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
