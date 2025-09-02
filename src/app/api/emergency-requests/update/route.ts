import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../../lib/database'
import { getFirebaseAuth } from '../../../../lib/firebase-admin'

export async function PUT(request: NextRequest) {
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

    const { requestId, updates } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    // Get the current request to verify ownership or provider assignment
    const requests = await DatabaseService.getEmergencyRequests(userId)
    const currentRequest = requests.find(req => req.id === requestId)

    if (!currentRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Check if user has permission to update this request
    const canUpdate = 
      currentRequest.userId === userId || // User owns the request
      currentRequest.assignedProvider?.id === userId || // Provider is assigned
      decodedToken.role === 'admin' // Admin can update any request

    if (!canUpdate) {
      return NextResponse.json({ error: 'Unauthorized to update this request' }, { status: 403 })
    }

    // Validate status transitions
    if (updates.status) {
      const validTransitions = {
        'pending': ['assigned', 'cancelled'],
        'assigned': ['in_progress', 'cancelled'],
        'in_progress': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': []
      }

      const currentStatus = currentRequest.status
      const newStatus = updates.status

      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${newStatus}` },
          { status: 400 }
        )
      }
    }

    // Update the request
    await DatabaseService.updateEmergencyRequest(requestId, updates)

    // Create appropriate notifications
    if (updates.status) {
      let notificationTitle = ''
      let notificationMessage = ''

      switch (updates.status) {
        case 'assigned':
          notificationTitle = 'Service Provider Assigned'
          notificationMessage = 'A service provider has been assigned to your request.'
          break
        case 'in_progress':
          notificationTitle = 'Service In Progress'
          notificationMessage = 'Your service provider is on the way.'
          break
        case 'completed':
          notificationTitle = 'Service Completed'
          notificationMessage = 'Your emergency service has been completed.'
          break
        case 'cancelled':
          notificationTitle = 'Request Cancelled'
          notificationMessage = 'Your emergency request has been cancelled.'
          break
      }

      if (notificationTitle && currentRequest.userId) {
        await DatabaseService.createNotification({
          userId: currentRequest.userId,
          type: 'service_update',
          title: notificationTitle,
          message: notificationMessage,
          isRead: false,
          priority: updates.status === 'completed' ? 'high' : 'medium'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully'
    })

  } catch (error) {
    console.error('Error updating emergency request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
