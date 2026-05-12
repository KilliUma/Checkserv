function inferApiUrlFromHost(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const origin = window.location.origin

  // Convenção esperada na Vercel: <project>-client-portal -> <project>-api
  if (origin.includes('client-portal')) {
    return origin.replace('client-portal', 'api')
  }

  return ''
}

export function getApiBaseUrl(): string {
  const envApiUrl = (import.meta.env.VITE_API_URL || '').trim()

  if (import.meta.env.DEV) {
    return ''
  }

  return (envApiUrl || inferApiUrlFromHost()).replace(/\/$/, '')
}
