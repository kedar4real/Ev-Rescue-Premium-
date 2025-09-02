import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', planName } = await request.json()

    if (!amount || !planName) {
      return NextResponse.json(
        { error: 'Amount and plan name are required' },
        { status: 400 }
      )
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: planName,
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
