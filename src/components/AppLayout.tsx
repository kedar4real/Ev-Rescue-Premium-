'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIChatbot, ChatButton } from './AIChatbot'
import { geofencingService } from '../lib/geofencing'
import { analytics } from '../lib/analytics'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const router = useRouter()

  const handleEmergencyRequest = () => {
    setIsChatbotOpen(false)
    router.push('/emergency')
    analytics.trackFeatureUsed('emergency_request_from_chatbot')
  }

  const handleLocationRequest = () => {
    setIsChatbotOpen(false)
    router.push('/charging-stations')
    analytics.trackFeatureUsed('location_request_from_chatbot')
  }

  return (
    <>
      {children}
      
      {/* AI Chatbot */}
      <AIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onEmergencyRequest={handleEmergencyRequest}
        onLocationRequest={handleLocationRequest}
      />
      
      {/* Chat Button */}
      <ChatButton onClick={() => setIsChatbotOpen(true)} />
    </>
  )
}
