"use client";
import { useCallback, useMemo, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsProvider } from '@/components/StripeProvider';

function CardElementForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [amountInput, setAmountInput] = useState<string>("2000");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const amountInCents = useMemo(() => {
    const n = Number(amountInput);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
  }, [amountInput]);

  const createIntent = useCallback(async () => {
    setMessage(null);
    const res = await fetch('/api/stripe/payment_intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInCents })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to create PaymentIntent');
    }
    const data = await res.json();
    setClientSecret(data?.client_secret || null);
    return data?.client_secret as string;
  }, [amountInCents]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setIsSubmitting(true);
      const secret = clientSecret || (await createIntent());

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card Element not ready');

      const result = await stripe.confirmCardPayment(secret, {
        payment_method: { card: cardElement }
      });

      if (result.error) {
        setMessage(result.error.message || 'Payment failed');
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded');
      } else {
        setMessage(`Status: ${result.paymentIntent?.status || 'unknown'}`);
      }
    } catch (err: any) {
      setMessage(err?.message || 'Unexpected error');
    } finally {
      setIsSubmitting(false);
    }
  }, [stripe, elements, clientSecret, createIntent]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (in smallest currency unit)</label>
        <input
          type="number"
          min={50}
          step={50}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          className="w-full rounded-md border-gray-300 focus:border-brand focus:ring-brand"
        />
        <p className="text-xs text-gray-500 mt-1">For USD, 2000 = $20.00</p>
      </div>

      <div className="rounded-md border border-gray-300 p-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!stripe || isSubmitting || amountInCents <= 0}
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing…' : 'Pay'}
        </button>
        <button
          type="button"
          onClick={() => {
            setClientSecret(null);
            setMessage(null);
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Reset
        </button>
      </div>

      {message && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">{message}</div>
      )}
    </form>
  );
}

export default function CardElementPage() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h1 className="text-xl font-semibold mb-2">Card Element</h1>
      <p className="text-gray-600 mb-4">
        Collect card details with Card Element and confirm the Payment Intent on your server-created client secret.
      </p>
      <StripeElementsProvider>
        <CardElementForm />
      </StripeElementsProvider>
    </div>
  );
}


