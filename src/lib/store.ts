import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, EmergencyRequest, ServiceProvider, Notification } from '@/types'

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Emergency requests
  currentRequest: EmergencyRequest | null
  userRequests: EmergencyRequest[]
  nearbyProviders: ServiceProvider[]
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setCurrentRequest: (request: EmergencyRequest | null) => void
  setUserRequests: (requests: EmergencyRequest[]) => void
  setNearbyProviders: (providers: ServiceProvider[]) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentRequest: null,
      userRequests: [],
      nearbyProviders: [],
      sidebarOpen: false,
      theme: 'light',
      notifications: [],
      
      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentRequest: (request) => set({ currentRequest: request }),
      setUserRequests: (requests) => set({ userRequests: requests }),
      setNearbyProviders: (providers) => set({ nearbyProviders: providers }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ev-rescue-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        notifications: state.notifications,
      }),
    }
  )
)
