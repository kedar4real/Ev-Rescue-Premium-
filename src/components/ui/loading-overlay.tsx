'use client'

import { useState } from 'react'
import { 
  ArrowPathIcon as Loader2,
  CheckCircleIcon as CheckCircle,
  ExclamationCircleIcon as AlertCircle,
  XMarkIcon as X
} from '@heroicons/react/24/outline'

interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
  type?: 'loading' | 'success' | 'error'
  progress?: number
  onClose?: () => void
  showCloseButton?: boolean
}

export function LoadingOverlay({
  isVisible,
  title = 'Loading...',
  description,
  type = 'loading',
  progress,
  onClose,
  showCloseButton = false
}: LoadingOverlayProps) {
  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-500" />
      default:
        return <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20'
      case 'error':
        return 'bg-red-900/20'
      default:
        return 'bg-gray-900/20'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Content */}
      <div className={`
        relative bg-gray-900 border border-gray-700 rounded-2xl p-8 
        shadow-2xl max-w-md w-full mx-4
        ${getBackgroundColor()}
        animate-in fade-in-0 zoom-in-95 duration-300
      `}>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            title="Close"
            aria-label="Close loading overlay"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-300 text-sm mb-4">
              {description}
            </p>
          )}
          
          {progress !== undefined && type === 'loading' && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out progress-width"
                style={{ '--progress-width': `${Math.min(100, Math.max(0, progress))}%` } as React.CSSProperties}
              />
            </div>
          )}
          
          {type === 'loading' && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce animation-delay-100" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce animation-delay-200" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for managing loading overlay state
export function useLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false)
  const [title, setTitle] = useState('Loading...')
  const [description, setDescription] = useState<string | undefined>()
  const [type, setType] = useState<'loading' | 'success' | 'error'>('loading')
  const [progress, setProgress] = useState<number | undefined>()

  const show = (options?: {
    title?: string
    description?: string
    type?: 'loading' | 'success' | 'error'
    progress?: number
  }) => {
    if (options?.title) setTitle(options.title)
    if (options?.description) setDescription(options.description)
    if (options?.type) setType(options.type)
    if (options?.progress !== undefined) setProgress(options.progress)
    setIsVisible(true)
  }

  const hide = () => {
    setIsVisible(false)
  }

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress)
  }

  const setSuccess = (title: string, description?: string) => {
    setType('success')
    setTitle(title)
    setDescription(description)
    setProgress(100)
  }

  const setError = (title: string, description?: string) => {
    setType('error')
    setTitle(title)
    setDescription(description)
  }

  return {
    isVisible,
    title,
    description,
    type,
    progress,
    show,
    hide,
    updateProgress,
    setSuccess,
    setError
  }
}
