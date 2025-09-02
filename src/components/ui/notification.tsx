'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { 
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ExclamationTriangleIcon as AlertTriangle,
  InformationCircleIcon as Info,
  XMarkIcon as X
} from '@heroicons/react/24/outline'

interface NotificationMethods {
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

declare global {
  interface Window {
    showNotification: NotificationMethods
  }
}

export interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function Notification({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  action 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-dismiss
    if (duration > 0) {
      const dismissTimer = setTimeout(() => handleClose(), duration)
      return () => clearTimeout(dismissTimer)
    }
    
    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.(id)
    }, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-900/90',
          borderColor: 'border-green-700/50',
          textColor: 'text-green-100',
          iconColor: 'text-green-400'
        }
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-900/90',
          borderColor: 'border-red-700/50',
          textColor: 'text-red-100',
          iconColor: 'text-red-400'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-900/90',
          borderColor: 'border-yellow-700/50',
          textColor: 'text-yellow-100',
          iconColor: 'text-yellow-400'
        }
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-green-900/90',
          borderColor: 'border-green-700/50',
          textColor: 'text-green-100',
          iconColor: 'text-green-400'
        }
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-900/90',
          borderColor: 'border-gray-700/50',
          textColor: 'text-gray-100',
          iconColor: 'text-gray-400'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out ${
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`${styles.bgColor} ${styles.borderColor} border backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 p-4`}>
        <div className="flex items-start space-x-3">
          <div className={`${styles.iconColor} flex-shrink-0 mt-0.5`}>
            <styles.icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`${styles.textColor} font-semibold text-sm mb-1`}>
              {title}
            </div>
            {message && (
              <div className="text-gray-300 text-sm leading-relaxed">
                {message}
              </div>
            )}
            
            {action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={action.onClick}
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0 mt-0.5"
            aria-label="Close notification"
            title="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-black/20 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white/30 rounded-full transition-all duration-100 ease-linear"
              style={{ 
                width: isExiting ? '0%' : '100%',
                transitionDuration: `${duration}ms`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Notification container to manage multiple notifications
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration })
  }

  // Expose methods globally (you can also use React Context for this)
  if (typeof window !== 'undefined') {
    window.showNotification = {
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}

// Hook for using notifications
export function useNotifications() {
  const showSuccess = (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.success(title, message, duration)
    }
  }

  const showError = (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.error(title, message, duration)
    }
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.warning(title, message, duration)
    }
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.info(title, message, duration)
    }
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

// Quick notification functions
export const notify = {
  success: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.success(title, message, duration)
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.error(title, message, duration)
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.warning(title, message, duration)
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification.info(title, message, duration)
    }
  }
}
