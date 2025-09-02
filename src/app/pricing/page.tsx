'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { SubscriptionPlans } from '../../components/SubscriptionPlans'
import RazorpayPayment from '../../components/RazorpayPayment'
import { subscriptionService } from '../../lib/subscription'
import { analytics } from '../../lib/analytics'
import { notify } from '../../components/ui/notification'

export default function PricingPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly')

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const handlePlanSelect = (planId: string, interval: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setSelectedPlan(planId)
    setSelectedInterval(interval)
    setIsPaymentModalOpen(true)

    // Track plan selection
    analytics.trackFeatureUsed('subscription_plan_selected', {
      planId,
      interval,
      userId: user?.id
    })
  }

  const handlePaymentSuccess = (paymentId: string) => {
    notify.success('Payment Successful', `Your subscription has been activated! Payment ID: ${paymentId}`)
    setIsPaymentModalOpen(false)
    
    // Track successful payment
    analytics.trackPaymentSuccess(
      subscriptionService.calculateSubscriptionCost(selectedPlan, selectedInterval),
      selectedPlan,
      'razorpay'
    )
  }

  const handlePaymentFailure = (error: string) => {
    notify.error('Payment Failed', error)
    setIsPaymentModalOpen(false)
  }

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false)
  }

  const selectedPlanData = subscriptionService.getPlanById(selectedPlan)
  const amount = selectedPlanData ? subscriptionService.calculateSubscriptionCost(selectedPlan, selectedInterval) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.08),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(22,163,74,0.08),transparent_40%)]"></div>
      
      <div className="relative z-10">
        <SubscriptionPlans
          currentPlan={user?.subscription?.plan || 'basic'}
          onPlanSelect={handlePlanSelect}
          showCurrentPlan={true}
        />
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedPlanData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <RazorpayPayment
              amount={amount}
              currency="INR"
              planName={`${selectedPlanData.name} (${selectedInterval})`}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}