'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  FileText, 
  Image, 
  Smile,
  Clock,
  User,
  Bot,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import { notify } from '../../components/ui/notification'
import { ChatSkeleton } from '../../components/LoadingSkeleton'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'read'
}

interface SupportCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function LiveChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatStatus, setChatStatus] = useState<'waiting' | 'connected' | 'ended'>('waiting')
  const [agentInfo, setAgentInfo] = useState<{
    name: string
    avatar: string
    status: 'online' | 'busy' | 'offline'
    rating: number
  } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supportCategories: SupportCategory[] = [
    {
      id: 'emergency',
      name: 'Emergency Support',
      description: 'Urgent roadside assistance',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      id: 'charging',
      name: 'Charging Issues',
      description: 'Charging station problems',
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      id: 'technical',
      name: 'Technical Support',
      description: 'Vehicle technical issues',
      icon: Bot,
      color: 'text-green-500'
    },
    {
      id: 'billing',
      name: 'Billing & Payments',
      description: 'Payment and invoice queries',
      icon: FileText,
      color: 'text-purple-500'
    }
  ]

  // Mock agent connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatStatus('connected')
      setAgentInfo({
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        rating: 4.8
      })
      
      // Add welcome message
      setMessages([
        {
          id: '1',
          content: 'Hi! I\'m Sarah, your EV Rescue support specialist. How can I help you today?',
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
          status: 'read'
        }
      ])
      setIsInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false)
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(newMessage),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      }
      setMessages(prev => [...prev, agentResponse])
    }, 1000 + Math.random() * 2000)
  }

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return 'I understand this is urgent. Let me connect you with our emergency response team immediately. Can you provide your current location?'
    } else if (lowerMessage.includes('charging') || lowerMessage.includes('battery')) {
      return 'I can help you with charging issues. Are you experiencing problems with a specific charging station or your vehicle\'s charging system?'
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('bill')) {
      return 'I\'ll be happy to help with your billing questions. Can you provide your account number or the specific issue you\'re experiencing?'
    } else {
      return 'Thank you for your message. I\'m here to help. Could you please provide more details about your concern?'
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setChatStatus('waiting')
    setMessages([])
    setAgentInfo(null)
    
    // Simulate reconnection
    setTimeout(() => {
      setChatStatus('connected')
      setAgentInfo({
        name: 'Mike Chen',
        avatar: '/api/placeholder/40/40',
        status: 'online',
        rating: 4.9
      })
      
      setMessages([
        {
          id: '1',
          content: `Hi! I'm Mike, your ${supportCategories.find(c => c.id === categoryId)?.name} specialist. How can I assist you?`,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
          status: 'read'
        }
      ])
    }, 1500)
  }

  const endChat = () => {
    setChatStatus('ended')
    notify.success('Chat Ended', 'Your chat session has been ended. Thank you for contacting EV Rescue!')
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Live Chat Support</h1>
            <p className="text-xl text-green-400 max-w-2xl mx-auto">
              24/7 real-time support for all your EV rescue needs
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Support Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg border-2 border-gray-600 bg-gray-800">
                      <div className="animate-pulse flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-700 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-24"></div>
                          <div className="h-3 bg-gray-700 rounded w-32"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card className="bg-gray-900 border-gray-700 h-[600px]">
                <ChatSkeleton />
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Live Chat Support</h1>
          <p className="text-xl text-green-400 max-w-2xl mx-auto">
            24/7 real-time support for all your EV rescue needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Support Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Support Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-left ${
                        selectedCategory === category.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${category.color}`} />
                        <div>
                          <div className="font-medium text-white">{category.name}</div>
                          <div className="text-sm text-gray-400">{category.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900 border-gray-700 h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-700 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {agentInfo ? (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={agentInfo.avatar} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {agentInfo.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white">{agentInfo.name}</div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className={`w-2 h-2 rounded-full ${
                              agentInfo.status === 'online' ? 'bg-green-500' : 
                              agentInfo.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <span className="text-gray-400 capitalize">{agentInfo.status}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-yellow-400">★ {agentInfo.rating}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Connecting...</div>
                          <div className="text-sm text-gray-400">Please wait</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {chatStatus === 'connected' && (
                      <>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Video className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={endChat}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.sender === 'user' && (
                          <span className="flex items-center gap-1">
                            {message.status === 'sent' && <Clock className="h-3 w-3" />}
                            {message.status === 'delivered' && <CheckCircle className="h-3 w-3" />}
                            {message.status === 'read' && <CheckCircle className="h-3 w-3 text-green-400" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-400">Agent is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    disabled={chatStatus !== 'connected'}
                  />
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || chatStatus !== 'connected'}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
