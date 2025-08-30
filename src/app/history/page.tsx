'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Clock, 
  MapPin, 
  Truck, 
  Battery, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ServiceHistory {
  id: string;
  type: 'battery' | 'tire' | 'accident' | 'charging' | 'other';
  status: 'completed' | 'cancelled' | 'in-progress';
  description: string;
  location: string;
  requestedAt: Date;
  completedAt?: Date;
  technician: {
    name: string;
    phone: string;
    rating: number;
  };
  vehicle: string;
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function ServiceHistoryPage() {
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ServiceHistory[]>([]);
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

    // Simulate loading service history
    setTimeout(() => {
      const mockHistory: ServiceHistory[] = [
        {
          id: 'SR-001',
          type: 'battery',
          status: 'completed',
          description: 'Dead battery replacement',
          location: '123 Main St, New York, NY',
          requestedAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T11:45:00'),
          technician: {
            name: 'Michael Rodriguez',
            phone: '(555) 123-4567',
            rating: 4.9
          },
          vehicle: 'Tesla Model S',
          cost: 150.00,
          priority: 'high'
        },
        {
          id: 'SR-002',
          type: 'charging',
          status: 'completed',
          description: 'Mobile charging service',
          location: '456 Oak Ave, Brooklyn, NY',
          requestedAt: new Date('2024-01-10T14:20:00'),
          completedAt: new Date('2024-01-10T15:30:00'),
          technician: {
            name: 'Sarah Johnson',
            phone: '(555) 987-6543',
            rating: 4.8
          },
          vehicle: 'Nissan Leaf',
          cost: 75.00,
          priority: 'medium'
        },
        {
          id: 'SR-003',
          type: 'tire',
          status: 'completed',
          description: 'Flat tire repair',
          location: '789 Pine St, Queens, NY',
          requestedAt: new Date('2024-01-05T09:15:00'),
          completedAt: new Date('2024-01-05T10:00:00'),
          technician: {
            name: 'David Chen',
            phone: '(555) 456-7890',
            rating: 4.7
          },
          vehicle: 'Chevrolet Bolt',
          cost: 45.00,
          priority: 'medium'
        },
        {
          id: 'SR-004',
          type: 'accident',
          status: 'completed',
          description: 'Minor collision damage assessment',
          location: '321 Elm St, Bronx, NY',
          requestedAt: new Date('2024-01-01T16:45:00'),
          completedAt: new Date('2024-01-01T17:30:00'),
          technician: {
            name: 'Lisa Thompson',
            phone: '(555) 234-5678',
            rating: 4.9
          },
          vehicle: 'Ford Mustang Mach-E',
          cost: 200.00,
          priority: 'critical'
        }
      ];
      
      setServiceHistory(mockHistory);
      setFilteredHistory(mockHistory);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  useEffect(() => {
    let filtered = serviceHistory;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.technician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(service => service.type === typeFilter);
    }

    setFilteredHistory(filtered);
  }, [searchQuery, statusFilter, typeFilter, serviceHistory]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'battery': return <Battery className="h-4 w-4" />;
      case 'tire': return <AlertTriangle className="h-4 w-4" />;
      case 'accident': return <AlertTriangle className="h-4 w-4" />;
      case 'charging': return <Zap className="h-4 w-4" />;
      default: return <Truck className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return diffMins;
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
            <p className="mt-4 text-xl text-muted-foreground">Loading service history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium">Service History</h1>
          <p className="text-muted-foreground">View all your past service requests and their details</p>
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
                  placeholder="Search by description, location, technician, or ID..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="tire">Tire</SelectItem>
                  <SelectItem value="accident">Accident</SelectItem>
                  <SelectItem value="charging">Charging</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{serviceHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. Response</p>
                  <p className="text-2xl font-bold">12m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${serviceHistory.reduce((sum, service) => sum + service.cost, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Technicians</p>
                  <p className="text-2xl font-bold">
                    {new Set(serviceHistory.map(s => s.technician.name)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service History List */}
        <Card>
          <CardHeader>
            <CardTitle>Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((service) => (
                  <Card key={service.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(service.type)}
                            <div>
                              <h3 className="font-semibold text-lg">{service.description}</h3>
                              <p className="text-sm text-muted-foreground">ID: {service.id}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{service.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(service.requestedAt)}</span>
                            </div>
                            {service.completedAt && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{calculateDuration(service.requestedAt, service.completedAt)}m</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                            <Badge className={getPriorityColor(service.priority)}>
                              {service.priority}
                            </Badge>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-lg">${service.cost.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{service.vehicle}</p>
                          </div>
                          
                          <div className="text-right text-sm">
                            <p className="font-medium">{service.technician.name}</p>
                            <p className="text-muted-foreground">⭐ {service.technician.rating}/5</p>
                          </div>
                          
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${service.technician.phone}`}>
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
