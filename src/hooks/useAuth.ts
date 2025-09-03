import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAppStore } from '../lib/store'
import { User } from '../lib/database'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const { user, setUser, setAuthenticated } = useAppStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser({ ...userData, id: firebaseUser.uid })
          } else {
            // Create user document if it doesn't exist
            const userData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              phone: '',
              role: 'user',
                      vehicleType: 'car',
        vehicleModel: '',
        vehicleYear: 2020,
        batteryCapacity: 50,
              currentLocation: { 
                lat: 0, 
                lng: 0, 
                address: '',
                lastUpdated: Timestamp.now()
              },
              isProvider: false,
              rating: 0,
              totalRescues: 0,
              subscription: {
                plan: 'basic',
                status: 'active',
                        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                requestsUsed: 0,
                requestsLimit: 2
              },
              preferences: {
                notifications: true,
                locationTracking: true,
                emergencyContacts: []
              },
                    createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
            }
            await setDoc(doc(db, 'users', firebaseUser.uid), userData)
            setUser(userData)
          }
          setAuthenticated(true)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        setUser(null)
        setAuthenticated(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setAuthenticated])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const newUser: User = {
        id: result.user.uid,
        email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        role: 'user',
        vehicleType: userData.vehicleType || 'car',
        vehicleModel: userData.vehicleModel || '',
        vehicleYear: userData.vehicleYear || 2020,
        batteryCapacity: userData.batteryCapacity || 50,
        currentLocation: { 
          lat: 0, 
          lng: 0, 
          address: '',
          lastUpdated: Timestamp.now()
        },
        isProvider: false,
        rating: 0,
        totalRescues: 0,
        subscription: {
          plan: 'basic',
          status: 'active',
                  startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          requestsUsed: 0,
          requestsLimit: 2
        },
        preferences: {
          notifications: true,
          locationTracking: true,
          emergencyContacts: []
        },
              createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
      }
      
      await setDoc(doc(db, 'users', result.user.uid), newUser)
      await updateProfile(result.user, { displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() })
      
      return result.user
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    }
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      const userRef = doc(db, 'users', user.id)
      await setDoc(userRef, { ...user, ...updates, updatedAt: Timestamp.now() }, { merge: true })
      setUser({ ...user, ...updates, updatedAt: Timestamp.now() })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    loading,
    signIn,
    signUp,
    logout,
    updateUserProfile
  }
}
