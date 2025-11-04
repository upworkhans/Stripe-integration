'use client';
import { useEffect, useState } from 'react';
import { StripeElementsProvider } from '@/components/StripeProvider';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus('processing');
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/success` }
    });
    if (error) setStatus(error.message || 'error');
    else setStatus('succeeded');
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement />
        <button className="bg-brand text-white px-4 py-2 rounded">Pay</button>
      </form>
      <div className="text-sm text-gray-600">Status: {status}</div>
    </div>
  );
}

export default function PaymentElementPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amountMajor, setAmountMajor] = useState<number>(10);

  // Ensure Elements gets the clientSecret
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/stripe/payment_intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round((amountMajor || 0) * 100) })
      });
      const data = await res.json();
      setClientSecret(data.client_secret || null);
    })();
  }, [amountMajor]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold mb-2">On-site Payment Element</h1>
      <p className="text-gray-600">Accept multiple payment methods in a unified UI.</p>
      <label className="block">
        <span className="text-sm text-gray-600">Amount</span>
        <input type="number" min={0} step={0.01} className="mt-1 border rounded px-3 py-2" value={amountMajor} onChange={(e)=>setAmountMajor(parseFloat(e.target.value || '0'))} />
        <div className="text-xs text-gray-500 mt-1">Major units (e.g., 10.00)</div>
      </label>
      {clientSecret ? (
        <StripeElementsProvider clientSecret={clientSecret}>
          <PaymentForm />
        </StripeElementsProvider>
      ) : (
        <div>Creating PaymentIntent…</div>
      )}
    </div>
  );
}

