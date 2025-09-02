import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../../lib/database'
import { getFirebaseAuth } from '../../../../lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getFirebaseAuth().verifyIdToken(token)

    // Validate token
    if (!decodedToken.uid) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 })
    }

    // Only admins can send notifications
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userIds, type, title, message, priority = 'medium', data } = await request.json()

    if (!userIds || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userIds, type, title, message' },
        { status: 400 }
      )
    }

    const notifications = []
    const userIdsArray = Array.isArray(userIds) ? userIds : [userIds]

    for (const userId of userIdsArray) {
      // Validate userId before creating notification
      if (!userId) {
        console.warn('Skipping notification creation for undefined userId')
        continue
      }

      const notificationData = {
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        priority
      }

      const notificationId = await DatabaseService.createNotification(notificationData)
      notifications.push(notificationId)
    }

    return NextResponse.json({
      success: true,
      notifications,
      message: `Notifications sent to ${userIdsArray.length} users`
    })

  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
