export const AUTH_STORAGE = {
  accessToken: 'auth_token:v1',
  refreshToken: 'refresh_token:v1',
} as const

export function clearAuthStorage(): void {
  localStorage.removeItem(AUTH_STORAGE.accessToken)
  localStorage.removeItem(AUTH_STORAGE.refreshToken)
  localStorage.removeItem('user:v1')
}
