'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Truck, 
  MapPin, 
  Battery, 
  Clock, 
  User, 
  Phone, 
  Search,
  Filter,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Fuel
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ServiceVan {
  id: string;
  name: string;
  type: 'mobile-charging' | 'towing' | 'maintenance' | 'emergency';
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  technician: {
    name: string;
    phone: string;
    rating: number;
    photo: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  equipment: string[];
  currentTask?: {
    id: string;
    type: string;
    location: string;
    estimatedCompletion: Date;
  };
  lastMaintenance: Date;
  nextMaintenance: Date;
  fuelLevel: number;
  batteryLevel: number;
  totalServices: number;
  rating: number;
}

export default function VanManagementPage() {
  const [serviceVans, setServiceVans] = useState<ServiceVan[]>([]);
  const [filteredVans, setFilteredVans] = useState<ServiceVan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading service vans
    setTimeout(() => {
      const mockVans: ServiceVan[] = [
        {
          id: 'VAN-001',
          name: 'Mobile Charging Unit #1',
          type: 'mobile-charging',
          status: 'busy',
          location: {
            lat: 40.7128,
            lng: -74.0060,
            address: '123 Main St, New York, NY'
          },
          technician: {
            name: 'Michael Rodriguez',
            phone: '(555) 123-4567',
            rating: 4.9,
            photo: '/api/placeholder/40/40'
          },
          vehicle: {
            make: 'Ford',
            model: 'Transit',
            year: 2023,
            licensePlate: 'NYC-123'
          },
          equipment: ['50kW Charger', 'Battery Pack', 'Tools'],
          currentTask: {
            id: 'TASK-001',
            type: 'Emergency Charging',
            location: '456 Oak Ave, Brooklyn',
            estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
          },
          lastMaintenance: new Date('2024-01-01'),
          nextMaintenance: new Date('2024-02-01'),
          fuelLevel: 85,
          batteryLevel: 90,
          totalServices: 156,
          rating: 4.8
        },
        {
          id: 'VAN-002',
          name: 'Towing Service Unit',
          type: 'towing',
          status: 'available',
          location: {
            lat: 40.7140,
            lng: -74.0065,
            address: '456 Oak Ave, Brooklyn, NY'
          },
          technician: {
            name: 'Sarah Johnson',
            phone: '(555) 987-6543',
            rating: 4.8,
            photo: '/api/placeholder/40/40'
          },
          vehicle: {
            make: 'Chevrolet',
            model: 'Express',
            year: 2022,
            licensePlate: 'NYC-456'
          },
          equipment: ['Tow Bar', 'Winch', 'Safety Equipment'],
          lastMaintenance: new Date('2024-01-05'),
          nextMaintenance: new Date('2024-02-05'),
          fuelLevel: 92,
          batteryLevel: 95,
          totalServices: 89,
          rating: 4.7
        },
        {
          id: 'VAN-003',
          name: 'Maintenance Unit',
          type: 'maintenance',
          status: 'maintenance',
          location: {
            lat: 40.7150,
            lng: -74.0070,
            address: '789 Pine St, Queens, NY'
          },
          technician: {
            name: 'David Chen',
            phone: '(555) 456-7890',
            rating: 4.7,
            photo: '/api/placeholder/40/40'
          },
          vehicle: {
            make: 'Mercedes',
            model: 'Sprinter',
            year: 2021,
            licensePlate: 'NYC-789'
          },
          equipment: ['Tool Kit', 'Diagnostic Equipment', 'Parts'],
          lastMaintenance: new Date('2024-01-10'),
          nextMaintenance: new Date('2024-02-10'),
          fuelLevel: 78,
          batteryLevel: 88,
          totalServices: 234,
          rating: 4.6
        },
        {
          id: 'VAN-004',
          name: 'Emergency Response Unit',
          type: 'emergency',
          status: 'available',
          location: {
            lat: 40.7160,
            lng: -74.0075,
            address: '321 Elm St, Bronx, NY'
          },
          technician: {
            name: 'Lisa Thompson',
            phone: '(555) 234-5678',
            rating: 4.9,
            photo: '/api/placeholder/40/40'
          },
          vehicle: {
            make: 'Dodge',
            model: 'ProMaster',
            year: 2023,
            licensePlate: 'NYC-012'
          },
          equipment: ['Emergency Lights', 'First Aid', 'Communication'],
          lastMaintenance: new Date('2024-01-15'),
          nextMaintenance: new Date('2024-02-15'),
          fuelLevel: 95,
          batteryLevel: 92,
          totalServices: 67,
          rating: 4.9
        }
      ];
      
      setServiceVans(mockVans);
      setFilteredVans(mockVans);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  useEffect(() => {
    let filtered = serviceVans;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(van =>
        van.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        van.technician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        van.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        van.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(van => van.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(van => van.type === typeFilter);
    }

    setFilteredVans(filtered);
  }, [searchQuery, statusFilter, typeFilter, serviceVans]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mobile-charging': return <Battery className="h-4 w-4" />;
      case 'towing': return <Truck className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mobile-charging': return 'bg-green-100 text-green-800';
      case 'towing': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getFuelColor = (level: number) => {
    if (level > 70) return 'text-green-600';
    if (level > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryColor = (level: number) => {
    if (level > 80) return 'text-green-600';
    if (level > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-xl text-muted-foreground">Loading van management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium">Van Management</h1>
            <p className="text-muted-foreground">Manage your service vehicles and track their status</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add New Van
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by van name, technician, license plate, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mobile-charging">Mobile Charging</SelectItem>
                  <SelectItem value="towing">Towing</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Vans</p>
                  <p className="text-2xl font-bold">{serviceVans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">
                    {serviceVans.filter(v => v.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Wrench className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">In Maintenance</p>
                  <p className="text-2xl font-bold">
                    {serviceVans.filter(v => v.status === 'maintenance').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Technicians</p>
                  <p className="text-2xl font-bold">
                    {new Set(serviceVans.map(v => v.technician.name)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Van Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVans.map((van) => (
            <Card key={van.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(van.type)}
                    <div>
                      <CardTitle className="text-lg">{van.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{van.vehicle.licensePlate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(van.status)}>
                      {van.status}
                    </Badge>
                    <Badge className={getTypeColor(van.type)}>
                      {van.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Technician Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{van.technician.name}</p>
                    <p className="text-sm text-muted-foreground">⭐ {van.technician.rating}/5</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${van.technician.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{van.vehicle.year} {van.vehicle.make} {van.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Services:</span>
                    <span className="font-medium">{van.totalServices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium">⭐ {van.rating}/5</span>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Fuel className={`h-4 w-4 ${getFuelColor(van.fuelLevel)}`} />
                    <span className="text-sm">{van.fuelLevel}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(van.batteryLevel)}`} />
                    <span className="text-sm">{van.batteryLevel}%</span>
                  </div>
                </div>

                {/* Current Task */}
                {van.currentTask && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Current Task</span>
                    </div>
                    <p className="text-sm text-green-700 mb-1">{van.currentTask.type}</p>
                    <p className="text-xs text-green-600">{van.currentTask.location}</p>
                    <p className="text-xs text-green-600">
                      ETA: {formatDate(van.currentTask.estimatedCompletion)}
                    </p>
                  </div>
                )}

                {/* Maintenance Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Maintenance:</span>
                    <span className="font-medium">{formatDate(van.lastMaintenance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Maintenance:</span>
                    <span className="font-medium">{formatDate(van.nextMaintenance)}</span>
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <p className="text-sm font-medium mb-2">Equipment:</p>
                  <div className="flex flex-wrap gap-1">
                    {van.equipment.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{van.location.address}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVans.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vans found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
