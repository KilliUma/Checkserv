const rawBasePath = import.meta.env.BASE_URL || '/'

const normalizedBasePath = rawBasePath === '/'
  ? ''
  : rawBasePath.replace(/\/$/, '')

export const routerBasePath = normalizedBasePath || '/'

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBasePath}${normalizedPath}`
}
