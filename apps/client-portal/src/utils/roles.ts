export function isAdminRole(role?: string): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function isStaffRole(role?: string): boolean {
  return isAdminRole(role) || role === 'LAB_TECHNICIAN'
}

export function getDefaultRouteForRole(role?: string): string {
  return isStaffRole(role) ? '/admin/dashboard' : '/dashboard'
}
