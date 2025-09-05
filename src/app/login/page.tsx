'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import { 
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  EnvelopeIcon as Mail,
  LockClosedIcon as Lock,
  ExclamationCircleIcon as AlertCircle,
  Battery0Icon as Battery,
  ArrowRightIcon as ArrowRight,
  SparklesIcon as Sparkles,
  ClockIcon as Clock,
  MapPinIcon as MapPin,
  PhoneIcon as Phone,
  UserGroupIcon as UserGroup
} from '@heroicons/react/24/outline'
import { notify } from '../../components/ui/notification'
import Link from 'next/link'

import { useAuth } from '../../components/providers/AuthProvider'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  

  const { signIn, signInWithGoogle, signInWithFacebook, signInWithTwitter } = useAuth()

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Tesla Model 3 Owner",
      content: "EV Rescue saved me when I was stranded on the highway. Their response was incredibly fast and professional.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "BMW i3 Owner", 
      content: "The real-time tracking feature is amazing. I could see exactly when help would arrive.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Nissan Leaf Owner",
      content: "Best investment I made for my EV. The peace of mind is worth every penny.",
      rating: 5,
      avatar: "EJ"
    }
  ]

  const features = [
    {
      icon: Clock,
      title: "15-Minute Response",
      description: "Average response time for emergency calls"
    },
    {
      icon: MapPin,
      title: "Nationwide Coverage",
      description: "Available in 50+ cities across the country"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock emergency assistance"
    },
    {
      icon: UserGroup,
      title: "10,000+ Happy Customers",
      description: "Trusted by EV owners nationwide"
    }
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Password strength calculation
  useEffect(() => {
    if (formData.password) {
      let strength = 0
      if (formData.password.length >= 8) strength += 1
      if (/[A-Z]/.test(formData.password)) strength += 1
      if (/[a-z]/.test(formData.password)) strength += 1
      if (/[0-9]/.test(formData.password)) strength += 1
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [formData.password])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Use the authentication system
      await signIn(formData.email, formData.password)
      
      // Success notification and redirect handled by AuthProvider
      notify.success('Login Successful', 'Welcome back to EV Rescue Premium!')
      
    } catch (error) {
      notify.error('Login Failed', error instanceof Error ? error.message : 'Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true)
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          notify.success('Login Successful', 'Welcome back to EV Rescue Premium!')
          break
        case 'facebook':
          await signInWithFacebook()
          notify.success('Login Successful', 'Welcome back to EV Rescue Premium!')
          break
        case 'twitter':
          await signInWithTwitter()
          notify.success('Login Successful', 'Welcome back to EV Rescue Premium!')
          break
        default:
          notify.info('Social Login', `${provider} login coming soon!`)
      }
    } catch (error) {
      notify.error('Social Login Failed', error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <Battery className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">EV Rescue</h1>
                <p className="text-green-400 text-sm font-medium">Premium</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 text-lg">Sign in to continue your EV journey</p>
          </div>

          {/* Login Form */}
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 ${
                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-12 pr-12 h-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200 ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'} password
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                      className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300 cursor-pointer">Remember me</Label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-900/50 px-4 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="h-12 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    className="h-12 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('twitter')}
                    className="h-12 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Features & Testimonials */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-900/20 to-green-800/10 p-12 flex-col justify-center">
        <div className="max-w-lg">
          {/* Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-400" />
              Why Choose EV Rescue Premium?
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-green-400 mb-3" />
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Testimonials */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">What Our Customers Say</h3>
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="p-6 bg-gray-900/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-4 h-4 text-yellow-400">★</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    title={`Go to testimonial ${index + 1}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-green-400 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
