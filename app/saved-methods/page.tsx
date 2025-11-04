"use client";
import { useEffect, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsProvider } from '@/components/StripeProvider';

function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus('processing');
    const result = await stripe.confirmSetup({ elements, confirmParams: { return_url: `${window.location.origin}/success` } });
    if ((result as any).error) setStatus(((result as any).error.message) || 'error');
    else setStatus(`saved: ${((result as any).setupIntent?.payment_method)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button className="bg-brand text-white px-4 py-2 rounded">Save payment method</button>
      <div className="text-sm text-gray-600">Status: {status}</div>
    </form>
  );
}

export default function SavedMethodsPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/stripe/setup_intents', { method: 'POST' });
      const data = await res.json();
      setClientSecret(data.client_secret || null);
    })();
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Saved Payment Methods</h1>
      <p className="text-gray-600">Use SetupIntents to securely collect and store a card for later use.</p>
      {clientSecret ? (
        <StripeElementsProvider clientSecret={clientSecret}>
          <SetupForm />
        </StripeElementsProvider>
      ) : (
        <div>Creating SetupIntent…</div>
      )}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        Use 4242 4242 4242 4242 for testing. See <a href="https://stripe.com/docs/testing#saving-cards" target="_blank" rel="noreferrer" className="underline text-brand">Stripe test docs for saving cards</a>.
      </div>
    </div>
  );
}

