'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { notify } from '../../components/ui/notification'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'emergency' | 'billing' | 'technical'
}

interface SupportTicket {
  id: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: Date
  category: string
}

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general' as 'general' | 'technical' | 'billing' | 'emergency'
  })
  
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const faqData: FAQItem[] = [
    {
      id: 'faq_001',
      question: 'How quickly can I expect a charging unit to arrive?',
      answer: 'Response times vary by priority: High priority requests (15-25 min), Medium priority (30-45 min), Low priority (45-60 min). We always prioritize safety and emergency situations.',
      category: 'emergency'
    },
    {
      id: 'faq_002',
      question: 'What types of vehicles do you support?',
      answer: 'We support all electric vehicles including cars, motorcycles, scooters, and commercial vehicles. Our mobile charging units are compatible with most EV charging standards.',
      category: 'general'
    },
    {
      id: 'faq_003',
      question: 'How much does emergency charging cost?',
      answer: 'Costs vary by plan: Basic ($9.99/month), Premium ($19.99/month), Enterprise ($49.99/month). Emergency charges are included in your subscription with no additional fees.',
      category: 'billing'
    },
    {
      id: 'faq_004',
      question: 'What if I\'m in a remote location?',
      answer: 'Our network covers most areas, but if you\'re in an extremely remote location, we\'ll coordinate with local emergency services and provide alternative solutions.',
      category: 'emergency'
    },
    {
      id: 'faq_005',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time with no cancellation fees. Your coverage remains active until the end of your current billing period.',
      category: 'billing'
    },
    {
      id: 'faq_006',
      question: 'How do I update my vehicle information?',
      answer: 'You can update your vehicle information anytime in your profile settings. Go to Profile > Vehicles to add, edit, or remove vehicle details.',
      category: 'technical'
    },
    {
      id: 'faq_007',
      question: 'What happens if the charging unit doesn\'t work?',
      answer: 'If there are any issues with the charging unit, our provider will immediately contact backup support. We guarantee a working solution or your money back.',
      category: 'technical'
    },
    {
      id: 'faq_008',
      question: 'Do you provide roadside assistance?',
      answer: 'Yes! Our emergency service includes basic roadside assistance. For complex mechanical issues, we\'ll coordinate with local towing services.',
      category: 'emergency'
    }
  ]

  const supportTickets: SupportTicket[] = [
    {
      id: 'ticket_001',
      subject: 'Battery level not updating in app',
      description: 'The battery level shown in the app doesn\'t match my vehicle\'s actual battery level. This could cause issues during emergency requests.',
      priority: 'medium',
      status: 'in_progress',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: 'technical'
    },
    {
      id: 'ticket_002',
      subject: 'Payment method declined',
      description: 'My credit card was declined when trying to renew my premium subscription. The card works everywhere else.',
      priority: 'high',
      status: 'open',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'billing'
    }
  ]

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      notify.error('Form Error', 'Please fill in all required fields')
      return
    }

    // Simulate form submission
    notify.success('Ticket Created', 'Your support ticket has been created successfully')
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      category: 'general'
    })
    
    setIsContactFormOpen(false)
  }

  const handleEmergencySupport = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    notify.info('Emergency Support', 'Connecting you to emergency support immediately...')
    // In real app, this would initiate emergency support
  }

  const handleLiveChat = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    router.push('/chat')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-900/50 text-red-200'
      case 'high': return 'bg-orange-900/50 text-orange-200'
      case 'medium': return 'bg-yellow-900/50 text-yellow-200'
      case 'low': return 'bg-green-900/50 text-green-200'
      default: return 'bg-gray-900/50 text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-900/50 text-blue-200'
      case 'in_progress': return 'bg-yellow-900/50 text-yellow-200'
      case 'resolved': return 'bg-green-900/50 text-green-200'
      case 'closed': return 'bg-gray-900/50 text-gray-200'
      default: return 'bg-gray-900/50 text-gray-200'
    }
  }

  return (
    <div className="min-h-screen emergency-bg text-white py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.08),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--success)/0.08),transparent_40%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            🆘 Support Center
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Get help when you need it most. Our support team is available 24/7 for emergency assistance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-700/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-white mb-3">Emergency Support</h3>
              <p className="text-gray-300 text-sm mb-4">Immediate assistance for urgent situations</p>
              <Button
                onClick={handleEmergencySupport}
                className="w-full bg-red-600 hover:bg-red-700 border-0"
              >
                Get Emergency Help
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-700/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
              <p className="text-gray-300 text-sm mb-4">Chat with support agents in real-time</p>
              <Button
                onClick={handleLiveChat}
                className="w-full bg-blue-600 hover:bg-blue-700 border-0"
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-700/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-3">Create Ticket</h3>
              <p className="text-gray-300 text-sm mb-4">Submit a support ticket for non-urgent issues</p>
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 border-0"
              >
                Create Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">❓ Frequently Asked Questions</h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-xl"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              aria-label="Filter FAQ by category"
              title="Filter FAQ by category"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="emergency">Emergency</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
            </select>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {filteredFAQ.map((item) => (
              <Card key={item.id} className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  <div className="mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.category === 'emergency' ? 'bg-red-900/50 text-red-200' :
                      item.category === 'billing' ? 'bg-blue-900/50 text-blue-200' :
                      item.category === 'technical' ? 'bg-purple-900/50 text-purple-200' :
                      'bg-gray-900/50 text-gray-200'
                    }`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        {isAuthenticated && supportTickets.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">🎫 Your Support Tickets</h2>
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-gray-900/60 border-gray-700/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{ticket.subject}</h3>
                        <p className="text-gray-300 text-sm mb-3">{ticket.description}</p>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-900/50 text-gray-200">
                            {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-gray-400 text-sm">
                        {ticket.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form Modal */}
        {isContactFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900/95 border-gray-700/50 backdrop-blur-md shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold">Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                      <Input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                             <select
                         value={contactForm.category}
                         onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value as 'general' | 'technical' | 'billing' | 'emergency' }))}
                         className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                         aria-label="Select ticket category"
                         title="Select ticket category"
                       >
                        <option value="general">General</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Priority *</label>
                                             <select
                         value={contactForm.priority}
                         onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                         className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                         aria-label="Select ticket priority"
                         title="Select ticket priority"
                       >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                    <Input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please describe your issue in detail..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent rounded-xl resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setIsContactFormOpen(false)}
                      variant="outline"
                      className="flex-1 border-2 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 rounded-xl px-4 py-3 font-semibold transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-xl px-4 py-3 font-semibold shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                    >
                      Submit Ticket
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Information */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-3xl font-black text-white mb-6">Need More Help?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Our support team is available 24/7 to assist you with any questions or concerns. 
                Don&apos;t hesitate to reach out!
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">📞</div>
                  <div className="text-white font-semibold">Phone Support</div>
                  <div className="text-gray-300">1-800-EV-RESCUE</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">📧</div>
                  <div className="text-white font-semibold">Email Support</div>
                  <div className="text-gray-300">support@evrescue.com</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🕒</div>
                  <div className="text-white font-semibold">Response Time</div>
                  <div className="text-gray-300">Within 2 hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
