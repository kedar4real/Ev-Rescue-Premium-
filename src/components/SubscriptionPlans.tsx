'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  CheckIcon as Check,
  XMarkIcon as X,
  StarIcon as Star,
  BoltIcon as Zap,
  ShieldCheckIcon as Shield,
  ChartBarIcon as BarChart3,
  CodeBracketIcon as Code,
  UsersIcon as Users,
  ClockIcon as Clock,
  ExclamationTriangleIcon as AlertTriangle
} from '@heroicons/react/24/outline'
import { subscriptionService, type SubscriptionPlan } from '../lib/subscription'
import { analytics } from '../lib/analytics'

interface SubscriptionPlansProps {
  currentPlan?: string
  onPlanSelect?: (planId: string, interval: 'monthly' | 'yearly') => void
  showCurrentPlan?: boolean
}

export function SubscriptionPlans({ 
  currentPlan = 'basic', 
  onPlanSelect,
  showCurrentPlan = true 
}: SubscriptionPlansProps) {
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const plans = subscriptionService.getSubscriptionPlans()

  const handlePlanSelect = async (planId: string) => {
    if (planId === currentPlan && showCurrentPlan) {
      return // Don't allow selecting current plan
    }

    setSelectedPlan(planId)
    setIsLoading(true)

    try {
      // Track plan selection
      analytics.trackFeatureUsed('subscription_plan_selected', {
        planId,
        interval: selectedInterval,
        currentPlan
      })

      if (onPlanSelect) {
        onPlanSelect(planId, selectedInterval)
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan.id) {
      case 'basic':
        return <Zap className="h-6 w-6" />
      case 'premium':
        return <Star className="h-6 w-6" />
      case 'enterprise':
        return <Star className="h-6 w-6" />
      default:
        return <Zap className="h-6 w-6" />
    }
  }

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan.id) {
      case 'basic':
        return 'border-gray-300'
      case 'premium':
        return 'border-green-500'
      case 'enterprise':
        return 'border-purple-500'
      default:
        return 'border-gray-300'
    }
  }

  const getPlanGradient = (plan: SubscriptionPlan) => {
    switch (plan.id) {
      case 'basic':
        return 'from-gray-50 to-gray-100'
      case 'premium':
        return 'from-green-50 to-green-100'
      case 'enterprise':
        return 'from-purple-50 to-purple-100'
      default:
        return 'from-gray-50 to-gray-100'
    }
  }

  const formatPrice = (plan: SubscriptionPlan) => {
    const price = selectedInterval === 'yearly' 
      ? subscriptionService.calculateSubscriptionCost(plan.id, 'yearly')
      : plan.price
    
    return `₹${price.toLocaleString()}`
  }

  const getSavings = (plan: SubscriptionPlan) => {
    if (selectedInterval === 'yearly') {
      const monthlyPrice = plan.price * 12
      const yearlyPrice = subscriptionService.calculateSubscriptionCost(plan.id, 'yearly')
      const savings = monthlyPrice - yearlyPrice
      return Math.round((savings / monthlyPrice) * 100)
    }
    return 0
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Select the perfect plan for your EV emergency needs
        </p>

        {/* Interval Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${selectedInterval === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
                     <button
             onClick={() => setSelectedInterval(selectedInterval === 'monthly' ? 'yearly' : 'monthly')}
             className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
             title="Toggle billing interval"
             aria-label="Toggle between monthly and yearly billing"
           >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                selectedInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${selectedInterval === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          {selectedInterval === 'yearly' && (
            <Badge className="bg-green-100 text-green-800">
              Save up to 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'ring-2 ring-green-500 shadow-lg' : ''
            } ${getPlanColor(plan)} ${
              selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
            } ${currentPlan === plan.id && showCurrentPlan ? 'opacity-75' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            {/* Current Plan Badge */}
            {currentPlan === plan.id && showCurrentPlan && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-blue-500 text-white px-3 py-1">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className={`text-center pb-4 ${getPlanGradient(plan)}`}>
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  plan.id === 'basic' ? 'bg-gray-100 text-gray-600' :
                  plan.id === 'premium' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getPlanIcon(plan)}
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>

              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900">
                  {formatPrice(plan)}
                </div>
                <div className="text-sm text-gray-500">
                  per {selectedInterval === 'yearly' ? 'year' : 'month'}
                </div>
                {getSavings(plan) > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    Save {getSavings(plan)}%
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Features */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {plan.limits.maxRequests === -1 ? 'Unlimited' : plan.limits.maxRequests} emergency requests
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {plan.limits.responseTime} min average response time
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.prioritySupport ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.prioritySupport ? 'text-gray-700' : 'text-gray-400'}`}>
                    Priority support
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.advancedAnalytics ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.advancedAnalytics ? 'text-gray-700' : 'text-gray-400'}`}>
                    Advanced analytics
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.customNotifications ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.customNotifications ? 'text-gray-700' : 'text-gray-400'}`}>
                    Custom notifications
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.apiAccess ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.apiAccess ? 'text-gray-700' : 'text-gray-400'}`}>
                    API access
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.whiteLabel ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.whiteLabel ? 'text-gray-700' : 'text-gray-400'}`}>
                    White label solution
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {plan.features.dedicatedSupport ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${plan.features.dedicatedSupport ? 'text-gray-700' : 'text-gray-400'}`}>
                    Dedicated support
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={currentPlan === plan.id && showCurrentPlan}
                className={`w-full ${
                  plan.id === 'basic' ? 'bg-gray-600 hover:bg-gray-700' :
                  plan.id === 'premium' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                } ${currentPlan === plan.id && showCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : currentPlan === plan.id && showCurrentPlan ? (
                  'Current Plan'
                ) : (
                  `Choose ${plan.name}`
                )}
              </Button>

              {/* Enterprise Note */}
              {plan.enterprise && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-purple-700">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">Enterprise Features</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    Includes custom integrations, dedicated account manager, and SLA guarantees.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-6 w-6 text-green-500" />
            <span className="text-sm text-gray-600">Secure payments</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-6 w-6 text-green-500" />
            <span className="text-sm text-gray-600">Cancel anytime</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-6 w-6 text-green-500" />
            <span className="text-sm text-gray-600">24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  )
}
