import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { rateLimitKeyFromRequestHeaders, rateLimitPaymentAttempts } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const key = rateLimitKeyFromRequestHeaders(req.headers as any);
    const rl = rateLimitPaymentAttempts(key);
    if (!rl.allowed) {
      return NextResponse.json({ error: rl.reason }, { status: 429 });
    }
    const stripe = getStripe();
    const si = await stripe.setupIntents.create({ usage: 'off_session', payment_method_types: ['card'] as any });
    return NextResponse.json({ client_secret: (si as any).client_secret, setup_intent: si });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create SetupIntent' }, { status: 500 });
  }
}


