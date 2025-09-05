'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { IconTrendingUp, IconTrendingDown, IconCurrencyDollar, IconCalendar } from '@tabler/icons-react'

import { RevenueChartData } from '../../types/widgets'

interface RevenueChartWidgetProps {
  data?: RevenueChartData
}

const mockData = {
  currentPeriod: {
    period: 'This Month',
    revenue: 12500,
    services: 45,
    growth: 12.5
  },
  previousPeriod: {
    period: 'Last Month',
    revenue: 11100,
    services: 38,
    growth: -2.3
  },
  monthlyData: [
    { period: 'Jan', revenue: 8500, services: 32, growth: 5.2 },
    { period: 'Feb', revenue: 9200, services: 35, growth: 8.2 },
    { period: 'Mar', revenue: 11100, services: 38, growth: -2.3 },
    { period: 'Apr', revenue: 12500, services: 45, growth: 12.5 }
  ],
  totalRevenue: 12500,
  totalServices: 45,
  growthRate: 12.5
}

export function RevenueChartWidget({ data = mockData }: RevenueChartWidgetProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />
  }

  // Simple bar chart representation
  const maxRevenue = Math.max(...data.monthlyData.map(d => d.revenue))
  
  return (
    <div className="space-y-4">
      {/* Current Period Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-2">
            <IconCurrencyDollar className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatCurrency(data.totalRevenue)}</div>
          <div className={`flex items-center gap-1 text-xs ${getGrowthColor(data.growthRate)}`}>
            {getGrowthIcon(data.growthRate)}
            <span>{Math.abs(data.growthRate)}% vs last month</span>
          </div>
        </div>
        
        <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-2">
            <IconCalendar className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">Services</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.totalServices}</div>
          <div className="text-xs text-gray-400">This month</div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
        <div className="flex items-center gap-2 mb-4">
          <IconTrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Monthly Revenue Trend</span>
        </div>
        
        <div className="space-y-3">
          {data.monthlyData.map((month, index) => (
            <div key={month.period} className="flex items-center gap-3">
              <div className="w-8 text-xs text-gray-400 font-medium">{month.period}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{formatCurrency(month.revenue)}</span>
                  <div className={`flex items-center gap-1 text-xs ${getGrowthColor(month.growth)}`}>
                    {getGrowthIcon(month.growth)}
                    <span>{Math.abs(month.growth)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500 chart-bar-dynamic"
                    style={{ '--chart-width': `${(month.revenue / maxRevenue) * 100}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/20">
          <div className="text-xs text-gray-400 mb-1">This Month</div>
          <div className="text-lg font-bold text-white">{formatCurrency(data.currentPeriod.revenue)}</div>
          <div className="text-xs text-gray-400">{data.currentPeriod.services} services</div>
        </div>
        
        <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/20">
          <div className="text-xs text-gray-400 mb-1">Last Month</div>
          <div className="text-lg font-bold text-gray-300">{formatCurrency(data.previousPeriod.revenue)}</div>
          <div className="text-xs text-gray-400">{data.previousPeriod.services} services</div>
        </div>
      </div>
    </div>
  )
}
