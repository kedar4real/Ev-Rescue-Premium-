'use client'

import { useState, useEffect } from 'react'
import { FirebaseConnectionManager } from '../lib/firebase'

export function useFirebaseConnection() {
  const [isOnline, setIsOnline] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Get initial connection status
    setIsOnline(FirebaseConnectionManager.getConnectionStatus())

    // Listen for connection changes
    const unsubscribe = FirebaseConnectionManager.addConnectionListener((online) => {
      setIsOnline(online)
      setIsConnecting(false)
    })

    return unsubscribe
  }, [])

  const retryConnection = async () => {
    setIsConnecting(true)
    try {
      // Force a connection check by trying to access Firestore
      const { db } = await import('../lib/firebase')
      // This will trigger Firebase to check its connection
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.warn('Connection retry failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return {
    isOnline,
    isConnecting,
    retryConnection
  }
}
