'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Switch } from '../../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Mail, 
  MapPin, 
  CreditCard,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Camera,
  AlertTriangle,
  BarChart3
} from 'lucide-react'
import { notify } from '../../components/ui/notification'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    emergency: boolean
    updates: boolean
    marketing: boolean
  }
  privacy: {
    locationSharing: boolean
    dataAnalytics: boolean
    thirdPartySharing: boolean
  }
  preferences: {
    language: string
    timezone: string
    currency: string
    theme: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      emergency: true,
      updates: true,
      marketing: false
    },
    privacy: {
      locationSharing: true,
      dataAnalytics: true,
      thirdPartySharing: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC+5:30',
      currency: 'USD',
      theme: 'dark'
    }
  })

  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '+1 (555) 987-6543'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleNotificationChange = (key: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }))
  }

  const handlePrivacyChange = (key: keyof UserSettings['privacy']) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }))
  }

  const handlePreferenceChange = (key: keyof UserSettings['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const handleProfileUpdate = () => {
    notify.success('Profile Updated', 'Your profile information has been updated successfully!')
  }

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      notify.error('Password Mismatch', 'New passwords do not match!')
      return
    }
    if (passwords.new.length < 8) {
      notify.error('Weak Password', 'Password must be at least 8 characters long!')
      return
    }
    notify.success('Password Changed', 'Your password has been updated successfully!')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      notify.info('Account Deletion', 'Account deletion request submitted. You will receive a confirmation email.')
    }
  }

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Settings</h1>
          <p className="text-xl text-green-400">Manage your account preferences and security</p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-green-400" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">First Name</label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Last Name</label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Email</label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Phone</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">Address</label>
                <Input
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Emergency Contact</label>
                  <Input
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Emergency Phone</label>
                  <Input
                    value={profileData.emergencyPhone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    type="tel"
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates via email</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-400">In-app notifications</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-400">Text message alerts</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <div>
                      <div className="text-white font-medium">Emergency Alerts</div>
                      <div className="text-sm text-gray-400">Critical service updates</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.emergency}
                    onCheckedChange={() => handleNotificationChange('emergency')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Location Sharing</div>
                      <div className="text-sm text-gray-400">Share location for emergency services</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.locationSharing}
                    onCheckedChange={() => handlePrivacyChange('locationSharing')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-white font-medium">Data Analytics</div>
                      <div className="text-sm text-gray-400">Help improve our services</div>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.dataAnalytics}
                    onCheckedChange={() => handlePrivacyChange('dataAnalytics')}
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">New Password</label>
                    <Input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Confirm Password</label>
                    <Input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange} className="bg-green-600 hover:bg-green-700 text-white">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Language</label>
                  <Select value={settings.preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Timezone</label>
                  <Select value={settings.preferences.timezone} onValueChange={(value) => handlePreferenceChange('timezone', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8:00">Pacific Time (UTC-8:00)</SelectItem>
                      <SelectItem value="UTC-5:00">Eastern Time (UTC-5:00)</SelectItem>
                      <SelectItem value="UTC+0:00">UTC (UTC+0:00)</SelectItem>
                      <SelectItem value="UTC+5:30">India (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC+8:00">China (UTC+8:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Currency</label>
                  <Select value={settings.preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Theme</label>
                  <Select value={settings.preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gray-900 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Delete Account</div>
                    <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
