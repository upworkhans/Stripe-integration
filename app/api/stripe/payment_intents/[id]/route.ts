import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const stripe = getStripe();
    const pi = await stripe.paymentIntents.retrieve(params.id, { expand: ['latest_charge'] });
    return NextResponse.json({
      id: pi.id,
      amount: pi.amount,
      currency: pi.currency,
      status: pi.status,
      created: pi.created,
      latest_charge: (pi as any).latest_charge || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve payment intent' }, { status: 500 });
  }
}

