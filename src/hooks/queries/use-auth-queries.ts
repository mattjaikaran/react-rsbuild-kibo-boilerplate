import { authApi } from '@/api/auth'
import { useAuth } from '@/lib/store'
import type { User } from '@/types'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

export const useProfile = (
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth()

  return useQuery<User, Error>({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  })
}

export const useSessionCheck = (
  options?: Omit<UseQueryOptions<boolean, Error>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth()

  return useQuery<boolean, Error>({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      try {
        await authApi.getProfile()
        return true
      } catch {
        return false
      }
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    ...options,
  })
}

export const useAuthStatus = () => {
  const { isAuthenticated, user } = useAuth()
  const profileQuery = useProfile({ enabled: isAuthenticated && !user })

  return {
    isAuthenticated,
    isLoading: profileQuery.isLoading,
    user: user || profileQuery.data,
    error: profileQuery.error,
  }
}
