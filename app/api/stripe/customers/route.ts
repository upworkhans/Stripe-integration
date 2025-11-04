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
    const body = await req.json();
    const stripe = getStripe();
    const customer = await stripe.customers.create({ email: body.email, name: body.name });
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create customer' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(id);
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve customer' }, { status: 500 });
  }
}


