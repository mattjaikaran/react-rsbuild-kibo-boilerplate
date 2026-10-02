import type { Theme } from './base'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  lastLogin?: string
}

export interface UserProfile extends User {
  avatar?: string
  bio?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: Theme
  notifications: boolean
  language: string
}
