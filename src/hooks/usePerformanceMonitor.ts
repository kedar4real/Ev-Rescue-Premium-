'use client'

import { useState, useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
  memoryUsage?: number
  networkLatency?: number
}

interface PerformanceThresholds {
  pageLoadTime: number // 2 seconds
  firstContentfulPaint: number // 1.5 seconds
  largestContentfulPaint: number // 2.5 seconds
  cumulativeLayoutShift: number // 0.1
  firstInputDelay: number // 100ms
  timeToInteractive: number // 3 seconds
}

const defaultThresholds: PerformanceThresholds = {
  pageLoadTime: 2000,
  firstContentfulPaint: 1500,
  largestContentfulPaint: 2500,
  cumulativeLayoutShift: 0.1,
  firstInputDelay: 100,
  timeToInteractive: 3000
}

export function usePerformanceMonitor(thresholds: Partial<PerformanceThresholds> = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState<string[]>([])

  const finalThresholds = { ...defaultThresholds, ...thresholds }

  const collectMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paintEntries = performance.getEntriesByType('paint')
    const layoutShiftEntries = performance.getEntriesByType('layout-shift') as PerformanceEntry[]

    // Calculate Core Web Vitals
    const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
    const largestContentfulPaint = paintEntries.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0
    
    // Calculate Cumulative Layout Shift
    const cumulativeLayoutShift = layoutShiftEntries.reduce((sum, entry) => {
      const layoutShiftEntry = entry as any
      return sum + (layoutShiftEntry.value || 0)
    }, 0)

    // Estimate First Input Delay (simplified)
    const firstInputDelay = 0 // Would need more complex implementation

    // Estimate Time to Interactive (simplified)
    const timeToInteractive = navigation.domContentLoadedEventEnd - navigation.fetchStart

    // Memory usage (if available)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize

    return {
      pageLoadTime,
      firstContentfulPaint,
      largestContentfulPaint,
      cumulativeLayoutShift,
      firstInputDelay,
      timeToInteractive,
      memoryUsage
    }
  }, [])

  const checkThresholds = useCallback((metrics: PerformanceMetrics) => {
    const newAlerts: string[] = []

    if (metrics.pageLoadTime > finalThresholds.pageLoadTime) {
      newAlerts.push(`Page load time (${metrics.pageLoadTime.toFixed(0)}ms) exceeds threshold (${finalThresholds.pageLoadTime}ms)`)
    }

    if (metrics.firstContentfulPaint > finalThresholds.firstContentfulPaint) {
      newAlerts.push(`First Contentful Paint (${metrics.firstContentfulPaint.toFixed(0)}ms) exceeds threshold (${finalThresholds.firstContentfulPaint}ms)`)
    }

    if (metrics.largestContentfulPaint > finalThresholds.largestContentfulPaint) {
      newAlerts.push(`Largest Contentful Paint (${metrics.largestContentfulPaint.toFixed(0)}ms) exceeds threshold (${finalThresholds.largestContentfulPaint}ms)`)
    }

    if (metrics.cumulativeLayoutShift > finalThresholds.cumulativeLayoutShift) {
      newAlerts.push(`Cumulative Layout Shift (${metrics.cumulativeLayoutShift.toFixed(3)}) exceeds threshold (${finalThresholds.cumulativeLayoutShift})`)
    }

    if (metrics.firstInputDelay > finalThresholds.firstInputDelay) {
      newAlerts.push(`First Input Delay (${metrics.firstInputDelay.toFixed(0)}ms) exceeds threshold (${finalThresholds.firstInputDelay}ms)`)
    }

    if (metrics.timeToInteractive > finalThresholds.timeToInteractive) {
      newAlerts.push(`Time to Interactive (${metrics.timeToInteractive.toFixed(0)}ms) exceeds threshold (${finalThresholds.timeToInteractive}ms)`)
    }

    setAlerts(newAlerts)
  }, [finalThresholds])

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    // Collect initial metrics
    const initialMetrics = collectMetrics()
    if (initialMetrics) {
      setMetrics(initialMetrics)
      checkThresholds(initialMetrics)
    }

    // Set up periodic monitoring
    const interval = setInterval(() => {
      const currentMetrics = collectMetrics()
      if (currentMetrics) {
        setMetrics(currentMetrics)
        checkThresholds(currentMetrics)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [collectMetrics, checkThresholds])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  const getPerformanceScore = useCallback((metrics: PerformanceMetrics): number => {
    let score = 100

    // Deduct points for each threshold violation
    if (metrics.pageLoadTime > finalThresholds.pageLoadTime) {
      score -= Math.min(20, (metrics.pageLoadTime - finalThresholds.pageLoadTime) / 100)
    }

    if (metrics.firstContentfulPaint > finalThresholds.firstContentfulPaint) {
      score -= Math.min(20, (metrics.firstContentfulPaint - finalThresholds.firstContentfulPaint) / 100)
    }

    if (metrics.largestContentfulPaint > finalThresholds.largestContentfulPaint) {
      score -= Math.min(20, (metrics.largestContentfulPaint - finalThresholds.largestContentfulPaint) / 100)
    }

    if (metrics.cumulativeLayoutShift > finalThresholds.cumulativeLayoutShift) {
      score -= Math.min(20, (metrics.cumulativeLayoutShift - finalThresholds.cumulativeLayoutShift) * 100)
    }

    return Math.max(0, Math.round(score))
  }, [finalThresholds])

  const getPerformanceGrade = useCallback((score: number): string => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }, [])

  // Auto-start monitoring on mount
  useEffect(() => {
    const cleanup = startMonitoring()
    return cleanup
  }, [startMonitoring])

  return {
    metrics,
    isMonitoring,
    alerts,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore,
    getPerformanceGrade,
    thresholds: finalThresholds
  }
}
