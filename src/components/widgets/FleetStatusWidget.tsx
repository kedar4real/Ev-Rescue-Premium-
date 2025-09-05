'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { IconTruck, IconBattery, IconMapPin, IconClock } from '@tabler/icons-react'

import { FleetStatusData } from '../../types/widgets'

interface FleetStatusWidgetProps {
  data?: FleetStatusData
}

const mockData = {
  vehicles: [
    {
      id: '1',
      name: 'Mobile Charger #1',
      status: 'available' as const,
      batteryLevel: 85,
      location: 'Downtown District',
      lastUpdate: '2 min ago',
      type: 'mobile_charger' as const
    },
    {
      id: '2',
      name: 'Service Van #2',
      status: 'busy' as const,
      batteryLevel: 92,
      location: 'Highway 101',
      lastUpdate: '5 min ago',
      type: 'service_van' as const
    },
    {
      id: '3',
      name: 'Tow Truck #3',
      status: 'available' as const,
      batteryLevel: 78,
      location: 'Airport Area',
      lastUpdate: '1 min ago',
      type: 'tow_truck' as const
    },
    {
      id: '4',
      name: 'Mobile Charger #4',
      status: 'maintenance' as const,
      batteryLevel: 45,
      location: 'Service Center',
      lastUpdate: '30 min ago',
      type: 'mobile_charger' as const
    }
  ],
  totalVehicles: 4,
  availableVehicles: 2,
  averageResponseTime: '12 min'
}

export function FleetStatusWidget({ data = mockData }: FleetStatusWidgetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'busy':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'maintenance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile_charger':
        return '🔋'
      case 'tow_truck':
        return '🚛'
      case 'service_van':
        return '🚐'
      default:
        return '🚗'
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{data.totalVehicles}</div>
          <div className="text-xs text-gray-400">Total Fleet</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{data.availableVehicles}</div>
          <div className="text-xs text-gray-400">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.averageResponseTime}</div>
          <div className="text-xs text-gray-400">Avg Response</div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {data.vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getTypeIcon(vehicle.type)}</div>
              <div>
                <div className="font-semibold text-white text-sm">{vehicle.name}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <IconMapPin className="h-3 w-3" />
                  {vehicle.location}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <IconBattery className="h-3 w-3" />
                  {vehicle.batteryLevel}%
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <IconClock className="h-3 w-3" />
                  {vehicle.lastUpdate}
                </div>
              </div>
              
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
