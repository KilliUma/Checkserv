import { hash, compare } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    READONLY: 0,
    CUSTOMER_USER: 1,
    LAB_TECHNICIAN: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 0

  return userLevel >= requiredLevel
}
