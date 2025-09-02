'use client'

import { Badge } from './ui/badge'
import { CheckCircle, Clock, AlertTriangle, XCircle, Zap, Battery } from 'lucide-react'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'available' | 'charging' | 'maintenance' | 'emergency'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
}

export function StatusIndicator({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showText = true 
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
      case 'available':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          text: 'Available'
        }
      case 'busy':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          icon: Clock,
          text: 'Busy'
        }
      case 'charging':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          icon: Battery,
          text: 'Charging'
        }
      case 'maintenance':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
          icon: AlertTriangle,
          text: 'Maintenance'
        }
      case 'emergency':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          icon: Zap,
          text: 'Emergency'
        }
      case 'offline':
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          icon: XCircle,
          text: 'Offline'
        }
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          icon: XCircle,
          text: 'Unknown'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  if (showText) {
    return (
      <Badge 
        className={`${config.bgColor} ${config.borderColor} ${config.textColor} border`}
      >
        {showIcon && <Icon className={`${iconSizes[size]} mr-1`} />}
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} ${config.color} rounded-full animate-pulse`}></div>
      {showIcon && <Icon className={`${iconSizes[size]} ${config.textColor}`} />}
    </div>
  )
}
