'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  CreditCard,
  Settings
} from 'lucide-react'
import { notify } from '../../components/ui/notification'
import { useAuth } from '../../components/providers/AuthProvider'
import Link from 'next/link'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notify.success('Profile Updated', 'Your profile has been updated successfully!')
      setIsEditing(false)
    } catch (error) {
      notify.error('Update Failed', 'Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Profile</h1>
          <p className="text-xl text-green-400">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback className="bg-green-600 text-white text-2xl">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Member since:</span>
                    <span className="text-white">{user.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/settings">
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                    <Calendar className="h-4 w-4 mr-2" />
                    Service History
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
                    <Shield className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Personal Information</CardTitle>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-300">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card className="bg-gray-900 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-2">12</div>
                    <div className="text-gray-400 text-sm">Services Used</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-2">4.9</div>
                    <div className="text-gray-400 text-sm">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">98%</div>
                    <div className="text-gray-400 text-sm">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Emergency service completed</div>
                      <div className="text-gray-400 text-sm">Battery replacement service</div>
                    </div>
                    <div className="text-gray-400 text-sm">2 days ago</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Charging station found</div>
                      <div className="text-gray-400 text-sm">Located nearby station</div>
                    </div>
                    <div className="text-gray-400 text-sm">1 week ago</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Profile updated</div>
                      <div className="text-gray-400 text-sm">Contact information changed</div>
                    </div>
                    <div className="text-gray-400 text-sm">2 weeks ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
