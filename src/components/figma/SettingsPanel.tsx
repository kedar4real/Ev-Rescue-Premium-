'use client'

import React, { useState } from 'react';
import { Icon } from '../ui/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  emergency: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  locationSharing: boolean;
  dataAnalytics: boolean;
  thirdPartySharing: boolean;
  profileVisibility: 'public' | 'private' | 'contacts';
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  units: 'metric' | 'imperial';
}

export const SettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'app' | 'account'>('notifications');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
    emergency: true,
    marketing: false
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    locationSharing: true,
    dataAnalytics: true,
    thirdPartySharing: false,
    profileVisibility: 'contacts'
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'dark',
    language: 'English',
    timezone: 'UTC-5',
    units: 'imperial'
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppSettingChange = (key: keyof AppSettings, value: string) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDataUsageColor = (usage: number) => {
    if (usage < 50) return 'text-success';
    if (usage < 80) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-xl text-muted-foreground">Customize your app experience and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="uber-card">
            <CardContent className="p-6">
              <nav className="space-y-2">
                {[
                  { id: 'notifications', label: 'Notifications', icon: 'bell' },
                  { id: 'privacy', label: 'Privacy & Security', icon: 'shield' },
                  { id: 'app', label: 'App Settings', icon: 'settings' },
                  { id: 'account', label: 'Account', icon: 'user' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'notifications' | 'privacy' | 'app' | 'account')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon name={tab.icon as 'bell' | 'shield' | 'settings' | 'user'} className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="bell" className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                        </div>
                      </div>
                      <Button 
                        variant={notificationSettings.push ? "default" : "outline"}
                        onClick={() => handleNotificationChange('push')}
                      >
                        {notificationSettings.push ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="mail" className="h-5 w-5 text-info" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Get updates via email</p>
                        </div>
                      </div>
                      <Button 
                        variant={notificationSettings.email ? "default" : "outline"}
                        onClick={() => handleNotificationChange('email')}
                      >
                        {notificationSettings.email ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="messageCircle" className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                        </div>
                      </div>
                      <Button 
                        variant={notificationSettings.sms ? "default" : "outline"}
                        onClick={() => handleNotificationChange('sms')}
                      >
                        {notificationSettings.sms ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="alertTriangle" className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">Emergency Alerts</p>
                          <p className="text-sm text-muted-foreground">Critical notifications for emergencies</p>
                        </div>
                      </div>
                      <Button 
                        variant={notificationSettings.emergency ? "default" : "outline"}
                        onClick={() => handleNotificationChange('emergency')}
                      >
                        {notificationSettings.emergency ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="megaphone" className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Marketing Communications</p>
                          <p className="text-sm text-muted-foreground">Receive promotional content and updates</p>
                        </div>
                      </div>
                      <Button 
                        variant={notificationSettings.marketing ? "default" : "outline"}
                        onClick={() => handleNotificationChange('marketing')}
                      >
                        {notificationSettings.marketing ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Schedule */}
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Notification Schedule</CardTitle>
                  <CardDescription>Set quiet hours and notification timing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quiet Hours Start</label>
                      <Input type="time" defaultValue="22:00" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quiet Hours End</label>
                      <Input type="time" defaultValue="08:00" className="bg-background" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="quiet-hours" className="rounded" />
                    <label htmlFor="quiet-hours" className="text-sm">Enable quiet hours (emergency alerts will still come through)</label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="mapPin" className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Location Sharing</p>
                          <p className="text-sm text-muted-foreground">Share your location for better service</p>
                        </div>
                      </div>
                      <Button 
                        variant={privacySettings.locationSharing ? "default" : "outline"}
                        onClick={() => handlePrivacyChange('locationSharing', !privacySettings.locationSharing)}
                      >
                        {privacySettings.locationSharing ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="barChart3" className="h-5 w-5 text-info" />
                        <div>
                          <p className="font-medium">Data Analytics</p>
                          <p className="text-sm text-muted-foreground">Help improve our services with usage data</p>
                        </div>
                      </div>
                      <Button 
                        variant={privacySettings.dataAnalytics ? "default" : "outline"}
                        onClick={() => handlePrivacyChange('dataAnalytics', !privacySettings.dataAnalytics)}
                      >
                        {privacySettings.dataAnalytics ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="share2" className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">Third-Party Sharing</p>
                          <p className="text-sm text-muted-foreground">Allow data sharing with trusted partners</p>
                        </div>
                      </div>
                      <Button 
                        variant={privacySettings.thirdPartySharing ? "default" : "outline"}
                        onClick={() => handlePrivacyChange('thirdPartySharing', !privacySettings.thirdPartySharing)}
                      >
                        {privacySettings.thirdPartySharing ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="eye" className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                        </div>
                      </div>
                      <select 
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        aria-label="Profile visibility setting"
                      >
                        <option value="public">Public</option>
                        <option value="contacts">Contacts Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="lock" className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="key" className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="shield" className="h-5 w-5 text-info" />
                      <div>
                        <p className="font-medium">Login History</p>
                        <p className="text-sm text-muted-foreground">View recent login activity</p>
                      </div>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* App Settings Tab */}
          {activeTab === 'app' && (
            <div className="space-y-6">
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="monitor" className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Theme</p>
                          <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
                        </div>
                      </div>
                      <select 
                        value={appSettings.theme}
                        onChange={(e) => handleAppSettingChange('theme', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        aria-label="Theme selection"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="globe" className="h-5 w-5 text-info" />
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">Select your preferred language</p>
                        </div>
                      </div>
                      <select 
                        value={appSettings.language}
                        onChange={(e) => handleAppSettingChange('language', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        aria-label="Language selection"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="clock" className="h-5 w-5 text-success" />
                        <div>
                          <p className="font-medium">Timezone</p>
                          <p className="text-sm text-muted-foreground">Set your local timezone</p>
                        </div>
                      </div>
                      <select 
                        value={appSettings.timezone}
                        onChange={(e) => handleAppSettingChange('timezone', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        aria-label="Timezone selection"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC+0">UTC</option>
                        <option value="UTC+1">Central European Time (UTC+1)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="ruler" className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">Units</p>
                          <p className="text-sm text-muted-foreground">Choose your preferred measurement system</p>
                        </div>
                      </div>
                      <select 
                        value={appSettings.units}
                        onChange={(e) => handleAppSettingChange('units', e.target.value)}
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        aria-label="Units selection"
                      >
                        <option value="metric">Metric (km, °C)</option>
                        <option value="imperial">Imperial (mi, °F)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Usage */}
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Data Usage</CardTitle>
                  <CardDescription>Monitor your app data consumption</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Used</span>
                      <span className="text-sm text-muted-foreground">2.4 GB / 5 GB</span>
                    </div>
                    <Progress value={48} className="h-2" />
                    <p className="text-xs text-muted-foreground">48% of available storage used</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="font-medium">Cache</p>
                      <p className="text-muted-foreground">1.2 GB</p>
                    </div>
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="font-medium">Documents</p>
                      <p className="text-muted-foreground">800 MB</p>
                    </div>
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="font-medium">Media</p>
                      <p className="text-muted-foreground">400 MB</p>
                    </div>
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="font-medium">Other</p>
                      <p className="text-muted-foreground">200 MB</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">Clear Cache</Button>
                    <Button variant="outline" className="flex-1">Clear All Data</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input value="alex.johnson@email.com" disabled className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input value="+1 (555) 123-4567" disabled className="bg-background" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Update Email</Button>
                    <Button variant="outline">Update Phone</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your premium subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">Premium Plan</p>
                      <p className="text-sm text-muted-foreground">Next billing: March 15, 2024</p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">Active</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="uber-card">
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-destructive rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
