import axios from 'axios'

const apiBaseUrl = (import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')).replace(/\/$/, '')

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: true,
})

export interface AuthSession {
  user: {
    id: string
    name: string
    email: string
    role: string
    customerId: string
  }
  expires: string
}

export const authService = {
  async getSession(): Promise<AuthSession | null> {
    try {
      const { data } = await api.get('/auth/session')
      return data
    } catch {
      return null
    }
  },

  async signIn(email: string, password: string) {
    const { data } = await api.post('/auth/signin', { email, password })
    return data
  },

  async signOut() {
    await api.post('/auth/signout')
  },
}
