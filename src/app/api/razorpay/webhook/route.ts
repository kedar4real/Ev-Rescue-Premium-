import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '../../../../lib/database'
import { subscriptionService } from '../../../../lib/subscription'
import crypto from 'crypto'

// Utility function to validate and extract userId from payment metadata
function validateUserId(payment: any): string | null {
  const userId = payment.notes?.userId
  if (!userId) {
    console.error('No userId in payment metadata')
    return null
  }
  if (typeof userId !== 'string' || userId.trim() === '') {
    console.error('Invalid userId format in payment metadata:', userId)
    return null
  }
  return userId
}

// Utility function to validate and extract userId from subscription metadata
function validateSubscriptionUserId(subscription: any): string | null {
  const userId = subscription.notes?.userId
  if (!userId) {
    console.error('No userId in subscription metadata')
    return null
  }
  if (typeof userId !== 'string' || userId.trim() === '') {
    console.error('Invalid userId format in subscription metadata:', userId)
    return null
  }
  return userId
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    console.log('Received Razorpay webhook:', event.event)

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break

      case 'subscription.charged':
        await handleSubscriptionCharged(event.payload.subscription.entity)
        break

      case 'subscription.completed':
        await handleSubscriptionCompleted(event.payload.subscription.entity)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.payload.subscription.entity)
        break

      case 'subscription.paused':
        await handleSubscriptionPaused(event.payload.subscription.entity)
        break

      case 'subscription.resumed':
        await handleSubscriptionResumed(event.payload.subscription.entity)
        break

      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle successful payment
async function handlePaymentCaptured(payment: any) {
  try {
    console.log('Payment captured:', payment.id)

    // Find user by payment metadata
    const userId = validateUserId(payment)
    if (!userId) return

    // Get user
    const user = await DatabaseService.getUser(userId)
    if (!user) {
      console.error('User not found:', userId)
      return
    }

    // Update user subscription
    const planId = payment.notes?.planId || 'basic'
    const interval = payment.notes?.interval || 'monthly'

    await DatabaseService.updateUser(userId, {
      subscription: {
        ...user.subscription,
        plan: planId as any,
        status: 'active' as any,
        startDate: new Date() as any,
        endDate: new Date(Date.now() + (interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000) as any,
        requestsUsed: 0
      }
    })

    // Create success notification (only if userId is valid)
    if (userId) {
      await DatabaseService.createNotification({
        userId,
        type: 'payment',
        title: 'Payment Successful',
        message: `Your payment of ₹${payment.amount / 100} has been processed successfully. Your subscription is now active.`,
        isRead: false,
        priority: 'high',
        data: {
          paymentId: payment.id,
          amount: payment.amount,
          planId,
          interval
        }
      })
    }

    // Log payment success
    console.log(`Payment successful for user ${userId}: ${payment.id}`)

  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

// Handle failed payment
async function handlePaymentFailed(payment: any) {
  try {
    console.log('Payment failed:', payment.id)

    const userId = validateUserId(payment)
    if (!userId) return

    // Create failure notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Payment Failed',
      message: `Your payment of ₹${payment.amount / 100} could not be processed. Please try again or contact support.`,
      isRead: false,
      priority: 'high',
      data: {
        paymentId: payment.id,
        amount: payment.amount,
        errorCode: payment.error_code,
        errorDescription: payment.error_description
      }
    })

    console.log(`Payment failed for user ${userId}: ${payment.id}`)

  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

// Handle subscription charged
async function handleSubscriptionCharged(subscription: any) {
  try {
    console.log('Subscription charged:', subscription.id)

    const userId = validateSubscriptionUserId(subscription)
    if (!userId) return

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Subscription Renewed',
      message: `Your subscription has been renewed. Payment of ₹${subscription.amount / 100} processed successfully.`,
      isRead: false,
      priority: 'medium',
      data: {
        subscriptionId: subscription.id,
        amount: subscription.amount,
        nextBillingDate: subscription.next_billing_at
      }
    })

    console.log(`Subscription charged for user ${userId}: ${subscription.id}`)

  } catch (error) {
    console.error('Error handling subscription charged:', error)
  }
}

// Handle subscription completed
async function handleSubscriptionCompleted(subscription: any) {
  try {
    console.log('Subscription completed:', subscription.id)

    const userId = validateSubscriptionUserId(subscription)
    if (!userId) return

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Subscription Completed',
      message: 'Your subscription period has ended. Please renew to continue using premium features.',
      isRead: false,
      priority: 'medium',
      data: {
        subscriptionId: subscription.id
      }
    })

    console.log(`Subscription completed for user ${userId}: ${subscription.id}`)

  } catch (error) {
    console.error('Error handling subscription completed:', error)
  }
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(subscription: any) {
  try {
    console.log('Subscription cancelled:', subscription.id)

    const userId = validateSubscriptionUserId(subscription)
    if (!userId) return

    // Update user subscription status
    const user = await DatabaseService.getUser(userId)
    if (user) {
      await DatabaseService.updateUser(userId, {
        subscription: {
          ...user.subscription,
          status: 'cancelled' as any,
          endDate: new Date() as any
        }
      })
    }

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Subscription Cancelled',
      message: 'Your subscription has been cancelled. You can still use the service until the end of your billing period.',
      isRead: false,
      priority: 'medium',
      data: {
        subscriptionId: subscription.id
      }
    })

    console.log(`Subscription cancelled for user ${userId}: ${subscription.id}`)

  } catch (error) {
    console.error('Error handling subscription cancelled:', error)
  }
}

// Handle subscription paused
async function handleSubscriptionPaused(subscription: any) {
  try {
    console.log('Subscription paused:', subscription.id)

    const userId = validateSubscriptionUserId(subscription)
    if (!userId) return

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Subscription Paused',
      message: 'Your subscription has been paused. You can resume it anytime from your account settings.',
      isRead: false,
      priority: 'medium',
      data: {
        subscriptionId: subscription.id
      }
    })

    console.log(`Subscription paused for user ${userId}: ${subscription.id}`)

  } catch (error) {
    console.error('Error handling subscription paused:', error)
  }
}

// Handle subscription resumed
async function handleSubscriptionResumed(subscription: any) {
  try {
    console.log('Subscription resumed:', subscription.id)

    const userId = validateSubscriptionUserId(subscription)
    if (!userId) return

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Subscription Resumed',
      message: 'Your subscription has been resumed. Welcome back!',
      isRead: false,
      priority: 'medium',
      data: {
        subscriptionId: subscription.id
      }
    })

    console.log(`Subscription resumed for user ${userId}: ${subscription.id}`)

  } catch (error) {
    console.error('Error handling subscription resumed:', error)
  }
}

// Handle refund created
async function handleRefundCreated(refund: any) {
  try {
    console.log('Refund created:', refund.id)

    const userId = validateUserId(refund)
    if (!userId) return

    // Create notification
    await DatabaseService.createNotification({
      userId,
      type: 'payment',
      title: 'Refund Processed',
      message: `Your refund of ₹${refund.amount / 100} has been processed and will be credited to your account within 5-7 business days.`,
      isRead: false,
      priority: 'medium',
      data: {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status
      }
    })

    console.log(`Refund created for user ${userId}: ${refund.id}`)

  } catch (error) {
    console.error('Error handling refund created:', error)
  }
}
