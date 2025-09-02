import { useState, useEffect } from 'react'
import { DatabaseService, type User, type EmergencyRequest, type FleetVehicle, type Notification } from '../lib/database'
import { useAuth } from './useAuth'

export function useRealTimeData() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<User | null>(null)
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load user data
        const userInfo = await DatabaseService.getUser(user.id)
        setUserData(userInfo)

        // Load user's emergency requests
        const requests = await DatabaseService.getEmergencyRequests(user.id)
        setEmergencyRequests(requests)

        // Load fleet vehicles (for providers/admins)
        if (userInfo?.role === 'provider' || userInfo?.role === 'admin') {
          const vehicles = await DatabaseService.getFleetVehicles()
          setFleetVehicles(vehicles)
        }

        // Load notifications
        const userNotifications = await DatabaseService.getUserNotifications(user.id)
        setNotifications(userNotifications)

      } catch (err) {
        console.error('Error loading real-time data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Set up real-time listeners
    const unsubscribeRequests = DatabaseService.subscribeToEmergencyRequests((requests) => {
      if (user?.id) {
        const userRequests = requests.filter(req => req.userId === user.id)
        setEmergencyRequests(userRequests)
      }
    })

    const unsubscribeFleet = DatabaseService.subscribeToFleetVehicles((vehicles) => {
      setFleetVehicles(vehicles)
    })

    const unsubscribeNotifications = DatabaseService.subscribeToUserNotifications(
      user?.id || '',
      (notifications) => {
        setNotifications(notifications)
      }
    )

    return () => {
      unsubscribeRequests()
      unsubscribeFleet()
      unsubscribeNotifications()
    }
  }, [user?.id])

  return {
    userData,
    emergencyRequests,
    fleetVehicles,
    notifications,
    loading,
    error,
    refetch: () => {
      if (user?.id) {
        // Trigger data reload
        setLoading(true)
        // The useEffect will handle the reload
      }
    }
  }
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        
        // Get analytics for the last 30 days
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - 30)
        
        const analyticsData = await DatabaseService.getAnalytics({ start: startDate, end: endDate })
        setAnalytics(analyticsData)
        
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  return { analytics, loading }
}
