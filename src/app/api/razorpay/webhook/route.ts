import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const event = body.event;
    const data = body.payload;

    console.log(`Razorpay Event: ${event}`, data);

    switch (event) {
      case 'subscription.activated': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription activated: ${subscriptionId}`);
          // Update subscription status in DB
          await db.update(subscriptions)
            .set({ status: 'active' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.paused': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription paused: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'paused' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription cancelled: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'canceled' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.completed': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription completed: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'completed' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'payment.authorized': {
        console.log('Payment authorized:', data.payment?.entity?.id);
        break;
      }

      case 'payment.failed': {
        console.log('Payment failed:', data.payment?.entity?.id);
        break;
      }

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({
      success: true,
      message: `Event ${event} processed successfully`,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
