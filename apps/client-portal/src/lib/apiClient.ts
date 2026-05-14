import axios from 'axios'
import { getApiBaseUrl } from '../utils/apiBaseUrl'

const root = getApiBaseUrl().replace(/\/$/, '')

/** Cliente HTTP partilhado: baseURL inclui `/api`, cookies de sessão em todos os ambientes. */
export const portalApi = axios.create({
  baseURL: `${root}/api`,
  withCredentials: true,
})

/** URL absoluta para abrir downloads PDF (cookie enviado no mesmo site em dev). */
export function reportDownloadAbsoluteUrl(reportId: string): string {
  if (!root && typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1/reports/${reportId}/download`
  }
  return `${root}/api/v1/reports/${reportId}/download`
}
