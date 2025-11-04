'use client';
import { useState } from 'react';

export default function BillingPage() {
  const [customer, setCustomer] = useState('');
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/billing_portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer })
      });
      const data = await res.json();
      setLog(data);
      if (data.url) window.location.href = data.url as string;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Invoices & Billing Portal</h1>
        <p className="text-gray-600 mb-4">Redirect customers to the hosted Billing Portal.</p>
        <label className="block">
          <span className="text-sm text-gray-600">Customer ID</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={customer} onChange={(e)=>setCustomer(e.target.value)} placeholder="cus_..." />
        </label>
        <div className="mt-4">
          <button onClick={openPortal} disabled={loading || !customer} className="bg-brand text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'Opening…' : 'Open Billing Portal'}</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="font-medium mb-2">Response</div>
        <pre className="text-sm bg-gray-100 p-3 rounded max-h-80 overflow-auto">{JSON.stringify(log, null, 2)}</pre>
      </div>
    </div>
  );
}
