'use client';
import { useEffect, useState } from 'react';

type EventItem = { id?: string; type: string; payload: unknown; createdAt?: string | number };

export default function WebhooksPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/webhooks/events');
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  async function clearAll() {
    await fetch('/api/webhooks/events', { method: 'DELETE' });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Webhooks</h1>
        <p className="text-gray-600">Incoming Stripe events (DB when enabled, memory otherwise).</p>
        <div className="mt-4 flex gap-3">
          <button onClick={load} disabled={loading} className="bg-brand text-white px-3 py-2 rounded disabled:opacity-60">{loading ? 'Loading…' : 'Refresh'}</button>
          <button onClick={clearAll} className="border px-3 py-2 rounded">Clear</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="font-medium mb-2">Events</div>
        <div className="space-y-3 max-h-[32rem] overflow-auto">
          {items.length === 0 ? (
            <div className="text-gray-500">No events</div>
          ) : items.map((e, idx) => (
            <div key={(e as any).id || idx} className="border rounded p-3">
              <div className="text-sm text-gray-600 mb-1">{e.type} — {e.createdAt ? new Date(Number(e.createdAt)).toLocaleString() : ''}</div>
              <pre className="text-xs bg-gray-50 rounded p-2 overflow-auto">{JSON.stringify(e.payload || e, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 

