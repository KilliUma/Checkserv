import { create } from 'zustand'
import {
  clearStoredAuthToken,
  portalApi as api,
  setStoredAuthToken,
} from '../lib/apiClient'

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
    set({ isLoading: true })
    try {
      const { data } = await api.get('/auth/session')
      set({ 
        session: data, 
        isAuthenticated: !!data,
        isLoading: false 
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        set({ 
          session: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      } else {
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
    let token: string | undefined

    try {
      const { data } = await api.post('/auth/signin', { email, password })
      token = data?.token
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao iniciar sessão')
    }

    if (token) {
      setStoredAuthToken(token)
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
    try {
      await api.post('/auth/signout')
    } finally {
      clearStoredAuthToken()
    }

    set({ 
      session: null, 
      isAuthenticated: false 
    })
  },
}))
