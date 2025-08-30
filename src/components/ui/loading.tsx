import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ripple'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  text?: string
  className?: string
}

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  color = 'primary',
  text,
  className = '' 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'border-blue-500 text-blue-500',
    secondary: 'border-gray-500 text-gray-500',
    success: 'border-green-500 text-green-500',
    warning: 'border-yellow-500 text-yellow-500',
    danger: 'border-red-500 text-red-500'
  }

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-current rounded-full animate-spin ${colorClasses[color]}`}></div>
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 bg-current rounded-full animate-pulse ${colorClasses[color]}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        ></div>
      ))}
    </div>
  )

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse ${colorClasses[color]}`}></div>
  )

  const renderBars = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1 bg-current animate-pulse ${colorClasses[color]}`}
          style={{ 
            height: '100%',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        ></div>
      ))}
    </div>
  )

  const renderRipple = () => (
    <div className={`${sizeClasses[size]} relative`}>
      <div className={`absolute inset-0 border-2 border-current rounded-full animate-ping opacity-75 ${colorClasses[color]}`}></div>
      <div className={`absolute inset-0 border-2 border-current rounded-full ${colorClasses[color]}`}></div>
    </div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'bars':
        return renderBars()
      case 'ripple':
        return renderRipple()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {text && (
        <div className={`text-sm font-medium ${colorClasses[color]}`}>
          {text}
        </div>
      )}
    </div>
  )
}

// Specialized loading components
export function PageLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-2xl font-bold text-white mb-2">Loading EV Rescue</div>
        <div className="text-gray-400">Preparing your experience...</div>
      </div>
    </div>
  )
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  )
}

export function CardLoading() {
  return (
    <div className="bg-gray-900/60 border border-gray-700/30 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export function TableLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-gray-900/40 rounded-xl animate-pulse">
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
          <div className="w-24 h-4 bg-gray-700 rounded"></div>
          <div className="w-20 h-4 bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
          <div className="w-12 h-4 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}

export function MapLoading() {
  return (
    <div className="bg-gray-900/60 border border-gray-700/30 rounded-2xl p-8 animate-pulse">
      <div className="w-full h-96 bg-gray-800 rounded-xl mb-4"></div>
      <div className="flex space-x-4">
        <div className="h-12 bg-gray-700 rounded-xl flex-1"></div>
        <div className="w-24 h-12 bg-gray-700 rounded-xl"></div>
        <div className="w-32 h-12 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  )
}
