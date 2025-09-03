'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { notify } from './ui/notification'
import { useAuth } from '../hooks/useAuth'
import { useUXFeedback } from './ui/ux-feedback'

declare global {
  interface Window {
    Razorpay: {
      new(options: {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: { razorpay_payment_id: string }) => void;
        prefill: {
          name: string;
          email: string;
          contact: string;
        };
        theme: {
          color: string;
        };
      }): void;
    }
  }
}

interface RazorpayPaymentProps {
  amount: number
  currency?: string
  planName: string
  onSuccess: (paymentId: string) => void
  onFailure: (error: string) => void
  onCancel: () => void
}

interface PaymentDetails {
  name: string
  email: string
  phone: string
  address: string
}

export default function RazorpayPayment({
  amount,
  currency = 'INR',
  planName,
  onSuccess,
  onFailure,
  onCancel
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const { user } = useAuth()
  const { startPayment, showSuccess, showError, LoadingOverlay } = useUXFeedback()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.currentLocation?.address || ''
  })
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setIsRazorpayLoaded(true)
    script.onerror = () => {
      notify.error('Payment Error', 'Failed to load payment gateway')
      setIsRazorpayLoaded(false)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleInputChange = (field: keyof PaymentDetails, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    if (!paymentDetails.name.trim()) {
      notify.error('Validation Error', 'Please enter your name')
      return false
    }
    if (!paymentDetails.email.trim()) {
      notify.error('Validation Error', 'Please enter your email')
      return false
    }
    if (!paymentDetails.phone.trim()) {
      notify.error('Validation Error', 'Please enter your phone number')
      return false
    }
    if (!paymentDetails.address.trim()) {
      notify.error('Validation Error', 'Please enter your address')
      return false
    }
    return true
  }

  const createOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          planName,
        }),
      })

      const data = await response.json()

      if (data.success) {
        return data.order
      } else {
        throw new Error(data.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const verifyPayment = async (paymentData: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Payment verification error:', error)
      return false
    }
  }

  const handlePayment = async () => {
    if (!validateForm()) return
    if (!isRazorpayLoaded) {
      showError('Payment Error', 'Payment gateway not loaded')
      return
    }

    setIsLoading(true)

    try {
      // Use enhanced UX feedback for payment flow
      await startPayment()
      
      // Create order first
      const order = await createOrder()
      setOrderId(order.id)

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'EV Rescue Premium',
        description: `${planName} Plan Subscription`,
        order_id: order.id,
        prefill: {
          name: paymentDetails.name,
          email: paymentDetails.email,
          contact: paymentDetails.phone
        },
        notes: {
          address: paymentDetails.address,
          plan: planName
        },
        theme: {
          color: '#00ff41' // Green theme
        },
        handler: async (response: { 
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          // Verify payment
          const isVerified = await verifyPayment(response)
          
          if (isVerified) {
            showSuccess('Payment Successful', `Payment ID: ${response.razorpay_payment_id}`)
            onSuccess(response.razorpay_payment_id)
          } else {
            showError('Payment Verification Failed', 'Payment could not be verified')
            onFailure('Payment verification failed')
          }
        },
        modal: {
          ondismiss: function () {
            // Payment modal dismissed
            notify.info('Payment Cancelled', 'Payment was cancelled by user')
            onCancel()
          }
        }
      }

      // Initialize Razorpay
      const RazorpayConstructor = (window as any).Razorpay
      const razorpay = new RazorpayConstructor(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      notify.error('Payment Error', 'Failed to initialize payment')
      onFailure('Payment initialization failed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount.toFixed(2)}`
    }
    return `$${amount.toFixed(2)}`
  }

  return (
    <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-xl">💳 Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white font-semibold">{planName} Plan</div>
            <div className="text-2xl font-bold text-green-400">
              {formatAmount(amount, currency)}
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Secure payment powered by Razorpay
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={paymentDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={paymentDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent rounded-xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={paymentDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Currency
              </label>
                             <select
                 className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                 disabled
                 aria-label="Currency selection"
                 title="Currency selection"
               >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Billing Address *
            </label>
            <textarea
              value={paymentDetails.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete billing address"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent rounded-xl resize-none"
            />
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-green-400 text-xl">🔒</div>
            <div>
              <div className="text-green-300 font-semibold mb-1">Secure Payment</div>
              <div className="text-green-200 text-sm">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption 
                and never store your payment details on our servers.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-2 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 rounded-xl px-6 py-3 font-semibold transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isLoading || !isRazorpayLoaded}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              `Pay ${formatAmount(amount, currency)}`
            )}
          </Button>
        </div>

        {/* Payment Methods */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Accepted Payment Methods</div>
          <div className="flex items-center justify-center gap-4 text-2xl">
            <span title="Credit/Debit Cards">💳</span>
            <span title="Net Banking">🏦</span>
            <span title="UPI">📱</span>
            <span title="Digital Wallets">👛</span>
            <span title="Wallets">💼</span>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center text-gray-400 text-xs">
          By proceeding with the payment, you agree to our{' '}
          <a href="#" className="text-green-400 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>
        </div>
      </CardContent>
      <LoadingOverlay />
    </Card>
  )
}
