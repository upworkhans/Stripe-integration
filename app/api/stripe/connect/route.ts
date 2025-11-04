import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { rateLimitKeyFromRequestHeaders, rateLimitPaymentAttempts } from '@/lib/rateLimit';

const schema = z.object({
  type: z.enum(['express', 'standard']).default('express'),
  country: z.string().default('US'),
  email: z.string().email().optional()
});

export async function POST(req: NextRequest) {
  try {
    const key = rateLimitKeyFromRequestHeaders(req.headers as any);
    const rl = rateLimitPaymentAttempts(key);
    if (!rl.allowed) {
      return NextResponse.json({ error: rl.reason }, { status: 429 });
    }
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });
    }
    const stripe = getStripe();
    const acct = await stripe.accounts.create({ type: parsed.data.type, country: parsed.data.country, email: parsed.data.email } as any);
    return NextResponse.json({ account: acct });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create connect account' }, { status: 500 });
  }
}

