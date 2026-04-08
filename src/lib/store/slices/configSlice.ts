import { env } from '@/config/env'
import type { StateCreator } from 'zustand'

interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  env: {
    appName: string
    appEnv: string
    isDevelopment: boolean
    isProduction: boolean
    mode: 'standalone' | 'django-spa'
  }
  features: {
    darkMode: boolean
    notifications: boolean
    magicLink: boolean
  }
}

export interface ConfigSlice {
  config: AppConfig
  isDjangoSPA: boolean
  isStandalone: boolean
  updateConfig: (updates: Partial<AppConfig>) => void
  isFeatureEnabled: (feature: keyof AppConfig['features']) => boolean
  setFeature: (feature: keyof AppConfig['features'], enabled: boolean) => void
}

const defaultConfig: AppConfig = {
  api: {
    baseUrl: env.apiUrl,
    timeout: env.apiTimeout,
  },
  env: {
    appName: env.appName,
    appEnv: env.appEnv,
    isDevelopment: env.isDev,
    isProduction: env.isProd,
    mode: 'standalone',
  },
  features: {
    darkMode: true,
    notifications: true,
    magicLink: false,
  },
}

export const createConfigSlice: StateCreator<ConfigSlice> = (set, get) => ({
  config: defaultConfig,
  isDjangoSPA: defaultConfig.env.mode === 'django-spa',
  isStandalone: defaultConfig.env.mode === 'standalone',

  updateConfig: (updates: Partial<AppConfig>) => {
    const { config } = get()
    const newConfig = { ...config, ...updates }
    set({
      config: newConfig,
      isDjangoSPA: newConfig.env.mode === 'django-spa',
      isStandalone: newConfig.env.mode === 'standalone',
    })
  },

  isFeatureEnabled: (feature: keyof AppConfig['features']) => {
    const { config } = get()
    return config.features[feature]
  },

  setFeature: (feature: keyof AppConfig['features'], enabled: boolean) => {
    const { config, updateConfig } = get()
    updateConfig({
      features: {
        ...config.features,
        [feature]: enabled,
      },
    })
  },
})
