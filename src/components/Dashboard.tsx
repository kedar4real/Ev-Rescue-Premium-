'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  IconMapPin as MapPin,
  IconAlertTriangle as AlertCircle,
  IconTruck as Truck,
  IconBattery as Battery,
  IconClock as Clock,
  IconNavigation as Navigation,
  IconArrowRight as ArrowRight,
  IconBolt as Zap,
  IconShield as Shield,
  IconTrendingUp as TrendingUp,
  IconUsers as Users,
  IconCar as Car,
  IconBike as Bike,
  IconAlertTriangle as AlertTriangle,
  IconCheck as CheckCircle,
  IconPhone as Phone,
  IconStar as Star,
  IconTool as Wrench,
  IconActivity as Activity,
  IconGauge as Gauge
} from '@tabler/icons-react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = React.memo(function Dashboard() {
  const { user } = useAuth();
  
  // Mock fleet data for dashboard overview
  const mockFleetData = [
    {
      id: 'van-001',
      type: 'van',
      name: 'Service Van Alpha',
      driver: 'John Smith',
      status: 'busy',
      currentLocation: { address: '123 Main St, New York, NY' },
      batteryLevel: 85,
      currentTask: { type: 'emergency' }
    },
    {
      id: 'scooter-001',
      type: 'scooter',
      name: 'Quick Response Scooter',
      driver: 'Mike Chen',
      status: 'available',
      currentLocation: { address: '789 Pine St, New York, NY' },
      batteryLevel: 95
    },
    {
      id: 'mobile-001',
      type: 'mobile-unit',
      name: 'Mobile Charging Unit',
      driver: 'Lisa Rodriguez',
      status: 'busy',
      currentLocation: { address: '321 Elm St, New York, NY' },
      batteryLevel: 60,
      currentTask: { type: 'charging' }
    },
    {
      id: 'emergency-001',
      type: 'emergency-vehicle',
      name: 'Emergency Response Unit',
      driver: 'Alex Thompson',
      status: 'busy',
      currentLocation: { address: '147 Oak St, New York, NY' },
      batteryLevel: 90,
      currentTask: { type: 'emergency' }
    }
  ]

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
      case 'busy': return 'bg-green-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }
  
  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in font-inter">
      {/* Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full particle opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-300 rounded-full particle opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-500 rounded-full particle opacity-25"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <section className="py-12 space-y-12">
          {/* Welcome Section */}
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-white">Welcome back, Alex</h1>
              <p className="text-xl text-green-400">Your Tesla Model 3 is ready to go</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-full">
                <div className="status-dot status-online"></div>
                <span className="font-medium">Tesla Model 3</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-full">
                <Battery className="h-4 w-4 text-primary" />
                <span className="font-medium">76% charged</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Find Charging Stations */}
            <Card className="uber-card morph-card hover-lift transition-all duration-300 animate-slide-up group [animation-delay:100ms] card-glass">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-info-foreground group-hover:rotate-12 transition-transform duration-300 icon-bounce" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">Find Charging</CardTitle>
                    <CardDescription className="text-muted-foreground">Locate nearby stations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Nearby stations</span>
                    <Badge variant="outline" className="border-info text-info">3 available</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Navigation className="h-4 w-4 text-info" />
                    <span>Within 2 miles of your location</span>
                  </div>
                </div>
                              <Button
                className="w-full uber-button-primary liquid-btn btn-hover btn-glass"
                asChild
              >
                  <Link href="/charging-finder">
                    <span>View Stations</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Assistance */}
            <Card className="uber-card morph-card hover-lift transition-all duration-300 animate-slide-up group emergency-glow [animation-delay:200ms] card-glass">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning group-hover:scale-110 transition-transform duration-300 pulse-glow">
                    <AlertCircle className="h-6 w-6 text-warning-foreground group-hover:animate-pulse icon-pulse" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-warning transition-colors duration-300">Emergency Help</CardTitle>
                    <CardDescription className="text-muted-foreground">24/7 roadside assistance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response time</span>
                    <Badge variant="outline" className="border-success text-success">
                      <div className="status-dot status-online mr-1"></div>
                      15 mins avg
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-warning" />
                    <span>Available now in your area</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-warning text-warning hover:bg-warning hover:text-warning-foreground font-medium transition-all duration-200" asChild>
                  <Link href="/emergency-assistance">
                    <span>Request Help</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mobile Charging */}
            <Card className="uber-card hover-lift transition-all duration-300 animate-slide-up [animation-delay:300ms] card-glass">
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Truck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Mobile Charging</CardTitle>
                    <CardDescription className="text-muted-foreground">On-demand service</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Service area</span>
                    <Badge variant="outline" className="border-primary text-primary">10 mile radius</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Fast charging available</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-all duration-200" asChild>
                  <Link href="/tracking">
                    <span>Schedule Service</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Overview */}
          <div className="space-y-8 animate-slide-up [animation-delay:350ms]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">Statistics Overview</h2>
                <p className="text-green-400">Key metrics and performance indicators</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="uber-card border-success/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/20">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="uber-card border-warning/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="uber-card border-warning/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/20">
                      <Users className="h-6 w-6 text-warning" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Technicians</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="uber-card border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Vehicles</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fleet Overview */}
          <div className="space-y-8 animate-slide-up [animation-delay:400ms]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">Fleet Overview</h2>
                <p className="text-green-400">Live status of all service vehicles</p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-green-500 text-black px-4 py-2 font-medium">
                  {mockFleetData.filter(v => v.status === 'available').length} Available
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-2 font-medium">
                  {mockFleetData.filter(v => v.status === 'busy').length} Busy
                </Badge>
              </div>
            </div>
            
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
           {mockFleetData.slice(0, 4).map((vehicle, index) => {
             const Icon = getVehicleIcon(vehicle.type)
             return (
               <Card key={vehicle.id} className="bg-gray-900 border-gray-700 card-hover">
                 <CardContent className="p-4">
                   <div className="flex items-start justify-between mb-3">
                     <div className={`p-2 rounded-lg ${getStatusColor(vehicle.status)}`}>
                       <Icon className="h-5 w-5 text-white" />
                     </div>
                     <Badge className={getStatusColor(vehicle.status)}>
                       {vehicle.status}
                     </Badge>
                   </div>
                   <h3 className="font-semibold text-white mb-2">{vehicle.name}</h3>
                   <p className="text-sm text-gray-400 mb-3">{vehicle.driver}</p>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span className="text-gray-400">Location:</span>
                       <span className="text-white font-medium">{vehicle.currentLocation.address.split(',')[0]}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Battery:</span>
                       <span className="text-white font-medium">{vehicle.batteryLevel}%</span>
                     </div>
                     {vehicle.currentTask && (
                       <div className="flex justify-between">
                         <span className="text-gray-400">Task:</span>
                         <span className="text-white font-medium">{vehicle.currentTask.type}</span>
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             )
           })}
         </div>
            
            <div className="text-center">
              <Button asChild className="btn-hover">
                <Link href="/fleet">
                  <Truck className="h-5 w-5 mr-2" />
                  View Full Fleet
                </Link>
              </Button>
            </div>
          </div>

          {/* Current Activity */}
          <div className="space-y-8 animate-slide-up [animation-delay:500ms]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">Current Activity</h2>
                <p className="text-green-400">Real-time updates on your service</p>
              </div>
              <Badge className="bg-green-500 text-black px-4 py-2 font-medium"> Live Updates </Badge>
            </div>
            <Card className="uber-card border-primary/20 bg-card">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                      <Truck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-2xl uber-text-accent">Mobile Unit En Route</CardTitle>
                      <CardDescription className="text-lg">Unit #MC-247 heading to your location</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 font-medium"> Active </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Estimated arrival</span>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-3xl font-bold uber-text-accent">12 min</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold">75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-muted" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-accent rounded-lg border border-border">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="font-semibold">Current Location</p>
                    <p className="text-muted-foreground">Main St & 5th Ave • Moving towards you</p>
                  </div>
                </div>
                <Button 
                  className="w-full uber-button-primary text-lg py-4" 
                  asChild
                >
                  <Link href="/tracking">
                    <Navigation className="h-5 w-5 mr-3" />
                    <span>Track in Real-time</span>
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
});
