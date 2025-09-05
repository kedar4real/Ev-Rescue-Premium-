import { DatabaseService } from './database'
import { withFirebaseErrorHandling } from './firebase-error-handler'
import { auth } from './firebase'

// Analytics Event Types
export type AnalyticsEvent = 
  | 'page_view'
  | 'user_signup'
  | 'user_login'
  | 'emergency_request_created'
  | 'emergency_request_completed'
  | 'payment_successful'
  | 'subscription_upgraded'
  | 'feature_used'
  | 'error_occurred'
  | 'user_feedback'

export interface AnalyticsEventData {
  event: AnalyticsEvent
  userId?: string
  properties?: Record<string, any>
  timestamp?: Date
  sessionId?: string
  page?: string
  referrer?: string
  userAgent?: string
  ip?: string
}

export class AnalyticsService {
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeUser()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async initializeUser() {
    try {
      const user = auth.currentUser
      this.userId = user?.uid || null
    } catch (error) {
      console.error('Error initializing analytics user:', error)
    }
  }

  // Track events
  async track(event: AnalyticsEvent, properties: Record<string, any> = {}) {
    try {
      // Skip analytics on server side
      if (typeof window === 'undefined') {
        console.log('Skipping analytics tracking - running on server side:', event)
        return
      }

      // Skip analytics if Firebase is not initialized yet
      const { FirebaseConnectionManager } = await import('./firebase')
      if (!FirebaseConnectionManager.isFirebaseInitialized()) {
        console.log('Skipping analytics tracking - Firebase not initialized:', event)
        return
      }

      // Check if user is authenticated before attempting any analytics operations
      const { canAccessFirestore, isOnline } = await import('./firebase-permissions')
      if (!canAccessFirestore()) {
        console.log('Skipping analytics tracking - user not authenticated:', event)
        return
      }

      // In offline mode, skip analytics to avoid errors
      if (!isOnline()) {
        console.log('Skipping analytics tracking - offline mode:', event)
        return
      }

      // Additional check: ensure we have a valid user ID
      const userId = this.userId || properties.userId
      if (!userId || userId === 'system') {
        console.log('Skipping analytics tracking - no valid user ID:', event)
        return
      }



      // Sanitize properties to remove undefined values
      const sanitizedProperties = Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => value !== undefined)
      )

      const eventData: AnalyticsEventData = {
        event,
        userId,
        properties: sanitizedProperties,
        timestamp: new Date(),
        sessionId: this.sessionId,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
      }

      // Send to your analytics service (Firebase Analytics, Mixpanel, etc.)
      await this.sendToAnalytics(eventData)

