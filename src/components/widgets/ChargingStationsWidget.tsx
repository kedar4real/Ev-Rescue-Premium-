'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { IconMapPin, IconBattery, IconClock, IconUsers } from '@tabler/icons-react'

import { ChargingStationsData } from '../../types/widgets'

interface ChargingStationsWidgetProps {
  data?: ChargingStationsData
}

const mockData = {
  stations: [
    {
      id: '1',
      name: 'Tesla Supercharger',
      location: '123 Main St, Downtown',
      status: 'available' as const,
      connectorTypes: ['Tesla', 'CCS'],
      powerOutput: '250kW',
      distance: '0.5 mi',
      price: '$0.28/kWh'
    },
    {
      id: '2',
      name: 'Electrify America',
      location: '456 Oak Ave, Midtown',
      status: 'occupied' as const,
      connectorTypes: ['CCS', 'CHAdeMO'],
      powerOutput: '150kW',
      distance: '1.2 mi',
      waitTime: '15 min',
      price: '$0.32/kWh'
    },
    {
      id: '3',
      name: 'ChargePoint',
      location: '789 Pine St, Uptown',
      status: 'available' as const,
      connectorTypes: ['CCS', 'Type 2'],
      powerOutput: '50kW',
      distance: '2.1 mi',
      price: '$0.25/kWh'
    },
    {
      id: '4',
      name: 'EVgo Station',
      location: '321 Elm St, Suburbs',
      status: 'maintenance' as const,
      connectorTypes: ['CCS', 'CHAdeMO'],
      powerOutput: '100kW',
      distance: '3.5 mi',
      price: '$0.30/kWh'
    }
  ],
  totalStations: 4,
  availableStations: 2,
  averageWaitTime: '8 min'
}

export function ChargingStationsWidget({ data = mockData }: ChargingStationsWidgetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'occupied':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'maintenance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '🟢'
      case 'occupied':
        return '🟡'
      case 'maintenance':
        return '🟠'
      case 'offline':
        return '🔴'
      default:
        return '⚪'
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{data.totalStations}</div>
          <div className="text-xs text-gray-400">Total Stations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{data.availableStations}</div>
          <div className="text-xs text-gray-400">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{data.averageWaitTime}</div>
          <div className="text-xs text-gray-400">Avg Wait</div>
        </div>
      </div>

      {/* Station List */}
      <div className="space-y-3">
        {data.stations.map((station) => (
          <div
            key={station.id}
            className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getStatusIcon(station.status)}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{station.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <IconMapPin className="h-3 w-3" />
                    {station.location}
                  </div>
                </div>
              </div>
              
              <Badge className={`text-xs px-2 py-1 ${getStatusColor(station.status)}`}>
                {station.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <IconBattery className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">{station.powerOutput}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin className="h-3 w-3 text-green-400" />
                <span className="text-gray-300">{station.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconUsers className="h-3 w-3 text-purple-400" />
                <span className="text-gray-300">{station.connectorTypes.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-semibold">{station.price}</span>
              </div>
            </div>

            {station.waitTime && (
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <div className="flex items-center gap-2 text-xs text-yellow-400">
                  <IconClock className="h-3 w-3" />
                  <span>Estimated wait: {station.waitTime}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
