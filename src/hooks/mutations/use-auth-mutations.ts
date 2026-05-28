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
  useQueryClient,
} from '@tanstack/react-query'

export const useLogin = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, LoginCredentials>,
    'mutationFn'
  >
) => {
  const { login } = useAuth()
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: authApi.login,
    onSuccess: data => {
      login(data as any)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
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
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, RegisterCredentials>,
    'mutationFn'
  >
) => {
  const { register } = useAuth()
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: authApi.register,
    onSuccess: data => {
      register(data as any)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
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
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, MagicLinkRequest>,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, MagicLinkRequest>({
    mutationFn: authApi.magicLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
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

export const useVerifyMagicLink = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, string>, 'mutationFn'>
) => {
  const { login } = useAuth()
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, string>({
    mutationFn: authApi.verifyMagicLink,
    onSuccess: data => {
      login(data as any)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        title: 'Logged in!',
        message: 'Magic link verified successfully.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Verification failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useLogout = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, void>,
    'mutationFn'
  >
) => {
  const { logout } = useAuth()
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, void>({
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
    ...options,
  })
}

export const useUpdateProfile = (
  options?: Omit<UseMutationOptions<User, Error, Partial<User>>, 'mutationFn'>
) => {
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<User, Error, Partial<User>>({
    mutationFn: authApi.updateProfile,
    onSuccess: data => {
      queryClient.setQueryData(['auth', 'profile'], data)
      addNotification({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been updated successfully.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Update failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useChangePassword = (
  options?: Omit<
    UseMutationOptions<
      { message: string },
      Error,
      { currentPassword: string; newPassword: string }
    >,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<
    { message: string },
    Error,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        title: 'Password changed',
        message: 'Your password has been changed successfully.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Password change failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useRequestPasswordReset = (
  options?: Omit<
    UseMutationOptions<{ message: string }, Error, string>,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, string>({
    mutationFn: authApi.requestPasswordReset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        title: 'Reset email sent',
        message: 'Check your email for password reset instructions.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Request failed',
        message: error.message,
      })
    },
    ...options,
  })
}

export const useResetPassword = (
  options?: Omit<
    UseMutationOptions<
      { message: string },
      Error,
      { token: string; newPassword: string }
    >,
    'mutationFn'
  >
) => {
  const { addNotification } = useUI()
  const queryClient = useQueryClient()

  return useMutation<
    { message: string },
    Error,
    { token: string; newPassword: string }
  >({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      addNotification({
        type: 'success',
        title: 'Password reset',
        message: 'Your password has been reset. You can now log in.',
      })
    },
    onError: error => {
      addNotification({
        type: 'error',
        title: 'Reset failed',
        message: error.message,
      })
    },
    ...options,
  })
}
