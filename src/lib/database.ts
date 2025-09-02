import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Global notification creation counter for debugging
let notificationCreationCount = 0

// Override the original addDoc function to intercept notification creation
const originalAddDoc = addDoc
const interceptedAddDoc = async (collectionRef: any, data: any) => {
  // Check if this is a notification collection
  if (collectionRef.path && collectionRef.path.includes('notifications')) {
    console.error('🚨 DIRECT NOTIFICATION CREATION DETECTED!', {
      path: collectionRef.path,
      data: data,
      stackTrace: new Error().stack
    })
    
    // Validate the data before proceeding
    if (!data.userId) {
      throw new Error('Direct notification creation blocked: userId is required')
    }
    if (typeof data.userId !== 'string' || data.userId.trim() === '') {
      throw new Error('Direct notification creation blocked: userId must be a non-empty string')
    }
  }
  
  return originalAddDoc(collectionRef, data)
}

// Replace the addDoc import with our intercepted version
const addDoc = interceptedAddDoc

// Database Collections
export const COLLECTIONS = {
  USERS: 'users',
  EMERGENCY_REQUESTS: 'emergencyRequests',
  FLEET_VEHICLES: 'fleetVehicles',
  CHARGING_STATIONS: 'chargingStations',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  SUBSCRIPTIONS: 'subscriptions',
  SERVICE_HISTORY: 'serviceHistory',
  CHAT_MESSAGES: 'chatMessages',
  SUPPORT_TICKETS: 'supportTickets'
} as const

