export interface Location {
  lat: number
  lng: number
  address: string
}

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'user' | 'admin' | 'provider'
  vehicleType: 'car' | 'scooter' | 'bike'
  vehicleModel: string
  batteryCapacity: number
  currentLocation: Location
  isProvider: boolean
  rating: number
  totalRescues: number
  createdAt: Date
  updatedAt: Date
}

export interface EmergencyRequest {
  id: string
  userId: string
  location: Location
  vehicleType: 'car' | 'scooter' | 'bike'
  vehicleModel: string
  batteryLevel: number
  description: string
  urgency: 'low' | 'medium' | 'high'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  estimatedArrival: Date | null
  providerId: string | null
  cost: number
}

export interface ServiceProvider {
  id: string
  name: string
  email: string
  phone: string
  currentLocation: Location
  vehicleTypes: string[]
  rating: number
  totalRescues: number
  isAvailable: boolean
  distance?: number
  createdAt: Date
  updatedAt: Date
}

export interface Charger {
  id: string
  type: string
  power: number
  connector: string
  isAvailable: boolean
  location: Location
}

export interface Payment {
  id: string
  userId: string
  requestId: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  method: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: Date
}

export interface ChatMessage {
  id: string
  requestId: string
  senderId: string
  message: string
  timestamp: Date
}

export interface Analytics {
  totalRequests: number
  completedRequests: number
  averageResponseTime: number
  totalRevenue: number
  userSatisfaction: number
}
