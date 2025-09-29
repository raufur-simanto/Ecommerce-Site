import { NextResponse } from 'next/server'
import { isDemoMode } from '@/lib/stripe-server'

export async function GET() {
  return NextResponse.json({
    isDemoMode,
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('HERE'),
    message: isDemoMode 
      ? '🎭 Running in demo mode - payments will be simulated' 
      : '💳 Stripe configured - real payments enabled'
  })
}
