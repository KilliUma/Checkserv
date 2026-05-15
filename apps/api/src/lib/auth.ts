import { cookies, headers } from 'next/headers'
import { verify } from 'jsonwebtoken'

export interface AuthTokenPayload {
  id: string
  email?: string
  role?: string
  customerId?: string | null
}

export function getAuthTokenPayload(): AuthTokenPayload | null {
  const cookieToken = cookies().get('auth-token')?.value
  const authHeader = headers().get('authorization')
  const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]
  const token = cookieToken || bearerToken

  if (!token) {
    return null
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'secret') as AuthTokenPayload
    return decoded?.id ? decoded : null
  } catch {
    return null
  }
}

export function isAdminRole(role: string | undefined): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}
