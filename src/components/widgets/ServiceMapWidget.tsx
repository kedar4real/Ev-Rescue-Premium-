'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { IconMapPin, IconTruck, IconBattery, IconAlertTriangle } from '@tabler/icons-react'

import { ServiceMapData } from '../../types/widgets'

interface ServiceMapWidgetProps {
  data?: ServiceMapData
}

const mockData = {
  locations: [
    {
      id: '1',
      type: 'request' as const,
      name: 'Emergency Request #1',
      coordinates: [37.7749, -122.4194] as [number, number],
      status: 'active' as const,
      priority: 'critical' as const,
      batteryLevel: 5,
      lastUpdate: '2 min ago'
    },
    {
      id: '2',
      type: 'provider' as const,
      name: 'Mobile Charger #1',
      coordinates: [37.7849, -122.4094] as [number, number],
      status: 'busy' as const,
      lastUpdate: '1 min ago'
    },
    {
      id: '3',
      type: 'station' as const,
      name: 'Tesla Supercharger',
      coordinates: [37.7649, -122.4294] as [number, number],
      status: 'available' as const,
      lastUpdate: '5 min ago'
    },
    {
      id: '4',
      type: 'request' as const,
      name: 'Emergency Request #2',
      coordinates: [37.7549, -122.4394] as [number, number],
      status: 'pending' as const,
      priority: 'high' as const,
      batteryLevel: 12,
      lastUpdate: '8 min ago'
    },
    {
      id: '5',
      type: 'provider' as const,
      name: 'Service Van #2',
      coordinates: [37.7449, -122.4494] as [number, number],
      status: 'available' as const,
      lastUpdate: '3 min ago'
    }
  ],
  totalActive: 3,
  coverageArea: '25 sq mi',
  averageDistance: '2.3 mi'
}

export function ServiceMapWidget({ data = mockData }: ServiceMapWidgetProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <IconAlertTriangle className="h-4 w-4 text-red-400" />
      case 'provider':
        return <IconTruck className="h-4 w-4 text-blue-400" />
      case 'station':
        return <IconBattery className="h-4 w-4 text-green-400" />
      default:
        return <IconMapPin className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'busy':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority?: string) => {
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

  // Simple map representation using CSS
  const mapLocations = data.locations.map((location, index) => ({
    ...location,
    x: 20 + (index * 15) + Math.random() * 10,
    y: 30 + (index * 10) + Math.random() * 15
  }))

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{data.locations.length}</div>
          <div className="text-xs text-gray-400">Total Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400">{data.totalActive}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.averageDistance}</div>
          <div className="text-xs text-gray-400">Avg Distance</div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="relative p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
        <div className="flex items-center gap-2 mb-4">
          <IconMapPin className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Service Coverage Map</span>
          <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
            {data.coverageArea}
          </Badge>
        </div>
        
        {/* Simple map representation */}
        <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`absolute w-full h-px bg-gray-600 grid-line-h-${i}`} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`absolute h-full w-px bg-gray-600 grid-line-v-${i}`} />
            ))}
          </div>
          
          {/* Location markers */}
          {mapLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ '--marker-x': `${location.x}%`, '--marker-y': `${location.y}%`, left: 'var(--marker-x)', top: 'var(--marker-y)' } as React.CSSProperties}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-800 shadow-lg">
                  {getTypeIcon(location.type)}
                </div>
                {/* Pulse animation for active items */}
                {location.status === 'active' && (
                  <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
                )}
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <IconAlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-gray-300">Requests</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <IconTruck className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <IconBattery className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">Stations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="space-y-2">
        {data.locations.map((location) => (
          <div
            key={location.id}
            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-700/40 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {getTypeIcon(location.type)}
              <div>
                <div className="font-semibold text-white text-sm">{location.name}</div>
                <div className="text-xs text-gray-400">
                  {location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {location.batteryLevel && (
                <div className="text-xs text-red-400">
                  {location.batteryLevel}%
                </div>
              )}
              {location.priority && (
                <Badge className={`text-xs px-2 py-1 ${getPriorityColor(location.priority)}`}>
                  {location.priority}
                </Badge>
              )}
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(location.status)}`}>
                {location.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
