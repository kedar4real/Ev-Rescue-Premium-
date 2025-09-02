'use client'

import { useState, useEffect } from 'react'
import { ProgressIndicator, EmergencyRequestProgress, PaymentProgress, ChargingSessionProgress } from './progress-indicator'
import { LoadingOverlay, useLoadingOverlay } from './loading-overlay'
import { ToastContainer, useToast } from './enhanced-toast'

// Main UX Feedback Provider Component
export function UXFeedbackProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

// Hook that combines all UX feedback functionality
export function useUXFeedback() {
  const toast = useToast()
  const loadingOverlay = useLoadingOverlay()
  const [progressSteps, setProgressSteps] = useState<any[]>([])
  const [currentProgressStep, setCurrentProgressStep] = useState<string>('')

  // Emergency Request Flow
  const startEmergencyRequest = async () => {
    const steps = [...EmergencyRequestProgress]
    setProgressSteps(steps)
    
    loadingOverlay.show({
      title: 'Submitting Emergency Request',
      description: 'Please wait while we process your request...',
      type: 'loading',
      progress: 0
    })

    // Simulate progress
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update step status
      const updatedSteps = [...steps]
      updatedSteps[i].status = 'in-progress'
      setProgressSteps(updatedSteps)
      setCurrentProgressStep(steps[i].id)
      
      // Update loading overlay progress
      const progress = ((i + 1) / steps.length) * 100
      loadingOverlay.updateProgress(progress)
      
      if (i === steps.length - 1) {
        updatedSteps[i].status = 'completed'
        setProgressSteps(updatedSteps)
        loadingOverlay.setSuccess('Request Submitted!', 'Your emergency request has been successfully submitted.')
        
        // Hide overlay after success
        setTimeout(() => {
          loadingOverlay.hide()
        }, 2000)
      }
    }
  }

  // Payment Flow
  const startPayment = async () => {
    const steps = [...PaymentProgress]
    setProgressSteps(steps)
    
    loadingOverlay.show({
      title: 'Processing Payment',
      description: 'Please wait while we process your payment...',
      type: 'loading',
      progress: 0
    })

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedSteps = [...steps]
      updatedSteps[i].status = 'in-progress'
      setProgressSteps(updatedSteps)
      setCurrentProgressStep(steps[i].id)
      
      const progress = ((i + 1) / steps.length) * 100
      loadingOverlay.updateProgress(progress)
      
      if (i === steps.length - 1) {
        updatedSteps[i].status = 'completed'
        setProgressSteps(updatedSteps)
        loadingOverlay.setSuccess('Payment Successful!', 'Your subscription has been activated.')
        
        setTimeout(() => {
          loadingOverlay.hide()
        }, 2000)
      }
    }
  }

  // Charging Session Flow
  const startChargingSession = async () => {
    const steps = [...ChargingSessionProgress]
    setProgressSteps(steps)
    
    loadingOverlay.show({
      title: 'Starting Charging Session',
      description: 'Connecting to charging station...',
      type: 'loading',
      progress: 0
    })

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const updatedSteps = [...steps]
      updatedSteps[i].status = 'in-progress'
      setProgressSteps(updatedSteps)
      setCurrentProgressStep(steps[i].id)
      
      const progress = ((i + 1) / steps.length) * 100
      loadingOverlay.updateProgress(progress)
      
      if (i === steps.length - 1) {
        updatedSteps[i].status = 'completed'
        setProgressSteps(updatedSteps)
        loadingOverlay.setSuccess('Charging Started!', 'Your vehicle is now charging.')
        
        setTimeout(() => {
          loadingOverlay.hide()
        }, 2000)
      }
    }
  }

  // Quick feedback methods
  const showSuccess = (title: string, description?: string) => {
    toast.success(title, description)
  }

  const showError = (title: string, description?: string) => {
    toast.error(title, description)
  }

  const showWarning = (title: string, description?: string) => {
    toast.warning(title, description)
  }

  const showInfo = (title: string, description?: string) => {
    toast.info(title, description)
  }

  const showLoading = (title: string, description?: string) => {
    return toast.loading(title, description)
  }

  return {
    // Toast methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast: toast.updateToast,
    removeToast: toast.removeToast,
    
    // Loading overlay methods
    showLoadingOverlay: loadingOverlay.show,
    hideLoadingOverlay: loadingOverlay.hide,
    updateProgress: loadingOverlay.updateProgress,
    setSuccess: loadingOverlay.setSuccess,
    setError: loadingOverlay.setError,
    
    // Progress methods
    progressSteps,
    currentProgressStep,
    setProgressSteps,
    setCurrentProgressStep,
    
    // Predefined flows
    startEmergencyRequest,
    startPayment,
    startChargingSession,
    
    // Components
    LoadingOverlay: () => (
      <LoadingOverlay
        isVisible={loadingOverlay.isVisible}
        title={loadingOverlay.title}
        description={loadingOverlay.description}
        type={loadingOverlay.type}
        progress={loadingOverlay.progress}
        onClose={loadingOverlay.hide}
      />
    ),
    ProgressIndicator: () => (
      <ProgressIndicator
        steps={progressSteps}
        currentStep={currentProgressStep}
      />
    )
  }
}

// Enhanced Button with Loading States
interface LoadingButtonProps {
  onClick: () => Promise<void> | void
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  loadingText?: string
}

export function LoadingButton({
  onClick,
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  loadingText = 'Loading...'
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading || disabled) return
    
    setIsLoading(true)
    try {
      await onClick()
    } finally {
      setIsLoading(false)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white'
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'lg':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-3 text-base'
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  )
}
