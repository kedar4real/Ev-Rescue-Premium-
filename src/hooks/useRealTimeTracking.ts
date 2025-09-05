'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface TrackingData {
  id: string
  vehicleId: string
  driverName: string
  status: 'en-route' | 'arrived' | 'in-progress' | 'completed'
  location: {
    lat: number
    lng: number
    address: string
  }
  eta: number // minutes
  progress: number // percentage
  lastUpdated: Date
}

interface UseRealTimeTrackingOptions {
  autoConnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useRealTimeTracking(options: UseRealTimeTrackingOptions = {}) {
  const {
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options

  const [trackingData, setTrackingData] = useState<TrackingData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Mock data for development
  const mockTrackingData: TrackingData[] = [
    {
      id: 'track-001',
      vehicleId: 'van-001',
      driverName: 'John Smith',
      status: 'en-route',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY'
      },
      eta: 12,
      progress: 75,
      lastUpdated: new Date()
    },
    {
      id: 'track-002',
      vehicleId: 'mobile-001',
      driverName: 'Lisa Rodriguez',
      status: 'arrived',
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: '456 Broadway, New York, NY'
      },
      eta: 0,
      progress: 100,
      lastUpdated: new Date()
    }
  ]

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In production, use real WebSocket URL
      // const ws = new WebSocket('wss://your-websocket-url.com/tracking')
      
      // For development, simulate WebSocket connection
      const ws = new WebSocket('ws://localhost:8080/tracking')
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setIsLoading(false)
        reconnectAttempts.current = 0
        
        toast({
          title: "Connected",
          description: "Real-time tracking is now active",
          variant: "success"
        })
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setTrackingData(prev => {
            const updated = prev.map(item => 
              item.id === data.id ? { ...item, ...data, lastUpdated: new Date() } : item
            )
            
            // Add new tracking data if it doesn't exist
            if (!prev.find(item => item.id === data.id)) {
              updated.push({ ...data, lastUpdated: new Date() })
            }
            
            return updated
          })

          // Show notifications for status changes
          if (data.status === 'arrived') {
            toast({
              title: "Service Provider Arrived",
              description: `${data.driverName} has arrived at your location`,
              variant: "success"
            })
          } else if (data.status === 'completed') {
            toast({
              title: "Service Completed",
              description: "Your EV rescue service has been completed",
              variant: "success"
            })
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        setIsLoading(false)
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, reconnectInterval)
        } else {
          setError('Failed to connect to tracking service')
          toast({
            title: "Connection Lost",
            description: "Unable to connect to real-time tracking",
            variant: "destructive"
          })
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Connection error occurred')
        setIsLoading(false)
      }

      wsRef.current = ws
    } catch (err) {
      console.error('Error creating WebSocket connection:', err)
      setError('Failed to establish connection')
      setIsLoading(false)
    }
  }, [reconnectInterval, maxReconnectAttempts, toast])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    setError(null)
  }, [])

  const requestLocationUpdate = useCallback((trackingId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'request_update',
        trackingId
      }))
    }
  }, [])

  const subscribeToTracking = useCallback((trackingId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        trackingId
      }))
    }
  }, [])

  const unsubscribeFromTracking = useCallback((trackingId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        trackingId
      }))
    }
  }, [])

  // Initialize connection
  useEffect(() => {
    if (autoConnect) {
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        setTrackingData(mockTrackingData)
        setIsConnected(true)
        setIsLoading(false)
      } else {
        connect()
      }
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    trackingData,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    requestLocationUpdate,
    subscribeToTracking,
    unsubscribeFromTracking
  }
}
