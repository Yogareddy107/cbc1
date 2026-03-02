import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { amount, email, receipt } = await request.json();

    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      );
    }

    // Create Razorpay order (amount in paise)
    const order = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt || `receipt-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
