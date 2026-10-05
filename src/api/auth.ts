import { apiClient } from '@/api/client'
import { AUTH_STORAGE } from '@/api/auth-storage'
import type {
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<{ token: string; refresh: string; user: User }>(
      '/auth/login',
      credentials,
    )
    return { user: data.user, tokens: { accessToken: data.token, refreshToken: data.refresh } }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await apiClient.post('/auth/signup', {
      email: credentials.email,
      username: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
    })
    return authApi.login({ email: credentials.email, password: credentials.password })
  },

  magicLink: async (request: MagicLinkRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ detail: string }>(
      '/auth/passwordless/login/request',
      request,
    )
    return { message: data.detail }
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<{ access: string; refresh: string; user: User }>(
      '/auth/passwordless/login/verify',
      { token },
    )
    return { user: data.user, tokens: { accessToken: data.access, refreshToken: data.refresh } }
  },

  logout: async (): Promise<{ message: string }> => {
    const refresh = localStorage.getItem(AUTH_STORAGE.refreshToken)
    const { data } = await apiClient.post('/auth/logout', { refresh })
    return data
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

  changePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/change-password', payload)
    return data
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/password-reset', { email })
    return data
  },

  resetPassword: async (payload: {
    token: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/password-reset/confirm', payload)
    return data
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await apiClient.post<{ access: string; refresh?: string }>('/token/refresh', {
      refresh: refreshToken,
    })
    return { accessToken: data.access, refreshToken: data.refresh ?? refreshToken }
  },
}
