'use client'

import { Icon } from '../ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { notify } from '../ui/notification';
import { Map } from '../Map';
import { 
  MapPinIcon as MapPin,
  MapIcon as Navigation,
  BoltIcon as Zap,
  ClockIcon as Clock,
  CurrencyDollarIcon as DollarSign,
  FunnelIcon as Filter,
  StarIcon as Star,
  ArrowRightIcon as ArrowRight,
  MagnifyingGlassIcon as Search,
  Battery0Icon as Battery,
  WifiIcon as Wifi,
  TruckIcon as Car
} from '@heroicons/react/24/outline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ChargingStationSkeleton, PageHeaderSkeleton } from '../LoadingSkeleton';

interface ChargingStation {
  id: string;
  name: string;
  distance: number;
  rating: number;
  price: number;
  available: boolean;
  fastCharging: boolean;
  estimatedTime: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  connectorTypes: string[];
  powerOutput: number; // kW
  network: string;
}

export function ChargingFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const chargingStations: ChargingStation[] = [
    {
      id: '1',
      name: 'Tesla Supercharger',
      distance: 0.8,
      rating: 4.8,
      price: 0.35,
      available: true,
      fastCharging: true,
      estimatedTime: 25,
      location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' },
      connectorTypes: ['Tesla', 'CCS'],
      powerOutput: 250,
      network: 'Tesla'
    },
    {
      id: '2',
      name: 'Electrify America',
      distance: 1.2,
      rating: 4.2,
      price: 0.31,
      available: true,
      fastCharging: true,
      estimatedTime: 30,
      location: { lat: 40.7140, lng: -74.0065, address: '456 Oak Ave, New York, NY' },
      connectorTypes: ['CCS', 'CHAdeMO'],
      powerOutput: 350,
      network: 'Electrify America'
    },
    {
      id: '3',
      name: 'ChargePoint',
      distance: 1.8,
      rating: 4.5,
      price: 0.28,
      available: false,
      fastCharging: false,
      estimatedTime: 45,
      location: { lat: 40.7150, lng: -74.0070, address: '789 Pine St, New York, NY' },
      connectorTypes: ['Type 2', 'CCS'],
      powerOutput: 50,
      network: 'ChargePoint'
    }
  ];

  // Remove authentication requirement for now - allow public access
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }
  // }, [isAuthenticated, router]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          notify.success('Location Found', 'Your current location has been detected');
        },
        (error) => {
          console.error('Location error:', error);
          notify.error('Location Error', 'Unable to get your current location');
        }
      ).finally(() => setIsLoadingLocation(false));
    } else {
      notify.error('Location Error', 'Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
    }
  };

  const calculateDistance = (stationLat: number, stationLng: number) => {
    if (!userLocation) return null;
    
    const R = 3959; // Earth's radius in miles
    const dLat = (stationLat - userLocation.lat) * Math.PI / 180;
    const dLng = (stationLng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(stationLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
  };

  const filteredStations = chargingStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'available' && station.available) ||
      (selectedFilter === 'fast' && station.fastCharging);
    
    return matchesSearch && matchesFilter;
  }).map(station => ({
    ...station,
    distance: userLocation ? calculateDistance(station.location.lat, station.location.lng) || station.distance : station.distance
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <PageHeaderSkeleton />
          <ChargingStationSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Charging Stations</h1>
          <p className="text-xl text-green-400 max-w-2xl mx-auto">Locate nearby EV charging stations</p>
        </div>

            {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by location or station name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-card border-border text-lg"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[200px] h-14 bg-card border-border">
              <Filter className="h-5 w-5 mr-2" />
              <SelectValue placeholder="Filter stations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              <SelectItem value="fast">Fast Charging</SelectItem>
              <SelectItem value="available">Available Now</SelectItem>
              <SelectItem value="nearby">Nearby</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            variant="outline"
            className="h-14 px-6 border-border hover:bg-accent"
          >
            {isLoadingLocation ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Locating...
              </>
            ) : (
              <>
                <MapPin className="h-5 w-5 mr-2" />
                My Location
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Location Status */}
      {userLocation && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <Icon name="mapPin" size={16} className="text-green-600" />
            <span className="font-medium">Using your location:</span>
            <span>{userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setShowMap(false)}
            className={`px-4 py-2 rounded-md transition-colors ${
              !showMap
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="list" size={16} className="mr-2" />
            List View
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showMap
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="map" size={16} className="mr-2" />
            Map View
          </button>
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="mb-8">
          <Map 
            stations={filteredStations}
            userLocation={userLocation}
            onStationSelect={(station) => {
              // Scroll to station in list view
              setShowMap(false);
              // You could also highlight the selected station
            }}
          />
        </div>
      )}

      {/* Stations Grid */}
      <div className={`grid gap-6 ${showMap ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredStations.map((station) => (
          <Card key={station.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{station.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Icon name="mapPin" size={16} className="text-muted-foreground" />
                    {station.distance} miles away
                  </CardDescription>
                </div>
                <Badge variant={station.available ? "default" : "secondary"}>
                  {station.available ? "Available" : "Occupied"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{station.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>${station.price}/kWh</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-500" />
                  <span>{station.fastCharging ? "Fast" : "Standard"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{station.estimatedTime} min</span>
                </div>
              </div>

              {/* Additional Station Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium">{station.network}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Power Output:</span>
                  <span className="font-medium">{station.powerOutput} kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Connectors:</span>
                  <div className="flex gap-1">
                    {station.connectorTypes.map((connector, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {connector}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => {
                    if (station.location) {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.location.lat},${station.location.lng}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (station.available) {
                      notify.success('Charging Started', `Starting charging session at ${station.name}`);
                    } else {
                      notify.error('Station Occupied', 'This station is currently in use');
                    }
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Start Charging
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

             {filteredStations.length === 0 && (
         <div className="text-center py-12">
           <Icon name="mapPin" size={48} className="mx-auto text-muted-foreground mb-4" />
           <h3 className="text-xl font-semibold mb-2 text-white">No stations found</h3>
           <p className="text-muted-foreground text-green-400">Try adjusting your search or filters</p>
         </div>
       )}
        </div>
      </div>
  );
}
