'use client'

import { useEffect, useRef } from 'react'
import { useFirebaseAuthState } from './useFirebaseAuthState'
import { AnalyticsService } from '../lib/analytics'

export function useAnalytics() {
  const { isAuthenticated, isLoading } = useFirebaseAuthState()
  const analyticsService = useRef<AnalyticsService | null>(null)

  useEffect(() => {
    // Only initialize analytics when user is authenticated
    if (!isLoading && isAuthenticated) {
      // Add a small delay to ensure Firebase is fully initialized
      const timer = setTimeout(() => {
        analyticsService.current = new AnalyticsService()
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (!isLoading && !isAuthenticated) {
      // Clear analytics service when user is not authenticated
      analyticsService.current = null
    }
  }, [isAuthenticated, isLoading])

  const track = async (event: string, properties: Record<string, any> = {}) => {
    if (analyticsService.current && isAuthenticated) {
      try {
        await analyticsService.current.track(event as any, properties)
      } catch (error) {
        console.warn('Analytics tracking failed:', error)
      }
    }
  }

  const trackPageView = async (page: string, properties: Record<string, any> = {}) => {
    if (analyticsService.current && isAuthenticated) {
      try {
        await analyticsService.current.trackPageView(page, properties)
      } catch (error) {
        console.warn('Analytics page view tracking failed:', error)
      }
    }
  }

  return {
    track,
    trackPageView,
    isReady: !isLoading && isAuthenticated
  }
}
