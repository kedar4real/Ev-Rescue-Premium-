'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  IconGripVertical,
  IconSettings,
  IconRefresh,
  IconMaximize,
  IconMinimize,
  IconX
} from '@tabler/icons-react'
import { 
  FleetStatusWidget,
  ChargingStationsWidget,
  EmergencyRequestsWidget,
  RevenueChartWidget,
  ServiceMapWidget
} from './widgets'
import { WidgetData, FleetStatusData, ChargingStationsData, EmergencyRequestsData, RevenueChartData, ServiceMapData } from '../types/widgets'

interface WidgetConfig {
  id: string
  title: string
  type: 'chart' | 'stats' | 'list' | 'map' | 'custom'
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  data?: WidgetData
}

interface DashboardWidgetProps {
  config: WidgetConfig
  onUpdate: (config: WidgetConfig) => void
  onRemove: (id: string) => void
  onMove?: (id: string, position: { x: number; y: number }) => void
  children: React.ReactNode
  isDragging?: boolean
  isResizing?: boolean
}

export function DashboardWidget({
  config,
  onUpdate,
  onRemove,
  children,
  isDragging = false,
  isResizing = false
}: DashboardWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small':
        return 'col-span-1 row-span-1'
      case 'medium':
        return 'col-span-2 row-span-1'
      case 'large':
        return 'col-span-2 row-span-2'
      default:
        return 'col-span-1 row-span-1'
    }
  }

  const handleSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    onUpdate({ ...config, size: newSize })
  }

  const handleSettings = () => {
    setIsEditing(!isEditing)
  }

  const handleRefresh = () => {
    // Trigger data refresh
    onUpdate({ ...config, data: config.data })
  }

  const renderWidgetContent = () => {
    switch (config.id) {
      case 'fleet-status':
        return <FleetStatusWidget data={config.data as FleetStatusData} />
      case 'charging-stations':
        return <ChargingStationsWidget data={config.data as ChargingStationsData} />
      case 'emergency-requests':
        return <EmergencyRequestsWidget data={config.data as EmergencyRequestsData} />
      case 'revenue-chart':
        return <RevenueChartWidget data={config.data as RevenueChartData} />
      case 'service-map':
        return <ServiceMapWidget data={config.data as ServiceMapData} />
      default:
        return children
    }
  }

  return (
    <Card 
      className={`card-glass transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-105' : ''
      } ${isResizing ? 'ring-2 ring-green-400' : ''} ${getSizeClasses()}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <IconGripVertical className="h-4 w-4 text-gray-400 cursor-move" />
          <CardTitle className="text-sm font-medium text-white">{config.title}</CardTitle>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <IconRefresh className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            {isExpanded ? <IconMinimize className="h-3 w-3" /> : <IconMaximize className="h-3 w-3" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="text-gray-400 hover:text-white h-6 w-6 p-0"
          >
            <IconSettings className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(config.id)}
            className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
          >
            <IconX className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Widget Size</label>
              <div className="flex space-x-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={config.size === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSizeChange(size)}
                    className="text-xs"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-400 block mb-1">Widget Title</label>
              <input
                type="text"
                value={config.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...config, title: e.target.value })}
                placeholder="Enter widget title"
                aria-label="Widget title"
                className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
          </div>
        )}
        
        <div className={`transition-all duration-300 ${isExpanded ? 'scale-105' : ''}`}>
          {renderWidgetContent()}
        </div>
      </CardContent>
    </Card>
  )
}

// Widget Library
export const WIDGET_TYPES = {
  fleetStatus: {
    id: 'fleet-status',
    title: 'Fleet Status',
    type: 'stats' as const,
    size: 'medium' as const,
    position: { x: 0, y: 0 }
  },
  chargingStations: {
    id: 'charging-stations',
    title: 'Charging Stations',
    type: 'chart' as const,
    size: 'large' as const,
    position: { x: 2, y: 0 }
  },
  emergencyRequests: {
    id: 'emergency-requests',
    title: 'Emergency Requests',
    type: 'list' as const,
    size: 'medium' as const,
    position: { x: 0, y: 1 }
  },
  revenueChart: {
    id: 'revenue-chart',
    title: 'Revenue Analytics',
    type: 'chart' as const,
    size: 'large' as const,
    position: { x: 2, y: 1 }
  },
  serviceMap: {
    id: 'service-map',
    title: 'Service Coverage',
    type: 'map' as const,
    size: 'large' as const,
    position: { x: 0, y: 2 }
  }
}

// Widget Factory
export function createWidget(type: keyof typeof WIDGET_TYPES, customConfig?: Partial<WidgetConfig>): WidgetConfig {
  const baseConfig = WIDGET_TYPES[type]
  return {
    ...baseConfig,
    ...customConfig,
    id: customConfig?.id || `${baseConfig.id}-${Date.now()}`
  }
}
