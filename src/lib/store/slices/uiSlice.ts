import { generateId } from '@/lib/utils'
import type { AppNotification, Theme, UIState } from '@/types'
import type { StateCreator } from 'zustand'

export interface UISlice extends UIState {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: false,
  notifications: [],
}

export const createUISlice: StateCreator<UISlice> = (set, get) => ({
  ...initialState,

  setTheme: (theme: Theme) => {
    set({ theme })
    localStorage.setItem('theme', theme)

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  },

  toggleTheme: () => {
    const { theme, setTheme } = get()
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  },

  setSidebarOpen: (sidebarOpen: boolean) => {
    set({ sidebarOpen })
  },

  toggleSidebar: () => {
    const { sidebarOpen } = get()
    set({ sidebarOpen: !sidebarOpen })
  },

  addNotification: notificationData => {
    const { notifications } = get()
    const notification: AppNotification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    set({
      notifications: [notification, ...notifications],
    })

    const duration = notification.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(notification.id)
      }, duration)
    }
  },

  removeNotification: (id: string) => {
    const { notifications } = get()
    set({
      notifications: notifications.filter(n => n.id !== id),
    })
  },

  clearNotifications: () => {
    set({ notifications: [] })
  },
})
