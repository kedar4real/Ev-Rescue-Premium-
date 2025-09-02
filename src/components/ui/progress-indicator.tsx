'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { 
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  ExclamationCircleIcon as AlertCircle,
  ArrowPathIcon as Loader2
} from '@heroicons/react/24/outline'

interface ProgressStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  currentStep?: string
  className?: string
}

export function ProgressIndicator({ steps, currentStep, className = '' }: ProgressIndicatorProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    if (currentStep) {
      const index = steps.findIndex(step => step.id === currentStep)
      if (index !== -1) {
        setCurrentStepIndex(index)
      }
    }
  }, [currentStep, steps])

  const getStepIcon = (step: ProgressStep, index: number) => {
    if (step.status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    if (step.status === 'error') {
      return <AlertCircle className="w-5 h-5 text-red-500" />
    }
    if (step.status === 'in-progress' || index === currentStepIndex) {
      return <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
    }
    return <Clock className="w-5 h-5 text-gray-500" />
  }

  const getStepStatus = (step: ProgressStep, index: number) => {
    if (step.status === 'completed') {
      return 'text-green-400'
    }
    if (step.status === 'error') {
      return 'text-red-400'
    }
    if (step.status === 'in-progress' || index === currentStepIndex) {
      return 'text-green-400'
    }
    return 'text-gray-400'
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step, index)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${getStepStatus(step, index)}`}>
                  {step.title}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {step.description}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-gray-600"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Predefined progress flows
export const EmergencyRequestProgress = [
  {
    id: 'location',
    title: 'Getting Location',
    description: 'Detecting your current position...',
    status: 'pending' as const
  },
  {
    id: 'matching',
    title: 'Finding Providers',
    description: 'Searching for available service providers...',
    status: 'pending' as const
  },
  {
    id: 'assignment',
    title: 'Assigning Provider',
    description: 'Connecting you with the nearest provider...',
    status: 'pending' as const
  },
  {
    id: 'confirmation',
    title: 'Request Confirmed',
    description: 'Your emergency request has been submitted',
    status: 'pending' as const
  }
]

export const PaymentProgress = [
  {
    id: 'processing',
    title: 'Processing Payment',
    description: 'Verifying your payment details...',
    status: 'pending' as const
  },
  {
    id: 'verification',
    title: 'Verifying Transaction',
    description: 'Confirming payment with bank...',
    status: 'pending' as const
  },
  {
    id: 'completion',
    title: 'Payment Complete',
    description: 'Your subscription has been activated',
    status: 'pending' as const
  }
]

export const ChargingSessionProgress = [
  {
    id: 'connection',
    title: 'Connecting to Station',
    description: 'Establishing connection to charging station...',
    status: 'pending' as const
  },
  {
    id: 'authentication',
    title: 'Authenticating',
    description: 'Verifying your account and payment method...',
    status: 'pending' as const
  },
  {
    id: 'charging',
    title: 'Charging Started',
    description: 'Your vehicle is now charging',
    status: 'pending' as const
  }
]
