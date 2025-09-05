'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  TruckIcon as Truck,
  CheckCircleIcon as CheckCircle,
  ExclamationTriangleIcon as AlertTriangle,
  ArrowPathIcon as Refresh,
  PhoneIcon as Phone,
  ChatBubbleLeftRightIcon as Chat
} from '@heroicons/react/24/outline'
import { useRealTimeTracking } from '@/hooks/useRealTimeTracking'
import { useToast } from '@/components/ui/use-toast'

interface RealTimeTrackingProps {
  trackingId?: string
  showAll?: boolean
}

export function RealTimeTracking({ trackingId, showAll = false }: RealTimeTrackingProps) {
  const { trackingData, isConnected, isLoading, error, requestLocationUpdate } = useRealTimeTracking()
  const [selectedTracking, setSelectedTracking] = useState<string | null>(trackingId || null)
  const { toast } = useToast()

  const filteredData = showAll ? trackingData : trackingData.filter(item => 
    !trackingId || item.id === trackingId
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'bg-green-500'
      case 'arrived': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'completed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en-route': return 'En Route'
      case 'arrived': return 'Arrived'
      case 'in-progress': return 'In Progress'
      case 'completed': return 'Completed'
      default: return 'Unknown'
    }
  }

  const handleRefresh = (trackingId: string) => {
    requestLocationUpdate(trackingId)
    toast({
      title: "Location Updated",
      description: "Requesting latest location from service provider",
      variant: "info"
    })
  }

  const handleCallDriver = (driverName: string) => {
    toast({
      title: "Calling Driver",
      description: `Initiating call to ${driverName}`,
      variant: "info"
    })
  }

  const handleChatDriver = (driverName: string) => {
    toast({
      title: "Opening Chat",
      description: `Starting chat with ${driverName}`,
      variant: "info"
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="uber-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="uber-card p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-destructive mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <Refresh className="h-4 w-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    )
  }

  if (filteredData.length === 0) {
    return (
      <div className="uber-card p-6 text-center">
        <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Tracking</h3>
        <p className="text-muted-foreground">No service providers are currently being tracked.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Live Tracking Active' : 'Connection Lost'}
          </span>
        </div>
        <Badge variant={isConnected ? 'default' : 'destructive'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {/* Tracking Cards */}
      {filteredData.map((tracking) => (
        <Card key={tracking.id} className="uber-card morph-card hover-lift">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getStatusColor(tracking.status)}`}>
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{tracking.driverName}</CardTitle>
                  <CardDescription>Vehicle ID: {tracking.vehicleId}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(tracking.status)}>
                  {getStatusText(tracking.status)}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRefresh(tracking.id)}
                  className="btn-hover"
                >
                  <Refresh className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress and ETA */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Progress</span>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {tracking.eta > 0 ? `${tracking.eta} min` : 'Arrived'}
                  </span>
                </div>
              </div>
              <Progress value={tracking.progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Started</span>
                <span>{tracking.progress}% Complete</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Current Location</span>
              </div>
              <div className="p-4 bg-accent rounded-lg border border-border">
                <p className="font-semibold">{tracking.location.address}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {tracking.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                className="flex-1 liquid-btn btn-hover"
                onClick={() => handleCallDriver(tracking.driverName)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Driver
              </Button>
              <Button
                variant="outline"
                className="flex-1 btn-hover"
                onClick={() => handleChatDriver(tracking.driverName)}
              >
                <Chat className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>

            {/* Status-specific information */}
            {tracking.status === 'arrived' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-400">Service Provider Has Arrived</span>
                </div>
                <p className="text-sm text-green-300 mt-1">
                  Your service provider is now at your location and ready to assist.
                </p>
              </div>
            )}

            {tracking.status === 'in-progress' && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-400">Service In Progress</span>
                </div>
                <p className="text-sm text-yellow-300 mt-1">
                  Your EV rescue service is currently being performed.
                </p>
              </div>
            )}

            {tracking.status === 'completed' && (
              <div className="p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold text-gray-400">Service Completed</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  Your EV rescue service has been completed successfully.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}