'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { 
  IconBolt as Zap, 
  IconShield as Shield, 
  IconCar as Car, 
  IconMapPin as MapPin, 
  IconClock as Clock, 
  IconUsers as Users, 
  IconStar as Star, 
  IconArrowRight as ArrowRight,
  IconCheck as CheckCircle,
  IconBattery as Battery,
  IconTrendingUp as TrendingUp
} from '@tabler/icons-react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeFeature] = useState(0)

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Response',
      description: 'Get emergency charging assistance in under 15 minutes with our premium service.',
      color: 'text-green-400'
    },
    {
      icon: Shield,
      title: '24/7 Emergency Support',
      description: 'Round-the-clock support team ready to help you in any emergency situation.',
      color: 'text-green-400'
    },
    {
      icon: Car,
      title: 'EV Specialists',
      description: 'Certified technicians with expertise in all electric vehicle models and charging systems.',
      color: 'text-purple-400'
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Track your rescue vehicle in real-time with live GPS updates and ETA predictions.',
      color: 'text-orange-400'
    }
  ]

  const stats = [
    { number: '15,247', label: 'Successful Rescues', icon: CheckCircle },
    { number: '12 min', label: 'Average Response Time', icon: Clock },
    { number: '847', label: 'Certified Technicians', icon: Users },
    { number: '99.8%', label: 'Service Uptime', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Tesla Model 3 Owner',
      content: 'EV Rescue Premium saved me when I was stranded on the highway. Their response was incredibly fast and professional.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'BMW i3 Owner',
      content: 'The real-time tracking feature is amazing. I could see exactly when help would arrive.',
      rating: 5,
      avatar: 'MR'
    },
    {
      name: 'Emily Johnson',
      role: 'Nissan Leaf Owner',
      content: 'Best investment I made for my EV. The peace of mind is worth every penny.',
      rating: 5,
      avatar: 'EJ'
    },
    {
      name: 'David Kim',
      role: 'Audi e-tron Owner',
      content: 'Outstanding service! They arrived in 12 minutes and had me back on the road in no time.',
      rating: 5,
      avatar: 'DK'
    },
    {
      name: 'Lisa Wang',
      role: 'Porsche Taycan Owner',
      content: 'Professional, reliable, and worth every cent. EV Rescue Premium is a lifesaver!',
      rating: 5,
      avatar: 'LW'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full particle opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-300 rounded-full particle opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-500 rounded-full particle opacity-25"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-green-400 rounded-full particle opacity-35"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-green-300 rounded-full particle opacity-20"></div>
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-green-800/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="glass-dark rounded-2xl p-8 backdrop-blur-xl mb-8">
              <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/30">
                <Zap className="w-4 h-4 mr-2" />
                Emergency EV Charging Service
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent">
                EV Rescue Premium
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Never get stranded again. Professional emergency charging assistance for your electric vehicle, 
                available 24/7 with lightning-fast response times.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold btn-glass">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg btn-glass">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center card-glass p-6 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-green-400 mr-2 icon-bounce" />
                    <span className="text-3xl font-bold text-white">{stat.number}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose EV Rescue Premium?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We provide the most reliable and fastest emergency charging service for electric vehicles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-glass border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center`}>
                    <feature.icon className={`w-8 h-8 ${feature.color} icon-bounce`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get help in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Request Help</h3>
              <p className="text-gray-400">Use our app to request emergency charging assistance with your exact location.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Track Response</h3>
              <p className="text-gray-400">Watch your rescue vehicle approach in real-time with live tracking and ETA updates.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get Charged</h3>
              <p className="text-gray-400">Our certified technicians provide fast, professional charging service to get you back on the road.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied EV owners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Never Get Stranded Again?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of EV owners who trust EV Rescue Premium for their emergency charging needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Battery className="w-8 h-8 text-green-400 mr-2" />
                <span className="text-xl font-bold">EV Rescue Premium</span>
              </div>
              <p className="text-gray-400">Professional emergency charging service for electric vehicles.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Charging</li>
                <li>Fleet Management</li>
                <li>Real-time Tracking</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EV Rescue Premium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
