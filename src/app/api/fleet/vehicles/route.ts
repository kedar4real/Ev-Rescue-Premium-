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

    // Only admins and providers can access fleet data
    if (decodedToken.role !== 'admin' && decodedToken.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const vehicles = await DatabaseService.getFleetVehicles()

    return NextResponse.json({
      success: true,
      vehicles
    })

  } catch (error) {
    console.error('Error fetching fleet vehicles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await getFirebaseAuth().verifyIdToken(token)

    // Only admins and providers can update fleet data
    if (decodedToken.role !== 'admin' && decodedToken.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { vehicleId, updates } = await request.json()

    if (!vehicleId) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
    }

    await DatabaseService.updateFleetVehicle(vehicleId, updates)

    return NextResponse.json({
      success: true,
      message: 'Vehicle updated successfully'
    })

  } catch (error) {
    console.error('Error updating fleet vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
