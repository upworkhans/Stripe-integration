import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET() {
  try {
    const stripe = getStripe();
    // Expand product to include name in response if possible
    // @ts-ignore
    const list = await (stripe.prices as any).list({ active: true, limit: 50, expand: ['data.product'] });
    const items = list.data.map((p: any) => ({
      id: p.id,
      currency: p.currency,
      unit_amount: p.unit_amount,
      recurring: p.recurring || null,
      nickname: p.nickname || null,
      productName: (p.product && p.product.name) || null,
      active: p.active
    }));
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to list prices' }, { status: 500 });
  }
}

