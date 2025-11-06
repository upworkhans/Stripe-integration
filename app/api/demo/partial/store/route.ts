import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { createPlan } from '@/lib/partialStore';
import { rateLimitKeyFromRequestHeaders, rateLimitPaymentAttempts } from '@/lib/rateLimit';

const schema = z.object({ payment_intent_id: z.string(), total: z.number().int().positive() });

export async function POST(req: NextRequest) {
  try {
    const key = rateLimitKeyFromRequestHeaders(req.headers as any);
    const rl = rateLimitPaymentAttempts(key);
    if (!rl.allowed) return NextResponse.json({ error: rl.reason }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });

    const stripe = getStripe();
    const pi = await stripe.paymentIntents.retrieve(parsed.data.payment_intent_id);
    const customer = (pi.customer as string) || '';
    const paymentMethod = (pi.payment_method as string) || '';
    const currency = pi.currency;
    const deposit = pi.amount;
    const remaining = parsed.data.total - deposit;
    if (!customer || !paymentMethod || remaining <= 0) {
      return NextResponse.json({ error: 'Missing customer/payment_method or invalid remaining amount' }, { status: 400 });
    }
    const plan = createPlan({ customer, paymentMethod, currency, total: parsed.data.total, deposit, remaining });
    return NextResponse.json({ plan_id: plan.id, remaining: plan.remaining, currency: plan.currency });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to store partial plan' }, { status: 500 });
  }
}


