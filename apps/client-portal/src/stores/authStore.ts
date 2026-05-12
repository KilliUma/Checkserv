import { create } from 'zustand'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
  isLoading: false,
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
    const response = await api.post('/auth/signin', { email, password })
    
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    
    set({ 
      session: response.data, 
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
