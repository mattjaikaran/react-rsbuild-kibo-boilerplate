import { authApi } from '@/api/auth'
import { AUTH_STORAGE, clearAuthStorage } from '@/api/auth-storage'
import type {
  AuthState,
  AuthTokens,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'
import type { StateCreator } from 'zustand'

export interface AuthSlice extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  magicLink: (request: MagicLinkRequest) => Promise<void>
  logout: () => Promise<{ message: string }>
  clearAuth: () => void
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

let refreshing: Promise<void> | null = null

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  ...initialState,

  login: async credentials => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login(credentials)
      get().setUser(response.user)
      get().setTokens(response.tokens)
    } catch (error) {
      get().clearAuth()
      set({ error: error instanceof Error ? error.message : 'Login failed' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  register: async credentials => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.register(credentials)
      get().setUser(response.user)
      get().setTokens(response.tokens)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  magicLink: async request => {
    set({ isLoading: true, error: null })
    try {
      await authApi.magicLink(request)
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Magic link failed' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      return await authApi.logout()
    } finally {
      get().clearAuth()
    }
  },

  clearAuth: () => {
    clearAuthStorage()
    set({ ...initialState })
  },

  refreshToken: () => {
    if (refreshing) return refreshing
    refreshing = (async () => {
      const refreshToken = localStorage.getItem(AUTH_STORAGE.refreshToken)
      if (!refreshToken) throw new Error('No refresh token')
      try {
        const tokens = await authApi.refreshToken(refreshToken)
        if (localStorage.getItem(AUTH_STORAGE.refreshToken) !== refreshToken) {
          throw new Error('Session changed during refresh')
        }
        get().setTokens(tokens)
      } catch (error) {
        get().clearAuth()
        throw error
      }
    })().finally(() => { refreshing = null })
    return refreshing
  },

  setUser: user => { set({ user }) },

  setTokens: tokens => {
    localStorage.setItem(AUTH_STORAGE.accessToken, tokens.accessToken)
    localStorage.setItem(AUTH_STORAGE.refreshToken, tokens.refreshToken)
    set({ tokens, isAuthenticated: true })
  },

  setLoading: isLoading => { set({ isLoading }) },
  setError: error => { set({ error }) },
  clearError: () => { set({ error: null }) },

  initializeAuth: async () => {
    const accessToken = localStorage.getItem(AUTH_STORAGE.accessToken)
    const refreshToken = localStorage.getItem(AUTH_STORAGE.refreshToken)
    if (!accessToken || !refreshToken) {
      get().clearAuth()
      return
    }
    set({ tokens: { accessToken, refreshToken }, isLoading: true })
    try {
      const user = await authApi.getMe()
      set({ user, isAuthenticated: true })
    } catch {
      get().clearAuth()
    } finally {
      set({ isLoading: false })
    }
  },
})
