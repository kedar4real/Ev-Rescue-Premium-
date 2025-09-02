import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../../lib/database'
import { auth } from '../../../../lib/firebase'
import { getFirebaseAuth } from '../../../../lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getFirebaseAuth().verifyIdToken(token)
    const userId = decodedToken.uid

    // Validate userId
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 })
    }

    const body = await request.json()
    const {
      location,
      vehicleInfo,
      requestType,
      priority = 'medium',
      notes = '',
      images = []
    } = body

    // Validate required fields
    if (!location || !vehicleInfo || !requestType) {
      return NextResponse.json(
        { error: 'Missing required fields: location, vehicleInfo, requestType' },
        { status: 400 }
      )
    }

    // Get user information
    const user = await DatabaseService.getUser(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check subscription limits
    if (user.subscription.requestsUsed >= user.subscription.requestsLimit) {
      return NextResponse.json(
        { error: 'Monthly request limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Create emergency request
    const requestData = {
      userId,
      userInfo: {
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        email: user.email
      },
      location,
      vehicleInfo,
      requestType,
      priority,
      status: 'pending' as const,
      notes,
      images,
      cost: 0, // Will be calculated based on service type
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const requestId = await DatabaseService.createEmergencyRequest(requestData)

    // Update user's request count
    await DatabaseService.updateUser(userId, {
      subscription: {
        ...user.subscription,
        requestsUsed: user.subscription.requestsUsed + 1
      }
    })

    // Create notification for user (only if userId is valid)
    if (userId) {
      await DatabaseService.createNotification({
        userId,
        type: 'service_update',
        title: 'Emergency Request Created',
        message: `Your ${requestType} request has been created and is being processed.`,
        isRead: false,
        priority: 'medium'
      })
    }

    // TODO: Notify available providers
    // TODO: Calculate estimated arrival time
    // TODO: Send SMS/email confirmation

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Emergency request created successfully'
    })

  } catch (error) {
    console.error('Error creating emergency request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
