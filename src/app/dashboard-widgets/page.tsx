'use client'

import React, { useState, useEffect } from 'react'
import { DashboardWidget, WIDGET_TYPES, createWidget } from '../../components/DashboardWidget'
import { WidgetData } from '../../types/widgets'
import { useAuth } from '../../hooks/useAuth'
import { useRealTimeData } from '../../hooks/useRealTimeData'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { IconPlus, IconLayoutGrid, IconSettings } from '@tabler/icons-react'

interface WidgetConfig {
  id: string
  title: string
  type: 'chart' | 'stats' | 'list' | 'map' | 'custom'
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  data?: WidgetData
}

export default function DashboardWidgetsPage() {
  const { user, isAuthenticated } = useAuth()
  const realTimeData = useRealTimeData()
  const [widgets, setWidgets] = useState<WidgetConfig[]>([])
  const [isEditMode, setIsEditMode] = useState(false)

  // Initialize default widgets
  useEffect(() => {
    if (isAuthenticated) {
      const defaultWidgets = [
        createWidget('fleetStatus', { position: { x: 0, y: 0 } }),
        createWidget('chargingStations', { position: { x: 2, y: 0 } }),
        createWidget('emergencyRequests', { position: { x: 0, y: 1 } }),
        createWidget('revenueChart', { position: { x: 2, y: 1 } }),
        createWidget('serviceMap', { position: { x: 0, y: 2 } })
      ]
      setWidgets(defaultWidgets)
    }
  }, [isAuthenticated])

  const handleWidgetUpdate = (updatedWidget: WidgetConfig) => {
    setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w))
  }

  const handleWidgetRemove = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId))
  }

  const handleAddWidget = (widgetType: keyof typeof WIDGET_TYPES) => {
    const newWidget = createWidget(widgetType, {
      position: { x: 0, y: widgets.length }
    })
    setWidgets(prev => [...prev, newWidget])
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-black">Access Denied</CardTitle>
            <CardDescription className="text-gray-300 text-lg">Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-2xl py-4 text-lg font-semibold">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (false) { // Remove loading check for now
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(22,163,74,0.12),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_60%)]"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-600/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-400/8 rounded-full blur-2xl animate-bounce-subtle"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-teal-500/8 rounded-full blur-2xl animate-pulse-glow"></div>
      
      {/* Particle Effects */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-green-400/60 rounded-full animate-particle"></div>
      <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-emerald-300/80 rounded-full animate-particle animation-delay-1s"></div>
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-300/70 rounded-full animate-particle animation-delay-2s"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight gradient-text">
              Dashboard 📊
            </h1>
            <p className="text-xl text-gray-300 font-light leading-relaxed animate-slide-in-left">
              Real-time monitoring and control center
            </p>
          </div>
          
          <div className="flex items-center gap-3 animate-slide-in-right">
            <Button
              variant="outline"
              onClick={() => setIsEditMode(!isEditMode)}
              className="border-2 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 btn-hover liquid-btn"
            >
              <IconSettings className="h-4 w-4 mr-2" />
              {isEditMode ? 'Exit Edit' : 'Edit Layout'}
            </Button>
            
            {isEditMode && (
              <div className="flex gap-2 animate-fade-in-up">
                {Object.keys(WIDGET_TYPES).map((type, index) => (
                  <Button
                    key={type}
                    onClick={() => handleAddWidget(type as keyof typeof WIDGET_TYPES)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-xl px-4 py-2 text-sm font-semibold btn-hover liquid-btn animate-scale-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <IconPlus className="h-4 w-4 mr-1" />
                    {WIDGET_TYPES[type as keyof typeof WIDGET_TYPES].title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Widget Grid with Staggered Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget, index) => {
            const delayClass = index === 0 ? '' : index === 1 ? 'animation-delay-0-1s' : index === 2 ? 'animation-delay-0-2s' : index === 3 ? 'animation-delay-0-3s' : 'animation-delay-0-4s'
            return (
            <div 
              key={widget.id} 
              className={`animate-fade-in-up ${delayClass}`}
            >
              <DashboardWidget
                config={widget}
                onUpdate={handleWidgetUpdate}
                onRemove={handleWidgetRemove}
                isDragging={false}
                isResizing={false}
              >
                {/* Fallback content - will be replaced by renderWidgetContent */}
                <div className="p-4 text-center text-gray-400">
                  <IconLayoutGrid className="h-8 w-8 mx-auto mb-2" />
                  <p>Widget content loading...</p>
                </div>
              </DashboardWidget>
            </div>
            )
          })}
        </div>

        {/* Empty State */}
        {widgets.length === 0 && (
          <Card className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <IconLayoutGrid className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-white mb-2">No Widgets Added</h3>
              <p className="text-gray-400 mb-6">Add widgets to start monitoring your EV rescue operations</p>
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-2xl px-8 py-3 text-lg font-semibold"
              >
                <IconPlus className="h-5 w-5 mr-2" />
                Add Your First Widget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
