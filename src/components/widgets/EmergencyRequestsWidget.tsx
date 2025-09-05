'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { IconAlertTriangle, IconMapPin, IconClock, IconBattery, IconUser } from '@tabler/icons-react'

import { EmergencyRequestsData } from '../../types/widgets'

interface EmergencyRequestsWidgetProps {
  data?: EmergencyRequestsData
}

const mockData = {
  requests: [
    {
      id: '1',
      customerName: 'John Smith',
      vehicleInfo: {
        type: 'Tesla Model 3',
        model: '2022',
        batteryLevel: 5
      },
      location: {
        address: '123 Main St, Downtown',
        coordinates: [37.7749, -122.4194] as [number, number]
      },
      priority: 'critical' as const,
      status: 'in_progress' as const,
      createdAt: '10 min ago',
      estimatedArrival: '5 min',
      assignedProvider: 'Mobile Charger #1',
      notes: 'Customer stranded on highway'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      vehicleInfo: {
        type: 'BMW i3',
        model: '2021',
        batteryLevel: 12
      },
      location: {
        address: '456 Oak Ave, Midtown',
        coordinates: [37.7849, -122.4094] as [number, number]
      },
      priority: 'high' as const,
      status: 'assigned' as const,
      createdAt: '15 min ago',
      estimatedArrival: '8 min',
      assignedProvider: 'Service Van #2'
    },
    {
      id: '3',
      customerName: 'Mike Chen',
      vehicleInfo: {
        type: 'Nissan Leaf',
        model: '2020',
        batteryLevel: 8
      },
      location: {
        address: '789 Pine St, Uptown',
        coordinates: [37.7649, -122.4294] as [number, number]
      },
      priority: 'medium' as const,
      status: 'pending' as const,
      createdAt: '20 min ago'
    },
    {
      id: '4',
      customerName: 'Emily Davis',
      vehicleInfo: {
        type: 'Chevrolet Bolt',
        model: '2023',
        batteryLevel: 15
      },
      location: {
        address: '321 Elm St, Suburbs',
        coordinates: [37.7549, -122.4394] as [number, number]
      },
      priority: 'low' as const,
      status: 'completed' as const,
      createdAt: '45 min ago'
    }
  ],
  totalRequests: 4,
  activeRequests: 3,
  averageResponseTime: '12 min'
}

export function EmergencyRequestsWidget({ data = mockData }: EmergencyRequestsWidgetProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'in_progress':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🚨'
      case 'high':
        return '⚠️'
      case 'medium':
        return '⚡'
      case 'low':
        return '🔋'
      default:
        return '📋'
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{data.totalRequests}</div>
          <div className="text-xs text-gray-400">Total Requests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{data.activeRequests}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.averageResponseTime}</div>
          <div className="text-xs text-gray-400">Avg Response</div>
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {data.requests.map((request) => (
          <div
            key={request.id}
            className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getPriorityIcon(request.priority)}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{request.customerName}</div>
                  <div className="text-xs text-gray-400">{request.vehicleInfo.type} {request.vehicleInfo.model}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge className={`text-xs px-2 py-1 ${getPriorityColor(request.priority)}`}>
                  {request.priority}
                </Badge>
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(request.status)}`}>
                  {request.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="flex items-center gap-2">
                <IconMapPin className="h-3 w-3 text-green-400" />
                <span className="text-gray-300">{request.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBattery className="h-3 w-3 text-red-400" />
                <span className="text-gray-300">{request.vehicleInfo.batteryLevel}% battery</span>
              </div>
              <div className="flex items-center gap-2">
                <IconClock className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">{request.createdAt}</span>
              </div>
              {request.estimatedArrival && (
                <div className="flex items-center gap-2">
                  <IconAlertTriangle className="h-3 w-3 text-yellow-400" />
                  <span className="text-gray-300">ETA: {request.estimatedArrival}</span>
                </div>
              )}
            </div>

            {request.assignedProvider && (
              <div className="pt-3 border-t border-gray-700/30">
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <IconUser className="h-3 w-3" />
                  <span>Assigned: {request.assignedProvider}</span>
                </div>
              </div>
            )}

            {request.notes && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 italic">"{request.notes}"</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
