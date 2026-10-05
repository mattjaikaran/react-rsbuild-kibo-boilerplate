import { useCallback, useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (notify: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', notify)
      return () => mediaQuery.removeEventListener('change', notify)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useIsMobile = () => useMediaQuery('(max-width: 639px)')
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)')

export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)')

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

export const useBreakpoint = (): 'mobile' | 'tablet' | 'desktop' | 'large' => {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isLargeDesktop = useIsLargeDesktop()

  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  if (isLargeDesktop) return 'large'
  return 'desktop'
}