      // Store in local database for custom analytics (only if all conditions are met)
      try {
        await this.storeEvent(eventData)
      } catch (storeError) {
        // Don't let storage errors break the main analytics flow
        console.warn('Analytics storage failed, but continuing with external analytics:', storeError)
      }

    } catch (error) {
      // Provide more detailed error information
      const errorInfo = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        event,
        userId: this.userId || properties.userId,
        timestamp: new Date().toISOString()
      }
      console.error('Error tracking analytics event:', errorInfo)
    }
  }

  // Page view tracking
  async trackPageView(page: string, properties: Record<string, any> = {}) {
    // Sanitize properties to remove undefined values
    const sanitizedProperties = Object.fromEntries(
      Object.entries(properties).filter(([_, value]) => value !== undefined)
    )
    
    await this.track('page_view', {
      page,
      ...sanitizedProperties
    })
  }

  // User actions
  async trackUserSignup(method: string, properties: Record<string, any> = {}) {
    await this.track('user_signup', {
      method,
      ...properties
    })
  }

  async trackUserLogin(method: string, properties: Record<string, any> = {}) {
    await this.track('user_login', {
      method,
      ...properties
    })
  }

  // Business events
  async trackEmergencyRequestCreated(requestType: string, priority: string, location: any) {
    await this.track('emergency_request_created', {
      requestType,
      priority,
      location: {
        city: location.address?.split(',')[1]?.trim(),
        coordinates: { lat: location.lat, lng: location.lng }
      }
    })
  }

  async trackEmergencyRequestCompleted(requestId: string, duration: number, cost: number, rating: number) {
    await this.track('emergency_request_completed', {
      requestId,
      duration,
      cost,
      rating
    })
  }

  async trackPaymentSuccess(amount: number, plan: string, method: string) {
    await this.track('payment_successful', {
      amount,
      plan,
      method
    })
  }

  async trackSubscriptionUpgrade(fromPlan: string, toPlan: string) {
    await this.track('subscription_upgraded', {
      fromPlan,
      toPlan
    })
  }

  // Feature usage
  async trackFeatureUsed(feature: string, properties: Record<string, any> = {}) {
    await this.track('feature_used', {
      feature,
      ...properties
    })
  }

  // Error tracking
  async trackError(error: Error, context: string, properties: Record<string, any> = {}) {
    await this.track('error_occurred', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      ...properties
    })
  }

  // User feedback
  async trackUserFeedback(type: 'rating' | 'review' | 'complaint', data: any) {
    await this.track('user_feedback', {
      type,
      data
    })
  }

  // Performance tracking
  async trackPerformance(metric: string, value: number, properties: Record<string, any> = {}) {
    await this.track('feature_used', {
      feature: 'performance',
      metric,
      value,
      ...properties
    })
  }

  // Custom event tracking
  async trackCustom(eventName: string, properties: Record<string, any> = {}) {
    await this.track('feature_used', {
      feature: eventName,
      ...properties
    })
  }

  // Send to external analytics service
  private async sendToAnalytics(eventData: AnalyticsEventData) {
    try {
      // Firebase Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventData.event, {
          event_category: 'user_action',
          event_label: eventData.page,
          value: eventData.properties?.value || 0,
          custom_parameters: eventData.properties
        })
      }

      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventData.event, {
          event_category: 'user_action',
          event_label: eventData.page,
          value: eventData.properties?.value || 0,
          custom_parameters: eventData.properties
        })
      }

      // Mixpanel (if configured)
      if (typeof window !== 'undefined' && (window as any).mixpanel) {
        (window as any).mixpanel.track(eventData.event, {
          ...eventData.properties,
          page: eventData.page,
          session_id: eventData.sessionId
        })
      }

    } catch (error) {
      console.error('Error sending to external analytics:', error)
    }
  }

  // Store event in local database
  private async storeEvent(eventData: AnalyticsEventData) {
    try {
      // Skip if Firebase is not initialized yet
      const { FirebaseConnectionManager } = await import('./firebase')
      if (!FirebaseConnectionManager.isFirebaseInitialized()) {
        console.log('Skipping analytics storage - Firebase not initialized:', eventData.event)
        return
      }

      // Only store analytics events if we have a valid userId
      if (!eventData.userId || eventData.userId === 'system') {
        console.log('Skipping analytics storage - no valid userId:', eventData.event)
        return
      }

      // Check if user is authenticated before attempting Firestore operations
      const { canAccessFirestore, isOnline } = await import('./firebase-permissions')
      if (!canAccessFirestore()) {
        console.log('Skipping analytics storage - user not authenticated:', eventData.event)
        return
      }

      // In offline mode, skip analytics storage to avoid errors
      if (!isOnline()) {
        console.log('Skipping analytics storage - offline mode:', eventData.event)
        return
      }

      // Sanitize the data object to remove any undefined values
      const sanitizedData = {
        ...eventData,
        properties: Object.fromEntries(
          Object.entries(eventData.properties || {}).filter(([_, value]) => value !== undefined)
        )
      }

      // Store in Firestore for custom analytics with error handling
      try {
        await withFirebaseErrorHandling(
          () => DatabaseService.createNotification({
            userId: eventData.userId,
            type: 'system',
            title: `Analytics: ${eventData.event}`,
            message: JSON.stringify(sanitizedData.properties),
            isRead: false,
            priority: 'low',
            data: sanitizedData
          }),
          'Analytics event storage'
        )
      } catch (firebaseError) {
        // If Firebase operations fail, just log and continue
        console.warn('Firebase analytics storage failed:', firebaseError)
        return // Exit gracefully without throwing
      }
    } catch (error) {
      // Provide more detailed error information
      const errorInfo = {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        event: eventData.event,
        userId: eventData.userId,
        timestamp: new Date().toISOString()
      }
      console.error('Error storing analytics event:', errorInfo)
    }
  }

  // Get analytics data
  async getAnalytics(dateRange: { start: Date, end: Date }) {
    try {
      return await DatabaseService.getAnalytics(dateRange)
    } catch (error) {
      console.error('Error getting analytics:', error)
      return []
    }
  }

  // Real-time analytics
  async getRealTimeMetrics() {
    try {
      const [users, requests, vehicles] = await Promise.all([
        DatabaseService.getUsersByRole('user'),
        DatabaseService.getEmergencyRequests(),
        DatabaseService.getFleetVehicles()
      ])

      return {
        activeUsers: users.length,
        totalRequests: requests.length,
        activeRequests: requests.filter(req => ['pending', 'assigned', 'in_progress'].includes(req.status)).length,
        availableVehicles: vehicles.filter(v => v.status === 'available').length,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Error getting real-time metrics:', error)
      return null
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackUserSignup: analytics.trackUserSignup.bind(analytics),
    trackUserLogin: analytics.trackUserLogin.bind(analytics),
    trackEmergencyRequestCreated: analytics.trackEmergencyRequestCreated.bind(analytics),
    trackEmergencyRequestCompleted: analytics.trackEmergencyRequestCompleted.bind(analytics),
    trackPaymentSuccess: analytics.trackPaymentSuccess.bind(analytics),
    trackSubscriptionUpgrade: analytics.trackSubscriptionUpgrade.bind(analytics),
    trackFeatureUsed: analytics.trackFeatureUsed.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackUserFeedback: analytics.trackUserFeedback.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackCustom: analytics.trackCustom.bind(analytics)
  }
}

export default analytics
