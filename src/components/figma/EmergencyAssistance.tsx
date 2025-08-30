'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { notify } from '../ui/notification';
import { AlertCircle, Phone, MapPin, Clock, Wrench, Battery, Truck, CheckCircle, ArrowRight, Shield, Zap, Car, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface EmergencyRequest {
  id: string;
  type: 'battery' | 'tire' | 'accident' | 'other';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  requestedAt: Date;
  estimatedArrival?: number;
  userId: string;
  vehicleInfo: {
    type: string;
    model: string;
    batteryLevel: number;
  };
}

export function EmergencyAssistance() {
  const [activeTab, setActiveTab] = useState<'request' | 'tracking'>('request');
  const [emergencyType, setEmergencyType] = useState<EmergencyRequest['type']>('battery');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<EmergencyRequest['priority']>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Remove authentication requirement for now - allow public access
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }
  // }, [isAuthenticated, router]);

  const emergencyTypes = [
    { value: 'battery', label: 'Battery Issue', icon: Battery, color: 'text-orange-500', description: 'Vehicle won\'t start or completely drained' },
    { value: 'tire', label: 'Flat Tire', icon: Car, color: 'text-red-500', description: 'Tire puncture or damage' },
    { value: 'accident', label: 'Accident', icon: AlertTriangle, color: 'text-red-600', description: 'Collision or vehicle damage' },
    { value: 'other', label: 'Other', icon: Wrench, color: 'text-blue-500', description: 'Mechanical or electrical issues' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-600 text-white border-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-600 text-white border-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-orange-600 text-white border-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-600 text-white border-red-500' }
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Reverse geocoding to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
              setLocation(address);
              notify.success('Location Found', 'Your current location has been detected');
            })
            .catch(() => {
              setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
              notify.success('Location Found', 'Your current location has been detected');
            });
        },
        (error) => {
          console.error('Location error:', error);
          notify.error('Location Error', 'Unable to get your current location. Please enter manually.');
          setIsGettingLocation(false);
        }
      );
    } else {
      notify.error('Location Error', 'Geolocation is not supported by this browser');
      setIsGettingLocation(false);
    }
  };

  const handlePrioritySelect = (selectedPriority: EmergencyRequest['priority']) => {
    setPriority(selectedPriority);
  };

  const handleEmergencyRequest = async () => {
    if (!description.trim() || !location.trim()) {
      notify.error('Missing Information', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const request: EmergencyRequest = {
        id: `ER-${Date.now()}`,
        type: emergencyType,
        status: 'pending',
        priority,
        description,
        location: currentLocation ? {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          address: location
        } : { lat: 0, lng: 0, address: location },
        requestedAt: new Date(),
        userId: user?.id || 'anonymous',
        vehicleInfo: {
          type: user?.vehicleType || 'Unknown',
          model: user?.vehicleModel || 'Unknown',
          batteryLevel: user?.batteryCapacity || 0
        }
      };

      notify.success('Request Submitted', 'Your emergency assistance request has been submitted successfully');
      
      // Reset form
      setDescription('');
      setLocation('');
      setPriority('medium');
      setEmergencyType('battery');
      
      // Switch to tracking tab
      setActiveTab('tracking');
      
    } catch (error) {
      notify.error('Submission Failed', 'Failed to submit your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Emergency Assistance
          </h1>
          <p className="text-xl text-green-400 max-w-2xl mx-auto">
            24/7 roadside assistance for your EV. Help is just a click away.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'request'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Request Assistance
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'tracking'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Track Request
            </button>
          </div>
        </div>

        {activeTab === 'request' ? (
          <div className="space-y-6 animate-slide-in-right">
            {/* Emergency Type Selection */}
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  Emergency Type
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select the type of assistance you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setEmergencyType(type.value as EmergencyRequest['type'])}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          emergencyType === type.value
                            ? 'border-red-500 bg-red-500/10 shadow-lg'
                            : 'border-gray-600 hover:border-red-500/50 bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${type.color}`} />
                          <div className="text-left">
                            <div className="font-semibold text-white">{type.label}</div>
                            <div className="text-sm text-gray-400">{type.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertCircle className="h-6 w-6 text-blue-500" />
                  Describe Your Emergency
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Provide details about your situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your emergency situation in detail..."
                  className="min-h-[120px] bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 input-focus"
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="h-6 w-6 text-green-500" />
                  Your Location
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Help us locate you quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your address or location"
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 input-focus"
                  />
                  <Button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white btn-hover"
                  >
                    {isGettingLocation ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {currentLocation && (
                  <div className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    GPS coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Level */}
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  Priority Level
                </CardTitle>
                <CardDescription className="text-gray-300">
                  How urgent is your situation?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {priorityLevels.map((priorityLevel) => (
                    <button
                      key={priorityLevel.value}
                      onClick={() => handlePrioritySelect(priorityLevel.value as EmergencyRequest['priority'])}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 font-medium ${
                        priority === priorityLevel.value
                          ? `${priorityLevel.color} shadow-lg border-current`
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600/50'
                      }`}
                    >
                      {priorityLevel.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Car className="h-6 w-6 text-green-500" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vehicle:</span>
                    <div className="font-medium text-white">{user?.vehicleType || 'Not specified'} {user?.vehicleModel || ''}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Battery Level:</span>
                    <div className="font-medium text-white">{user?.batteryCapacity || 0}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

                         {/* Fleet Status */}
             <Card className="bg-gray-900 border-gray-700 card-hover">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-white">
                   <Truck className="h-6 w-6 text-green-500" />
                   Available Response Units
                 </CardTitle>
                 <CardDescription className="text-gray-300">
                   Real-time status of emergency response vehicles
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="text-center p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                     <div className="text-2xl font-bold text-green-400">3</div>
                     <div className="text-sm text-green-300">Available Units</div>
                   </div>
                   <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                     <div className="text-2xl font-bold text-green-400">5 min</div>
                     <div className="text-sm text-green-300">Avg Response Time</div>
                   </div>
                 </div>
                 <div className="mt-4 text-center">
                   <Button 
                     variant="outline" 
                     asChild
                     className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black btn-hover"
                   >
                     <Link href="/fleet">
                       <Truck className="h-4 w-4 mr-2" />
                       View Live Fleet
                     </Link>
                   </Button>
                 </div>
               </CardContent>
             </Card>

             {/* Submit Button */}
             <Button 
               onClick={handleEmergencyRequest}
               disabled={isLoading || !description.trim() || !location.trim()}
               className="w-full py-6 text-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-400 font-bold btn-hover animate-bounce-in"
               size="lg"
             >
               {isLoading ? (
                 <>
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                   Submitting Request...
                 </>
               ) : (
                 <>
                   <Phone className="h-6 w-6 mr-3" />
                   Request Emergency Assistance
                 </>
               )}
             </Button>

            {/* Emergency Contact */}
            <div className="text-center text-sm text-gray-300 animate-fade-in">
              <p>For immediate assistance, call our 24/7 hotline:</p>
              <p className="text-lg font-semibold text-red-400">1-800-EV-RESCUE</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-slide-in-right">
            <Card className="bg-gray-800/50 border-gray-700/30 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-6 w-6 text-blue-500" />
                  Track Your Request
                </CardTitle>
                <CardDescription className="text-gray-300">Monitor the status of your emergency assistance request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Enter your request ID" className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 input-focus" />
                  <Button className="w-full btn-hover">Track Request</Button>
                </div>
                
                {/* Quick Action */}
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('request')}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white btn-hover"
                  >
                    Create New Emergency Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
