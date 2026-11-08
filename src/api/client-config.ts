import type { Config } from '@/api/generated/client'
import { AUTH_STORAGE } from '@/api/auth-storage'
import { env } from '@/config/env'
import { useStore } from '@/lib/store'
import axios, { type AxiosError, type AxiosStatic, type InternalAxiosRequestConfig } from 'axios'

/**
 * Transport for every generated SDK call.
 *
 * The generated client accepts this instance through `createClientConfig`, so
 * the JWT request interceptor and the refresh-on-401 response interceptor keep
 * applying to generated endpoints. The generic CRUD hooks use it directly.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_STORAGE.accessToken)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetriedRequest = InternalAxiosRequestConfig & { authRetried?: boolean }

const apiBasePath = new URL(env.apiUrl, 'http://localhost').pathname.replace(/\/$/, '')

/** Path relative to the configured API prefix; generated calls pass absolute URLs. */
function apiPath(url: string | undefined): string {
  if (!url) return ''
  let pathname: string
  try {
    pathname = new URL(url, 'http://localhost').pathname
  } catch {
    return url
  }
  return pathname.startsWith(apiBasePath) ? pathname.slice(apiBasePath.length) || '/' : pathname
}

const publicAuthPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/passwordless/login/request',
  '/auth/passwordless/login/verify',
]

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriedRequest | undefined
    const path = apiPath(request?.url)
    const publicAuth = path.startsWith('/token/') || publicAuthPaths.includes(path)
    if (error.response?.status !== 401 || !request || publicAuth) throw error

    if (!request.authRetried && localStorage.getItem(AUTH_STORAGE.refreshToken)) {
      request.authRetried = true
      try {
        await useStore.getState().refreshToken()
        if (path === '/auth/logout') {
          request.data = { refresh: localStorage.getItem(AUTH_STORAGE.refreshToken) }
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

/**
 * Initial configuration for `src/api/generated/client.gen.ts`.
 *
 * `@hey-api/client-axios` types the option as `AxiosStatic`, but it accepts an
 * existing instance at runtime (`instance = config.axios` when the value is not
 * the axios static). Reusing the instance keeps the interceptors above.
 */
export function createClientConfig(override?: Config): Config {
  return {
    ...override,
    axios: apiClient as unknown as AxiosStatic,
    baseURL: env.apiUrl,
  }
}
