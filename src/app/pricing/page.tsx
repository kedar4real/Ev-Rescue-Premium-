'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { notify } from '../../components/ui/notification'
import RazorpayPayment from '../../components/RazorpayPayment'

interface PricingPlan {
  id: string
  name: string
  price: number
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
  savings?: number
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay'
  last4?: string
  brand?: string
  isDefault: boolean
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>('premium')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      billingCycle,
      features: [
        '5 emergency requests per month',
        'Standard response time (30-45 min)',
        'Basic support',
        'Standard charging units',
        'Email notifications'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'monthly' ? 19.99 : 199.99,
      billingCycle,
      popular: true,
      features: [
        'Unlimited emergency requests',
        'Priority response time (15-25 min)',
        'Premium support 24/7',
        'Advanced charging units (75kWh+)',
        'Push notifications',
        'Real-time tracking',
        'Priority customer service',
        'Exclusive discounts'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 49.99 : 499.99,
      billingCycle,
      features: [
        'Unlimited emergency requests',
        'Ultra-fast response time (10-15 min)',
        'Dedicated account manager',
        'Custom charging solutions',
        'Advanced analytics dashboard',
        'API access',
        'White-label options',
        'Custom integrations',
        'Priority scheduling',
        'Bulk discounts'
      ]
    }
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      isDefault: false
    },
    {
      id: 'apple-pay',
      type: 'apple-pay',
      isDefault: false
    },
    {
      id: 'google-pay',
      type: 'google-pay',
      isDefault: false
    }
  ]

  const handlePlanSelection = (planId: string) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setSelectedPlan(planId)
    setIsPaymentModalOpen(true)
  }

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      notify.error('Payment Error', 'Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      notify.success('Payment Successful', 'Your subscription has been activated!')
      setIsPaymentModalOpen(false)
      setCardNumber('')
      setExpiryDate('')
      setCvv('')
      setCardholderName('')
    } catch (error) {
      notify.error('Payment Failed', 'Payment could not be processed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12
    const savings = monthlyTotal - yearlyPrice
    return Math.round((savings / monthlyTotal) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.08),transparent_40%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            💳 Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto mb-8">
            Select the perfect plan for your emergency charging needs. 
            <span className="text-blue-400 font-semibold"> Save up to 17%</span> with annual billing.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium transition-colors duration-300 ${
              billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'
            }`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              aria-label="Toggle billing cycle"
              title="Toggle billing cycle"
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
            <span className={`text-lg font-medium transition-colors duration-300 ${
              billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'
            }`}>
              Yearly
              {billingCycle === 'yearly' && (
                <span className="ml-2 px-2 py-1 bg-green-900/50 text-green-200 text-xs font-semibold rounded-full border border-green-700/50">
                  Save {getSavings(19.99, 199.99)}%
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-gray-900/60 border-gray-700/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20' : 'hover:border-gray-600/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-black text-white tracking-tight mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-gray-400 font-medium">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-400 font-medium">
                    Save ${(plan.price * 12) - plan.price} per year
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-400 text-lg mt-0.5">✅</span>
                      <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transform hover:scale-105'
                      : 'bg-gray-800/50 border-2 border-gray-600/50 text-white hover:bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  {plan.popular ? '🚀 Get Started' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white text-center mb-12">Feature Comparison</h2>
          <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/30">
                      <th className="text-left p-6 text-gray-400 font-semibold">Features</th>
                      <th className="text-center p-6 text-gray-400 font-semibold">Basic</th>
                      <th className="text-center p-6 text-blue-400 font-semibold">Premium</th>
                      <th className="text-center p-6 text-gray-400 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/20">
                      <td className="p-6 text-white font-medium">Emergency Requests</td>
                      <td className="text-center p-6 text-gray-300">5/month</td>
                      <td className="text-center p-6 text-white font-semibold">Unlimited</td>
                      <td className="text-center p-6 text-gray-300">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-700/20">
                      <td className="p-6 text-white font-medium">Response Time</td>
                      <td className="text-center p-6 text-gray-300">30-45 min</td>
                      <td className="text-center p-6 text-white font-semibold">15-25 min</td>
                      <td className="text-center p-6 text-gray-300">10-15 min</td>
                    </tr>
                    <tr className="border-b border-gray-700/20">
                      <td className="p-6 text-white font-medium">Support</td>
                      <td className="text-center p-6 text-gray-300">Basic</td>
                      <td className="text-center p-6 text-white font-semibold">24/7 Premium</td>
                      <td className="text-center p-6 text-gray-300">Dedicated Manager</td>
                    </tr>
                    <tr className="border-b border-gray-700/20">
                      <td className="p-6 text-white font-medium">Charging Units</td>
                      <td className="text-center p-6 text-gray-300">Standard</td>
                      <td className="text-center p-6 text-white font-semibold">Advanced (75kWh+)</td>
                      <td className="text-center p-6 text-gray-300">Custom Solutions</td>
                    </tr>
                    <tr>
                      <td className="p-6 text-white font-medium">Analytics</td>
                      <td className="text-center p-6 text-gray-300">Basic</td>
                      <td className="text-center p-6 text-white font-semibold">Advanced</td>
                      <td className="text-center p-6 text-gray-300">Custom Dashboard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">No setup fees! You only pay for your chosen subscription plan.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Absolutely! You can cancel your subscription at any time with no cancellation fees.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-3xl font-black text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of EV owners who trust us for their emergency charging needs. 
                Start your premium experience today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handlePlanSelection('premium')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                >
                  🚀 Start Premium Plan
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
                >
                  📞 Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

             {/* Razorpay Payment Modal */}
       {isPaymentModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <RazorpayPayment
               amount={plans.find(p => p.id === selectedPlan)?.price || 0}
               currency="INR"
               planName={plans.find(p => p.id === selectedPlan)?.name || ''}
               onSuccess={(paymentId) => {
                 notify.success('Payment Successful', `Your subscription has been activated! Payment ID: ${paymentId}`)
                 setIsPaymentModalOpen(false)
               }}
               onFailure={(error) => {
                 notify.error('Payment Failed', error)
               }}
               onCancel={() => {
                 setIsPaymentModalOpen(false)
               }}
             />
           </div>
         </div>
       )}
    </div>
  )
}
