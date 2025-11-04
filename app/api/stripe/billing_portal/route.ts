import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { env } from '@/lib/env';

const schema = z.object({
  customer: z.string(),
  return_url: z.string().default(`${env.STRIPE_CLIENT_URL}/`)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: parsed.data.customer,
      return_url: parsed.data.return_url
    });
    return NextResponse.json({ url: (session as any).url, session });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create billing portal session' }, { status: 500 });
  }
}

