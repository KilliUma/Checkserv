import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function authMiddleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register')
  
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Permitir rotas públicas da API
  if (isApiRoute && req.nextUrl.pathname === '/api/health') {
    return NextResponse.next()
  }

  // Se não está autenticado e não é página de auth
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se está autenticado e tentando acessar página de auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export function requireAuth(roles?: string[]) {
  return async (req: NextRequest) => {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    if (roles && !roles.includes(token.role as string)) {
      return NextResponse.json(
        { error: 'Sem permissão' },
        { status: 403 }
      )
    }

    return NextResponse.next()
  }
}
