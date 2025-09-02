'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import LiveTracker from '../../components/LiveTracker'
import { notify } from '../../components/ui/notification'
import { TrackingSkeleton, PageHeaderSkeleton } from '../../components/LoadingSkeleton'

interface EmergencyRequest {
  id: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  vehicleType: string
  batteryLevel: number
  description: string
  createdAt: Date
  assignedProvider: {
    id: string
    name: string
    vehicleType: string
    rating: number
  }
}

export default function TrackingPage() {
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Simulate loading active requests
    setTimeout(() => {
      const mockRequests: EmergencyRequest[] = [
        {
          id: 'req_001',
          status: 'in_progress',
          priority: 'high',
          vehicleType: 'Tesla Model 3',
          batteryLevel: 15,
          description: 'Stranded on highway, need urgent charging',
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          assignedProvider: {
            id: 'prov_001',
            name: 'John Smith',
            vehicleType: 'Mobile Charger',
            rating: 4.8
          }
        },
        {
          id: 'req_002',
          status: 'assigned',
          priority: 'medium',
          vehicleType: 'Nissan Leaf',
          batteryLevel: 25,
          description: 'Low battery in parking lot',
          createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          assignedProvider: {
            id: 'prov_002',
            name: 'Sarah Johnson',
            vehicleType: 'Mobile Charger',
            rating: 4.9
          }
        }
      ]
      
      setActiveRequests(mockRequests)
      if (mockRequests.length > 0) {
        setSelectedRequest(mockRequests[0].id)
      }
      setIsLoading(false)
    }, 1000)
  }, [isAuthenticated, router])

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequest(requestId)
  }

  const handleEmergencyCall = () => {
    notify.info('Emergency Call', 'Connecting to emergency services...')
    // In real app, this would initiate a call
  }

  const handleCancelRequest = (requestId: string) => {
    if (confirm('Are you sure you want to cancel this emergency request?')) {
      setActiveRequests(prev => prev.filter(req => req.id !== requestId))
      if (selectedRequest === requestId) {
        setSelectedRequest(activeRequests[0]?.id || '')
      }
      notify.success('Request Cancelled', 'Emergency request has been cancelled')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <PageHeaderSkeleton />
          <TrackingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.08),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.08),transparent_40%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            📍 Live Tracking
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Monitor your emergency requests in real-time and track service providers
          </p>
        </div>

        {activeRequests.length === 0 ? (
          <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-6">🚗</div>
              <h2 className="text-2xl font-bold text-white mb-4">No Active Requests</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                You don&apos;t have any active emergency requests at the moment. 
                Create a new request when you need emergency charging.
              </p>
              <Button
                onClick={() => router.push('/emergency')}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all duration-300"
              >
                🚨 Create Emergency Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Requests Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🚨 Active Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedRequest === request.id
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => handleRequestSelect(request.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          request.priority === 'high' ? 'bg-red-900/50 text-red-200' :
                          request.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-200' :
                          'bg-green-900/50 text-green-200'
                        }`}>
                          {request.priority.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'in_progress' ? 'bg-green-900/50 text-green-200' :
                          request.status === 'assigned' ? 'bg-yellow-900/50 text-yellow-200' :
                          'bg-gray-900/50 text-gray-200'
                        }`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-white font-semibold">{request.vehicleType}</div>
                        <div className="text-gray-400 text-sm">
                          Battery: {request.batteryLevel}%
                        </div>
                        <div className="text-gray-400 text-sm">
                          Created: {request.createdAt.toLocaleTimeString()}
                        </div>
                        {request.assignedProvider && (
                          <div className="text-green-400 text-sm">
                            Provider: {request.assignedProvider.name}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelRequest(request.id)
                          }}
                          className="text-red-400 border-red-500 hover:bg-red-500 hover:text-white text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Tracking Area */}
            <div className="lg:col-span-2">
              <LiveTracker requestId={selectedRequest} />
              
              {/* Emergency Actions */}
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm mt-6">
                <CardHeader>
                  <CardTitle className="text-white text-xl">🚨 Emergency Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      onClick={handleEmergencyCall}
                      className="w-full bg-red-600 hover:bg-red-700 border-0 py-4 rounded-xl font-bold text-lg"
                    >
                      🚨 Emergency Call
                    </Button>
                    <Button
                      onClick={() => router.push('/emergency')}
                      variant="outline"
                      className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white py-4 rounded-xl font-bold text-lg"
                    >
                      📝 New Request
                    </Button>
                  </div>
                  
                  <div className="text-center text-gray-400 text-sm">
                    <p>💡 Tip: Keep tracking active to get real-time updates on your emergency request</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {activeRequests.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">📊 Quick Statistics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">{activeRequests.length}</div>
                  <div className="text-gray-400 text-sm">Active Requests</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {activeRequests.filter(r => r.status === 'in_progress').length}
                  </div>
                  <div className="text-gray-400 text-sm">In Progress</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {activeRequests.filter(r => r.priority === 'high').length}
                  </div>
                  <div className="text-gray-400 text-sm">High Priority</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round(activeRequests.reduce((acc, r) => acc + r.batteryLevel, 0) / activeRequests.length)}%
                  </div>
                  <div className="text-gray-400 text-sm">Avg Battery</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
