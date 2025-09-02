'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { MapPin, Clock, Phone, Truck, User, Navigation, Battery, CheckCircle2, AlertCircle, Map, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { notify } from './ui/notification';

interface TrackingData {
  id: string;
  type: string;
  status: 'pending' | 'assigned' | 'en_route' | 'arriving' | 'on_site' | 'completed';
  technician: {
    name: string;
    rating: number;
    phone: string;
    photo: string;
    vehicle: string;
  };
  vehicle: string;
  estimatedArrival: string;
  currentLocation: string;
  progress: number;
  timeline: Array<{
    time: string;
    status: string;
    description: string;
    completed: boolean;
    current?: boolean;
  }>;
}

export function RealTimeTracking() {
  const [isMapView, setIsMapView] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading tracking data
    setTimeout(() => {
      const mockData: TrackingData = {
        id: 'MC-247',
        type: 'Mobile Charging',
        status: 'en_route',
        technician: {
          name: 'Michael Rodriguez',
          rating: 4.9,
          phone: '(555) 123-4567',
          photo: '/api/placeholder/40/40',
          vehicle: 'Mobile Charging Unit #3'
        },
        vehicle: 'Tesla Model S - White',
        estimatedArrival: '8 minutes',
        currentLocation: 'Main St & 5th Ave',
        progress: 75,
        timeline: [
          { 
            time: '2:15 PM', 
            status: 'Request received', 
            description: 'Emergency assistance request confirmed',
            completed: true
          },
          { 
            time: '2:18 PM', 
            status: 'Technician assigned', 
            description: 'Michael R. assigned to your request',
            completed: true
          },
          { 
            time: '2:22 PM', 
            status: 'En route', 
            description: 'Mobile charging unit dispatched to your location',
            completed: true
          },
          { 
            time: '2:35 PM', 
            status: 'Arriving soon', 
            description: 'Technician will arrive in 8 minutes',
            completed: false,
            current: true
          },
          { 
            time: 'ETA 2:43 PM', 
            status: 'Service', 
            description: 'Charging service will begin',
            completed: false
          }
        ]
      };
      
      setTrackingData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const handleEmergencyCall = () => {
    notify.info('Emergency Call', 'Connecting to emergency services...');
    // In real app, this would initiate a call
  };

  const handleContactTechnician = () => {
    if (trackingData?.technician.phone) {
      window.open(`tel:${trackingData.technician.phone}`, '_self');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'current': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'current': return <Clock className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
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
            <p className="mt-4 text-xl text-muted-foreground">Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-6">🚗</div>
              <h2 className="text-2xl font-bold mb-4">No Active Requests</h2>
              <p className="text-muted-foreground mb-8">
                                 You don&apos;t have any active emergency requests at the moment. 
                Create a new request when you need emergency charging.
              </p>
              <Button
                onClick={() => router.push('/emergency-assistance')}
                className="bg-primary hover:bg-primary/90 px-8 py-4 text-lg font-bold"
              >
                🚨 Create Emergency Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Track Your Service</h1>
          <p className="text-muted-foreground">Real-time updates for your emergency assistance</p>
        </div>

        {/* Status Overview */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl text-green-800">Service Active</CardTitle>
                <p className="text-green-700">
                  Unit #{trackingData.id} • {trackingData.type}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                En Route
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Estimated Arrival</span>
                </div>
                <p className="text-2xl font-medium text-green-800">{trackingData.estimatedArrival}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Current Location</span>
                </div>
                <p className="font-medium text-green-800">{trackingData.currentLocation}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Battery className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Progress</span>
                </div>
                <Progress value={trackingData.progress} className="w-full" />
                <p className="text-sm font-medium text-green-800">{trackingData.progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technician Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Technician
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={trackingData.technician.photo} />
                <AvatarFallback className="text-lg font-bold">
                  {trackingData.technician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{trackingData.technician.name}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">Rating:</span>
                    <span className="font-medium">{trackingData.technician.rating}/5</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{trackingData.technician.vehicle}</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleContactTechnician}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Service Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingData.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-100' : item.current ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        item.completed ? 'text-green-800' : item.current ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {item.status}
                      </p>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleEmergencyCall}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Emergency Call
              </Button>
              <Button
                onClick={() => setIsMapView(!isMapView)}
                variant="outline"
                className="w-full"
              >
                <Map className="h-4 w-4 mr-2" />
                {isMapView ? 'Hide Map' : 'Show Map'}
              </Button>
              <Button
                onClick={() => router.push('/emergency-assistance')}
                variant="outline"
                className="w-full"
              >
                <Truck className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map View */}
        {isMapView && (
          <Card>
            <CardHeader>
              <CardTitle>Live Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Map className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
