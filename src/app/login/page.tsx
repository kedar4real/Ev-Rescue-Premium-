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
  Github, 
  Chrome,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { notify } from '../../components/ui/notification'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  
  const router = useRouter()
  const { signIn } = useAuth()

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

  const handleSocialLogin = (provider: string) => {
    notify.info('Social Login', `${provider} login coming soon!`)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md">
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
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-300">Remember me</Label>
                </div>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  Forgot password?
                </Link>
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
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-2xl mb-1">⚡</div>
            <div className="text-white text-sm font-medium">Fast Response</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-2xl mb-1">🛡️</div>
            <div className="text-white text-sm font-medium">24/7 Support</div>
          </div>
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-green-400 text-2xl mb-1">🚗</div>
            <div className="text-white text-sm font-medium">EV Specialists</div>
          </div>
        </div>
      </div>
    </div>
  )
}
