'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  BoltIcon as Zap,
  Bars3Icon as Menu,
  BellIcon as Bell,
  UserIcon as User,
  MapPinIcon as MapPin,
  ExclamationCircleIcon as AlertCircle,
  TruckIcon as Truck,
  Battery0Icon as Battery,
  ArrowRightOnRectangleIcon as LogOut,
  Cog6ToothIcon as Settings,
  ChevronDownIcon as ChevronDown
} from '@heroicons/react/24/outline'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './providers/AuthProvider'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { user, userProfile, isAuthenticated, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const navItems = [
    { id: '/', label: 'Dashboard', icon: Zap },
    { id: '/charging-finder', label: 'Find Charging', icon: MapPin },
    { id: '/emergency-assistance', label: 'Emergency', icon: AlertCircle },
    { id: '/tracking', label: 'Track Progress', icon: Truck },
    { id: '/chat', label: 'Live Chat', icon: Battery },
    { id: '/fleet', label: 'Fleet', icon: Truck },
    { id: '/history', label: 'History', icon: Battery },
    { id: '/van-management', label: 'Van Management', icon: Truck },
    { id: '/analytics', label: 'Analytics', icon: Battery }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-gray-900 border-gray-700">
            <div className="px-2 py-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-black" />
                </div>
                <span className="font-bold text-white">EV Rescue</span>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        pathname === item.id
                          ? 'bg-green-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo - Hidden on desktop since sidebar has its own logo */}
        <div className="flex items-center gap-2 mr-6 md:hidden">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Zap className="h-4 w-4 text-black" />
          </div>
          <span className="font-bold text-white hidden sm:inline">EV Rescue</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback className="bg-green-600 text-white text-sm">
                    {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {userProfile?.firstName} {userProfile?.lastName}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium">{userProfile?.firstName} {userProfile?.lastName}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  
                  <div className="border-t border-gray-700 my-1"></div>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
