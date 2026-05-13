import { create } from 'zustand'
import axios from 'axios'

const apiBaseUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3103' : '')).replace(/\/$/, '')

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: true,
})

interface AuthSession {
  user: {
    id: string
    name: string
    email: string
    role: string
    customerId: string
  }
  expires: string
}

interface AuthStore {
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  checkSession: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoading: true,
  isAuthenticated: false,

  checkSession: async () => {
    try {
      const { data } = await api.get('/auth/session')
      set({ 
        session: data, 
        isAuthenticated: !!data,
        isLoading: false 
      })
    } catch (error: any) {
      // 401 é esperado quando não há sessão - não é um erro real
      if (error.response?.status === 401) {
        set({ 
          session: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      } else {
        // Outros erros (servidor offline, etc)
        console.error('Erro ao verificar sessão:', error)
        set({ 
          session: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      }
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/signin', { email, password })
    
    if (response.data.error) {
      throw new Error(response.data.error)
    }

    // Confirma persistencia da sessao via cookie antes de marcar login como concluido.
    const { data: sessionData } = await api.get('/auth/session')
    if (!sessionData?.user) {
      throw new Error('Sessao nao persistida no navegador')
    }
    
    set({ 
      session: sessionData,
      isAuthenticated: true,
      isLoading: false 
    })
  },

  logout: async () => {
    await api.post('/auth/signout')
    set({ 
      session: null, 
      isAuthenticated: false 
    })
  },
}))
