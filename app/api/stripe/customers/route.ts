import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stripe = getStripe();
    const customer = await stripe.customers.create({ email: body.email, name: body.name });
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create customer' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const stripe = getStripe();
    const customer = await stripe.customers.retrieve(id);
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve customer' }, { status: 500 });
  }
}


