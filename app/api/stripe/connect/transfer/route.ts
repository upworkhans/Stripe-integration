import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

const schema = z.object({
  destination: z.string(),
  amount: z.number().int().positive(),
  currency: z.string().default('usd')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }
    const stripe = getStripe();
    const tr = await stripe.transfers.create({
      destination: parsed.data.destination,
      amount: parsed.data.amount,
      currency: parsed.data.currency
    });
    return NextResponse.json({ transfer: tr });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create transfer' }, { status: 500 });
  }
}

