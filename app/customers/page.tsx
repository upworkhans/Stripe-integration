"use client";
import { useState } from 'react';

export default function CustomersPage() {
  const [email, setEmail] = useState('test@example.com');
  const [name, setName] = useState('Test User');
  const [created, setCreated] = useState<any>(null);
  const [found, setFound] = useState<any>(null);

  async function createCustomer() {
    const res = await fetch('/api/stripe/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name }) });
    const data = await res.json();
    setCreated(data.customer);
  }

  async function retrieveCustomer() {
    if (!created?.id) return;
    const res = await fetch(`/api/stripe/customers?id=${created.id}`);
    const data = await res.json();
    setFound(data.customer);
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Portal & Customer Management</h1>
      <p className="text-gray-600">Create a customer and fetch it back.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-gray-600">Email</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Name</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={createCustomer} className="bg-brand text-white px-4 py-2 rounded">Create Customer</button>
        <button onClick={retrieveCustomer} className="border px-4 py-2 rounded">Retrieve</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded border p-3 bg-gray-50 text-sm">
          <div className="font-medium mb-1">Created</div>
          <pre>{JSON.stringify(created, null, 2)}</pre>
        </div>
        <div className="rounded border p-3 bg-gray-50 text-sm">
          <div className="font-medium mb-1">Retrieved</div>
          <pre>{JSON.stringify(found, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

