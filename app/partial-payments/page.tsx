'use client';
import { useEffect, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementsProvider } from '@/components/StripeProvider';

function PartialForm({ clientSecret, totalMajor, onPlanId }: { clientSecret: string | null; totalMajor: number; onPlanId: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<string>('idle');
  const [planId, setPlanId] = useState<string | null>(null);

  async function confirmDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setStatus('processing');
    const result = await stripe.confirmPayment({ elements, clientSecret, confirmParams: { return_url: `${window.location.origin}/success` } });
    if ((result as any).error) {
      const error = (result as any).error;
      setStatus(error.message || 'error');
      return;
    }

    try {
      const total = Math.round((totalMajor || 0) * 100);
      const res = await fetch('/api/demo/partial/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payment_intent_id: (result as any).paymentIntent?.id, total }) });
      const data = await res.json();
      if (data.plan_id) {
        setPlanId(data.plan_id);
        onPlanId(data.plan_id);
        setStatus('deposit_succeeded');
      } else {
        setStatus(data.error || 'failed to store plan');
      }
    } catch (err: any) {
      setStatus(err?.message || 'error');
    }
  }

  async function chargeRemaining() {
    if (!planId) return;
    setStatus('charging_remaining');
    const res = await fetch('/api/demo/partial/charge_rest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: planId }) });
    const data = await res.json();
    if (data.intent) setStatus(data.intent.status || 'succeeded');
    else setStatus(data.error || 'error');
  }

  return (
    <form onSubmit={confirmDeposit} className="space-y-4">
      <div className="text-sm text-gray-600">10% charged now, 90% later.</div>
      {!clientSecret ? (
        <div>Creating deposit intent…</div>
      ) : (
        <PaymentElement />
      )}
      <button className="bg-brand text-white px-4 py-2 rounded">Pay 10% now</button>
      {planId && (
        <div className="rounded border p-3 bg-gray-50">
          <div className="text-sm mb-2">Plan created. You can trigger the remaining 90% now for demo purposes.</div>
          <button type="button" onClick={chargeRemaining} className="border px-3 py-2 rounded">Charge remaining</button>
        </div>
      )}
      <div className="text-sm text-gray-600">Status: {status}</div>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        Use 4242 4242 4242 4242 for testing. In production, you would schedule the remaining 90% by date or event via a job/webhook, using the saved payment method.
      </div>
    </form>
  );
}

export default function PartialPaymentsPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalMajor, setTotalMajor] = useState<number>(100);
  const [planId, setPlanId] = useState<string | null>(null);

  // Create or refresh the deposit intent whenever total changes
  useEffect(() => {
    (async () => {
      const deposit = Math.max(1, Math.round((totalMajor || 0) * 100 * 0.1));
      const res = await fetch('/api/stripe/payment_intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: deposit })
      });
      const data = await res.json();
      setClientSecret(data.client_secret || null);
    })();
  }, [totalMajor]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Partial Payments (10/90)</h1>
      <p className="text-gray-600">Collect a deposit now and charge the remainder later.</p>
      <label className="block">
        <span className="text-sm text-gray-600">Total amount</span>
        <input type="number" min={0} step={0.01} className="mt-1 border rounded px-3 py-2" value={totalMajor} onChange={(e)=>setTotalMajor(parseFloat(e.target.value || '0'))} />
      </label>
      <StripeElementsProvider clientSecret={clientSecret}>
        <PartialForm clientSecret={clientSecret} totalMajor={totalMajor} onPlanId={setPlanId} />
      </StripeElementsProvider>
    </div>
  );
}


