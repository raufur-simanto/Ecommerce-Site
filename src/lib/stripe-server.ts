import Stripe from 'stripe'

// For demo purposes, use a fallback when Stripe key is not available
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key_for_development'
const isDemoMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('HERE')

let stripe: Stripe | null = null

try {
  if (!isDemoMode) {
    stripe = new Stripe(stripeKey, {
      apiVersion: '2025-08-27.basil',
    })
  }
} catch (error) {
  console.warn('Stripe initialization failed, running in demo mode:', error)
}

export { stripe, isDemoMode }
