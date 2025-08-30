import { useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useAppStore } from '../lib/store'
import { User } from '../types'

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
              name: firebaseUser.displayName || '',
              phone: '',
              role: 'user',
              vehicleType: 'car',
              vehicleModel: '',
              batteryCapacity: 50,
              currentLocation: { lat: 0, lng: 0, address: '' },
              isProvider: false,
              rating: 0,
              totalRescues: 0,
              createdAt: new Date(),
              updatedAt: new Date()
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
        name: userData.name || '',
        phone: userData.phone || '',
        role: 'user',
        vehicleType: userData.vehicleType || 'car',
        vehicleModel: userData.vehicleModel || '',
        batteryCapacity: userData.batteryCapacity || 50,
        currentLocation: { lat: 0, lng: 0, address: '' },
        isProvider: false,
        rating: 0,
        totalRescues: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(doc(db, 'users', result.user.uid), newUser)
      await updateProfile(result.user, { displayName: userData.name })
      
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
      await setDoc(userRef, { ...user, ...updates, updatedAt: new Date() }, { merge: true })
      setUser({ ...user, ...updates, updatedAt: new Date() })
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
