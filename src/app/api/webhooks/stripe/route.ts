import { NextRequest, NextResponse } from 'next/server'
import { stripe, verifyWebhookSignature } from '@/lib/payments/stripe'
import { supabaseAdmin } from '@/lib/db/supabase'
import type { PanelId } from '@/types'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event

  try {
    event = verifyWebhookSignature(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const panelIds = session.metadata?.panelIds?.split(',') as PanelId[]

        if (userId && panelIds) {
          // Update user panels
          const { data: user } = await supabaseAdmin
            .from('users')
            .select('panels')
            .eq('id', userId)
            .single()

          const currentPanels = (user?.panels as string[]) || []
          const newPanels = [...new Set([...currentPanels, ...panelIds])]

          await supabaseAdmin
            .from('users')
            .update({
              panels: newPanels,
              subscription_status: 'active',
            })
            .eq('id', userId)

          // Create subscription record
          await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            panel_ids: panelIds,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false,
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              cancel_at_period_end: subscription.cancel_at_period_end,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)

          // Update user subscription status
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (userId) {
          // Mark subscription as cancelled
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('stripe_subscription_id', subscription.id)

          // Get remaining active subscriptions
          const { data: activeSubscriptions } = await supabaseAdmin
            .from('subscriptions')
            .select('panel_ids')
            .eq('user_id', userId)
            .eq('status', 'active')

          // Calculate remaining panels
          const remainingPanels = activeSubscriptions?.flatMap(s => s.panel_ids) || []

          // Update user panels (keep free panels)
          const freePanels = ['P1', 'P2', 'P8', 'P10', 'P12', 'P21']
          const newPanels = [...new Set([...remainingPanels, ...freePanels])]

          await supabaseAdmin
            .from('users')
            .update({
              panels: newPanels,
              subscription_status: remainingPanels.length > 0 ? 'active' : 'inactive',
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string

        // Find user by customer ID
        const { data: subscription } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subscription) {
          await supabaseAdmin
            .from('users')
            .update({ subscription_status: 'past_due' })
            .eq('id', subscription.user_id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
