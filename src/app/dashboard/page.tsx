'use client'

import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../hooks/useAuth'
import { useRealTimeData } from '../../hooks/useRealTimeData'
import { DashboardSkeleton, PageHeaderSkeleton, StatsGridSkeleton } from '../../components/LoadingSkeleton'
import { analytics } from '../../lib/analytics'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const realTimeData = useRealTimeData()
  // Mock data for now since useRealTimeData doesn't return these properties
  const userData = { firstName: user?.firstName, role: 'user', subscription: { plan: 'premium' } }
  const emergencyRequests: any[] = []
  const fleetVehicles: any[] = []
  const notifications: any[] = []
  const loading = false
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Track page view
    analytics.trackPageView('/dashboard', {
      userId: user?.id,
      userRole: userData?.role
    })
  }, [user?.id, userData?.role])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-black">Access Denied</CardTitle>
            <CardDescription className="text-gray-300 text-lg">Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-2xl py-4 text-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <PageHeaderSkeleton />
          <StatsGridSkeleton />
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(22,163,74,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_60%)]"></div>
      
      {/* Enhanced Floating Elements with Better Animations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-600/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-400/8 rounded-full blur-2xl animate-bounce-subtle"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-500/8 rounded-full blur-2xl animate-pulse-glow"></div>
      
      {/* Particle Effects */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-green-400/60 rounded-full animate-particle"></div>
      <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-emerald-300/80 rounded-full animate-particle" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-300/70 rounded-full animate-particle" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header with Animations */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight gradient-text">
            Welcome back, {userData?.firstName || user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed animate-slide-in-left">
            Manage your emergency charging requests and account with ease
          </p>
        </div>

        {/* Enhanced Quick Actions with Staggered Animations */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer card-glass hover:border-green-500/50 hover:scale-105 animate-slide-in-left">
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce-subtle">🚨</div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Emergency Request</h3>
              <p className="text-base text-gray-300 mb-6 font-medium">Need immediate charging help?</p>
              <Link href="/emergency-assistance">
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 rounded-2xl py-3 text-lg font-semibold shadow-2xl shadow-red-500/30 btn-hover liquid-btn">
                  Request Help
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer card-glass hover:border-green-500/50 hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-float">🔋</div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Find Chargers</h3>
              <p className="text-base text-gray-300 mb-6 font-medium">Locate nearby charging stations</p>
              <Link href="/charging-finder">
                <Button className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white rounded-2xl py-3 text-lg font-semibold btn-hover liquid-btn">
                  Search Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer card-glass hover:border-green-500/50 hover:scale-105 animate-slide-in-right" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">👤</div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight">Profile</h3>
              <p className="text-base text-gray-300 mb-6 font-medium">Update your information</p>
              <Link href="/profile">
                <Button className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-2xl py-3 text-lg font-semibold btn-hover liquid-btn">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Overview with Staggered Animations */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {[
            { 
              label: 'Total Requests', 
              value: emergencyRequests?.length || 0, 
              icon: '📋', 
              color: 'from-green-900/50 to-green-800/50 border-green-700/50',
              animation: 'animate-fade-in-up'
            },
            { 
              label: 'Active Requests', 
              value: emergencyRequests?.filter(r => ['pending', 'assigned', 'in_progress'].includes(r.status)).length || 0, 
              icon: '🔄', 
              color: 'from-yellow-900/50 to-yellow-800/50 border-yellow-700/50',
              animation: 'animate-slide-in-left'
            },
            { 
              label: 'Completed', 
              value: emergencyRequests?.filter(r => r.status === 'completed').length || 0, 
              icon: '✅', 
              color: 'from-green-900/50 to-green-800/50 border-green-700/50',
              animation: 'animate-fade-in-up'
            },
            { 
              label: 'Subscription', 
              value: userData?.subscription?.plan?.toUpperCase() || 'BASIC', 
              icon: '💎', 
              color: 'from-purple-900/50 to-purple-800/50 border-purple-700/50',
              animation: 'animate-slide-in-right'
            }
          ].map((stat, index) => (
            <Card key={index} className={`text-center card-glass hover:border-green-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${stat.animation}`} style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-8">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-transform duration-300 animate-bounce-subtle`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white mb-2 tracking-tight gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-300 font-medium uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700/50">
            <nav className="-mb-px flex space-x-10">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'requests', label: 'My Requests', icon: '📋' },
                { id: 'providers', label: 'Service Providers', icon: '🚗' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-2 border-b-2 font-semibold text-base flex items-center gap-3 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600/50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-black text-white tracking-tight">Recent Activity</CardTitle>
                <CardDescription className="text-lg text-gray-300 font-light mt-2">Your latest emergency charging requests</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                {emergencyRequests && emergencyRequests.length > 0 ? (
                  <div className="space-y-6">
                    {emergencyRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-6 border border-gray-700/30 rounded-2xl bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300">
                        <div className="flex items-center gap-5">
                          <div className={`w-4 h-4 rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-500' :
                            request.status === 'in_progress' ? 'bg-green-500' :
                            request.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                          <div>
                            <div className="font-semibold text-white text-lg">{request.vehicleInfo.type} - {request.vehicleInfo.model}</div>
                            <div className="text-base text-gray-300 font-medium">
                              {request.location.address} • {request.priority} priority
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-semibold capitalize text-white">{request.status}</div>
                          <div className="text-sm text-gray-400 font-medium">
                            {request.createdAt.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-xl font-medium mb-2">No requests yet</p>
                    <p className="text-base">Your emergency charging requests will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'requests' && (
          <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-black text-white tracking-tight">All Requests</CardTitle>
              <CardDescription className="text-lg text-gray-300 font-light mt-2">Complete history of your emergency charging requests</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {emergencyRequests && emergencyRequests.length > 0 ? (
                <div className="space-y-6">
                  {emergencyRequests.map((request) => (
                    <div key={request.id} className="border border-gray-700/30 rounded-2xl p-6 bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white text-lg">{request.vehicleInfo.type} - {request.vehicleInfo.model}</h4>
                        <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                          request.status === 'pending' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50' :
                          request.status === 'in_progress' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                          request.status === 'completed' ? 'bg-green-900/50 text-green-200 border border-green-700/50' : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5 text-base">
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Location:</strong> 
                          <span className="text-gray-300 font-medium">{request.location.address}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Battery:</strong> 
                          <span className="text-gray-300 font-medium">{request.vehicleInfo.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Urgency:</strong> 
                          <span className="text-gray-300 font-medium capitalize">{request.priority}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Created:</strong> 
                          <span className="text-gray-300 font-medium">{request.createdAt.toDate().toLocaleDateString()}</span>
                        </div>
                      </div>
                                            {request.notes && (
                        <div className="mt-5 pt-5 border-t border-gray-700/30">
                          <strong className="text-white font-semibold">Details:</strong>
                          <span className="text-gray-300 font-medium ml-3">{request.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-xl font-medium mb-2">No requests found</p>
                  <p className="text-base">Start by creating an emergency request</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'providers' && (
          <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-black text-white tracking-tight">Nearby Service Providers</CardTitle>
              <CardDescription className="text-lg text-gray-300 font-light mt-2">Available mobile charging units in your area</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {fleetVehicles && fleetVehicles.length > 0 ? (
                <div className="space-y-6">
                  {fleetVehicles.map((provider) => (
                    <div key={provider.id} className="border border-gray-700/30 rounded-2xl p-6 bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-white text-lg">{provider.name}</h4>
                        <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                          provider.status === 'available' ? 'bg-green-900/50 text-green-200 border border-green-700/50' : 'bg-red-900/50 text-red-200 border border-red-700/50'
                        }`}>
                          {provider.status === 'available' ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5 text-base">
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Rating:</strong> 
                          <span className="text-gray-300 font-medium">⭐ {provider.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Rescues:</strong> 
                          <span className="text-gray-300 font-medium">{provider.totalServices}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <strong className="text-white font-semibold">Type:</strong> 
                          <span className="text-gray-300 font-medium capitalize">{provider.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">🚗</div>
                  <p className="text-xl font-medium mb-2">No providers found</p>
                  <p className="text-base">We&apos;ll notify you when providers are available</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
