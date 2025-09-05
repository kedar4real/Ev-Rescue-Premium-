'use client'

import { useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import { User } from 'firebase/auth'

export function useFirebaseAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user)
        setIsLoading(false)
        setError(null)
      },
      (error) => {
        console.error('Firebase auth state change error:', error)
        setError(error.message)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user
  }
}

// Hook to wait for authentication to be ready
export function useAuthReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsReady(true)
    })

    return () => unsubscribe()
  }, [])

  return isReady
}
