'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconRefresh,
  IconMaximize,
  IconMinimize
} from '@tabler/icons-react'

interface ChartData {
  name: string
  value: number
  change: number
  color: string
}

interface InteractiveChartProps {
  title: string
  data: ChartData[]
  type?: 'bar' | 'line' | 'pie' | 'area'
  showControls?: boolean
  onDataPointClick?: (data: ChartData) => void
}

export function InteractiveChart({ 
  title, 
  data, 
  type = 'bar', 
  showControls = true,
  onDataPointClick 
}: InteractiveChartProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedData, setSelectedData] = useState<ChartData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const maxValue = Math.max(...data.map(d => d.value))

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleDataPointClick = (item: ChartData) => {
    setSelectedData(item)
    onDataPointClick?.(item)
  }

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">{item.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{item.value}</span>
              <div className={`flex items-center space-x-1 ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change >= 0 ? (
                  <IconTrendingUp className="h-3 w-3" />
                ) : (
                  <IconTrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs">{Math.abs(item.change)}%</span>
              </div>
            </div>
          </div>
          <div 
            className="h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleDataPointClick(item)}
          >
            <div 
              className="chart-bar"
              style={{ 
                '--chart-width': `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color
              } as React.CSSProperties}
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderLineChart = () => (
    <div className="relative h-48">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y * 2}
            x2="400"
            y2={y * 2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Line path */}
        <path
          d={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 400
            const y = 200 - (item.value / maxValue) * 200
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          className="cursor-pointer hover:stroke-green-300 transition-colors"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 400
          const y = 200 - (item.value / maxValue) * 200
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={item.color}
              className="cursor-pointer hover:r-6 transition-all"
              onClick={() => handleDataPointClick(item)}
            />
          )
        })}
      </svg>
    </div>
  )

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180)
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180)
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180)
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ')
            
            currentAngle += angle
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleDataPointClick(item)}
              />
            )
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      default:
        return renderBarChart()
    }
  }

  return (
    <Card className={`card-glass transition-all duration-300 ${isExpanded ? 'col-span-2 row-span-2' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        {showControls && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white"
            >
              <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? <IconMinimize className="h-4 w-4" /> : <IconMaximize className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {renderChart()}
        
        {selectedData && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{selectedData.name}</div>
                <div className="text-sm text-gray-400">Value: {selectedData.value}</div>
              </div>
              <div className={`flex items-center space-x-1 ${
                selectedData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {selectedData.change >= 0 ? (
                  <IconTrendingUp className="h-4 w-4" />
                ) : (
                  <IconTrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm">{selectedData.change}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
