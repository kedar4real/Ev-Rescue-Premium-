'use client'

import { Card, CardContent, CardHeader } from './ui/card'

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-4/5"></div>
          <div className="h-3 bg-gray-700 rounded w-3/5"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse">
          <div className="h-96 bg-gray-700 rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              i % 2 === 0 ? 'bg-gray-700' : 'bg-green-600/20'
            }`}>
              <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
          <div className="w-10 h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function EmergencyFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Emergency Type Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-700 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-gray-700 rounded"></div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-700 rounded flex-1"></div>
            <div className="w-24 h-10 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="h-12 bg-gray-700 rounded-lg"></div>
    </div>
  )
}

export function ChargingStationSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-4 bg-gray-700 rounded w-12"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-700 rounded flex-1"></div>
                <div className="h-8 bg-gray-700 rounded flex-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TrackingSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-600 rounded-xl">
                <div className="animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-700 rounded w-16"></div>
                    <div className="h-5 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-28"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-96 bg-gray-700 rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="text-center mb-8 animate-pulse">
      <div className="h-12 bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto"></div>
    </div>
  )
}

export function StatsGridSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-700 rounded w-48"></div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
