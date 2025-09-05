'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { notify } from './ui/notification'

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'user' | 'provider' | 'system'
  message: string
  timestamp: Date
  isRead: boolean
  attachments?: {
    type: 'image' | 'file' | 'location'
    url: string
    name: string
  }[]
}

interface ChatProps {
  requestId: string
  providerId?: string
  providerName?: string
  isOpen: boolean
  onClose: () => void
}

export default function Chat({ requestId, providerId, providerName, isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadChatHistory()
      scrollToBottom()
    }
  }, [isOpen, requestId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatHistory = async () => {
    setIsLoading(true)
    try {
      // Mock chat history
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          senderId: 'system',
          senderName: 'System',
          senderType: 'system',
          message: 'Emergency request #REQ001 has been assigned to Elite EV Rescue',
          timestamp: new Date(Date.now() - 300000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'provider1',
          senderName: 'EV Rescue Premium',
          senderType: 'provider',
          message: 'Hello! We\'re on our way to your location. ETA: 12 minutes. Please confirm your exact location.',
          timestamp: new Date(Date.now() - 240000),
          isRead: true
        },
        {
          id: '3',
          senderId: 'user1',
          senderName: 'You',
          senderType: 'user',
          message: 'Thank you! I\'m at the corner of 5th Avenue and 42nd Street, near the Starbucks.',
          timestamp: new Date(Date.now() - 180000),
          isRead: true
        },
        {
          id: '4',
          senderId: 'provider1',
          senderName: 'EV Rescue Premium',
          senderType: 'provider',
          message: 'Perfect! We can see your location. Our mobile unit is equipped with a 75kWh fast charger. What\'s your vehicle type?',
          timestamp: new Date(Date.now() - 120000),
          isRead: true
        },
        {
          id: '5',
          senderId: 'user1',
          senderName: 'You',
          senderType: 'user',
          message: 'Tesla Model 3, 2023. Battery is at 5%.',
          timestamp: new Date(Date.now() - 60000),
          isRead: true
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      notify.error('Chat Error', 'Failed to load chat history')
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user1',
      senderName: 'You',
      senderType: 'user',
      message: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    }

    setMessages(prev => [...prev, message])
    const currentMessage = newMessage.trim()
    setNewMessage('')
    setIsTyping(true)
    
    try {
      // Send message to API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: requestId,
          senderId: 'user1',
          senderName: 'You',
          senderType: 'user',
          message: currentMessage
        })
      })

      if (response.ok) {
        // Update message status
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, isRead: true } : msg
        ))
      }

      // Simulate intelligent provider response
      setTimeout(() => {
        setIsTyping(false)
        const providerResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'provider1',
          senderName: providerName || 'Service Provider',
          senderType: 'provider',
          message: generateProviderResponse(currentMessage),
          timestamp: new Date(),
          isRead: false
        }
        setMessages(prev => [...prev, providerResponse])
      }, 1500 + Math.random() * 2000)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsTyping(false)
      
      // Fallback response
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'provider1',
        senderName: providerName || 'Service Provider',
        senderType: 'provider',
        message: 'Message received. We\'ll respond shortly.',
        timestamp: new Date(),
        isRead: false
      }
      setMessages(prev => [...prev, errorResponse])
    }
  }

  const generateProviderResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return 'Thank you for the location update. We can see your position and are en route. ETA: 12 minutes.'
    } else if (lowerMessage.includes('battery') || lowerMessage.includes('charge')) {
      return 'Understood. Our mobile unit is equipped with a 75kWh fast charger. We\'ll get you back on the road quickly.'
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return 'We\'re treating this as a priority. Our emergency response team is dispatched and will arrive shortly.'
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! We\'re here to help. Is there anything else you need assistance with?'
    } else if (lowerMessage.includes('eta') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return 'Current ETA is 10-15 minutes. We\'ll send you real-time updates as we approach your location.'
    } else {
      return 'Message received. We\'re monitoring your request and will provide updates shortly.'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate file upload
      notify.info('File Upload', `${file.name} uploaded successfully`)
      e.target.value = ''
    }
  }

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationMessage: ChatMessage = {
            id: Date.now().toString(),
            senderId: 'user1',
            senderName: 'You',
            senderType: 'user',
            message: '📍 Current Location Shared',
            timestamp: new Date(),
            isRead: false,
            attachments: [{
              type: 'location',
              url: `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`,
              name: 'Current Location'
            }]
          }
          setMessages(prev => [...prev, locationMessage])
          notify.success('Location Shared', 'Your current location has been shared')
        },
        (error) => {
          notify.error('Location Error', 'Failed to get your location')
        }
      )
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50">
      <Card className="h-full bg-gray-900/95 border-gray-700/50 backdrop-blur-md shadow-2xl">
        <CardHeader className="pb-4 border-b border-gray-700/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Live Chat
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            {providerName ? `Chat with ${providerName}` : 'Emergency Support Chat'}
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.senderType === 'user'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                          : message.senderType === 'system'
                          ? 'bg-gray-700/50 text-gray-300 text-center'
                          : 'bg-gray-800/50 text-white border border-gray-700/30'
                      }`}
                    >
                      {message.senderType !== 'system' && (
                        <div className="text-xs text-gray-300 mb-1 font-medium">
                          {message.senderName}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">{message.message}</div>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="bg-white/10 rounded-lg p-2">
                              {attachment.type === 'location' && (
                                <a
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-green-300 hover:text-green-200 text-xs"
                                >
                                  📍 {attachment.name}
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${
                        message.senderType === 'user' ? 'text-green-200' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                        {message.senderType === 'user' && (
                          <span className="ml-2">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800/50 text-white rounded-2xl px-4 py-3 border border-gray-700/30">
                      <div className="text-sm text-gray-300 mb-1">Service Provider</div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">Typing</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full p-2"
                title="Attach file"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </Button>
              <Button
                onClick={sendLocation}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full p-2"
                title="Share location"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent rounded-2xl px-4 py-3 text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 px-4 py-3 rounded-2xl font-semibold shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            aria-label="Attach file"
            title="Attach file"
          />
        </CardContent>
      </Card>
    </div>
  )
}
