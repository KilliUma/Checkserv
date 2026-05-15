import axios from 'axios'
import { getApiBaseUrl } from '../utils/apiBaseUrl'

const root = getApiBaseUrl().replace(/\/$/, '')
const authTokenStorageKey = 'wearcheck.authToken'

/** Cliente HTTP partilhado: baseURL inclui `/api`, com cookie e fallback Bearer token. */
export const portalApi = axios.create({
  baseURL: `${root}/api`,
  withCredentials: true,
})

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(authTokenStorageKey)
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(authTokenStorageKey, token)
}

export function clearStoredAuthToken(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(authTokenStorageKey)
}

portalApi.interceptors.request.use((config) => {
  const token = getStoredAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/** URL absoluta para abrir downloads PDF (cookie enviado no mesmo site em dev). */
export function reportDownloadAbsoluteUrl(reportId: string): string {
  if (!root && typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1/reports/${reportId}/download`
  }
  return `${root}/api/v1/reports/${reportId}/download`
}
