import Razorpay from 'razorpay'

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Razorpay configuration
export const razorpayConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  theme: {
    color: '#00ff41', // Green theme for EV Rescue
  },
  companyName: 'EV Rescue Premium',
  companyDescription: 'Emergency EV Charging Service',
}

// Payment plans configuration
export const paymentPlans = {
  basic: {
    name: 'Basic Plan',
    monthly: 999, // ₹9.99
    yearly: 9999, // ₹99.99
    features: [
      'Emergency charging requests',
      'Basic tracking',
      'Email support',
      'Up to 5 requests/month'
    ]
  },
  premium: {
    name: 'Premium Plan',
    monthly: 1999, // ₹19.99
    yearly: 19999, // ₹199.99
    features: [
      'Unlimited emergency requests',
      'Real-time tracking',
      'Priority support',
      'Live chat support',
      'Advanced analytics'
    ]
  },
  enterprise: {
    name: 'Enterprise Plan',
    monthly: 4999, // ₹49.99
    yearly: 49999, // ₹499.99
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 phone support',
      'Custom reporting',
      'API access'
    ]
  }
}

// Utility functions
export const formatAmount = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const convertToPaise = (amount: number): number => {
  return Math.round(amount * 100)
}

export const convertFromPaise = (amount: number): number => {
  return amount / 100
}
