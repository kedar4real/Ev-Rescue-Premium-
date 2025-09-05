'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-md shimmer-dark", className)}
      {...props}
    />
  )
}

// Card Skeleton
function CardSkeleton() {
  return (
    <div className="uber-card p-6 space-y-4 card-glass">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[80%]" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}

// Dashboard Stats Skeleton
function StatsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="uber-card p-6 card-glass">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-6 w-[40px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Fleet Card Skeleton
function FleetCardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="uber-card p-4">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[100px] mb-3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-[60px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-[50px]" />
              <Skeleton className="h-3 w-[40px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Table Skeleton
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="uber-card">
      <div className="p-6">
        <Skeleton className="h-6 w-[200px] mb-4" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Profile Skeleton
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

// Chat Message Skeleton
function ChatMessageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] ${i % 2 === 0 ? 'order-2' : 'order-1'}`}>
            <div className="flex items-center space-x-2 mb-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
            <div className="uber-card p-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Map Skeleton
function MapSkeleton() {
  return (
    <div className="uber-card p-6">
      <Skeleton className="h-6 w-[150px] mb-4" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  )
}

// List Skeleton
function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="uber-card p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  CardSkeleton,
  StatsSkeleton,
  FleetCardSkeleton,
  TableSkeleton,
  ProfileSkeleton,
  ChatMessageSkeleton,
  MapSkeleton,
  ListSkeleton
}
