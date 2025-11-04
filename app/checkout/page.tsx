'use client';
import { useEffect, useState } from 'react';
import { redactSecrets } from '@/lib/redact';

type PriceItem = { id: string; productName: string | null; nickname: string | null; unit_amount: number; currency: string; recurring: { interval: string } | null };

export default function CheckoutPage() {
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<'payment' | 'subscription'>('payment');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<any>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stripe/prices');
        const data = await res.json();
        if (Array.isArray(data.items)) setPrices(data.items);
      } catch {
        // ignore
      }
    })();
  }, []);

  async function createSession() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: price || undefined, quantity, mode })
      });
      const data = await res.json();
      setLog(data);
      if (data.url) {
        window.location.href = data.url as string;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Off-site Checkout</h1>
        <p className="text-gray-600 mb-4">Create a Checkout Session for one-time or subscription.</p>
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          Use test card 4242 4242 4242 4242 with any future date, any CVC, any ZIP. For more options (3DS, declines, wallets), see
          <a href="https://stripe.com/docs/testing" target="_blank" rel="noreferrer" className="ml-1 underline text-brand">Stripe test docs</a>.
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Price (optional)</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={price} onChange={(e)=>setPrice(e.target.value)}>
              <option value="">— Select a price (or leave blank) —</option>
              {prices.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.productName || p.nickname || p.id)} • {(p.unit_amount/100).toFixed(2)} {p.currency.toUpperCase()} {p.recurring ? `/${p.recurring.interval}` : ''}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Quantity</span>
            <input type="number" min={1} className="mt-1 w-full border rounded px-3 py-2" value={quantity} onChange={(e)=>setQuantity(parseInt(e.target.value || '1', 10))} />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Mode</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
              <option value="payment">payment</option>
              <option value="subscription">subscription</option>
            </select>
          </label>
        </div>
        <div className="mt-4">
          <button onClick={createSession} disabled={loading} className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark disabled:opacity-60">
            {loading ? 'Creating…' : 'Create Checkout Session'}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="font-medium mb-2">Response</div>
        <pre className="text-sm bg-gray-100 p-3 rounded max-h-80 overflow-auto">{JSON.stringify(redactSecrets(log), null, 2)}</pre>
      </div>
    </div>
  );
}

