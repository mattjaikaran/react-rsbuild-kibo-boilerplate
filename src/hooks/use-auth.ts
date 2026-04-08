import { authApi } from '@/api/auth'
import { useAuth, useUI } from '@/lib/store'
import type {
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'
import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'

export const useLogin = (
  options?: UseMutationOptions<AuthResponse, Error, LoginCredentials>
) => {
  const { login } = useAuth()
  const { addNotification } = useUI()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      login(data as any)
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been successfully logged in.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Login failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useRegister = (
  options?: UseMutationOptions<AuthResponse, Error, RegisterCredentials>
) => {
  const { register } = useAuth()
  const { addNotification } = useUI()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      register(data as any)
      addNotification({
        type: 'success',
        title: 'Account created!',
        message: 'Your account has been successfully created.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Registration failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useMagicLink = (
  options?: UseMutationOptions<{ message: string }, Error, MagicLinkRequest>
) => {
  const { addNotification } = useUI()

  return useMutation({
    mutationFn: authApi.magicLink,
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Magic link sent!',
        message: 'Check your email for the login link.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Failed to send magic link',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      queryClient.clear()
      addNotification({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      })
    },
    onError: () => {
      logout()
      queryClient.clear()
      addNotification({
        type: 'warning',
        title: 'Logged out',
        message: 'You have been logged out locally.',
      })
    },
  })
}

export const useProfile = (options?: UseQueryOptions<User, Error>) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    ...options,
  })
}
