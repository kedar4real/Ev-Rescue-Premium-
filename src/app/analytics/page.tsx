'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  DollarSign, 
  Zap, 
  BarChart3,
  Calendar,
  Download
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface ServiceData {
  month: string
  emergency: number
  charging: number
  maintenance: number
  total: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric] = useState('all')

  const metrics: MetricCard[] = [
    {
      title: 'Total Services',
      value: '1,247',
      change: 12.5,
      changeType: 'increase',
      icon: BarChart3,
      color: 'text-green-500'
    },
    {
      title: 'Response Time',
      value: '8.2 min',
      change: 5.3,
      changeType: 'decrease',
      icon: Clock,
      color: 'text-green-500'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: 2.1,
      changeType: 'increase',
      icon: Users,
      color: 'text-yellow-500'
    },
    {
      title: 'Revenue',
      value: '$45.2K',
      change: 18.7,
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-purple-500'
    }
  ]

  const serviceData: ServiceData[] = [
    { month: 'Jan', emergency: 45, charging: 32, maintenance: 28, total: 105 },
    { month: 'Feb', emergency: 52, charging: 38, maintenance: 31, total: 121 },
    { month: 'Mar', emergency: 48, charging: 35, maintenance: 29, total: 112 },
    { month: 'Apr', emergency: 61, charging: 42, maintenance: 35, total: 138 },
    { month: 'May', emergency: 55, charging: 39, maintenance: 32, total: 126 },
    { month: 'Jun', emergency: 67, charging: 45, maintenance: 38, total: 150 }
  ]

  const topServices = [
    { name: 'Battery Replacement', count: 156, percentage: 12.5, status: 'completed' },
    { name: 'Tire Change', count: 134, percentage: 10.8, status: 'completed' },
    { name: 'Charging Station Repair', count: 98, percentage: 7.9, status: 'in-progress' },
    { name: 'Emergency Towing', count: 87, percentage: 7.0, status: 'completed' },
    { name: 'Software Update', count: 76, percentage: 6.1, status: 'scheduled' }
  ]

  const fleetPerformance = [
    { vehicle: 'Service Van Alpha', uptime: 94.2, efficiency: 87.5, status: 'active' },
    { vehicle: 'Quick Response Scooter', uptime: 96.8, efficiency: 92.1, status: 'active' },
    { vehicle: 'Mobile Charging Unit', uptime: 89.5, efficiency: 84.3, status: 'maintenance' },
    { vehicle: 'Emergency Response Unit', uptime: 98.1, efficiency: 95.7, status: 'active' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'scheduled': return 'bg-green-500'
      case 'active': return 'bg-green-500'
      case 'maintenance': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'scheduled': return 'Scheduled'
      case 'active': return 'Active'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Analytics Dashboard</h1>
            <p className="text-xl text-green-400">Service performance metrics and insights</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="bg-gray-900 border-gray-700 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{metric.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-800`}>
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    {metric.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.change}%
                    </span>
                    <span className="text-sm text-gray-400 ml-2">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Trends Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Service Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceData.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-400">{data.month}</div>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full" 
                            style={{ width: `${(data.emergency / Math.max(...serviceData.map(d => d.total))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">Emergency</span>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full" 
                            style={{ width: `${(data.charging / Math.max(...serviceData.map(d => d.total))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">Charging</span>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-yellow-500 h-3 rounded-full" 
                            style={{ width: `${(data.maintenance / Math.max(...serviceData.map(d => d.total))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">Maintenance</span>
                      </div>
                      
                      <div className="w-16 text-right">
                        <span className="text-sm font-medium text-white">{data.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Services */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{service.name}</div>
                        <div className="text-xs text-gray-400">{service.count} services</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">{service.percentage}%</div>
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(service.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fleet Performance */}
        <div className="mt-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Fleet Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-400 font-medium">Vehicle</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Uptime</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Efficiency</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fleetPerformance.map((vehicle, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                              <Zap className="h-4 w-4 text-green-400" />
                            </div>
                            <span className="text-white font-medium">{vehicle.vehicle}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${vehicle.uptime}%` }}
                              />
                            </div>
                            <span className="text-white text-sm">{vehicle.uptime}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${vehicle.efficiency}%` }}
                              />
                            </div>
                            <span className="text-white text-sm">{vehicle.efficiency}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                            {getStatusText(vehicle.status)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">98.2%</div>
              <div className="text-gray-400 text-sm">Service Success Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Availability</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">4.9/5</div>
              <div className="text-gray-400 text-sm">Customer Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
