// Widget Data Types
export interface FleetVehicle {
  id: string
  name: string
  status: 'available' | 'busy' | 'maintenance' | 'offline'
  batteryLevel: number
  location: string
  lastUpdate: string
  type: 'mobile_charger' | 'tow_truck' | 'service_van'
}

export interface FleetStatusData {
  vehicles: FleetVehicle[]
  totalVehicles: number
  availableVehicles: number
  averageResponseTime: string
}

export interface ChargingStation {
  id: string
  name: string
  location: string
  status: 'available' | 'occupied' | 'maintenance' | 'offline'
  connectorTypes: string[]
  powerOutput: string
  distance: string
  waitTime?: string
  price: string
}

export interface ChargingStationsData {
  stations: ChargingStation[]
  totalStations: number
  availableStations: number
  averageWaitTime: string
}

export interface EmergencyRequest {
  id: string
  customerName: string
  vehicleInfo: {
    type: string
    model: string
    batteryLevel: number
  }
  location: {
    address: string
    coordinates: [number, number]
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  estimatedArrival?: string
  assignedProvider?: string
  notes?: string
}

export interface EmergencyRequestsData {
  requests: EmergencyRequest[]
  totalRequests: number
  activeRequests: number
  averageResponseTime: string
}

export interface RevenueData {
  period: string
  revenue: number
  services: number
  growth: number
}

export interface RevenueChartData {
  currentPeriod: RevenueData
  previousPeriod: RevenueData
  monthlyData: RevenueData[]
  totalRevenue: number
  totalServices: number
  growthRate: number
}

export interface ServiceLocation {
  id: string
  type: 'request' | 'provider' | 'station'
  name: string
  coordinates: [number, number]
  status: 'active' | 'pending' | 'completed' | 'available' | 'busy'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  batteryLevel?: number
  lastUpdate: string
}

export interface ServiceMapData {
  locations: ServiceLocation[]
  totalActive: number
  coverageArea: string
  averageDistance: string
}

// Union type for all widget data
export type WidgetData = 
  | FleetStatusData 
  | ChargingStationsData 
  | EmergencyRequestsData 
  | RevenueChartData 
  | ServiceMapData
  | undefined
