import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { env } from '@/lib/env';

const createSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default(env.DEFAULT_CURRENCY),
  customer: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  payment_method_types: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      customer: parsed.data.customer,
      metadata: parsed.data.metadata,
      automatic_payment_methods: { enabled: true },
      payment_method_types: parsed.data.payment_method_types,
    });

    return NextResponse.json({ id: intent.id, client_secret: (intent as any).client_secret, intent });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}

