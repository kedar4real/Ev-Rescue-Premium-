import { DatabaseService } from './database'

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: {
    emergencyRequests: number
    prioritySupport: boolean
    advancedAnalytics: boolean
    customNotifications: boolean
    apiAccess: boolean
    whiteLabel: boolean
    dedicatedSupport: boolean
  }
  limits: {
    maxRequests: number
    maxUsers?: number
    maxVehicles?: number
    responseTime: number // in minutes
  }
  popular?: boolean
  enterprise?: boolean
}

export interface PricingTier {
  id: string
  name: string
  basePrice: number
  currency: string
  perRequestPrice: number
  features: string[]
  targetAudience: 'individual' | 'business' | 'enterprise'
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individual EV owners',
    price: 299,
    currency: 'INR',
    interval: 'monthly',
    features: {
      emergencyRequests: 2,
      prioritySupport: false,
      advancedAnalytics: false,
      customNotifications: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedSupport: false
    },
    limits: {
      maxRequests: 2,
      responseTime: 45
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Best for frequent travelers',
    price: 799,
    currency: 'INR',
    interval: 'monthly',
    features: {
      emergencyRequests: 10,
      prioritySupport: true,
      advancedAnalytics: true,
      customNotifications: true,
      apiAccess: false,
      whiteLabel: false,
      dedicatedSupport: false
    },
    limits: {
      maxRequests: 10,
      responseTime: 30
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For businesses and fleet operators',
    price: 2499,
    currency: 'INR',
    interval: 'monthly',
    features: {
      emergencyRequests: -1, // Unlimited
      prioritySupport: true,
      advancedAnalytics: true,
      customNotifications: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedSupport: true
    },
    limits: {
      maxRequests: -1, // Unlimited
      maxUsers: 100,
      maxVehicles: 50,
      responseTime: 15
    },
    enterprise: true
  }
]

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'individual',
    name: 'Individual',
    basePrice: 0,
    currency: 'INR',
    perRequestPrice: 1500,
    features: [
      'Pay per use',
      'Basic support',
      'Standard response time',
      'Mobile app access'
    ],
    targetAudience: 'individual'
  },
  {
    id: 'business',
    name: 'Business',
    basePrice: 5000,
    currency: 'INR',
    perRequestPrice: 1200,
    features: [
      'Monthly subscription',
      'Priority support',
      'Faster response time',
      'Analytics dashboard',
      'Team management'
    ],
    targetAudience: 'business'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    basePrice: 25000,
    currency: 'INR',
    perRequestPrice: 800,
    features: [
      'Unlimited requests',
      'Dedicated support',
      'Fastest response time',
      'Advanced analytics',
      'API access',
      'White label solution',
      'Custom integrations'
    ],
    targetAudience: 'enterprise'
  }
]

