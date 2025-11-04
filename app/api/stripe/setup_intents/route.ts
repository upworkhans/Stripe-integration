import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(_req: NextRequest) {
  try {
    const stripe = getStripe();
    const si = await stripe.setupIntents.create({ usage: 'off_session', payment_method_types: ['card'] as any });
    return NextResponse.json({ client_secret: (si as any).client_secret, setup_intent: si });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create SetupIntent' }, { status: 500 });
  }
}


