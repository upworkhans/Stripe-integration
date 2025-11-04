'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
export const dynamic = 'force-dynamic';

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const paymentIntentId = params.get('payment_intent');
  const [pi, setPi] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (paymentIntentId) {
        try {
          const res = await fetch(`/api/stripe/payment_intents/${paymentIntentId}`);
          const data = await res.json();
          setPi(data);
        } catch {
          // ignore
        }
      }
    })();
  }, [paymentIntentId]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto text-center space-y-4">
      <div className="text-2xl font-semibold text-green-700">Payment successful</div>
      <p className="text-gray-600">Thank you! Your transaction has been completed.</p>
      {sessionId && (
        <div className="text-sm text-gray-500">
          Checkout Session ID: <code className="bg-gray-100 px-2 py-1 rounded">{sessionId}</code>
        </div>
      )}
      {pi && (
        <div className="text-left bg-gray-50 rounded p-4 text-sm">
          <div className="font-medium mb-2">Payment Details</div>
          <div>ID: <code>{pi.id}</code></div>
          <div>Amount: {(pi.amount/100).toFixed(2)} {String(pi.currency).toUpperCase()}</div>
          <div>Status: {pi.status}</div>
          <div>Created: {new Date(pi.created*1000).toLocaleString()}</div>
          {pi.latest_charge && (
            <div>Latest Charge: <code>{(typeof pi.latest_charge === 'object' ? pi.latest_charge.id : pi.latest_charge)}</code></div>
          )}
        </div>
      )}
      <div className="pt-2">
        <Link href="/" className="inline-block bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">Return Home</Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto text-center">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}

