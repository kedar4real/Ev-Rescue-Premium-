'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.duration && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.type])

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
      default:
        return <Info className="w-5 h-5 text-green-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/90 border-green-700/50'
      case 'error':
        return 'bg-red-900/90 border-red-700/50'
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-700/50'
      case 'loading':
        return 'bg-green-900/90 border-green-700/50'
      default:
        return 'bg-green-900/90 border-green-700/50'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor()}
        border backdrop-blur-sm rounded-lg p-4 shadow-lg
        min-w-[320px] max-w-md
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm">
            {toast.title}
          </div>
          {toast.description && (
            <div className="text-gray-300 text-xs mt-1">
              {toast.description}
            </div>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-green-400 hover:text-green-300 text-xs font-medium mt-2 underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        {toast.type !== 'loading' && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            title="Close notification"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const updateToast = (id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ))
  }

  const success = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, description, ...options })
  }

  const error = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, description, ...options })
  }

  const warning = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, description, ...options })
  }

  const info = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, description, ...options })
  }

  const loading = (title: string, description?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'loading', title, description, duration: 0, ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    success,
    error,
    warning,
    info,
    loading
  }
}

// Toast Container Component
export function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Enhanced notification function that works with the new toast system
export const notify = {
  success: (title: string, description?: string) => {
    // This will be connected to the toast system in the app
    console.log('Success:', title, description)
  },
  error: (title: string, description?: string) => {
    console.log('Error:', title, description)
  },
  warning: (title: string, description?: string) => {
    console.log('Warning:', title, description)
  },
  info: (title: string, description?: string) => {
    console.log('Info:', title, description)
  },
  loading: (title: string, description?: string) => {
    console.log('Loading:', title, description)
  }
}