// Type Definitions
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'user' | 'provider' | 'admin'
  vehicleType: 'car' | 'motorcycle' | 'scooter' | 'truck'
  vehicleModel: string
  vehicleYear: number
  batteryCapacity: number
  currentLocation: {
    lat: number
    lng: number
    address: string
    lastUpdated: Timestamp
  }
  isProvider: boolean
  rating: number
  totalRescues: number
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'inactive' | 'cancelled'
    startDate: Timestamp
    endDate: Timestamp
    requestsUsed: number
    requestsLimit: number
  }
  preferences: {
    notifications: boolean
    locationTracking: boolean
    emergencyContacts: string[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface EmergencyRequest {
  id: string
  userId: string
  userInfo: {
    name: string
    phone: string
    email: string
  }
  location: {
    lat: number
    lng: number
    address: string
  }
  vehicleInfo: {
    type: string
    model: string
    batteryLevel: number
  }
  requestType: 'charging' | 'towing' | 'jump_start' | 'tire_change' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assignedProvider?: {
    id: string
    name: string
    phone: string
    vehicleId: string
  }
  estimatedArrival?: Timestamp
  actualArrival?: Timestamp
  completionTime?: Timestamp
  notes: string
  images: string[]
  cost: number
  rating?: number
  feedback?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface FleetVehicle {
  id: string
  name: string
  type: 'mobile_charger' | 'tow_truck' | 'service_van'
  status: 'available' | 'busy' | 'maintenance' | 'offline'
  location: {
    lat: number
    lng: number
    address: string
    lastUpdated: Timestamp
  }
  driver: {
    id: string
    name: string
    phone: string
    license: string
  }
  equipment: {
    chargingCapacity: number
    batteryLevel: number
    tools: string[]
  }
  currentRequest?: string
  totalServices: number
  rating: number
  lastMaintenance: Timestamp
  nextMaintenance: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ChargingStation {
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  operator: string
  connectors: {
    type: 'CCS' | 'CHAdeMO' | 'Type2' | 'Tesla'
    power: number
    status: 'available' | 'occupied' | 'out_of_order'
  }[]
  pricing: {
    perKwh: number
    perMinute: number
    parkingFee: number
  }
  amenities: string[]
  rating: number
  totalReviews: number
  isVerified: boolean
  lastUpdated: Timestamp
}

export interface Notification {
  id: string
  userId: string
  type: 'emergency' | 'service_update' | 'payment' | 'promotion' | 'system'
  title: string
  message: string
  data?: any
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Timestamp
  expiresAt?: Timestamp
}

export interface Analytics {
  id: string
  date: string
  metrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalRequests: number
    completedRequests: number
    averageResponseTime: number
    revenue: number
    fleetUtilization: number
    userSatisfaction: number
  }
  breakdown: {
    requestTypes: Record<string, number>
    userSegments: Record<string, number>
    geographic: Record<string, number>
    timeOfDay: Record<string, number>
  }
  createdAt: Timestamp
}

// Database Helper Functions
export class DatabaseService {
  // User Operations
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  }

  static async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } as User : null
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    const q = query(collection(db, COLLECTIONS.USERS), where('role', '==', role))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
  }

  // Emergency Request Operations
  static async createEmergencyRequest(requestData: Omit<EmergencyRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.EMERGENCY_REQUESTS), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  }

  static async updateEmergencyRequest(requestId: string, updates: Partial<EmergencyRequest>): Promise<void> {
    const requestRef = doc(db, COLLECTIONS.EMERGENCY_REQUESTS, requestId)
    await updateDoc(requestRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  }

  static async getEmergencyRequests(userId?: string): Promise<EmergencyRequest[]> {
    let q = query(collection(db, COLLECTIONS.EMERGENCY_REQUESTS), orderBy('createdAt', 'desc'))
    
    if (userId) {
      q = query(collection(db, COLLECTIONS.EMERGENCY_REQUESTS), where('userId', '==', userId), orderBy('createdAt', 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest))
  }

  static async getActiveEmergencyRequests(): Promise<EmergencyRequest[]> {
    const q = query(
      collection(db, COLLECTIONS.EMERGENCY_REQUESTS), 
      where('status', 'in', ['pending', 'assigned', 'in_progress']),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest))
  }

  // Fleet Vehicle Operations
  static async getFleetVehicles(): Promise<FleetVehicle[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.FLEET_VEHICLES))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FleetVehicle))
  }

  static async updateFleetVehicle(vehicleId: string, updates: Partial<FleetVehicle>): Promise<void> {
    const vehicleRef = doc(db, COLLECTIONS.FLEET_VEHICLES, vehicleId)
    await updateDoc(vehicleRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  }

  // Charging Station Operations
  static async getChargingStations(): Promise<ChargingStation[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CHARGING_STATIONS))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChargingStation))
  }

  static async getNearbyChargingStations(lat: number, lng: number, radius: number = 10): Promise<ChargingStation[]> {
    // Note: This is a simplified version. For production, use GeoFirestore for proper geospatial queries
    const stations = await this.getChargingStations()
    return stations.filter(station => {
      const distance = this.calculateDistance(lat, lng, station.location.lat, station.location.lng)
      return distance <= radius
    })
  }

  // Notification Operations
  static async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    notificationCreationCount++
    const creationId = notificationCreationCount
    
    // Log the incoming data for debugging
    console.log(`[${creationId}] Creating notification with data:`, {
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      stackTrace: new Error().stack
    })

    // Validate required fields
    if (!notificationData.userId) {
      console.error(`[${creationId}] Notification creation failed: userId is undefined`, notificationData)
      throw new Error('userId is required for notification creation')
    }
    if (typeof notificationData.userId !== 'string' || notificationData.userId.trim() === '') {
      console.error(`[${creationId}] Notification creation failed: userId is invalid`, notificationData)
      throw new Error('userId must be a non-empty string')
    }
    if (!notificationData.type) {
      console.error(`[${creationId}] Notification creation failed: type is undefined`, notificationData)
      throw new Error('type is required for notification creation')
    }
    if (!notificationData.title) {
      console.error(`[${creationId}] Notification creation failed: title is undefined`, notificationData)
      throw new Error('title is required for notification creation')
    }
    if (!notificationData.message) {
      console.error(`[${creationId}] Notification creation failed: message is undefined`, notificationData)
      throw new Error('message is required for notification creation')
    }

    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        ...notificationData,
        createdAt: serverTimestamp()
      })
      console.log(`[${creationId}] Notification created successfully with ID:`, docRef.id)
      return docRef.id
    } catch (error) {
      console.error(`[${creationId}] Error creating notification:`, error, 'Data:', notificationData)
      throw error
    }
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification))
  }

  // Analytics Operations
  static async getAnalytics(dateRange: { start: Date, end: Date }): Promise<Analytics[]> {
    const q = query(
      collection(db, COLLECTIONS.ANALYTICS),
      where('date', '>=', dateRange.start.toISOString().split('T')[0]),
      where('date', '<=', dateRange.end.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Analytics))
  }

  // Real-time Listeners
  static subscribeToEmergencyRequests(callback: (requests: EmergencyRequest[]) => void): () => void {
    const q = query(collection(db, COLLECTIONS.EMERGENCY_REQUESTS), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyRequest))
      callback(requests)
    })
  }

  static subscribeToFleetVehicles(callback: (vehicles: FleetVehicle[]) => void): () => void {
    return onSnapshot(collection(db, COLLECTIONS.FLEET_VEHICLES), (querySnapshot) => {
      const vehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FleetVehicle))
      callback(vehicles)
    })
  }

  static subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification))
      callback(notifications)
    })
  }

  // Utility Functions
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}

export default DatabaseService
