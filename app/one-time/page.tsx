"use client";
import { useCallback, useMemo, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsProvider } from '@/components/StripeProvider';

function OneTimeForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amountMajor, setAmountMajor] = useState<number>(20);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');

  const amountInCents = useMemo(() => Math.round((amountMajor || 0) * 100), [amountMajor]);

  const createIntent = useCallback(async () => {
    const res = await fetch('/api/stripe/payment_intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInCents })
    });
    const data = await res.json();
    setClientSecret(data.client_secret || null);
    return data.client_secret as string;
  }, [amountInCents]);

  const handleConfirm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus('processing');
    try {
      const secret = clientSecret || (await createIntent());
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card Element not ready');
      const result = await stripe.confirmCardPayment(secret, { payment_method: { card } });
      if (result.error) setStatus(result.error.message || 'error');
      else if (result.paymentIntent?.status === 'succeeded') setStatus('succeeded');
      else setStatus(result.paymentIntent?.status || 'unknown');
    } catch (err: any) {
      setStatus(err?.message || 'error');
    }
  }, [stripe, elements, clientSecret, createIntent]);

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      <label className="block">
        <span className="text-sm text-gray-600">Amount</span>
        <input type="number" min={0} step={0.01} className="mt-1 border rounded px-3 py-2" value={amountMajor} onChange={(e)=>setAmountMajor(parseFloat(e.target.value || '0'))} />
      </label>
      <div className="rounded-md border border-gray-300 p-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button className="bg-brand text-white px-4 py-2 rounded">Confirm Payment</button>
      <div className="text-sm text-gray-600">Status: {status}</div>
    </form>
  );
}

export default function OneTimePage() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h1 className="text-xl font-semibold mb-2">One-time Direct Payment</h1>
      <p className="text-gray-600 mb-4">Server-created PaymentIntent + manual confirmation.</p>
      <StripeElementsProvider>
        <OneTimeForm />
      </StripeElementsProvider>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        When testing payments, use 4242 4242 4242 4242, any future date, any CVC, any ZIP. See
        <a href="https://stripe.com/docs/testing" target="_blank" rel="noreferrer" className="ml-1 underline text-brand">Stripe testing docs</a>.
      </div>
    </div>
  );
}

