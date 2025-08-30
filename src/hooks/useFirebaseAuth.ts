'use client'

import { useState, useEffect } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  emergencyContacts: string[]
  vehicleInfo: {
    make: string
    model: string
    year: string
    licensePlate: string
  }
  membershipType: 'basic' | 'premium' | 'enterprise'
  createdAt: Date
  lastLogin: Date
  isActive: boolean
}

interface AuthError {
  code: string
  message: string
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load user profile from Firestore
  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      await loadUserProfile(result.user.uid)
      return result
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUp = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    address: string
  }) => {
    try {
      setError(null)
      setLoading(true)
      
      // Create user account
      const result = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )

      // Update display name
      await updateProfile(result.user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      })

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        emergencyContacts: [],
        vehicleInfo: {
          make: '',
          model: '',
          year: '',
          licensePlate: ''
        },
        membershipType: 'basic',
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true
      }

      await setDoc(doc(db, 'users', result.user.uid), userProfile)
      setUserProfile(userProfile)

      return result
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await loadUserProfile(result.user.uid)
      return result
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await loadUserProfile(result.user.uid)
      return result
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Twitter
  const signInWithTwitter = async () => {
    try {
      setError(null)
      setLoading(true)
      const provider = new TwitterAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await loadUserProfile(result.user.uid)
      return result
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOutUser = async () => {
    try {
      setError(null)
      await signOut(auth)
      setUserProfile(null)
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      const authError: AuthError = {
        code: error.code,
        message: getErrorMessage(error.code)
      }
      setError(authError)
      throw authError
    }
  }

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      setError(null)
      const updatedProfile = { ...userProfile, ...updates }
      await setDoc(doc(db, 'users', user.uid), updatedProfile)
      setUserProfile(updatedProfile as UserProfile)
    } catch (error: any) {
      const authError: AuthError = {
        code: 'profile-update-error',
        message: 'Failed to update profile'
      }
      setError(authError)
      throw authError
    }
  }

  // Clear error
  const clearError = () => setError(null)

  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signOut: signOutUser,
    resetPassword,
    updateUserProfile,
    clearError
  }
}

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection'
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed'
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled'
    default:
      return 'An error occurred. Please try again'
  }
}
