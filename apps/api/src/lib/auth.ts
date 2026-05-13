import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export interface AuthTokenPayload {
  id: string
  email?: string
  role?: string
  customerId?: string | null
}

export function getAuthTokenPayload(): AuthTokenPayload | null {
  const token = cookies().get('auth-token')?.value

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