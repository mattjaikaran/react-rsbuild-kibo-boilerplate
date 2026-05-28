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
  logout: () => void
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => void
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const STORAGE_KEYS = {
  authToken: 'auth_token:v1',
  refreshToken: 'refresh_token:v1',
  user: 'user:v1',
} as const

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  ...initialState,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })

    try {
      const mockResponse = {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      }

      localStorage.setItem(STORAGE_KEYS.authToken, mockResponse.tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, mockResponse.tokens.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mockResponse.user))

      set({
        user: mockResponse.user,
        tokens: mockResponse.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      })
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null })

    try {
      const mockResponse = {
        user: {
          id: '1',
          email: credentials.email,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      }

      localStorage.setItem(STORAGE_KEYS.authToken, mockResponse.tokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, mockResponse.tokens.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(mockResponse.user))

      set({
        user: mockResponse.user,
        tokens: mockResponse.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      })
    }
  },

  magicLink: async (_request: MagicLinkRequest) => {
    set({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Magic link failed',
      })
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    localStorage.removeItem(STORAGE_KEYS.user)

    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  },

  refreshToken: async () => {
    const { tokens } = get()
    if (!tokens?.refreshToken) return

    set({ isLoading: true })

    try {
      const mockTokens = {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
      }

      localStorage.setItem(STORAGE_KEYS.authToken, mockTokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, mockTokens.refreshToken)

      set({
        tokens: mockTokens,
        isLoading: false,
      })
    } catch {
      get().logout()
    }
  },

  setUser: (user: User) => {
    set({ user })
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  },

  setTokens: (tokens: AuthTokens) => {
    set({ tokens })
    localStorage.setItem(STORAGE_KEYS.authToken, tokens.accessToken)
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken)
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },

  initializeAuth: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.authToken)
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
      const userStr = localStorage.getItem(STORAGE_KEYS.user)

      if (token && refreshToken && userStr) {
        const user = JSON.parse(userStr)
        set({
          user,
          tokens: { accessToken: token, refreshToken },
          isAuthenticated: true,
        })
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      localStorage.removeItem(STORAGE_KEYS.authToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  },
})
