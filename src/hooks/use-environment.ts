import {
  useEnvConfig,
  useIsDjangoSPA as useIsDjangoSPAStore,
  useIsStandalone as useIsStandaloneStore,
} from '@/lib/store'
import { useSyncExternalStore } from 'react'

export function useEnvironment() {
  return useEnvConfig()
}

export function useIsDjangoSPA() {
  return useIsDjangoSPAStore()
}

export function useIsStandalone() {
  return useIsStandaloneStore()
}

export function useIsDevelopment() {
  const env = useEnvironment()
  return env.isDevelopment
}

export function useIsProduction() {
  const env = useEnvironment()
  return env.isProduction
}

const subscribeToOnline = (callback: () => void) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const getOnlineSnapshot = () => navigator.onLine
const getOnlineServerSnapshot = () => true

export function useNetworkStatus() {
  return useSyncExternalStore(
    subscribeToOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot
  )
}

const subscribeToResize = (callback: () => void) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

const getViewportSnapshot = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
})

const getViewportServerSnapshot = () => ({ width: 1024, height: 768 })

let cachedViewport = { width: 0, height: 0 }
const getMemoizedViewportSnapshot = () => {
  const current = getViewportSnapshot()
  if (
    current.width !== cachedViewport.width ||
    current.height !== cachedViewport.height
  ) {
    cachedViewport = current
  }
  return cachedViewport
}

export function useViewportSize() {
  return useSyncExternalStore(
    subscribeToResize,
    getMemoizedViewportSnapshot,
    getViewportServerSnapshot
  )
}
