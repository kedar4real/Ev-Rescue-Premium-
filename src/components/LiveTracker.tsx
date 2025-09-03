'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useAppStore } from '../lib/store'
import { Location } from '../types'

interface LiveTrackerProps {
  requestId?: string
  showProviderInfo?: boolean
}

export default function LiveTracker({ requestId, showProviderInfo = true }: LiveTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  
  const { userRequests } = useAppStore()
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Get current request if requestId is provided
  const currentRequest = requestId 
    ? userRequests.find(r => r.id === requestId)
    : userRequests[userRequests.length - 1]

  useEffect(() => {
    if (isTracking) {
      startLocationTracking()
    } else {
      stopTracking()
    }

    return () => stopTracking()
  }, [isTracking])

  const startLocationTracking = () => {
    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          }
          setCurrentLocation(location)
          
          // Start continuous tracking
          locationIntervalRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const newLocation: Location = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                  address: 'Current Location'
                }
                setCurrentLocation(newLocation)
              },
              (error) => {
                console.error('Location tracking error:', error)
                // notify.error('Location Error', 'Unable to get current location') // Removed notify import
              }
            )
          }, 10000) // Update every 10 seconds
        },
        (error) => {
          console.error('Initial location error:', error)
          // notify.error('Location Error', 'Unable to get current location') // Removed notify import
        }
      )
    }
  }

  const stopTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current)
      locationIntervalRef.current = null
    }
  }

  const toggleTracking = () => {
    setIsTracking(!isTracking)
  }

  if (!currentRequest) {
    return (
      <Card className="uber-card">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No active emergency request found.</p>
            <p>Please create a new request to start tracking.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Request Info */}
      <Card className="uber-card">
        <CardHeader>
          <CardTitle>Emergency Request #{currentRequest.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>
              <span className="ml-2 capitalize">{currentRequest.status}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Urgency:</span>
              <span className="ml-2 capitalize">{currentRequest.priority}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Vehicle:</span>
              <span className="ml-2">{currentRequest.vehicleInfo.model}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Battery:</span>
              <span className="ml-2">{currentRequest.vehicleInfo.batteryLevel}%</span>
            </div>
          </div>
          
          <div>
            <span className="font-medium text-muted-foreground">Description:</span>
            <p className="mt-1">{currentRequest.notes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Location Tracking */}
      <Card className="uber-card">
        <CardHeader>
          <CardTitle>Location Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Status</p>
              <p className="font-medium">{isTracking ? 'Active' : 'Inactive'}</p>
            </div>
            <Button 
              onClick={toggleTracking}
              variant={isTracking ? "destructive" : "default"}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Button>
          </div>
          
          {currentLocation && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Latitude:</span>
                <span className="ml-2">{currentLocation.lat.toFixed(6)}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Longitude:</span>
                <span className="ml-2">{currentLocation.lng.toFixed(6)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Provider Info */}
      {showProviderInfo && currentRequest.assignedProvider && (
        <Card className="uber-card">
          <CardHeader>
            <CardTitle>Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">
              <p>Provider ID: {currentRequest.assignedProvider.id}</p>
              <p className="text-sm mt-2">Provider details would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
