'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import { CardSkeleton, StatsSkeleton, FleetCardSkeleton, TableSkeleton, ProfileSkeleton, ChatMessageSkeleton, MapSkeleton, ListSkeleton } from './ui/loading-skeleton'

// Lazy load components with appropriate skeleton fallbacks
export const LazyDashboard = lazy(() => import('./Dashboard').then(module => ({ default: module.Dashboard })))
export const LazyChargingFinder = lazy(() => import('../app/charging-finder/page'))
export const LazyEmergencyAssistance = lazy(() => import('../app/emergency-assistance/page'))
export const LazyTracking = lazy(() => import('../app/tracking/page'))
export const LazyChat = lazy(() => import('../app/chat/page'))
export const LazyFleet = lazy(() => import('../app/fleet/page'))
export const LazyHistory = lazy(() => import('../app/history/page'))
export const LazyAnalytics = lazy(() => import('../app/analytics/page'))
export const LazyProfile = lazy(() => import('../app/profile/page'))
export const LazySettings = lazy(() => import('../app/settings/page'))

// Skeleton mapping for different component types
const skeletonMap = {
  dashboard: CardSkeleton,
  stats: StatsSkeleton,
  fleet: FleetCardSkeleton,
  table: TableSkeleton,
  profile: ProfileSkeleton,
  chat: ChatMessageSkeleton,
  map: MapSkeleton,
  list: ListSkeleton,
  default: CardSkeleton
} as const

type SkeletonType = keyof typeof skeletonMap

interface LazyWrapperProps {
  children: React.ReactNode
  skeleton?: SkeletonType
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, skeleton = 'default', fallback }: LazyWrapperProps) {
  const SkeletonComponent = skeletonMap[skeleton]
  
  return (
    <Suspense fallback={fallback || <SkeletonComponent />}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading with error boundaries
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  skeleton: SkeletonType = 'default'
) {
  return function LazyComponent(props: T) {
    return (
      <LazyWrapper skeleton={skeleton}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
}

// Error boundary for lazy loaded components
export class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="uber-card p-6 text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load</h3>
          <p className="text-muted-foreground">Something went wrong while loading this component.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
