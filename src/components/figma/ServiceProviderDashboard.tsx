'use client'

import React, { useState } from 'react';
import { Icon } from '../ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ServiceRequest {
  id: string;
  customerName: string;
  vehicleType: string;
  issue: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  estimatedTime: string;
  distance: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  vehicle: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  completedJobs: number;
  currentLocation: string;
}

export const ServiceProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'providers' | 'analytics'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const serviceRequests: ServiceRequest[] = [
    {
      id: 'SR-001',
      customerName: 'Alex Johnson',
      vehicleType: 'Tesla Model 3',
      issue: 'Battery drained, stranded on highway',
      location: 'I-95 Exit 23, 2.3 miles away',
      priority: 'critical',
      status: 'pending',
      estimatedTime: '15 min',
      distance: '2.3 mi'
    },
    {
      id: 'SR-002',
      customerName: 'Sarah Chen',
      vehicleType: 'Nissan Leaf',
      issue: 'Charging port malfunction',
      location: 'Main St & 5th Ave, 1.8 miles away',
      priority: 'high',
      status: 'assigned',
      estimatedTime: '25 min',
      distance: '1.8 mi'
    },
    {
      id: 'SR-003',
      customerName: 'Mike Rodriguez',
      vehicleType: 'Chevrolet Bolt',
      issue: 'Tire puncture, needs roadside assistance',
      location: 'Park Ave & 12th St, 3.1 miles away',
      priority: 'medium',
      status: 'in-progress',
      estimatedTime: '10 min',
      distance: '3.1 mi'
    }
  ];

  const serviceProviders: ServiceProvider[] = [
    {
      id: 'SP-001',
      name: 'John Smith',
      vehicle: 'Mobile Charging Unit #MC-247',
      status: 'available',
      rating: 4.8,
      completedJobs: 156,
      currentLocation: 'Downtown Area'
    },
    {
      id: 'SP-002',
      name: 'Emily Davis',
      vehicle: 'Emergency Response Unit #ER-103',
      status: 'busy',
      rating: 4.9,
      completedJobs: 203,
      currentLocation: 'Highway Patrol Zone'
    },
    {
      id: 'SP-003',
      name: 'David Wilson',
      vehicle: 'Mobile Service Unit #MS-456',
      status: 'available',
      rating: 4.7,
      completedJobs: 89,
      currentLocation: 'Suburban District'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'assigned': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500 text-white';
      case 'busy': return 'bg-orange-500 text-white';
      case 'offline': return 'bg-gray-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Service Provider Dashboard</h1>
        <p className="text-xl text-muted-foreground">Manage service requests and provider assignments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="uber-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info">
                <Icon name="battery" className="h-6 w-6 text-info-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Icon name="truck" className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Available Providers</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning">
                <Icon name="alertTriangle" className="h-6 w-6 text-warning-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="uber-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
                <Icon name="alertTriangle" className="h-6 w-6 text-success-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8">
        {[
          { id: 'requests', label: 'Service Requests', icon: 'truck' },
          { id: 'providers', label: 'Service Providers', icon: 'settings' },
          { id: 'analytics', label: 'Analytics', icon: 'user' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'requests' | 'providers' | 'analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon as 'truck' | 'settings' | 'user'} className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Service Requests</h2>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Icon name="plus" className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          <div className="grid gap-6">
            {serviceRequests.map((request) => (
              <Card key={request.id} className="uber-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{request.customerName}</h3>
                          <p className="text-muted-foreground">{request.vehicleType}</p>
                        </div>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground">{request.issue}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Icon name="mapPin" className="h-4 w-4 text-muted-foreground" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="clock" className="h-4 w-4 text-muted-foreground" />
                          <span>{request.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="dollarSign" className="h-4 w-4 text-muted-foreground" />
                          <span>Est. $45-65</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Icon name="phone" className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Message customer')}
                      >
                        <Icon name="messageCircle" className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => console.log('Navigate to location')}
                      >
                        <Icon name="navigation" className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Service Providers</h2>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Icon name="plus" className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>

          <div className="grid gap-6">
            {serviceProviders.map((provider) => (
              <Card key={provider.id} className="uber-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon name="user" className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <p className="text-muted-foreground">{provider.vehicle}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Icon name="star" className="h-4 w-4 text-yellow-500" />
                            <span>{provider.rating}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="checkCircle" className="h-4 w-4 text-green-500" />
                            <span>{provider.completedJobs} jobs</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={getProviderStatusColor(provider.status)}>
                        {provider.status.toUpperCase()}
                      </Badge>
                      <div className="text-right text-sm">
                        <p className="font-medium">Current Location</p>
                        <p className="text-muted-foreground">{provider.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Analytics & Performance</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="uber-card">
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response time over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Today&apos;s Average</span>
                    <span className="font-bold text-lg">18.5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-bold text-lg">22.3 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-bold text-lg">19.8 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="uber-card">
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Rating distribution from recent service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">5 Stars</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={75} className="w-20" />
                      <span className="font-bold">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">4 Stars</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={20} className="w-20" />
                      <span className="font-bold">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">3 Stars & Below</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={5} className="w-20" />
                      <span className="font-bold">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Service Request Details</CardTitle>
              <CardDescription>Request ID: {selectedRequest.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-semibold">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                  <p className="font-semibold">{selectedRequest.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Description</p>
                <p className="text-sm">{selectedRequest.issue}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">{selectedRequest.location}</p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Icon name="calendar" className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
