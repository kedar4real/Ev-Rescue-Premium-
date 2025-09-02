'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  MapPin, 
  Truck, 
  Bike, 
  Car, 
  Navigation, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  Zap,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { notify } from './ui/notification'

interface FleetVehicle {
  id: string
  type: 'van' | 'scooter' | 'mobile-unit' | 'emergency-vehicle'
  name: string
  driver: string
  phone: string
  status: 'available' | 'busy' | 'maintenance' | 'offline'
  currentLocation: {
    lat: number
    lng: number
    address: string
    timestamp: Date
  }
  destination?: {
    lat: number
    lng: number
    address: string
    eta: number
  }
  batteryLevel: number
  fuelLevel: number
  currentTask?: {
    id: string
    type: 'emergency' | 'charging' | 'maintenance' | 'delivery'
    priority: 'low' | 'medium' | 'high' | 'critical'
    description: string
    customerName: string
    estimatedDuration: number
  }
  lastUpdate: Date
  speed: number
  heading: number
}

interface FleetMapProps {
  onVehicleSelect?: (vehicle: FleetVehicle) => void
  showControls?: boolean
  className?: string
}

export function FleetMap({ onVehicleSelect, showControls = true, className = '' }: FleetMapProps) {
  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOffline, setShowOffline] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Mock fleet data - in real app, this would come from API
  const mockFleetData: FleetVehicle[] = [
    {
      id: 'van-001',
      type: 'van',
      name: 'Service Van Alpha',
      driver: 'John Smith',
      phone: '+1-555-0101',
      status: 'busy',
      currentLocation: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY',
        timestamp: new Date()
      },
      destination: {
        lat: 40.7140,
        lng: -74.0065,
        address: '456 Oak Ave, New York, NY',
        eta: 15
      },
      batteryLevel: 85,
      fuelLevel: 70,
      currentTask: {
        id: 'task-001',
        type: 'emergency',
        priority: 'high',
        description: 'Battery replacement for Tesla Model 3',
        customerName: 'Sarah Johnson',
        estimatedDuration: 45
      },
      lastUpdate: new Date(),
      speed: 25,
      heading: 45
    },
    {
      id: 'scooter-001',
      type: 'scooter',
      name: 'Quick Response Scooter',
      driver: 'Mike Chen',
      phone: '+1-555-0102',
      status: 'available',
      currentLocation: {
        lat: 40.7130,
        lng: -74.0062,
        address: '789 Pine St, New York, NY',
        timestamp: new Date()
      },
      batteryLevel: 95,
      fuelLevel: 100,
      lastUpdate: new Date(),
      speed: 0,
      heading: 0
    },
    {
      id: 'mobile-001',
      type: 'mobile-unit',
      name: 'Mobile Charging Unit',
      driver: 'Lisa Rodriguez',
      phone: '+1-555-0103',
      status: 'busy',
      currentLocation: {
        lat: 40.7135,
        lng: -74.0068,
        address: '321 Elm St, New York, NY',
        timestamp: new Date()
      },
      destination: {
        lat: 40.7145,
        lng: -74.0070,
        address: '654 Maple St, New York, NY',
        eta: 8
      },
      batteryLevel: 60,
      fuelLevel: 80,
      currentTask: {
        id: 'task-002',
        type: 'charging',
        priority: 'medium',
        description: 'Mobile charging for stranded EV',
        customerName: 'David Wilson',
        estimatedDuration: 30
      },
      lastUpdate: new Date(),
      speed: 18,
      heading: 90
    },
    {
      id: 'emergency-001',
      type: 'emergency-vehicle',
      name: 'Emergency Response Unit',
      driver: 'Alex Thompson',
      phone: '+1-555-0104',
      status: 'busy',
      currentLocation: {
        lat: 40.7125,
        lng: -74.0055,
        address: '147 Oak St, New York, NY',
        timestamp: new Date()
      },
      destination: {
        lat: 40.7138,
        lng: -74.0062,
        address: '258 Pine St, New York, NY',
        eta: 5
      },
      batteryLevel: 90,
      fuelLevel: 95,
      currentTask: {
        id: 'task-003',
        type: 'emergency',
        priority: 'critical',
        description: 'Accident response - EV collision',
        customerName: 'Emergency Call',
        estimatedDuration: 60
      },
      lastUpdate: new Date(),
      speed: 35,
      heading: 135
    }
  ]

  useEffect(() => {
    // Initialize fleet data
    setVehicles(mockFleetData)
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (autoRefresh) {
        updateVehiclePositions()
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const updateVehiclePositions = () => {
    setVehicles(prevVehicles => 
      prevVehicles.map(vehicle => {
        if (vehicle.status === 'busy' && vehicle.destination) {
          // Simulate movement towards destination
          const progress = Math.min(0.1, 1) // Move 10% towards destination
          const newLat = vehicle.currentLocation.lat + (vehicle.destination.lat - vehicle.currentLocation.lat) * progress
          const newLng = vehicle.currentLocation.lng + (vehicle.destination.lng - vehicle.currentLocation.lng) * progress
          
          return {
            ...vehicle,
            currentLocation: {
              ...vehicle.currentLocation,
              lat: newLat,
              lng: newLng,
              timestamp: new Date()
            },
            lastUpdate: new Date()
          }
        }
        return vehicle
      })
    )
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'van': return Truck
      case 'scooter': return Bike
      case 'mobile-unit': return Car
      case 'emergency-vehicle': return AlertTriangle
      default: return Car
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-green-400'
      case 'maintenance': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesType = filterType === 'all' || vehicle.type === filterType
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOffline = showOffline || vehicle.status !== 'offline'
    
    return matchesType && matchesStatus && matchesSearch && matchesOffline
  })

  const handleVehicleSelect = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle)
    onVehicleSelect?.(vehicle)
  }

  const handleContactDriver = (vehicle: FleetVehicle) => {
    notify.success('Contact Initiated', `Connecting you with ${vehicle.driver}`)
    // In real app, this would initiate a call or chat
  }

  const handleTrackVehicle = (vehicle: FleetVehicle) => {
    notify.success('Tracking Started', `Now tracking ${vehicle.name}`)
    // In real app, this would focus the map on the vehicle
  }

  const refreshFleetData = () => {
    setIsLoading(true)
    setTimeout(() => {
      updateVehiclePositions()
      setIsLoading(false)
      notify.success('Fleet Updated', 'Fleet positions have been refreshed')
    }, 1000)
  }

  return (
    <div className={`space-y-6 ${className}`}>
             {/* Controls */}
       {showControls && (
         <Card className="bg-gray-900 border-gray-700">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-white">
               <MapPin className="h-6 w-6 text-green-500" />
               Fleet Control Center
             </CardTitle>
           </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles or drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-gray-700/50 border-gray-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="van">Vans</SelectItem>
                  <SelectItem value="scooter">Scooters</SelectItem>
                  <SelectItem value="mobile-unit">Mobile Units</SelectItem>
                  <SelectItem value="emergency-vehicle">Emergency Vehicles</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Toggle Controls */}
            <div className="flex items-center gap-4">
                             <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowOffline(!showOffline)}
                 className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${showOffline ? 'bg-green-500 text-black' : ''}`}
               >
                 {showOffline ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                 {showOffline ? 'Hide Offline' : 'Show Offline'}
               </Button>
               
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setAutoRefresh(!autoRefresh)}
                 className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${autoRefresh ? 'bg-green-500 text-black' : ''}`}
               >
                 <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                 Auto Refresh
               </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFleetData}
                disabled={isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

             {/* Fleet Overview */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card className="bg-gray-900 border-gray-700">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-gray-400">Total Vehicles</p>
                 <p className="text-2xl font-bold text-white">{vehicles.length}</p>
               </div>
               <Truck className="h-8 w-8 text-green-500" />
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gray-900 border-gray-700">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-gray-400">Available</p>
                 <p className="text-2xl font-bold text-green-500">
                   {vehicles.filter(v => v.status === 'available').length}
                 </p>
               </div>
               <CheckCircle className="h-8 w-8 text-green-500" />
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gray-900 border-gray-700">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-gray-400">Busy</p>
                 <p className="text-2xl font-bold text-green-400">
                   {vehicles.filter(v => v.status === 'busy').length}
                 </p>
               </div>
               <Clock className="h-8 w-8 text-green-400" />
             </div>
           </CardContent>
         </Card>
         
         <Card className="bg-gray-900 border-gray-700">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-gray-400">Offline</p>
                 <p className="text-2xl font-bold text-gray-500">
                   {vehicles.filter(v => v.status === 'offline').length}
                 </p>
               </div>
               <AlertTriangle className="h-8 w-8 text-gray-500" />
             </div>
           </CardContent>
         </Card>
       </div>

             {/* Vehicle List */}
       <Card className="bg-gray-900 border-gray-700">
         <CardHeader>
           <CardTitle className="text-white">Live Fleet Status</CardTitle>
         </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => {
              const Icon = getVehicleIcon(vehicle.type)
              return (
                <div
                  key={vehicle.id}
                                     className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                     selectedVehicle?.id === vehicle.id
                       ? 'border-green-500 bg-green-500/10'
                       : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                   }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-lg bg-gray-600/50 ${getStatusColor(vehicle.status)}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-white">{vehicle.name}</h3>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
                          {vehicle.currentTask && (
                            <Badge className={getPriorityColor(vehicle.currentTask.priority)}>
                              {vehicle.currentTask.priority}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Driver:</span>
                            <p className="text-white font-medium">{vehicle.driver}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <p className="text-white font-medium">{vehicle.currentLocation.address}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Battery:</span>
                            <p className="text-white font-medium">{vehicle.batteryLevel}%</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Last Update:</span>
                            <p className="text-white font-medium">
                              {Math.floor((Date.now() - vehicle.lastUpdate.getTime()) / 1000)}s ago
                            </p>
                          </div>
                        </div>
                        
                        {vehicle.currentTask && (
                          <div className="bg-gray-600/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-white">Current Task</span>
                            </div>
                            <p className="text-sm text-gray-300">{vehicle.currentTask.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>Customer: {vehicle.currentTask.customerName}</span>
                              <span>Duration: {vehicle.currentTask.estimatedDuration}min</span>
                            </div>
                          </div>
                        )}
                        
                        {vehicle.destination && (
                          <div className="bg-green-600/20 p-3 rounded-lg border border-green-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Navigation className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-green-300">En Route To</span>
                            </div>
                            <p className="text-sm text-green-200">{vehicle.destination.address}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-green-400">
                              <span>ETA: {vehicle.destination.eta} min</span>
                              <span>Speed: {vehicle.speed} mph</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                                             <Button
                         size="sm"
                         variant="outline"
                         onClick={(e) => {
                           e.stopPropagation()
                           handleContactDriver(vehicle)
                         }}
                         className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                       >
                         <Phone className="h-4 w-4 mr-2" />
                         Contact
                       </Button>
                       
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={(e) => {
                           e.stopPropagation()
                           handleTrackVehicle(vehicle)
                         }}
                         className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                       >
                         <Navigation className="h-4 w-4 mr-2" />
                         Track
                       </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {filteredVehicles.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No vehicles found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
