import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCorsHeaders } from './lib/cors'

interface AuthTokenPayload {
  id?: string
  exp?: number
  status?: string
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)

  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function base64UrlToJson<T>(value: string): T | null {
  try {
    const bytes = base64UrlToBytes(value)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null
  }

  const header = base64UrlToJson<{ alg?: string }>(encodedHeader)
  if (header?.alg !== 'HS256') {
    return null
  }

  const secret = process.env.NEXTAUTH_SECRET || 'secret'
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBytes(encodedSignature) as unknown as BufferSource,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`) as unknown as BufferSource
  )

  if (!isValid) {
    return null
  }

  const payload = base64UrlToJson<AuthTokenPayload>(encodedPayload)
  if (!payload?.id) {
    return null
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return null
  }

  return payload
}

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

  // Rotas públicas
  const publicPaths = ['/api/health', '/api/auth']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return response
  }

  // Verificar autenticação
  const token = request.cookies.get('auth-token')?.value
  const decoded = token ? await verifyAuthToken(token) : null

  if (!decoded) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401, headers: response.headers }
    )
  }

  // Verificar status do usuário
  if (decoded.status && decoded.status !== 'ACTIVE') {
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
