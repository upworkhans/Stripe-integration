import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { env } from '@/lib/env';

const createSchema = z.object({
  mode: z.enum(['payment', 'subscription']).default('payment'),
  price: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  client_reference_id: z.string().optional(),
  customer: z.string().optional(),
  customer_email: z.string().email().optional(),
  metadata: z.record(z.string()).optional(),
  allow_promotion_codes: z.boolean().optional(),
  tax_rates: z.array(z.string()).optional(),
  success_url: z.string().default(`${env.STRIPE_CLIENT_URL}/success`),
  cancel_url: z.string().default(`${env.STRIPE_CLIENT_URL}/cancel`),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }
    const stripe = getStripe();
    const line_items = parsed.data.price
      ? [{ price: parsed.data.price, quantity: parsed.data.quantity }]
      : [{ price_data: { currency: env.DEFAULT_CURRENCY, product_data: { name: 'Demo' }, unit_amount: 2000 }, quantity: parsed.data.quantity }];

    const session = await stripe.checkout.sessions.create({
      mode: parsed.data.mode,
      line_items,
      client_reference_id: parsed.data.client_reference_id,
      customer: parsed.data.customer,
      customer_email: parsed.data.customer_email,
      metadata: parsed.data.metadata,
      allow_promotion_codes: parsed.data.allow_promotion_codes,
      success_url: parsed.data.success_url,
      cancel_url: parsed.data.cancel_url,
      automatic_tax: parsed.data.tax_rates ? undefined : { enabled: false },
    } as any);

    return NextResponse.json({ id: session.id, url: (session as any).url, session });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}

