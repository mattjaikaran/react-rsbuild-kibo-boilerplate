import { AUTH_STORAGE } from '@/api/auth-storage'
import {
  authChangePassword,
  authGetCurrentUser,
  authLogin,
  authLogout,
  authRefresh,
  authRequestMagicLink,
  authRequestPasswordReset,
  authResetPassword,
  authSignup,
  authUpdateCurrentUser,
  authVerifyMagicLink,
} from '@/api/generated/sdk.gen'
import type {
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'

/**
 * App-facing auth contract on top of the generated SDK.
 *
 * The generated operations own URLs, payloads, and response types; this module
 * only maps the backend's token names to the store's `AuthTokens` shape.
 */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await authLogin({ body: credentials, throwOnError: true })
    return { user: data.user, tokens: { accessToken: data.token, refreshToken: data.refresh } }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await authSignup({
      body: {
        email: credentials.email,
        username: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
      },
      throwOnError: true,
    })
    return authApi.login({ email: credentials.email, password: credentials.password })
  },

  magicLink: async (request: MagicLinkRequest): Promise<{ message: string }> => {
    const { data } = await authRequestMagicLink({ body: request, throwOnError: true })
    return { message: data.detail }
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const { data } = await authVerifyMagicLink({ body: { token }, throwOnError: true })
    return { user: data.user, tokens: { accessToken: data.access, refreshToken: data.refresh } }
  },

  logout: async (): Promise<{ message: string }> => {
    const refresh = localStorage.getItem(AUTH_STORAGE.refreshToken)
    const { data } = await authLogout({ body: { refresh }, throwOnError: true })
    return data
  },

  getProfile: async (): Promise<User> => {
    const { data } = await authGetCurrentUser({ throwOnError: true })
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await authGetCurrentUser({ throwOnError: true })
    return data
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await authUpdateCurrentUser({ body: updates, throwOnError: true })
    return data
  },

  changePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await authChangePassword({ body: payload, throwOnError: true })
    return data
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await authRequestPasswordReset({ body: { email }, throwOnError: true })
    return data
  },

  resetPassword: async (payload: {
    token: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await authResetPassword({ body: payload, throwOnError: true })
    return data
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await authRefresh({ body: { refresh: refreshToken }, throwOnError: true })
    return { accessToken: data.access, refreshToken: data.refresh ?? refreshToken }
  },
}
