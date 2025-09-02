'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Map } from '../../components/Map'

interface AdminStats {
  totalUsers: number
  totalRequests: number
  activeRequests: number
  completedRequests: number
  averageResponseTime: number
  totalRevenue: number
}

interface ServiceProvider {
  id: string
  name: string
  email: string
  phone: string
  vehicleTypes: string[]
  isAvailable: boolean
  rating: number
  totalRescues: number
  location: {
    lat: number
    lng: number
    address: string
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    averageResponseTime: 0,
    totalRevenue: 0
  })
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lng: -74.0060, address: 'New York, NY' })

  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }

    loadAdminData()
  }, [isAuthenticated, user, router])

  const loadAdminData = async () => {
    try {
      setStats({
        totalUsers: 1247,
        totalRequests: 892,
        activeRequests: 23,
        completedRequests: 869,
        averageResponseTime: 28,
        totalRevenue: 45670
      })

      setServiceProviders([
        {
          id: '1',
          name: 'Elite EV Rescue',
          email: 'contact@eliteevrescue.com',
          phone: '+1 (555) 123-4567',
          vehicleTypes: ['car', 'scooter', 'bike'],
          isAvailable: true,
          rating: 4.8,
          totalRescues: 156,
          location: { lat: 40.7589, lng: -73.9851, address: 'Manhattan, NY' }
        },
        {
          id: '2',
          name: 'Quick Charge Mobile',
          email: 'info@quickchargemobile.com',
          phone: '+1 (555) 987-6543',
          vehicleTypes: ['car', 'scooter'],
          isAvailable: false,
          rating: 4.6,
          totalRescues: 89,
          location: { lat: 40.7505, lng: -73.9934, address: 'Midtown, NY' }
        },
        {
          id: '3',
          name: 'Green Energy Rescue',
          email: 'help@greenenergyrescue.com',
          phone: '+1 (555) 456-7890',
          vehicleTypes: ['car', 'bike'],
          isAvailable: true,
          rating: 4.9,
          totalRescues: 203,
          location: { lat: 40.7484, lng: -73.9857, address: 'Chelsea, NY' }
        }
      ])
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'requests', label: 'Emergency Requests', icon: '🚨' },
    { id: 'providers', label: 'Service Providers', icon: '🚗' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'map', label: 'Live Map', icon: '🗺️' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
      <div className="absolute inset-0 bg-radial-gradient-circle-at-30-30-rgba-59-130-246-0-08-transparent-40"></div>
      <div className="absolute inset-0 bg-radial-gradient-circle-at-70-70-rgba-168-85-247-0-08-transparent-40"></div>
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 bg-opacity-8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 bg-opacity-8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                🛡️ Admin Dashboard
              </h1>
              <p className="text-xl text-gray-300 font-light leading-relaxed">Manage your EV Rescue Premium platform</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400 font-medium">Logged in as</div>
                <div className="font-semibold text-white text-lg">{user?.name || 'Admin'}</div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="border-2 border-gray-600 border-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white hover:border-gray-500 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                ← Back to App
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-green-900 to-green-800 border-green-700' },
            { label: 'Total Requests', value: stats.totalRequests, icon: '📋', color: 'from-purple-900 to-purple-800 border-purple-700' },
            { label: 'Active', value: stats.activeRequests, icon: '🔄', color: 'from-yellow-900 to-yellow-800 border-yellow-700' },
            { label: 'Completed', value: stats.completedRequests, icon: '✅', color: 'from-green-900 to-green-800 border-green-700' },
            { label: 'Avg Response', value: `${stats.averageResponseTime}min`, icon: '⏱️', color: 'from-indigo-900 to-indigo-800 border-indigo-700' },
            { label: 'Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, icon: '💰', color: 'from-emerald-900 to-emerald-800 border-emerald-700' }
          ].map((stat, index) => (
            <Card key={index} className="text-center bg-gray-900 bg-opacity-40 border-gray-700 border-opacity-30 backdrop-blur-sm hover:bg-gray-800 hover:bg-opacity-50 hover:border-gray-600 hover:border-opacity-50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-50 flex items-center justify-center text-2xl shadow-2xl`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-700 border-opacity-50">
            <nav className="-mb-px flex space-x-10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-2 border-b-2 font-semibold text-base flex items-center gap-3 whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600 hover:border-opacity-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">Recent Activity</CardTitle>
                  <CardDescription className="text-lg text-gray-300 font-light mt-2">Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    {[
                      { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                      { action: 'Emergency request submitted', time: '5 minutes ago', type: 'request' },
                      { action: 'Service provider went online', time: '12 minutes ago', type: 'provider' },
                      { action: 'Request completed successfully', time: '18 minutes ago', type: 'completion' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border border-gray-700 border-opacity-30 rounded-2xl bg-gray-800 bg-opacity-40 backdrop-blur-sm hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-300">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'user' ? 'bg-green-500' :
                          activity.type === 'request' ? 'bg-red-500' :
                          activity.type === 'provider' ? 'bg-green-500' : 'bg-purple-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-base text-white font-medium">{activity.action}</div>
                          <div className="text-sm text-gray-400 font-medium">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">Quick Actions</CardTitle>
                  <CardDescription className="text-lg text-gray-300 font-light mt-2">Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 py-4 rounded-2xl font-semibold shadow-lg shadow-green-500 shadow-opacity-30 transform hover:scale-105 transition-all duration-300">
                      📊 Generate Report
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 py-4 rounded-2xl font-semibold shadow-lg shadow-green-500 shadow-opacity-30 transform hover:scale-105 transition-all duration-300">
                      ➕ Add Service Provider
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 py-4 rounded-2xl font-semibold shadow-lg shadow-purple-500 shadow-opacity-30 transform hover:scale-105 transition-all duration-300">
                      👥 Manage Users
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 border-0 py-4 rounded-2xl font-semibold shadow-lg shadow-yellow-500 shadow-opacity-30 transform hover:scale-105 transition-all duration-300">
                      ⚙️ System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-black text-white tracking-tight">Emergency Requests</CardTitle>
              <CardDescription className="text-lg text-gray-300 font-light mt-2">Monitor and manage all emergency requests</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-gray-700 border-opacity-50">
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">ID</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">User</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Vehicle</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Location</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Urgency</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-gray-800 border-opacity-50 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300">
                        <td className="py-4 px-6 text-white font-medium">#REQ{i.toString().padStart(3, '0')}</td>
                        <td className="py-4 px-6 text-white">User {i}</td>
                        <td className="py-4 px-6 text-gray-300">Tesla Model 3</td>
                        <td className="py-4 px-6 text-gray-300">Manhattan, NY</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                            i === 1 ? 'bg-red-900 bg-opacity-50 text-red-200 border border-red-700 border-opacity-50' :
                            i === 2 ? 'bg-yellow-900 bg-opacity-50 text-yellow-200 border border-yellow-700 border-opacity-50' :
                            'bg-green-900 bg-opacity-50 text-green-200 border border-green-700 border-opacity-50'
                          }`}>
                            {i === 1 ? 'High' : i === 2 ? 'Medium' : 'Low'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                            i === 1 ? 'bg-green-900 bg-opacity-50 text-green-200 border border-green-700 border-opacity-50' :
                            i === 2 ? 'bg-yellow-900 bg-opacity-50 text-yellow-200 border border-yellow-700 border-opacity-50' :
                            'bg-green-900 bg-opacity-50 text-green-200 border border-green-700 border-opacity-50'
                          }`}>
                            {i === 1 ? 'In Progress' : i === 2 ? 'Pending' : 'Completed'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300 font-medium">2024-01-{i.toString().padStart(2, '0')}</td>
                        <td className="py-4 px-6">
                          <Button size="sm" variant="outline" className="border-2 border-gray-600 border-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white hover:border-gray-500 rounded-xl px-4 py-2 font-semibold transition-all duration-300">
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white tracking-tight">Service Providers</h3>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-green-500 shadow-opacity-30 transform hover:scale-105 transition-all duration-300">
                ➕ Add Provider
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceProviders.map((provider) => (
                <Card key={provider.id} className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-xl font-black tracking-tight">{provider.name}</CardTitle>
                      <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                        provider.isAvailable ? 'bg-green-900 bg-opacity-50 text-green-200 border border-green-700 border-opacity-50' : 'bg-red-900 bg-opacity-50 text-red-200 border border-red-700 border-opacity-50'
                      }`}>
                        {provider.isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                    <CardDescription className="text-gray-300 text-base">{provider.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-8 pb-8">
                    <div className="flex items-center gap-3 text-base">
                      <span className="text-gray-400 font-medium">Phone:</span>
                      <span className="text-white font-semibold">{provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <span className="text-gray-400 font-medium">Rating:</span>
                      <span className="text-white font-semibold">⭐ {provider.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <span className="text-gray-400 font-medium">Rescues:</span>
                      <span className="text-white font-semibold">{provider.totalRescues}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <span className="text-gray-400 font-medium">Vehicles:</span>
                      <span className="text-white font-semibold">{provider.vehicleTypes.join(', ')}</span>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button size="sm" variant="outline" className="flex-1 border-2 border-gray-600 border-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white hover:border-gray-500 rounded-xl px-4 py-2 font-semibold transition-all duration-300">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-2 border-gray-600 border-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white hover:border-gray-500 rounded-xl px-4 py-2 font-semibold transition-all duration-300">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-black text-white tracking-tight">User Management</CardTitle>
              <CardDescription className="text-lg text-gray-300 font-light mt-2">Manage platform users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b border-gray-700 border-opacity-50">
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">User</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Role</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Joined</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-gray-800 border-opacity-50 hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300">
                        <td className="py-4 px-6 text-white font-medium">User {i}</td>
                        <td className="py-4 px-6 text-gray-300">user{i}@example.com</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                            i === 1 ? 'bg-purple-900 bg-opacity-50 text-purple-200 border border-purple-700 border-opacity-50' : 'bg-gray-700 bg-opacity-50 text-gray-300 border border-gray-600 border-opacity-50'
                          }`}>
                            {i === 1 ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-2 rounded-full text-sm font-semibold bg-green-900 bg-opacity-50 text-green-200 border border-green-700 border-opacity-50">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300 font-medium">2024-01-{i.toString().padStart(2, '0')}</td>
                        <td className="py-4 px-6">
                          <Button size="sm" variant="outline" className="border-2 border-gray-600 border-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white hover:border-gray-500 rounded-xl px-4 py-2 font-semibold transition-all duration-300">
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">Request Trends</CardTitle>
                  <CardDescription className="text-lg text-gray-300 font-light mt-2">Monthly emergency request volume</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[65, 78, 92, 85, 103, 89, 76, 94, 87, 101, 95, 88].map((value, index) => (
                      <div key={index} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-300 hover:scale-105" 
                           style={{ height: `${(value / 103) * 100}%` }}>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-4 font-medium">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">Response Time Analysis</CardTitle>
                  <CardDescription className="text-lg text-gray-300 font-light mt-2">Average response times by priority</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="space-y-6">
                    {[
                      { priority: 'High', time: '18 min', percentage: 85, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
                      { priority: 'Medium', time: '32 min', percentage: 72, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
                      { priority: 'Low', time: '45 min', percentage: 68, color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-base mb-3">
                          <span className="text-white font-semibold">{item.priority} Priority</span>
                          <span className="text-white font-medium">{item.time}</span>
                        </div>
                        <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-3">
                          <div className={`h-3 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-8">
            <Card className="bg-gray-900 bg-opacity-60 border-gray-700 border-opacity-30 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-black text-white tracking-tight">Live Service Map</CardTitle>
                <CardDescription className="text-lg text-gray-300 font-light mt-2">Monitor service providers and active requests in real-time</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Map 
                  onLocationSelect={handleLocationSelect}
                  initialLocation={selectedLocation}
                  height="600px"
                  showSearch={false}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
