import { NextRequest, NextResponse } from 'next/server'
import { stripe, isDemoMode } from '@/lib/stripe-server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await request.json()

    if (!amount || amount < 0.5) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    // Demo mode - simulate payment intent creation
    if (isDemoMode || !stripe) {
      const demoPaymentIntentId = `pi_demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      
      return NextResponse.json({
        clientSecret: `${demoPaymentIntentId}_secret_demo`,
        paymentIntentId: demoPaymentIntentId,
        isDemoMode: true,
        message: 'Running in demo mode - no real payments will be processed'
      })
    }

    // Real Stripe integration
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isDemoMode: false
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    // Fallback to demo mode if Stripe fails
    const demoPaymentIntentId = `pi_demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    return NextResponse.json({
      clientSecret: `${demoPaymentIntentId}_secret_demo`,
      paymentIntentId: demoPaymentIntentId,
      isDemoMode: true,
      message: 'Stripe unavailable - running in demo mode'
    })
  }
}
