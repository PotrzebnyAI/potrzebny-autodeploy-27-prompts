import Stripe from 'stripe'
import { PANELS, type PanelId } from '@/types'

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Stripe Price IDs (to be configured in Stripe Dashboard)
// Format: price_[panelId]_monthly or price_[panelId]_yearly
export const PRICE_IDS: Record<PanelId, { monthly: string; yearly: string }> = {
  P1: { monthly: 'price_free', yearly: 'price_free' },
  P2: { monthly: 'price_free', yearly: 'price_free' },
  P3: { monthly: process.env.STRIPE_PRICE_P3_MONTHLY!, yearly: process.env.STRIPE_PRICE_P3_YEARLY! },
  P4: { monthly: process.env.STRIPE_PRICE_P4_MONTHLY!, yearly: process.env.STRIPE_PRICE_P4_YEARLY! },
  P5: { monthly: process.env.STRIPE_PRICE_P5_MONTHLY!, yearly: process.env.STRIPE_PRICE_P5_YEARLY! },
  P6: { monthly: process.env.STRIPE_PRICE_P6_MONTHLY!, yearly: process.env.STRIPE_PRICE_P6_YEARLY! },
  P7: { monthly: process.env.STRIPE_PRICE_P7_MONTHLY!, yearly: process.env.STRIPE_PRICE_P7_YEARLY! },
  P8: { monthly: 'price_free', yearly: 'price_free' },
  P9: { monthly: process.env.STRIPE_PRICE_P9_MONTHLY!, yearly: process.env.STRIPE_PRICE_P9_YEARLY! },
  P10: { monthly: 'price_free', yearly: 'price_free' },
  P11: { monthly: process.env.STRIPE_PRICE_P11_MONTHLY!, yearly: process.env.STRIPE_PRICE_P11_YEARLY! },
  P12: { monthly: 'price_free', yearly: 'price_free' },
  P13: { monthly: process.env.STRIPE_PRICE_P13_MONTHLY!, yearly: process.env.STRIPE_PRICE_P13_YEARLY! },
  P14: { monthly: process.env.STRIPE_PRICE_P14_MONTHLY!, yearly: process.env.STRIPE_PRICE_P14_YEARLY! },
  P15: { monthly: process.env.STRIPE_PRICE_P15_MONTHLY!, yearly: process.env.STRIPE_PRICE_P15_YEARLY! },
  P16: { monthly: process.env.STRIPE_PRICE_P16_MONTHLY!, yearly: process.env.STRIPE_PRICE_P16_YEARLY! },
  P17: { monthly: process.env.STRIPE_PRICE_P17_MONTHLY!, yearly: process.env.STRIPE_PRICE_P17_YEARLY! },
  P18: { monthly: process.env.STRIPE_PRICE_P18_MONTHLY!, yearly: process.env.STRIPE_PRICE_P18_YEARLY! },
  P19: { monthly: process.env.STRIPE_PRICE_P19_MONTHLY!, yearly: process.env.STRIPE_PRICE_P19_YEARLY! },
  P20: { monthly: process.env.STRIPE_PRICE_P20_MONTHLY!, yearly: process.env.STRIPE_PRICE_P20_YEARLY! },
  P21: { monthly: 'price_free', yearly: 'price_free' },
  P22: { monthly: process.env.STRIPE_PRICE_P22_MONTHLY!, yearly: process.env.STRIPE_PRICE_P22_YEARLY! },
}

export interface CreateCheckoutOptions {
  userId: string
  email: string
  panelIds: PanelId[]
  billingPeriod: 'monthly' | 'yearly'
  successUrl: string
  cancelUrl: string
}

export interface CreatePortalOptions {
  customerId: string
  returnUrl: string
}

// Create Stripe Checkout Session
export async function createCheckoutSession(options: CreateCheckoutOptions) {
  const { userId, email, panelIds, billingPeriod, successUrl, cancelUrl } = options

  // Filter out free panels and get price IDs
  const lineItems = panelIds
    .filter(panelId => PANELS[panelId].price > 0)
    .map(panelId => ({
      price: PRICE_IDS[panelId][billingPeriod],
      quantity: 1,
    }))

  if (lineItems.length === 0) {
    throw new Error('No paid panels selected')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    payment_method_types: ['card', 'blik'], // BLIK via Stripe
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      panelIds: panelIds.join(','),
    },
    subscription_data: {
      metadata: {
        userId,
        panelIds: panelIds.join(','),
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    locale: 'pl',
  })

  return session
}

// Create Customer Portal Session
export async function createPortalSession(options: CreatePortalOptions) {
  const { customerId, returnUrl } = options

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

// Get or create Stripe customer
export async function getOrCreateCustomer(userId: string, email: string, name?: string) {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId },
  })

  return customer
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'items.data.price.product'],
  })
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string, immediately = false) {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId)
  }

  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

// Resume cancelled subscription
export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

// Update subscription (add/remove panels)
export async function updateSubscription(
  subscriptionId: string,
  newPanelIds: PanelId[],
  billingPeriod: 'monthly' | 'yearly'
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Get current items
  const currentItems = subscription.items.data.map(item => ({
    id: item.id,
    deleted: true,
  }))

  // Get new items
  const newItems = newPanelIds
    .filter(panelId => PANELS[panelId].price > 0)
    .map(panelId => ({
      price: PRICE_IDS[panelId][billingPeriod],
      quantity: 1,
    }))

  return await stripe.subscriptions.update(subscriptionId, {
    items: [...currentItems, ...newItems],
    proration_behavior: 'create_prorations',
    metadata: {
      panelIds: newPanelIds.join(','),
    },
  })
}

// Create payment intent for one-time payment
export async function createPaymentIntent(
  amount: number,
  currency: string = 'pln',
  customerId?: string
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents/grosze
    currency,
    customer: customerId,
    payment_method_types: ['card', 'blik'],
  })
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
