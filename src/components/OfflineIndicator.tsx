'use client'

import React from 'react'
import { useFirebaseConnection } from '../hooks/useFirebaseConnection'
import { IconWifi, IconWifiOff, IconRefresh } from '@tabler/icons-react'

export function OfflineIndicator() {
  const { isOnline, isConnecting, retryConnection } = useFirebaseConnection()

  if (isOnline) {
    return null // Don't show anything when online
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="card-glass p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isConnecting ? (
              <IconRefresh className="h-5 w-5 text-yellow-400 animate-spin" />
            ) : (
              <IconWifiOff className="h-5 w-5 text-yellow-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-yellow-400">
              {isConnecting ? 'Reconnecting...' : 'You\'re offline'}
            </p>
            <p className="text-xs text-yellow-300/80">
              Some features may be limited
            </p>
          </div>
          
          {!isConnecting && (
            <button
              onClick={retryConnection}
              className="flex-shrink-0 p-1 rounded-md hover:bg-yellow-500/20 transition-colors"
              title="Retry connection"
            >
              <IconRefresh className="h-4 w-4 text-yellow-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Connection status component for header
export function ConnectionStatus() {
  const { isOnline, isConnecting } = useFirebaseConnection()

  return (
    <div className="flex items-center space-x-2">
      {isOnline ? (
        <div className="flex items-center space-x-1 text-green-400">
          <IconWifi className="h-4 w-4" />
          <span className="text-xs">Online</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1 text-yellow-400">
          {isConnecting ? (
            <IconRefresh className="h-4 w-4 animate-spin" />
          ) : (
            <IconWifiOff className="h-4 w-4" />
          )}
          <span className="text-xs">Offline</span>
        </div>
      )}
    </div>
  )
}
