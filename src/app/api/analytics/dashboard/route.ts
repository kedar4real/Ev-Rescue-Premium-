import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../../lib/database'
import { getFirebaseAuth } from '../../../../lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getFirebaseAuth().verifyIdToken(token)

    // Only admins can access analytics
    if (decodedToken.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d, 1y

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }

    // Get analytics data
    const analytics = await DatabaseService.getAnalytics({ start: startDate, end: endDate })
    
    // Get additional real-time data
    const [users, emergencyRequests, fleetVehicles] = await Promise.all([
      DatabaseService.getUsersByRole('user'),
      DatabaseService.getEmergencyRequests(),
      DatabaseService.getFleetVehicles()
    ])

    // Calculate metrics
    const totalUsers = users.length
    const activeUsers = users.filter(user => {
      const lastActive = user.currentLocation.lastUpdated.toDate()
      const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceActive <= 30
    }).length

    const totalRequests = emergencyRequests.length
    const completedRequests = emergencyRequests.filter(req => req.status === 'completed').length
    const pendingRequests = emergencyRequests.filter(req => req.status === 'pending').length
    const inProgressRequests = emergencyRequests.filter(req => req.status === 'in_progress').length

    // Calculate average response time
    const completedWithTimes = emergencyRequests.filter(req => 
      req.status === 'completed' && req.actualArrival && req.createdAt
    )
    const averageResponseTime = completedWithTimes.length > 0 
      ? completedWithTimes.reduce((sum, req) => {
          const responseTime = req.actualArrival!.toDate().getTime() - req.createdAt.toDate().getTime()
          return sum + responseTime
        }, 0) / completedWithTimes.length / (1000 * 60) // Convert to minutes
      : 0

    // Calculate revenue
    const revenue = emergencyRequests
      .filter(req => req.status === 'completed')
      .reduce((sum, req) => sum + req.cost, 0)

    // Calculate fleet utilization
    const availableVehicles = fleetVehicles.filter(vehicle => vehicle.status === 'available').length
    const busyVehicles = fleetVehicles.filter(vehicle => vehicle.status === 'busy').length
    const fleetUtilization = fleetVehicles.length > 0 ? (busyVehicles / fleetVehicles.length) * 100 : 0

    // Calculate user satisfaction
    const ratedRequests = emergencyRequests.filter(req => req.rating && req.rating > 0)
    const userSatisfaction = ratedRequests.length > 0
      ? ratedRequests.reduce((sum, req) => sum + req.rating!, 0) / ratedRequests.length
      : 0

    // Request type breakdown
    const requestTypes = emergencyRequests.reduce((acc, req) => {
      acc[req.requestType] = (acc[req.requestType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Geographic breakdown
    const geographic = emergencyRequests.reduce((acc, req) => {
      const city = req.location.address.split(',')[1]?.trim() || 'Unknown'
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Time of day breakdown
    const timeOfDay = emergencyRequests.reduce((acc, req) => {
      const hour = req.createdAt.toDate().getHours()
      const period = hour < 6 ? 'Night' : hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
      acc[period] = (acc[period] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const dashboardData = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      metrics: {
        totalUsers,
        activeUsers,
        newUsers: users.filter(user => {
          const daysSinceCreated = (Date.now() - user.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24)
          return daysSinceCreated <= 30
        }).length,
        totalRequests,
        completedRequests,
        pendingRequests,
        inProgressRequests,
        averageResponseTime: Math.round(averageResponseTime),
        revenue,
        fleetUtilization: Math.round(fleetUtilization),
        userSatisfaction: Math.round(userSatisfaction * 10) / 10
      },
      breakdown: {
        requestTypes,
        userSegments: {
          basic: users.filter(user => user.subscription.plan === 'basic').length,
          premium: users.filter(user => user.subscription.plan === 'premium').length,
          enterprise: users.filter(user => user.subscription.plan === 'enterprise').length
        },
        geographic,
        timeOfDay
      },
      fleet: {
        total: fleetVehicles.length,
        available: availableVehicles,
        busy: busyVehicles,
        maintenance: fleetVehicles.filter(vehicle => vehicle.status === 'maintenance').length,
        offline: fleetVehicles.filter(vehicle => vehicle.status === 'offline').length
      },
      recentActivity: emergencyRequests
        .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
        .slice(0, 10)
        .map(req => ({
          id: req.id,
          type: req.requestType,
          status: req.status,
          location: req.location.address,
          createdAt: req.createdAt.toDate().toISOString(),
          user: req.userInfo.name
        }))
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
