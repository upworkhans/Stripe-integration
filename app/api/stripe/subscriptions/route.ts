import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

const schema = z.object({
  customer: z.string().optional(),
  customer_email: z.string().email().optional(),
  price: z.string(),
  quantity: z.number().int().positive().default(1),
  trial_days: z.number().int().min(0).max(365).optional(),
  metadata: z.record(z.string()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }
    const stripe = getStripe();

    let customerId = parsed.data.customer;
    if (!customerId && parsed.data.customer_email) {
      const c = await stripe.customers.create({ email: parsed.data.customer_email });
      customerId = c.id;
    }
    if (!customerId) {
      return NextResponse.json({ error: 'customer or customer_email is required' }, { status: 400 });
    }

    const sub = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: parsed.data.price, quantity: parsed.data.quantity }],
      trial_period_days: parsed.data.trial_days,
      metadata: parsed.data.metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    } as any);

    return NextResponse.json({ id: sub.id, status: (sub as any).status, subscription: sub });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create subscription' }, { status: 500 });
  }
}

