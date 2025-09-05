'use client'

import React from 'react'
import { useFirebaseAuthState } from '../hooks/useFirebaseAuthState'
import { Skeleton } from './ui/loading-skeleton'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ 
  children, 
  fallback = <Skeleton className="h-8 w-32" />,
  requireAuth = true 
}: AuthGuardProps) {
  const { user, isLoading, error, isAuthenticated } = useFirebaseAuthState()

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>
  }

  // Show error state
  if (error) {
    console.warn('Authentication error:', error)
    return requireAuth ? (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">Authentication error: {error}</p>
      </div>
    ) : <>{children}</>
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400 text-sm">Please log in to access this feature.</p>
      </div>
    )
  }

  // Render children if authentication requirements are met
  return <>{children}</>
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requireAuth: boolean = true
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard requireAuth={requireAuth}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
