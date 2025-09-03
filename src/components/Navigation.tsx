'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Menu, 
  X, 
  Battery, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  MapPin,
  Zap,
  Car,
  MessageSquare,
  BarChart3,
  CreditCard
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { notify } from './ui/notification'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await logout()
      notify.success('Signed Out', 'You have been successfully signed out')
      router.push('/landing')
    } catch (error) {
      notify.error('Sign Out Error', 'Failed to sign out. Please try again.')
    }
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Emergency', href: '/emergency-assistance', icon: Zap },
    { name: 'Charging Finder', href: '/charging-finder', icon: MapPin },
    { name: 'Fleet', href: '/fleet', icon: Car },
    { name: 'Tracking', href: '/tracking', icon: MapPin },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
  ]

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? '/dashboard' : '/landing'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">EV Rescue</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Premium
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Bell className="w-5 h-5" />
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <span className="hidden sm:block">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</span>
                  </Button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard className="w-4 h-4 mr-3" />
                        Billing
                      </Link>
                      <hr className="my-1 border-gray-700" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
