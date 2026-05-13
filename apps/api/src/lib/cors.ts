const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3100',
  'http://localhost:3101',
  'http://localhost:3102',
  'https://checkserv-client-portal.vercel.app',
  'https://checkserv-backoffice.vercel.app',
  'https://checkserv-web.vercel.app',
  'https://checkserv-api.vercel.app',
]

function getConfiguredOrigins(): string[] {
  const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return [...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]
}

function isAllowedVercelHost(hostname: string): boolean {
  if (!hostname.endsWith('.vercel.app')) {
    return false
  }

  if (hostname.endsWith('-claudio-rodrigues-projects-ccdc0b4a.vercel.app')) {
    return true
  }

  return /(^|-)checkserv|client-portal|backoffice|wearcheck/i.test(hostname)
}

export function isAllowedOrigin(origin: string): boolean {
  if (!origin) {
    return false
  }

  if (getConfiguredOrigins().includes(origin)) {
    return true
  }

  try {
    const { hostname, protocol } = new URL(origin)
    if (protocol !== 'https:') {
      return false
    }

    if (hostname.endsWith('.checkserv.co.ao')) {
      return true
    }

    return isAllowedVercelHost(hostname)
  } catch {
    return false
  }
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !isAllowedOrigin(origin)) {
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    Vary: 'Origin',
  }
}