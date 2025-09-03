import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAppStore } from '../lib/store'
import { EmergencyRequest } from '../lib/database'
import { ServiceProvider, Location } from '../types'
import { generateId } from '../lib/utils'

export function useEmergencyRequests() {
  const [loading, setLoading] = useState(false)
  const { 
    user, 
    userRequests, 
    nearbyProviders,
    setCurrentRequest, 
    setUserRequests, 
    setNearbyProviders 
  } = useAppStore()

  const createRequest = async (requestData: Partial<EmergencyRequest>) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const newRequest: any = {
        id: generateId(),
        userId: user.id,
        userInfo: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          phone: user.phone || '',
          email: user.email || ''
        },
        location: requestData.location || { lat: 0, lng: 0, address: '' },
        vehicleInfo: {
          type: (requestData as any).vehicleType || 'car',
          model: (requestData as any).vehicleModel || '',
          batteryLevel: (requestData as any).batteryLevel || 0
        },
        requestType: 'charging' as const,
        priority: (requestData as any).urgency || 'medium',
        status: (requestData as any).status || 'pending',
        notes: (requestData as any).description || '',
        images: [],
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'emergency_requests'), newRequest)
      const createdRequest = { ...newRequest, id: docRef.id }
      
      setCurrentRequest(createdRequest)
      return createdRequest
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: string, updates?: Partial<EmergencyRequest>) => {
    setLoading(true)
    try {
      const requestRef = doc(db, 'emergency_requests', requestId)
      await updateDoc(requestRef, {
        status,
        updatedAt: new Date(),
        ...updates
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getNearbyProviders = async (location: Location, radius: number = 50) => {
    try {
      const providersRef = collection(db, 'service_providers')
      const providersSnapshot = await getDocs(providersRef)
      
      const providers: ServiceProvider[] = []
      providersSnapshot.forEach(doc => {
        const provider = doc.data() as ServiceProvider
        const distance = calculateDistance(
          location.lat,
          location.lng,
          provider.currentLocation.lat,
          provider.currentLocation.lng
        )
        
        if (distance <= radius) {
          providers.push({
            ...provider,
            distance: Math.round(distance * 10) / 10
          })
        }
      })
      
      // Sort by distance
      providers.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      setNearbyProviders(providers)
      return providers
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error fetching nearby providers:', errorMessage)
      return []
    }
  }

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Listen to user's emergency requests
  useEffect(() => {
    if (!user) return

    const requestsRef = collection(db, 'emergency_requests')
    const userRequestsQuery = query(
      requestsRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(userRequestsQuery, (snapshot) => {
      const requests: EmergencyRequest[] = []
      snapshot.forEach(doc => {
        requests.push({ ...doc.data(), id: doc.id } as EmergencyRequest)
      })
      setUserRequests(requests)
    })

    return () => unsubscribe()
  }, [user, setUserRequests])

  return {
    loading,
    userRequests,
    nearbyProviders,
    createRequest,
    updateRequestStatus,
    getNearbyProviders
  }
}
