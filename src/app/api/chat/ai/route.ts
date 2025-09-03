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

  // Emergency detection with enhanced keywords
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || 
      lowerMessage.includes('stuck') || lowerMessage.includes('dead battery') ||
      lowerMessage.includes('stranded') || lowerMessage.includes('help') ||
      lowerMessage.includes('battery dead') || lowerMessage.includes('no charge')) {
    return {
      content: "🚨 I understand you're in an emergency situation. Let me help you get assistance immediately. I can connect you with our emergency response team or help you create an emergency request right away.",
      suggestions: ["Create Emergency Request", "Call Emergency Hotline", "Find Nearest Service", "Share Location"],
      actionType: 'emergency',
      confidence: 0.95
    }
  }

  // Location/Charging station requests
  if (lowerMessage.includes('charging station') || lowerMessage.includes('charger') || 
      lowerMessage.includes('nearby') || lowerMessage.includes('location') ||
      lowerMessage.includes('where') || lowerMessage.includes('find') ||
      lowerMessage.includes('station') || lowerMessage.includes('plug')) {
    return {
      content: "🔋 I can help you find nearby charging stations! Let me show you the closest available stations with real-time status, pricing, and availability.",
      suggestions: ["Show Charging Stations", "Get Directions", "Check Availability", "Filter by Type"],
      actionType: 'location',
      confidence: 0.9
    }
  }

  // Subscription/Account queries
  if (lowerMessage.includes('subscription') || lowerMessage.includes('plan') || 
      lowerMessage.includes('billing') || lowerMessage.includes('payment') ||
      lowerMessage.includes('account') || lowerMessage.includes('invoice') ||
      lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return {
      content: "💳 I can help you with your subscription and billing information. You can view your current plan, usage statistics, and payment history in your dashboard.",
      suggestions: ["View Subscription", "Upgrade Plan", "Billing History", "Payment Methods", "Usage Stats"],
      actionType: 'info',
      confidence: 0.85
    }
  }

  // Request tracking
  if (lowerMessage.includes('track') || lowerMessage.includes('status') || 
      lowerMessage.includes('request') || lowerMessage.includes('where') ||
      lowerMessage.includes('eta') || lowerMessage.includes('arrival') ||
      lowerMessage.includes('progress') || lowerMessage.includes('update')) {
    return {
      content: "📍 I can help you track your service requests! Let me check the status of your current requests and show you real-time updates including ETA and service provider location.",
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
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('help') || lowerMessage.includes('how') || 
      lowerMessage.includes('what') || lowerMessage.includes('can you')) {
    return {
      content: "👋 Hello! I'm your EV Rescue assistant. I can help you with emergency services, finding charging stations, managing your subscription, tracking requests, and technical support. What can I help you with today?",
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
  return {
    content: "I understand you're looking for help. Could you be more specific about what you need? I can assist with emergency services, charging stations, subscriptions, technical support, or general questions about EV Rescue.",
    suggestions: ["Emergency Help", "Find Chargers", "Account Help", "Technical Support", "General Info"],
    actionType: 'info',
    confidence: 0.5
  }
}