class SubscriptionService {
  // Get all subscription plans
  getSubscriptionPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS
  }

  // Get plan by ID
  getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId)
  }

  // Get pricing tiers
  getPricingTiers(): PricingTier[] {
    return PRICING_TIERS
  }

  // Calculate subscription cost
  calculateSubscriptionCost(planId: string, interval: 'monthly' | 'yearly'): number {
    const plan = this.getPlanById(planId)
    if (!plan) return 0

    const monthlyPrice = plan.price
    return interval === 'yearly' ? monthlyPrice * 12 * 0.8 : monthlyPrice // 20% discount for yearly
  }

  // Calculate usage-based pricing
  calculateUsageCost(tierId: string, requests: number): number {
    const tier = PRICING_TIERS.find(t => t.id === tierId)
    if (!tier) return 0

    return tier.basePrice + (requests * tier.perRequestPrice)
  }

  // Check if user can make request
  async canMakeRequest(userId: string): Promise<{
    allowed: boolean
    reason?: string
    remainingRequests?: number
  }> {
    try {
      const user = await DatabaseService.getUser(userId)
      if (!user) {
        return { allowed: false, reason: 'User not found' }
      }

      const plan = this.getPlanById(user.subscription.plan)
      if (!plan) {
        return { allowed: false, reason: 'Invalid subscription plan' }
      }

      // Check if plan has unlimited requests
      if (plan.limits.maxRequests === -1) {
        return { allowed: true, remainingRequests: -1 }
      }

      // Check request limit
      const remainingRequests = plan.limits.maxRequests - user.subscription.requestsUsed
      
      if (remainingRequests <= 0) {
        return { 
          allowed: false, 
          reason: 'Monthly request limit exceeded',
          remainingRequests: 0
        }
      }

      return { 
        allowed: true, 
        remainingRequests 
      }

    } catch (error) {
      console.error('Error checking request eligibility:', error)
      return { allowed: false, reason: 'System error' }
    }
  }

  // Upgrade subscription
  async upgradeSubscription(userId: string, newPlanId: string): Promise<{
    success: boolean
    message: string
    cost?: number
  }> {
    try {
      const user = await DatabaseService.getUser(userId)
      if (!user) {
        return { success: false, message: 'User not found' }
      }

      const newPlan = this.getPlanById(newPlanId)
      if (!newPlan) {
        return { success: false, message: 'Invalid plan selected' }
      }

      const currentPlan = this.getPlanById(user.subscription.plan)
      if (!currentPlan) {
        return { success: false, message: 'Current plan not found' }
      }

      // Calculate upgrade cost
      const upgradeCost = this.calculateUpgradeCost(currentPlan, newPlan)

      // Update user subscription
      await DatabaseService.updateUser(userId, {
        subscription: {
          ...user.subscription,
          plan: newPlanId as any,
          requestsLimit: newPlan.limits.maxRequests,
          requestsUsed: 0, // Reset usage for new plan
          startDate: new Date() as any,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) as any // 30 days from now
        }
      })

      // Create notification
      await DatabaseService.createNotification({
        userId,
        type: 'payment',
        title: 'Subscription Upgraded',
        message: `Your subscription has been upgraded to ${newPlan.name}. You now have ${newPlan.limits.maxRequests === -1 ? 'unlimited' : newPlan.limits.maxRequests} requests per month.`,
        isRead: false,
        priority: 'high'
      })

      return {
        success: true,
        message: `Successfully upgraded to ${newPlan.name}`,
        cost: upgradeCost
      }

    } catch (error) {
      console.error('Error upgrading subscription:', error)
      return { success: false, message: 'Failed to upgrade subscription' }
    }
  }

  // Calculate upgrade cost
  private calculateUpgradeCost(currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): number {
    // Simple prorated calculation
    const currentPrice = currentPlan.price
    const newPrice = newPlan.price
    
    if (newPrice <= currentPrice) {
      return 0 // Downgrade or same price
    }

    // Calculate prorated upgrade cost
    const priceDifference = newPrice - currentPrice
    return Math.round(priceDifference * 0.5) // 50% prorated for mid-cycle upgrade
  }

  // Get subscription analytics
  async getSubscriptionAnalytics(): Promise<{
    totalSubscribers: number
    planDistribution: Record<string, number>
    revenue: number
    churnRate: number
  }> {
    try {
      const users = await DatabaseService.getUsersByRole('user')
      
      const totalSubscribers = users.length
      const planDistribution: Record<string, number> = {}
      let revenue = 0

      users.forEach(user => {
        const plan = this.getPlanById(user.subscription.plan)
        if (plan) {
          planDistribution[plan.name] = (planDistribution[plan.name] || 0) + 1
          revenue += plan.price
        }
      })

      // Calculate churn rate (simplified)
      const churnRate = 0.05 // 5% monthly churn rate (placeholder)

      return {
        totalSubscribers,
        planDistribution,
        revenue,
        churnRate
      }

    } catch (error) {
      console.error('Error getting subscription analytics:', error)
      return {
        totalSubscribers: 0,
        planDistribution: {},
        revenue: 0,
        churnRate: 0
      }
    }
  }

  // Create subscription invoice
  async createInvoice(userId: string, planId: string, interval: 'monthly' | 'yearly'): Promise<{
    invoiceId: string
    amount: number
    currency: string
    description: string
  }> {
    const plan = this.getPlanById(planId)
    if (!plan) {
      throw new Error('Invalid plan')
    }

    const amount = this.calculateSubscriptionCost(planId, interval)
    const invoiceId = `inv_${Date.now()}_${userId}`

    return {
      invoiceId,
      amount,
      currency: plan.currency,
      description: `${plan.name} subscription (${interval})`
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<{
    success: boolean
    message: string
    endDate?: Date
  }> {
    try {
      const user = await DatabaseService.getUser(userId)
      if (!user) {
        return { success: false, message: 'User not found' }
      }

      // Set subscription to cancelled
      await DatabaseService.updateUser(userId, {
        subscription: {
          ...user.subscription,
          status: 'cancelled' as any,
          endDate: new Date() as any
        }
      })

      // Create notification
      await DatabaseService.createNotification({
        userId,
        type: 'payment',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled. You can still use the service until the end of your billing period.',
        isRead: false,
        priority: 'medium'
      })

      return {
        success: true,
        message: 'Subscription cancelled successfully',
        endDate: new Date()
      }

    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return { success: false, message: 'Failed to cancel subscription' }
    }
  }
}

// Create singleton instance
export const subscriptionService = new SubscriptionService()

export default subscriptionService
