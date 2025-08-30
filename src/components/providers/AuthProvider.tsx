'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  requireAuth: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'demo@evrescue.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    createdAt: new Date('2024-01-01')
  }
]

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const publicPages = [
  '/', '/login', '/register', '/pricing', '/support'
]

const protectedPages = [
  '/admin', '/profile', '/settings'
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  
  const requireAuth = protectedPages.includes(pathname)
  const isPublicPage = publicPages.includes(pathname)
  const isAuthenticated = !!user

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for existing session
        const storedUser = localStorage.getItem('evrescue_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle authentication redirects
  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login')
      } else if (isPublicPage && isAuthenticated && pathname === '/login') {
        router.push('/')
      }
    }
  }, [requireAuth, isAuthenticated, isLoading, router, pathname, isPublicPage])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication logic
      const foundUser = mockUsers.find(u => u.email === email)
      if (!foundUser) {
        throw new Error('Invalid email or password')
      }
      
      // In a real app, you would verify the password here
      if (password !== 'demo123') {
        throw new Error('Invalid email or password')
      }
      
      // Store user in localStorage (in real app, use secure tokens)
      localStorage.setItem('evrescue_user', JSON.stringify(foundUser))
      setUser(foundUser)
      
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock user creation
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
      }
      
      // Store user in localStorage (in real app, use secure tokens)
      localStorage.setItem('evrescue_user', JSON.stringify(newUser))
      setUser(newUser)
      
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear user data
      localStorage.removeItem('evrescue_user')
      setUser(null)
      
      // Redirect to home page
      router.push('/')
      
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      requireAuth,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}
