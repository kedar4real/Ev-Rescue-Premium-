import { NextRequest, NextResponse } from 'next/server'

interface AIResponse {
  content: string
  suggestions?: string[]
  actionType?: 'emergency' | 'location' | 'booking' | 'info' | 'support'
  confidence?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, userId } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Enhanced AI response generation
    const aiResponse = await generateAIResponse(message, context, userId)

    return NextResponse.json(aiResponse)
  } catch (error) {
    console.error('Error generating AI response:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}

async function generateAIResponse(message: string, context?: any, userId?: string): Promise<AIResponse> {
  const lowerMessage = message.toLowerCase()
  
  // Add variety to responses with multiple options
  const emergencyResponses = [
    "🚨 I understand you're in an emergency situation. Let me help you get assistance immediately. I can connect you with our emergency response team or help you create an emergency request right away.",
    "🚨 Emergency detected! I'm here to help you get immediate assistance. Our emergency response team can be dispatched to your location within minutes.",
    "🚨 I see you need urgent help! Let me connect you with our emergency services right away. We have mobile charging units ready to assist you.",
    "🚨 Emergency situation recognized! I'll help you get the fastest possible assistance. Our team is standing by to help you get back on the road."
  ]

  // Emergency detection with enhanced keywords
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || 
      lowerMessage.includes('stuck') || lowerMessage.includes('dead battery') ||
      lowerMessage.includes('stranded') || lowerMessage.includes('help') ||
      lowerMessage.includes('battery dead') || lowerMessage.includes('no charge')) {
    return {
      content: emergencyResponses[Math.floor(Math.random() * emergencyResponses.length)],
      suggestions: ["Create Emergency Request", "Call Emergency Hotline", "Find Nearest Service", "Share Location"],
      actionType: 'emergency',
      confidence: 0.95
    }
  }

  // Location/Charging station requests
  const chargingResponses = [
    "🔋 I can help you find nearby charging stations! Let me show you the closest available stations with real-time status, pricing, and availability.",
    "🔋 Looking for charging stations? I'll help you locate the nearest ones with current availability and pricing information.",
    "🔋 I can find the best charging stations near you! Let me show you options with real-time status and competitive rates.",
    "🔋 Need to charge up? I'll help you discover nearby charging stations with live availability and pricing details."
  ]

  if (lowerMessage.includes('charging station') || lowerMessage.includes('charger') || 
      lowerMessage.includes('nearby') || lowerMessage.includes('location') ||
      lowerMessage.includes('where') || lowerMessage.includes('find') ||
      lowerMessage.includes('station') || lowerMessage.includes('plug')) {
    return {
      content: chargingResponses[Math.floor(Math.random() * chargingResponses.length)],
      suggestions: ["Show Charging Stations", "Get Directions", "Check Availability", "Filter by Type"],
      actionType: 'location',
      confidence: 0.9
    }
  }

  // Subscription/Account queries
  const subscriptionResponses = [
    "💳 I can help you with your subscription and billing information. You can view your current plan, usage statistics, and payment history in your dashboard.",
    "💳 Let me assist you with your account and subscription details. I can show you your current plan, billing history, and usage statistics.",
    "💳 I'm here to help with your subscription management! You can access your plan details, payment history, and usage analytics through your dashboard.",
    "💳 Need help with your account? I can provide information about your subscription, billing details, and service usage statistics."
  ]

  if (lowerMessage.includes('subscription') || lowerMessage.includes('plan') || 
      lowerMessage.includes('billing') || lowerMessage.includes('payment') ||
      lowerMessage.includes('account') || lowerMessage.includes('invoice') ||
      lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return {
      content: subscriptionResponses[Math.floor(Math.random() * subscriptionResponses.length)],
      suggestions: ["View Subscription", "Upgrade Plan", "Billing History", "Payment Methods", "Usage Stats"],
      actionType: 'info',
      confidence: 0.85
    }
  }

  // Request tracking
  const trackingResponses = [
    "📍 I can help you track your service requests! Let me check the status of your current requests and show you real-time updates including ETA and service provider location.",
    "📍 Need to track your service? I'll show you the current status of your requests with live updates on ETA and technician location.",
    "📍 Let me help you monitor your service requests! I can provide real-time tracking information including arrival times and service provider updates.",
    "📍 I'll help you track your service status! You can see live updates on your requests, including ETA and technician location information."
  ]

  if (lowerMessage.includes('track') || lowerMessage.includes('status') || 
      lowerMessage.includes('request') || lowerMessage.includes('where') ||
      lowerMessage.includes('eta') || lowerMessage.includes('arrival') ||
      lowerMessage.includes('progress') || lowerMessage.includes('update')) {
    return {
      content: trackingResponses[Math.floor(Math.random() * trackingResponses.length)],
      suggestions: ["View Active Requests", "Track Service Provider", "Get ETA", "Request Updates"],
      actionType: 'info',
      confidence: 0.9
    }
  }

  // Technical support
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || 
      lowerMessage.includes('not working') || lowerMessage.includes('error') ||
      lowerMessage.includes('trouble') || lowerMessage.includes('fix') ||
      lowerMessage.includes('broken') || lowerMessage.includes('malfunction')) {
    return {
      content: "🔧 I'm here to help with technical issues! I can connect you with our technical support team or provide troubleshooting guidance for common EV problems.",
      suggestions: ["Technical Support", "Troubleshooting Guide", "Schedule Service", "Contact Expert"],
      actionType: 'support',
      confidence: 0.8
    }
  }

  // Booking/Scheduling
  if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || 
      lowerMessage.includes('appointment') || lowerMessage.includes('reserve') ||
      lowerMessage.includes('plan') || lowerMessage.includes('arrange')) {
    return {
      content: "📅 I can help you book or schedule services! You can schedule maintenance, charging sessions, or emergency services at your convenience.",
      suggestions: ["Schedule Service", "Book Charging", "Maintenance Appointment", "Emergency Booking"],
      actionType: 'booking',
      confidence: 0.85
    }
  }

  // Greeting/General help
  const greetingResponses = [
    "👋 Hello! I'm your EV Rescue assistant. I can help you with emergency services, finding charging stations, managing your subscription, tracking requests, and technical support. What can I help you with today?",
    "👋 Hi there! I'm here to assist you with all your EV needs. Whether you need emergency help, want to find charging stations, or need support with your account, I'm ready to help!",
    "👋 Welcome! I'm your EV Rescue AI assistant. I can help with emergency services, charging station locations, account management, service tracking, and technical support. How can I assist you?",
    "👋 Hello! I'm your dedicated EV Rescue helper. From emergency assistance to finding the best charging stations, I'm here to make your EV journey smooth and worry-free. What do you need help with?",
    "👋 Hi! I'm your EV Rescue assistant, ready to help with emergency services, charging station finder, subscription management, and technical support. What can I do for you today?"
  ]

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('help') || lowerMessage.includes('how') || 
      lowerMessage.includes('what') || lowerMessage.includes('can you')) {
    return {
      content: greetingResponses[Math.floor(Math.random() * greetingResponses.length)],
      suggestions: ["Emergency Services", "Find Charging Stations", "Check Subscription", "Track Requests", "Technical Support"],
      actionType: 'info',
      confidence: 0.7
    }
  }

  // Weather/Route planning
  if (lowerMessage.includes('weather') || lowerMessage.includes('route') || 
      lowerMessage.includes('trip') || lowerMessage.includes('journey') ||
      lowerMessage.includes('travel') || lowerMessage.includes('drive')) {
    return {
      content: "🗺️ I can help you plan your EV journey! I can provide weather-aware route planning, charging station recommendations along your route, and trip optimization.",
      suggestions: ["Plan Route", "Weather Check", "Charging Stops", "Trip Calculator"],
      actionType: 'info',
      confidence: 0.8
    }
  }

  // Default response with context awareness
  const defaultResponses = [
    "I understand you're looking for help. Could you be more specific about what you need? I can assist with emergency services, charging stations, subscriptions, technical support, or general questions about EV Rescue.",
    "I'm here to help! Please let me know what specific assistance you need. I can help with emergency services, finding charging stations, account management, technical support, or answer questions about our services.",
    "How can I assist you today? I'm equipped to help with emergency EV services, charging station locations, subscription management, technical support, and general inquiries about EV Rescue Premium.",
    "I'm ready to help! Could you provide more details about what you need assistance with? I can support you with emergency services, charging station finder, account help, technical issues, or general questions.",
    "What can I help you with? I'm here to assist with emergency EV services, charging station locations, subscription management, technical support, and any questions you might have about our services."
  ]

  return {
    content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    suggestions: ["Emergency Help", "Find Chargers", "Account Help", "Technical Support", "General Info"],
    actionType: 'info',
    confidence: 0.5
  }
}
