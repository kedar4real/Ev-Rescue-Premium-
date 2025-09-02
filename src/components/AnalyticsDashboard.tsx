'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Car, 
  Clock, 
  DollarSign,
  Activity,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react'

interface AnalyticsData {
  period: string
  dateRange: {
    start: string
    end: string
  }
  metrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalRequests: number
    completedRequests: number
    pendingRequests: number
    inProgressRequests: number
    averageResponseTime: number
    revenue: number
    fleetUtilization: number
    userSatisfaction: number
  }
  breakdown: {
    requestTypes: Record<string, number>
    userSegments: Record<string, number>
    geographic: Record<string, number>
    timeOfDay: Record<string, number>
  }
  fleet: {
    total: number
    available: number
    busy: number
    maintenance: number
    offline: number
  }
  recentActivity: Array<{
    id: string
    type: string
    status: string
    location: string
    createdAt: string
    user: string
  }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics/dashboard?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-900/60 border-gray-700/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900/60 border-gray-700/30">
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Analytics</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchAnalytics} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) return null

  const { metrics, breakdown, fleet, recentActivity } = analytics

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{metrics.newUsers} new
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {metrics.completedRequests} completed
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{metrics.averageResponseTime}min</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Target: 30min
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-white">${metrics.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status */}
      <Card className="bg-gray-900/60 border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Car className="h-5 w-5" />
            Fleet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{fleet.available}</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{fleet.busy}</div>
              <div className="text-sm text-gray-400">Busy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{fleet.maintenance}</div>
              <div className="text-sm text-gray-400">Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{fleet.offline}</div>
              <div className="text-sm text-gray-400">Offline</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Types Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Request Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(breakdown.requestTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                  <Badge variant="secondary" className="bg-green-900/50 text-green-200">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/60 border-gray-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(breakdown.userSegments).map(([segment, count]) => (
                <div key={segment} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{segment}</span>
                  <Badge variant="secondary" className="bg-blue-900/50 text-blue-200">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900/60 border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'in_progress' ? 'bg-yellow-500' :
                    activity.status === 'pending' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium capitalize">{activity.type.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-400">{activity.user} • {activity.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      activity.status === 'completed' ? 'bg-green-900/50 text-green-200' :
                      activity.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-200' :
                      activity.status === 'pending' ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-900/50 text-gray-200'
                    }`}
                  >
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
