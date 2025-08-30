'use client'

import React, { useState } from 'react';
import { Icon } from '../ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  membership: 'basic' | 'premium' | 'enterprise';
  joinDate: string;
  totalRequests: number;
  completedRequests: number;
  averageRating: number;
  vehicles: Vehicle[];
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'car' | 'scooter' | 'bike';
  batteryCapacity: number;
  currentBattery: number;
  lastService: string;
  nextService: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareVehicleInfo: boolean;
    shareContactInfo: boolean;
  };
  language: string;
  timezone: string;
}

export const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'contacts' | 'preferences' | 'security' | 'billing'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [userData] = useState<UserData>({
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: '/api/placeholder/150/150',
    membership: 'premium',
    joinDate: 'March 2024',
    totalRequests: 24,
    completedRequests: 22,
    averageRating: 4.8,
    vehicles: [
      {
        id: '1',
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        type: 'car',
        batteryCapacity: 75,
        currentBattery: 68,
        lastService: '2024-02-15',
        nextService: '2024-05-15'
      },
      {
        id: '2',
        make: 'Segway',
        model: 'Ninebot MAX',
        year: 2022,
        type: 'scooter',
        batteryCapacity: 48,
        currentBattery: 42,
        lastService: '2024-01-20',
        nextService: '2024-04-20'
      }
    ],
    emergencyContacts: [
      {
        id: '1',
        name: 'Sarah Johnson',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'sarah.johnson@email.com',
        isPrimary: true
      },
      {
        id: '2',
        name: 'Mike Chen',
        relationship: 'Friend',
        phone: '+1 (555) 456-7890',
        email: 'mike.chen@email.com',
        isPrimary: false
      }
    ],
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      privacy: {
        shareLocation: true,
        shareVehicleInfo: true,
        shareContactInfo: false
      },
      language: 'English',
      timezone: 'America/New_York'
    }
  });

  const handleEdit = () => {
    setEditData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case 'enterprise': return 'bg-purple-500 text-white';
      case 'premium': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMembershipIcon = (membership: string) => {
    switch (membership) {
      case 'enterprise': return <Icon name="shield" className="h-4 w-4" />;
      case 'premium': return <Icon name="shield" className="h-4 w-4" />;
      default: return <Icon name="user" className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Icon name="user" className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Icon name="bell" className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Icon name="settings" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="uber-card animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-info flex items-center justify-center text-white text-2xl font-bold">
                {userData.name.charAt(0)}
              </div>
              <Button size="icon" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full">
                <Icon name="camera" className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                  <p className="text-sm text-muted-foreground">Member since {userData.joinDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getMembershipColor(userData.membership)}>
                    <div className="flex items-center space-x-1">
                      {getMembershipIcon(userData.membership)}
                      <span className="capitalize">{userData.membership}</span>
                    </div>
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEdit}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="edit" className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">{userData.totalRequests}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-success">{userData.completedRequests}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-warning">{userData.averageRating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-card p-1 rounded-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
        {[
          { id: 'profile', label: 'Profile', icon: 'user' },
          { id: 'vehicles', label: 'Vehicles', icon: 'car' },
          { id: 'contacts', label: 'Emergency Contacts', icon: 'phone' },
          { id: 'preferences', label: 'Preferences', icon: 'settings' },
          { id: 'security', label: 'Security', icon: 'shield' },
          { id: 'billing', label: 'Billing', icon: 'creditCard' }
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as 'profile' | 'vehicles' | 'contacts' | 'preferences' | 'security' | 'billing')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon name={icon as 'user' | 'car' | 'phone' | 'settings' | 'shield' | 'creditCard'} className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card className="uber-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} className="uber-button-primary">
                      <Icon name="save" className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="font-medium">{userData.joinDate}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Vehicles</h2>
            <Button className="uber-button-primary">
              <Icon name="car" className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {userData.vehicles.map((vehicle, index) => (
              <Card 
                key={vehicle.id} 
                className="uber-card hover-lift transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                      <CardDescription className="capitalize">{vehicle.type}</CardDescription>
                    </div>
                    <Badge variant="outline" className="border-primary text-primary">
                      {vehicle.currentBattery}% Battery
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Battery Level</span>
                      <span>{vehicle.currentBattery}/{vehicle.batteryCapacity} kWh</span>
                    </div>
                    <Progress value={(vehicle.currentBattery / vehicle.batteryCapacity) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Service</span>
                      <span>{vehicle.lastService}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next Service</span>
                      <span>{vehicle.nextService}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Icon name="edit" className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="icon">
                      <Icon name="mapPin" className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Emergency Contacts</h2>
            <Button className="uber-button-primary">
              <Icon name="phone" className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {userData.emergencyContacts.map((contact, index) => (
              <Card 
                key={contact.id} 
                className="uber-card hover-lift transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>{contact.relationship}</CardDescription>
                    </div>
                    {contact.isPrimary && (
                      <Badge className="bg-primary text-primary-foreground">
                        Primary
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="phone" className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="mail" className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Icon name="edit" className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="icon">
                      <Icon name="phone" className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card className="uber-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(userData.preferences.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key} Notifications</span>
                    <Button 
                      variant={value ? "default" : "outline"} 
                      size="sm"
                      className={value ? "bg-primary" : ""}
                    >
                      {value ? "On" : "Off"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="uber-card">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control what information is shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(userData.preferences.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">Share {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <Button 
                      variant={value ? "default" : "outline"} 
                      size="sm"
                      className={value ? "bg-primary" : ""}
                    >
                      {value ? "On" : "Off"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card className="uber-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="lock" className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="key" className="h-4 w-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="shield" className="h-4 w-4 mr-2" />
                  Login History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card className="uber-card">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="creditCard" className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="creditCard" className="h-4 w-4 mr-2" />
                  Billing History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="settings" className="h-4 w-4 mr-2" />
                  Subscription Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Logout Section */}
      <Card className="uber-card animate-slide-up" style={{ animationDelay: '600ms' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive">
              <Icon name="logOut" className="h-5 w-5 text-destructive-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <Icon name="logOut" className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
