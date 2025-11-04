"use client";
import { useEffect, useState } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsProvider } from '@/components/StripeProvider';
import type { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js';

function PRBInner() {
  const stripe = useStripe();
  const [ready, setReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);

  useEffect(() => {
    (async () => {
      if (!stripe) return;
      // Create an intent upfront so we can confirm with the PRB payment method
      const res = await fetch('/api/stripe/payment_intents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 2000 }) });
      const data = await res.json();
      setClientSecret(data.client_secret || null);
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: { label: 'Demo Payment', amount: 2000 },
        requestPayerName: true,
        requestPayerEmail: true
      });
      const result = await pr.canMakePayment();
      if (result) {
        setPaymentRequest(pr as any);
        setReady(true);
      }
      pr.on('paymentmethod', async (ev) => {
        try {
          if (!clientSecret) throw new Error('Missing client secret');
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, { payment_method: ev.paymentMethod.id }, { handleActions: false });
          if (error) {
            ev.complete('fail');
          } else if (paymentIntent?.status === 'requires_action') {
            const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
            ev.complete(actionError ? 'fail' : 'success');
          } else {
            ev.complete('success');
          }
        } catch {
          ev.complete('fail');
        }
      });
    })();
  }, [stripe, clientSecret]);

  if (!ready) {
    return <div className="text-sm text-gray-600">Apple Pay / Google Pay not available in this browser.</div>;
  }
  return <PaymentRequestButtonElement options={{ paymentRequest: paymentRequest as any, style: { paymentRequestButton: { type: 'default', theme: 'dark', height: '44px' } } }} />;
}

export default function PaymentRequestPage() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Payment Request Button</h1>
      <p className="text-gray-600">Demo Apple Pay / Google Pay via the Payment Request API.</p>
      <StripeElementsProvider>
        <PRBInner />
      </StripeElementsProvider>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        For testing, set up Apple Pay/Google Pay in your browser. See <a href="https://stripe.com/docs/stripe-js/elements/payment-request-button" target="_blank" rel="noreferrer" className="underline text-brand">Stripe PRB docs</a>.
      </div>
    </div>
  );
}

