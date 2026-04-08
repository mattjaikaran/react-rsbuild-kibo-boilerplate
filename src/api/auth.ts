import { apiClient } from '@/api/client'
import type {
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', credentials)
    return data
  },

  magicLink: async (request: MagicLinkRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/magic-link', request)
    return data
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/magic-link/verify', { token })
    return data
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const { data } = await apiClient.post('/auth/logout')
      return data
    } catch {
      return { message: 'Logged out successfully' }
    }
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await apiClient.patch('/auth/me', updates)
    return data
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/change-password', payload)
    return data
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/password-reset', { email })
    return data
  },

  resetPassword: async (payload: { token: string; newPassword: string }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/password-reset/confirm', payload)
    return data
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken })
    return data
  },
}
