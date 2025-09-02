'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  MapPinIcon as MapPin,
  MapIcon as Navigation,
  BoltIcon as Zap,
  ClockIcon as Clock,
  StarIcon as Star,
  FunnelIcon as Filter,
  ArrowPathIcon as RefreshCw,
  Squares2X2Icon as Layers,
  Cog6ToothIcon as Settings
} from '@heroicons/react/24/outline'
import { geofencingService } from '../lib/geofencing'
import { DatabaseService, type ChargingStation } from '../lib/database'
import { analytics } from '../lib/analytics'

interface MapProps {
  stations: ChargingStation[]
  userLocation?: { lat: number; lng: number } | null
  onStationSelect?: (station: ChargingStation) => void
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
  showGeofences?: boolean
  showUserLocation?: boolean
}

export function EnhancedMap({ 
  stations, 
  userLocation, 
  onStationSelect, 
  onLocationUpdate,
  showGeofences = true,
  showUserLocation = true
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null)
  const [mapLayers, setMapLayers] = useState({
    stations: true,
    geofences: false,
    traffic: false
  })
  const [filterOptions, setFilterOptions] = useState({
    available: true,
    fastCharging: false,
    verified: false
  })
  const [userMarker, setUserMarker] = useState<any>(null)
  const [stationMarkers, setStationMarkers] = useState<any[]>([])
  const [geofenceLayers, setGeofenceLayers] = useState<any[]>([])

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || mapInstance) return

      try {
        const L = await import('leaflet')
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // Initialize map with user location or default
        const center = userLocation || { lat: 19.0176, lng: 72.8562 } // Mumbai default
        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true
        }).setView([center.lat, center.lng], 13)

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        // Add user location marker
        if (userLocation && showUserLocation) {
          const marker = L.marker([userLocation.lat, userLocation.lng], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })
          }).addTo(map)

          marker.bindPopup(`
            <div class="text-center">
              <h3 class="font-semibold text-green-600">Your Location</h3>
              <p class="text-sm text-gray-600">Current position</p>
            </div>
          `)

          setUserMarker(marker)
        }

        setMapInstance(map)
        setIsMapLoaded(true)

        // Track map initialization
        analytics.trackFeatureUsed('map_initialized', {
          userLocation: !!userLocation,
          stationCount: stations.length
        })

      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    initializeMap()
  }, [mapRef, mapInstance, userLocation, showUserLocation, stations.length])

  // Update user location
  useEffect(() => {
    if (mapInstance && userLocation && userMarker) {
      userMarker.setLatLng([userLocation.lat, userLocation.lng])
      mapInstance.setView([userLocation.lat, userLocation.lng], mapInstance.getZoom())
    }
  }, [mapInstance, userLocation, userMarker])

  // Add charging station markers
  useEffect(() => {
    if (!mapInstance || !isMapLoaded) return

    const L = require('leaflet')
    
    // Clear existing markers
    stationMarkers.forEach(marker => mapInstance.removeLayer(marker))
    const newMarkers: any[] = []

    // Filter stations based on options
    const filteredStations = stations.filter(station => {
      if (filterOptions.available && !station.connectors.some(c => c.status === 'available')) return false
      if (filterOptions.fastCharging && !station.connectors.some(c => c.power >= 50)) return false
      if (filterOptions.verified && !station.isVerified) return false
      return true
    })

    filteredStations.forEach(station => {
      const availableConnectors = station.connectors.filter(c => c.status === 'available').length
      const totalConnectors = station.connectors.length
      const isAvailable = availableConnectors > 0

      // Create custom icon based on availability
      const icon = L.divIcon({
        className: 'charging-station-marker',
        html: `
          <div class="relative">
            <div class="w-8 h-8 ${isAvailable ? 'bg-green-500' : 'bg-red-500'} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 ${isAvailable ? 'bg-green-400' : 'bg-red-400'} rounded-full border border-white"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      const marker = L.marker([station.location.lat, station.location.lng], { icon })
        .addTo(mapInstance)

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900">${station.name}</h3>
            ${station.isVerified ? '<span class="text-blue-500 text-xs">✓ Verified</span>' : ''}
          </div>
          <p class="text-sm text-gray-600 mb-2">${station.location.address}</p>
          <div class="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'} rounded-full"></span>
              ${availableConnectors}/${totalConnectors} available
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              ${station.rating}/5
            </span>
          </div>
          <div class="flex gap-1 mb-2">
            ${station.connectors.map(connector => `
              <span class="px-2 py-1 text-xs rounded ${connector.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${connector.type} ${connector.power}kW
              </span>
            `).join('')}
          </div>
          <div class="text-xs text-gray-500">
            ₹${station.pricing.perKwh}/kWh • ₹${station.pricing.perMinute}/min
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Add click handler
      marker.on('click', () => {
        setSelectedStation(station)
        if (onStationSelect) {
          onStationSelect(station)
        }
        analytics.trackFeatureUsed('station_selected', {
          stationId: station.id,
          stationName: station.name,
          isAvailable: isAvailable
        })
      })

      newMarkers.push(marker)
    })

    setStationMarkers(newMarkers)

  }, [mapInstance, isMapLoaded, stations, filterOptions, onStationSelect])

  // Add geofence layers
  useEffect(() => {
    if (!mapInstance || !isMapLoaded || !showGeofences) return

    const L = require('leaflet')
    
    // Clear existing geofence layers
    geofenceLayers.forEach(layer => mapInstance.removeLayer(layer))
    const newLayers: any[] = []

    const geofences = geofencingService.getAllGeofences()
    
    geofences.forEach(geofence => {
      const circle = L.circle([geofence.center.lat, geofence.center.lng], {
        radius: geofence.radius,
        color: getGeofenceColor(geofence.type),
        fillColor: getGeofenceColor(geofence.type),
        fillOpacity: 0.1,
        weight: 2
      }).addTo(mapInstance)

      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold">${geofence.name}</h3>
          <p class="text-sm text-gray-600">${geofence.type.replace('_', ' ')}</p>
          <p class="text-xs text-gray-500">Service: ${geofence.properties.serviceAvailable ? 'Available' : 'Not Available'}</p>
        </div>
      `)

      newLayers.push(circle)
    })

    setGeofenceLayers(newLayers)

  }, [mapInstance, isMapLoaded, showGeofences])

  // Get geofence color based on type
  const getGeofenceColor = (type: string): string => {
    switch (type) {
      case 'service_area': return '#10b981' // green
      case 'premium_zone': return '#f59e0b' // yellow
      case 'restricted_zone': return '#ef4444' // red
      case 'charging_hub': return '#3b82f6' // blue
      default: return '#6b7280' // gray
    }
  }

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        if (onLocationUpdate) {
          onLocationUpdate(location)
        }

        analytics.trackFeatureUsed('location_requested', {
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }, [onLocationUpdate])

  // Toggle map layers
  const toggleLayer = (layer: string) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }))
  }

  // Toggle filter options
  const toggleFilter = (filter: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }))
  }

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Location Button */}
        <Button
          onClick={getCurrentLocation}
          size="sm"
          className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
        >
          <Navigation className="h-4 w-4" />
        </Button>

        {/* Layer Toggle */}
        <Button
          onClick={() => toggleLayer('geofences')}
          size="sm"
          className={`shadow-lg ${mapLayers.geofences ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          <Layers className="h-4 w-4" />
        </Button>

        {/* Refresh Button */}
        <Button
          onClick={() => window.location.reload()}
          size="sm"
          className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterOptions.available}
              onChange={() => toggleFilter('available')}
              className="rounded"
            />
            <span className="text-gray-600">Available only</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterOptions.fastCharging}
              onChange={() => toggleFilter('fastCharging')}
              className="rounded"
            />
            <span className="text-gray-600">Fast charging</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterOptions.verified}
              onChange={() => toggleFilter('verified')}
              className="rounded"
            />
            <span className="text-gray-600">Verified only</span>
          </label>
        </div>
      </div>

      {/* Station Info Panel */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedStation.name}</h3>
              <p className="text-sm text-gray-600">{selectedStation.location.address}</p>
            </div>
            <Button
              onClick={() => setSelectedStation(null)}
              size="sm"
              variant="ghost"
            >
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Rating:</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{selectedStation.rating}/5</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>
              <span>₹{selectedStation.pricing.perKwh}/kWh</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button size="sm" className="flex-1">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Reserve
            </Button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
