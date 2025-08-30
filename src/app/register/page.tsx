'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Checkbox } from '../../components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  MapPin,
  Github, 
  Chrome,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { notify } from '../../components/ui/notification'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/providers/AuthProvider'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreeToTerms: false,
    subscribeToNewsletter: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const router = useRouter()
  const { signUp } = useAuth()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
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
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      })
      
      // Success notification and redirect handled by AuthProvider
      notify.success('Registration Successful', 'Welcome to EV Rescue Premium! Your account has been created.')
      
    } catch (error) {
      notify.error('Registration Failed', error instanceof Error ? error.message : 'Something went wrong. Please try again.')
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

  const { signInWithGoogle, signInWithFacebook, signInWithTwitter } = useAuth()

  const handleSocialRegister = async (provider: string) => {
    try {
      setIsLoading(true)
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          notify.success('Registration Successful', 'Welcome to EV Rescue Premium!')
          break
        case 'facebook':
          await signInWithFacebook()
          notify.success('Registration Successful', 'Welcome to EV Rescue Premium!')
          break
        case 'twitter':
          await signInWithTwitter()
          notify.success('Registration Successful', 'Welcome to EV Rescue Premium!')
          break
        default:
          notify.info('Social Registration', `${provider} registration coming soon!`)
      }
    } catch (error) {
      notify.error('Social Registration Failed', error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EV Rescue</h1>
              <p className="text-green-400 text-sm">Premium</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Create your account</h2>
          <p className="text-gray-400">Join EV Rescue Premium for 24/7 emergency charging support</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.lastName ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
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

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                      errors.address ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.address && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.address}
                  </div>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                      }`}
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
                  {errors.password && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-400 hover:text-green-300 underline">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-green-400 hover:text-green-300 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.agreeToTerms}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subscribeToNewsletter"
                    checked={formData.subscribeToNewsletter}
                    onCheckedChange={(checked) => handleInputChange('subscribeToNewsletter', checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="subscribeToNewsletter" className="text-sm text-gray-300">
                    Subscribe to our newsletter for updates and offers
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Social Registration */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialRegister('Google')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialRegister('GitHub')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-3xl mb-2">⚡</div>
            <div className="text-white font-medium mb-1">24/7 Emergency Support</div>
            <div className="text-gray-400 text-sm">Round-the-clock roadside assistance</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-3xl mb-2">🚗</div>
            <div className="text-white font-medium mb-1">EV Specialists</div>
            <div className="text-gray-400 text-sm">Expert technicians for electric vehicles</div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-3xl mb-2">📱</div>
            <div className="text-white font-medium mb-1">Real-time Tracking</div>
            <div className="text-gray-400 text-sm">Live updates on service progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}
