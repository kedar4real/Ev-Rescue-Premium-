'use client'

import React from 'react';
import { Icon } from '../ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface EVRescueDashboardProps {
  onNavigate?: (view: string) => void;
}

export const EVRescueDashboard: React.FC<EVRescueDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm animate-slide-down">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          {/* Logo */}
          <div className="mr-8 flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="zap" className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline-block font-bold text-xl tracking-tight">
              EV Rescue Premium
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'charging', label: 'Find Charging' },
              { id: 'assistance', label: 'Assistance' },
              { id: 'tracking', label: 'Track Progress' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id) || console.log(`Navigating to: ${item.id}`)}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  item.id === 'dashboard' 
                    ? 'text-primary bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {item.label}
                {item.id === 'dashboard' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors duration-200">
              <Icon name="bell" className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent transition-colors duration-200">
              <Icon name="user" className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent transition-colors duration-200">
              <Icon name="settings" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 space-y-12 animate-fade-in">
        {/* Welcome Section */}
        <div className="space-y-6 animate-slide-up">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight">Welcome back, Alex</h1>
            <p className="text-xl text-muted-foreground">Your Tesla Model 3 is ready to go</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-full">
              <div className="status-dot status-online"></div>
              <span className="font-medium">Tesla Model 3</span>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 bg-card border border-border rounded-full">
              <Icon name="battery" className="h-4 w-4 text-primary" />
              <span className="font-medium">76% charged</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Find Charging Stations */}
          <Card className="uber-card hover-lift transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info">
                  <Icon name="mapPin" className="h-6 w-6 text-info-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Find Charging</CardTitle>
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
                  <Icon name="navigation" className="h-4 w-4 text-info" />
                  <span>Within 2 miles of your location</span>
                </div>
              </div>
              <Button className="w-full uber-button-primary" onClick={() => onNavigate?.('charging')}>
                <span>View Stations</span>
                <Icon name="chevronRight" className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Assistance */}
          <Card className="uber-card hover-lift transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning">
                  <Icon name="alertTriangle" className="h-6 w-6 text-warning-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">Emergency Help</CardTitle>
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
                  <Icon name="clock" className="h-4 w-4 text-warning" />
                  <span>Available now in your area</span>
                </div>
              </div>
              <Button variant="outline" className="w-full border-warning text-warning hover:bg-warning hover:text-warning-foreground font-medium transition-all duration-200" onClick={() => onNavigate?.('assistance')}>
                <span>Request Help</span>
                <Icon name="chevronRight" className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Mobile Charging */}
          <Card className="uber-card hover-lift transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Icon name="truck" className="h-6 w-6 text-primary-foreground" />
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
                  <span className="text-sm text-muted-foreground">Service status</span>
                  <Badge variant="outline" className="border-primary text-primary">Available</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="zap" className="h-4 w-4 text-primary" />
                  <span>Ready to dispatch in your area</span>
                </div>
              </div>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium transition-all duration-200">
                <span>Schedule Service</span>
                <Icon name="chevronRight" className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Activity */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Current Activity</h2>
              <p className="text-muted-foreground">Real-time updates on your service</p>
            </div>
            <Badge className="bg-primary text-primary-foreground px-4 py-2 font-medium"> Live Updates </Badge>
          </div>
          <Card className="uber-card border-primary/20 bg-card">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Icon name="truck" className="h-6 w-6 text-primary-foreground" />
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
                    <Icon name="clock" className="h-5 w-5 text-primary" />
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
                <Icon name="mapPin" className="h-6 w-6 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="font-semibold">Current Location</p>
                  <p className="text-muted-foreground">Main St & 5th Ave • Moving towards you</p>
                </div>
              </div>
              <Button className="w-full uber-button-primary text-lg py-4" onClick={() => onNavigate?.('tracking')}>
                <Icon name="navigation" className="h-5 w-5 mr-3" />
                <span>Track in Real-time</span>
                <Icon name="chevronRight" className="h-5 w-5 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Status */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Vehicle Status</h2>
              <p className="text-muted-foreground">Real-time monitoring</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="uber-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info">
                    <Icon name="battery" className="h-6 w-6 text-info-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Battery Level</p>
                    <p className="text-2xl font-bold">76%</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Next Service</p>
                    <p className="text-2xl font-bold">2,450 mi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="uber-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Icon name="settings" className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">System Status</p>
                    <p className="text-2xl font-bold">Optimal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

