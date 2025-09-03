'use client'

import React, { createContext, useContext } from 'react'
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth'
import { User } from 'firebase/auth'

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

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: { code: string; message: string } | null
  signIn: (email: string, password: string) => Promise<{ user: User | null; error?: { code: string; message: string } }>
  signUp: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    address: string
  }) => Promise<{ user: User | null; error?: { code: string; message: string } }>
  signInWithGoogle: () => Promise<{ user: User | null; error?: { code: string; message: string } }>
  signInWithFacebook: () => Promise<{ user: User | null; error?: { code: string; message: string } }>
  signInWithTwitter: () => Promise<{ user: User | null; error?: { code: string; message: string } }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseAuth = useFirebaseAuth()
  
  const isAuthenticated = !!firebaseAuth.user

  const contextValue: AuthContextType = {
    user: firebaseAuth.user,
    userProfile: firebaseAuth.userProfile,
    isAuthenticated,
    isLoading: firebaseAuth.loading,
    error: firebaseAuth.error,
    signIn: firebaseAuth.signIn,
    signUp: firebaseAuth.signUp,
    signInWithGoogle: firebaseAuth.signInWithGoogle,
    signInWithFacebook: firebaseAuth.signInWithFacebook,
    signInWithTwitter: firebaseAuth.signInWithTwitter,
    signOut: firebaseAuth.signOut,
    resetPassword: firebaseAuth.resetPassword,
    updateUserProfile: firebaseAuth.updateUserProfile,
    clearError: firebaseAuth.clearError
  }

  if (firebaseAuth.loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}
