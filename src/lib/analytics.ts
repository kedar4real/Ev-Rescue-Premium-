import { DatabaseService } from './database'
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

class AnalyticsService {
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
      const eventData: AnalyticsEventData = {
        event,
        userId: this.userId || undefined,
        properties,
        timestamp: new Date(),
        sessionId: this.sessionId,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined
      }

      // Send to your analytics service (Firebase Analytics, Mixpanel, etc.)
      await this.sendToAnalytics(eventData)

      // Store in local database for custom analytics
      await this.storeEvent(eventData)

    } catch (error) {
      console.error('Error tracking analytics event:', error)
    }
  }

  // Page view tracking
  async trackPageView(page: string, properties: Record<string, any> = {}) {
    await this.track('page_view', {
      page,
      ...properties
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
      // Store in Firestore for custom analytics
      await DatabaseService.createNotification({
        userId: eventData.userId || 'system',
        type: 'system',
        title: `Analytics: ${eventData.event}`,
        message: JSON.stringify(eventData.properties),
        isRead: false,
        priority: 'low',
        data: eventData
      })
    } catch (error) {
      console.error('Error storing analytics event:', error)
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
