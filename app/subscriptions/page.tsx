'use client';
import { useEffect, useState } from 'react';

type PriceItem = { id: string; productName: string | null; nickname: string | null; unit_amount: number; currency: string; recurring: { interval: string } | null };

export default function SubscriptionsPage() {
  const [email, setEmail] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [trialDays, setTrialDays] = useState(0);
  const [log, setLog] = useState<any>(null);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/stripe/prices');
      const data = await res.json();
      if (Array.isArray(data.items)) setPrices(data.items.filter((p:any)=>!!p.recurring));
    })();
  }, []);

  async function createSubscription() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_email: email || undefined, price, quantity, trial_days: trialDays || undefined })
      });
      const data = await res.json();
      setLog(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Subscriptions & Plans</h1>
        <p className="text-gray-600 mb-4">Create a subscription using a recurring Price.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Customer email</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="user@example.com" />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Recurring Price</span>
            <select className="mt-1 w-full border rounded px-3 py-2" value={price} onChange={(e)=>setPrice(e.target.value)}>
              <option value="">— Select a recurring price —</option>
              {prices.map((p) => (
                <option key={p.id} value={p.id}>
                  {(p.productName || p.nickname || p.id)} • {(p.unit_amount/100).toFixed(2)} {p.currency.toUpperCase()} / {p.recurring?.interval}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Quantity</span>
            <input type="number" min={1} className="mt-1 w-full border rounded px-3 py-2" value={quantity} onChange={(e)=>setQuantity(parseInt(e.target.value || '1', 10))} />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Trial days (optional)</span>
            <input type="number" min={0} className="mt-1 w-full border rounded px-3 py-2" value={trialDays} onChange={(e)=>setTrialDays(parseInt(e.target.value || '0', 10))} />
          </label>
        </div>
        <div className="mt-4">
          <button onClick={createSubscription} disabled={loading || !price} className="bg-brand text-white px-4 py-2 rounded disabled:opacity-60">
            {loading ? 'Creating…' : 'Create Subscription'}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="font-medium mb-2">Response</div>
        <pre className="text-sm bg-gray-100 p-3 rounded max-h-80 overflow-auto">{JSON.stringify(log, null, 2)}</pre>
      </div>
    </div>
  );
}

