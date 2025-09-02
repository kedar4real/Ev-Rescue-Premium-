import { DatabaseService } from './database'

export interface Geofence {
  id: string
  name: string
  type: 'service_area' | 'restricted_zone' | 'premium_zone' | 'charging_hub'
  center: {
    lat: number
    lng: number
  }
  radius: number // in meters
  properties: {
    serviceAvailable: boolean
    premiumPricing: boolean
    restrictions: string[]
    operatingHours?: {
      open: string
      close: string
      timezone: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface LocationEvent {
  userId: string
  location: {
    lat: number
    lng: number
    accuracy: number
    timestamp: Date
  }
  geofences: {
    entered: Geofence[]
    exited: Geofence[]
    current: Geofence[]
  }
}

class GeofencingService {
  private geofences: Geofence[] = []
  private userLocations: Map<string, { lat: number; lng: number; timestamp: Date }> = new Map()
  private locationWatchers: Map<string, number> = new Map()

  // Initialize geofences
  async initializeGeofences() {
    try {
      // Load predefined service areas
      this.geofences = [
        {
          id: 'mumbai_central',
          name: 'Mumbai Central',
          type: 'service_area',
          center: { lat: 19.0176, lng: 72.8562 },
          radius: 10000, // 10km
          properties: {
            serviceAvailable: true,
            premiumPricing: false,
            restrictions: [],
            operatingHours: {
              open: '06:00',
              close: '22:00',
              timezone: 'Asia/Kolkata'
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'delhi_ncr',
          name: 'Delhi NCR',
          type: 'service_area',
          center: { lat: 28.6139, lng: 77.2090 },
          radius: 15000, // 15km
          properties: {
            serviceAvailable: true,
            premiumPricing: false,
            restrictions: [],
            operatingHours: {
              open: '05:00',
              close: '23:00',
              timezone: 'Asia/Kolkata'
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'bangalore_tech_park',
          name: 'Bangalore Tech Park',
          type: 'premium_zone',
          center: { lat: 12.9716, lng: 77.5946 },
          radius: 5000, // 5km
          properties: {
            serviceAvailable: true,
            premiumPricing: true,
            restrictions: ['high_traffic'],
            operatingHours: {
              open: '24/7',
              close: '24/7',
              timezone: 'Asia/Kolkata'
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'airport_restricted',
          name: 'Airport Restricted Zone',
          type: 'restricted_zone',
          center: { lat: 19.0896, lng: 72.8656 },
          radius: 2000, // 2km
          properties: {
            serviceAvailable: false,
            premiumPricing: false,
            restrictions: ['security_zone', 'no_emergency_service'],
            operatingHours: {
              open: '00:00',
              close: '23:59',
              timezone: 'Asia/Kolkata'
            }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    } catch (error) {
      console.error('Error initializing geofences:', error)
    }
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Check if location is within geofence
  private isLocationInGeofence(lat: number, lng: number, geofence: Geofence): boolean {
    const distance = this.calculateDistance(lat, lng, geofence.center.lat, geofence.center.lng)
    return distance <= geofence.radius
  }

  // Get geofences for a location
  getGeofencesForLocation(lat: number, lng: number): Geofence[] {
    return this.geofences.filter(geofence => 
      this.isLocationInGeofence(lat, lng, geofence)
    )
  }

  // Check geofence entry/exit
  checkGeofenceEvents(userId: string, newLocation: { lat: number; lng: number; accuracy: number }): LocationEvent {
    const previousLocation = this.userLocations.get(userId)
    const currentGeofences = this.getGeofencesForLocation(newLocation.lat, newLocation.lng)
    
    let enteredGeofences: Geofence[] = []
    let exitedGeofences: Geofence[] = []

    if (previousLocation) {
      const previousGeofences = this.getGeofencesForLocation(previousLocation.lat, previousLocation.lng)
      
      // Find newly entered geofences
      enteredGeofences = currentGeofences.filter(current => 
        !previousGeofences.some(prev => prev.id === current.id)
      )
      
      // Find exited geofences
      exitedGeofences = previousGeofences.filter(prev => 
        !currentGeofences.some(current => current.id === prev.id)
      )
    } else {
      // First location update - all current geofences are "entered"
      enteredGeofences = currentGeofences
    }

    // Update user location
    this.userLocations.set(userId, {
      lat: newLocation.lat,
      lng: newLocation.lng,
      timestamp: new Date()
    })

    const locationEvent: LocationEvent = {
      userId,
      location: {
        ...newLocation,
        timestamp: new Date()
      },
      geofences: {
        entered: enteredGeofences,
        exited: exitedGeofences,
        current: currentGeofences
      }
    }

    // Process geofence events
    this.processGeofenceEvents(locationEvent)

    return locationEvent
  }

  // Process geofence events
  private async processGeofenceEvents(event: LocationEvent) {
    try {
      // Handle entered geofences
      for (const geofence of event.geofences.entered) {
        await this.handleGeofenceEntry(event.userId, geofence)
      }

      // Handle exited geofences
      for (const geofence of event.geofences.exited) {
        await this.handleGeofenceExit(event.userId, geofence)
      }

      // Update user's current service area
      await this.updateUserServiceArea(event.userId, event.geofences.current)

    } catch (error) {
      console.error('Error processing geofence events:', error)
    }
  }

  // Handle geofence entry
  private async handleGeofenceEntry(userId: string, geofence: Geofence) {
    console.log(`User ${userId} entered geofence: ${geofence.name}`)

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: `Entered ${geofence.name}`,
      message: `You've entered the ${geofence.name} service area. ${geofence.properties.serviceAvailable ? 'Emergency services are available here.' : 'Emergency services are not available in this area.'}`,
      isRead: false,
      priority: 'medium',
      data: {
        geofenceId: geofence.id,
        geofenceType: geofence.type,
        serviceAvailable: geofence.properties.serviceAvailable
      }
    })

    // Handle different geofence types
    switch (geofence.type) {
      case 'service_area':
        if (geofence.properties.serviceAvailable) {
          // Enable emergency services
          await this.enableEmergencyServices(userId, geofence)
        }
        break
      
      case 'premium_zone':
        // Apply premium pricing
        await this.applyPremiumPricing(userId, geofence)
        break
      
      case 'restricted_zone':
        // Disable services
        await this.disableServices(userId, geofence)
        break
      
      case 'charging_hub':
        // Show charging station information
        await this.showChargingHubInfo(userId, geofence)
        break
    }
  }

  // Handle geofence exit
  private async handleGeofenceExit(userId: string, geofence: Geofence) {
    console.log(`User ${userId} exited geofence: ${geofence.name}`)

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: `Left ${geofence.name}`,
      message: `You've left the ${geofence.name} area.`,
      isRead: false,
      priority: 'low',
      data: {
        geofenceId: geofence.id,
        geofenceType: geofence.type
      }
    })

    // Handle different geofence types
    switch (geofence.type) {
      case 'premium_zone':
        // Remove premium pricing
        await this.removePremiumPricing(userId, geofence)
        break
      
      case 'restricted_zone':
        // Re-enable services
        await this.enableServices(userId, geofence)
        break
    }
  }

  // Update user's current service area
  private async updateUserServiceArea(userId: string, currentGeofences: Geofence[]) {
    const serviceArea = currentGeofences.find(g => g.type === 'service_area')
    
    if (serviceArea) {
      // Update user's current service area in database
      await DatabaseService.updateUser(userId, {
        currentLocation: {
          lat: 0, // Will be updated by location service
          lng: 0,
          address: serviceArea.name,
          lastUpdated: new Date() as any
        }
      })
    }
  }

  // Enable emergency services
  private async enableEmergencyServices(userId: string, geofence: Geofence) {
    // Update user's service availability
    await DatabaseService.updateUser(userId, {
      preferences: {
        notifications: true,
        locationTracking: true,
        emergencyContacts: []
      }
    })
  }

  // Apply premium pricing
  private async applyPremiumPricing(userId: string, geofence: Geofence) {
    // This would typically update pricing in the user's session
    // For now, we'll create a notification
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: 'Premium Zone Pricing',
      message: 'You are now in a premium service zone. Emergency services may have additional charges.',
      isRead: false,
      priority: 'medium'
    })
  }

  // Disable services
  private async disableServices(userId: string, geofence: Geofence) {
    await DatabaseService.createNotification({
      userId,
      type: 'emergency',
      title: 'Service Unavailable',
      message: `Emergency services are not available in ${geofence.name}. Please move to a service area.`,
      isRead: false,
      priority: 'high'
    })
  }

  // Show charging hub info
  private async showChargingHubInfo(userId: string, geofence: Geofence) {
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: 'Charging Hub Nearby',
      message: `You're near ${geofence.name} charging hub. Multiple charging stations available.`,
      isRead: false,
      priority: 'medium'
    })
  }

  // Remove premium pricing
  private async removePremiumPricing(userId: string, geofence: Geofence) {
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: 'Standard Pricing',
      message: 'You have left the premium zone. Standard pricing now applies.',
      isRead: false,
      priority: 'low'
    })
  }

  // Enable services
  private async enableServices(userId: string, geofence: Geofence) {
    await DatabaseService.createNotification({
      userId,
      type: 'system',
      title: 'Services Available',
      message: 'Emergency services are now available in your area.',
      isRead: false,
      priority: 'medium'
    })
  }

  // Start location tracking for user
  startLocationTracking(userId: string) {
    if (this.locationWatchers.has(userId)) {
      return // Already tracking
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        }

        this.checkGeofenceEvents(userId, location)
      },
      (error) => {
        console.error('Location tracking error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )

    this.locationWatchers.set(userId, watchId)
  }

  // Stop location tracking for user
  stopLocationTracking(userId: string) {
    const watchId = this.locationWatchers.get(userId)
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      this.locationWatchers.delete(userId)
    }
  }

  // Get service availability for location
  getServiceAvailability(lat: number, lng: number): {
    available: boolean
    geofences: Geofence[]
    restrictions: string[]
    pricing: 'standard' | 'premium'
  } {
    const geofences = this.getGeofencesForLocation(lat, lng)
    const serviceArea = geofences.find(g => g.type === 'service_area')
    const restrictedZone = geofences.find(g => g.type === 'restricted_zone')
    const premiumZone = geofences.find(g => g.type === 'premium_zone')

    const available = serviceArea?.properties.serviceAvailable && !restrictedZone
    const restrictions = geofences.flatMap(g => g.properties.restrictions)
    const pricing = premiumZone ? 'premium' : 'standard'

    return {
      available,
      geofences,
      restrictions,
      pricing
    }
  }

  // Get all geofences
  getAllGeofences(): Geofence[] {
    return this.geofences
  }

  // Add custom geofence
  addGeofence(geofence: Omit<Geofence, 'id' | 'createdAt' | 'updatedAt'>): Geofence {
    const newGeofence: Geofence = {
      ...geofence,
      id: `geofence_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.geofences.push(newGeofence)
    return newGeofence
  }
}

// Create singleton instance
export const geofencingService = new GeofencingService()

// Initialize geofences when module loads
geofencingService.initializeGeofences()

export default geofencingService
