'use client'

import { useState, useEffect, useCallback } from 'react'

interface RealTimeData {
  timestamp: number
  value: number
  change: number
}

interface UseRealTimeDataOptions {
  interval?: number
  maxDataPoints?: number
  initialValue?: number
  volatility?: number
}

export function useRealTimeData(options: UseRealTimeDataOptions = {}) {
  const {
    interval = 5000,
    maxDataPoints = 20,
    initialValue = 100,
    volatility = 0.1
  } = options

  const [data, setData] = useState<RealTimeData[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const generateNewValue = useCallback((previousValue: number): number => {
    const change = (Math.random() - 0.5) * volatility * previousValue
    return Math.max(0, previousValue + change)
  }, [volatility])

  const updateData = useCallback(() => {
    setData(prevData => {
      const lastValue = prevData.length > 0 ? prevData[prevData.length - 1].value : initialValue
      const newValue = generateNewValue(lastValue)
      const change = prevData.length > 0 
        ? ((newValue - lastValue) / lastValue) * 100 
        : 0

      const newDataPoint: RealTimeData = {
        timestamp: Date.now(),
        value: newValue,
        change
      }

      const updatedData = [...prevData, newDataPoint]
      
      // Keep only the last maxDataPoints
      if (updatedData.length > maxDataPoints) {
        return updatedData.slice(-maxDataPoints)
      }
      
      return updatedData
    })
    
    setLastUpdate(new Date())
  }, [generateNewValue, initialValue, maxDataPoints])

  useEffect(() => {
    if (!isConnected) return

    const intervalId = setInterval(updateData, interval)
    
    // Initial data point
    updateData()

    return () => clearInterval(intervalId)
  }, [isConnected, interval, updateData])

  const toggleConnection = useCallback(() => {
    setIsConnected(prev => !prev)
  }, [])

  const resetData = useCallback(() => {
    setData([])
    setLastUpdate(new Date())
  }, [])

  const getCurrentValue = useCallback(() => {
    return data.length > 0 ? data[data.length - 1].value : initialValue
  }, [data, initialValue])

  const getCurrentChange = useCallback(() => {
    return data.length > 0 ? data[data.length - 1].change : 0
  }, [data])

  const getAverageValue = useCallback(() => {
    if (data.length === 0) return initialValue
    const sum = data.reduce((acc, point) => acc + point.value, 0)
    return sum / data.length
  }, [data, initialValue])

  const getMinValue = useCallback(() => {
    if (data.length === 0) return initialValue
    return Math.min(...data.map(point => point.value))
  }, [data, initialValue])

  const getMaxValue = useCallback(() => {
    if (data.length === 0) return initialValue
    return Math.max(...data.map(point => point.value))
  }, [data, initialValue])

  return {
    data,
    isConnected,
    lastUpdate,
    toggleConnection,
    resetData,
    getCurrentValue,
    getCurrentChange,
    getAverageValue,
    getMinValue,
    getMaxValue
  }
}

// Specialized hooks for different data types
export function useRealTimeFleetData() {
  return useRealTimeData({
    interval: 3000,
    maxDataPoints: 15,
    initialValue: 12,
    volatility: 0.05
  })
}

export function useRealTimeChargingData() {
  return useRealTimeData({
    interval: 2000,
    maxDataPoints: 20,
    initialValue: 85,
    volatility: 0.08
  })
}

export function useRealTimeEmergencyData() {
  return useRealTimeData({
    interval: 10000,
    maxDataPoints: 10,
    initialValue: 3,
    volatility: 0.15
  })
}

export function useRealTimeRevenueData() {
  return useRealTimeData({
    interval: 5000,
    maxDataPoints: 12,
    initialValue: 2500,
    volatility: 0.12
  })
}