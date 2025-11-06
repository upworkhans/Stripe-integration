import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import { getPlan, markCompleted } from '@/lib/partialStore';
import { rateLimitKeyFromRequestHeaders, rateLimitPaymentAttempts } from '@/lib/rateLimit';

const schema = z.object({ plan_id: z.string() });

export async function POST(req: NextRequest) {
  try {
    const key = rateLimitKeyFromRequestHeaders(req.headers as any);
    const rl = rateLimitPaymentAttempts(key);
    if (!rl.allowed) return NextResponse.json({ error: rl.reason }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid body', details: parsed.error.format() }, { status: 400 });

    const plan = getPlan(parsed.data.plan_id);
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    if (plan.completed) return NextResponse.json({ error: 'Plan already completed' }, { status: 400 });

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: plan.remaining,
      currency: plan.currency,
      customer: plan.customer,
      payment_method: plan.paymentMethod,
      confirm: true,
      off_session: true,
    } as any);

    if ((intent as any).status === 'succeeded' || (intent as any).status === 'processing') {
      markCompleted(plan.id);
    }
    return NextResponse.json({ intent });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to charge remaining' }, { status: 500 });
  }
}


