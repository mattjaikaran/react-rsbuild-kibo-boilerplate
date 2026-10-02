import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { AUTH_STORAGE } from '@/api/auth-storage'
import { env } from '@/config/env'
import { useStore } from '@/lib/store'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem(AUTH_STORAGE.accessToken)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetriedRequest = InternalAxiosRequestConfig & { authRetried?: boolean }

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const request = error.config as RetriedRequest | undefined
    const publicAuth = request?.url?.startsWith('/token/') ||
      ['/auth/login', '/auth/signup', '/auth/passwordless/login/request',
        '/auth/passwordless/login/verify'].includes(request?.url ?? '')
    if (error.response?.status !== 401 || !request || publicAuth) throw error

    if (!request.authRetried && localStorage.getItem(AUTH_STORAGE.refreshToken)) {
      request.authRetried = true
      try {
        await useStore.getState().refreshToken()
        if (request.url === '/auth/logout') {
          request.data = JSON.stringify({
            refresh: localStorage.getItem(AUTH_STORAGE.refreshToken),
          })
        }
        return await apiClient.request(request)
      } catch {
        useStore.getState().clearAuth()
      }
    } else {
      useStore.getState().clearAuth()
    }
    window.location.assign('/auth/login')
    throw error
  },
)
