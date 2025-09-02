'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { 
  ChatBubbleLeftRightIcon as MessageCircle,
  PaperAirplaneIcon as Send,
  CpuChipIcon as Bot,
  UserIcon as User,
  XMarkIcon as X,
  ArrowPathIcon as Loader2,
  PhoneIcon as Phone,
  MapPinIcon as MapPin,
  ClockIcon as Clock,
  ExclamationTriangleIcon as AlertTriangle,
  CheckCircleIcon as CheckCircle
} from '@heroicons/react/24/outline'
import { analytics } from '../lib/analytics'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
  actionType?: 'emergency' | 'location' | 'booking' | 'info'
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
  onEmergencyRequest?: () => void
  onLocationRequest?: () => void
}

export function AIChatbot({ isOpen, onClose, onEmergencyRequest, onLocationRequest }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your EV Rescue assistant. How can I help you today?",
        timestamp: new Date(),
        suggestions: [
          "I need emergency charging",
          "Find nearby charging stations",
          "Check my subscription",
          "Track my request"
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Track user interaction
    analytics.trackFeatureUsed('chatbot_message', {
      message: message,
      timestamp: new Date()
    })

    try {
      // Simulate AI response
      const botResponse = await generateAIResponse(message)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
        actionType: botResponse.actionType
      }

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 1000 + Math.random() * 2000) // Simulate thinking time

    } catch (error) {
      console.error('Error generating AI response:', error)
      setIsTyping(false)
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<{
    content: string
    suggestions?: string[]
    actionType?: 'emergency' | 'location' | 'booking' | 'info'
  }> => {
    const message = userMessage.toLowerCase()

    // Emergency detection
    if (message.includes('emergency') || message.includes('urgent') || message.includes('stuck') || message.includes('dead battery')) {
      return {
        content: "I understand you're in an emergency situation. Let me help you get assistance immediately. I can connect you with our emergency response team or help you create an emergency request.",
        suggestions: ["Create Emergency Request", "Call Emergency Hotline", "Find Nearest Service"],
        actionType: 'emergency'
      }
    }

    // Location/Charging station requests
    if (message.includes('charging station') || message.includes('charger') || message.includes('nearby') || message.includes('location')) {
      return {
        content: "I can help you find nearby charging stations. Let me show you the closest available stations and their real-time status.",
        suggestions: ["Show Charging Stations", "Get Directions", "Check Availability"],
        actionType: 'location'
      }
    }

    // Subscription/Account queries
    if (message.includes('subscription') || message.includes('plan') || message.includes('billing') || message.includes('payment')) {
      return {
        content: "I can help you with your subscription details. You can view your current plan, usage, and billing information in your dashboard.",
        suggestions: ["View Subscription", "Upgrade Plan", "Billing History", "Payment Methods"]
      }
    }

    // Request tracking
    if (message.includes('track') || message.includes('status') || message.includes('request') || message.includes('where')) {
      return {
        content: "I can help you track your service requests. Let me check the status of your current requests and show you real-time updates.",
        suggestions: ["View Active Requests", "Track Service Provider", "Get ETA"]
      }
    }

    // General help
    if (message.includes('help') || message.includes('how') || message.includes('what')) {
      return {
        content: "I'm here to help! I can assist you with emergency services, finding charging stations, managing your subscription, and tracking your requests. What would you like to know more about?",
        suggestions: ["Emergency Services", "Charging Stations", "Subscription Plans", "How It Works"]
      }
    }

    // Default response
    return {
      content: "I understand you're looking for help. Could you be more specific about what you need? I can assist with emergency services, charging stations, subscriptions, or general questions about EV Rescue.",
      suggestions: ["Emergency Help", "Find Chargers", "Account Help", "General Info"]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Create Emergency Request" && onEmergencyRequest) {
      onEmergencyRequest()
      return
    }
    if (suggestion === "Show Charging Stations" && onLocationRequest) {
      onLocationRequest()
      return
    }
    handleSendMessage(suggestion)
  }

  const handleActionClick = (actionType: string) => {
    switch (actionType) {
      case 'emergency':
        if (onEmergencyRequest) onEmergencyRequest()
        break
      case 'location':
        if (onLocationRequest) onLocationRequest()
        break
      default:
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-gray-900/95 border-gray-700/50 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-sm">EV Rescue Assistant</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white"
              >
                {isMinimized ? '↑' : '↓'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[400px] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-green-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <Bot className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin text-green-400" />
                        <span className="text-xs text-gray-400">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length > 0 && messages[messages.length - 1].suggestions && (
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-gray-800/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/50"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages[messages.length - 1]?.actionType && (
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                  {messages[messages.length - 1].actionType === 'emergency' && (
                    <Button
                      onClick={() => handleActionClick('emergency')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Help
                    </Button>
                  )}
                  {messages[messages.length - 1].actionType === 'location' && (
                    <Button
                      onClick={() => handleActionClick('location')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Find Chargers
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(input)
                    }
                  }}
                />
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// Floating Chat Button
export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-40"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
