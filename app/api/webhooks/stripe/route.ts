import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';
import { getPrisma } from '@/lib/db';
import { addEvent } from '@/lib/eventsStore';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const text = await req.text();
  const sig = req.headers.get('stripe-signature');
  let event: Stripe.Event;

  try {
    if (env.bool.USE_MOCK_STRIPE || !env.STRIPE_WEBHOOK_SECRET) {
      event = JSON.parse(text);
    } else {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(text, sig as string, env.STRIPE_WEBHOOK_SECRET);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const prisma = getPrisma();
  if (prisma) {
    await prisma.webhookEvent.create({ data: { type: event.type, payload: event as any } });
  }
  if (!prisma) {
    addEvent({ type: event.type, payload: event });
  }

  return NextResponse.json({ received: true, type: event.type });
}

