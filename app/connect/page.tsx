import { env } from '@/lib/env';
"use client";
import { env } from '@/lib/env';
import { useState } from 'react';

export default function ConnectPage() {
  const [acct, setAcct] = useState<any>(null);
  const [dest, setDest] = useState('');
  const [amountMajor, setAmountMajor] = useState(10);
  const [log, setLog] = useState<any>(null);

  async function createAccount() {
    const res = await fetch('/api/stripe/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'express' }) });
    const data = await res.json();
    setAcct(data.account);
    setLog(data);
  }

  async function createTransfer() {
    const res = await fetch('/api/stripe/connect/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destination: dest, amount: Math.round(amountMajor*100) }) });
    const data = await res.json();
    setLog(data);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h1 className="text-xl font-semibold mb-2">Stripe Connect</h1>
        <p className="text-gray-600">Create connected accounts and transfers. ENABLE_CONNECT is {String(env.bool.ENABLE_CONNECT)}.</p>
        <div className="mt-4 flex gap-3">
          <button onClick={createAccount} className="bg-brand text-white px-3 py-2 rounded">Create Express Account</button>
        </div>
        {acct && (
          <div className="mt-4 text-sm text-gray-700">Connected Account: <code>{acct.id}</code></div>
        )}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-gray-600">Destination Account</span>
            <input className="mt-1 w-full border rounded px-3 py-2" value={dest} onChange={(e)=>setDest(e.target.value)} placeholder="acct_..." />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">Amount</span>
            <input type="number" min={0} step={0.01} className="mt-1 w-full border rounded px-3 py-2" value={amountMajor} onChange={(e)=>setAmountMajor(parseFloat(e.target.value||'0'))} />
          </label>
        </div>
        <div className="mt-4">
          <button onClick={createTransfer} className="border px-3 py-2 rounded">Create Transfer</button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="font-medium mb-2">Response</div>
        <pre className="text-sm bg-gray-100 p-3 rounded max-h-80 overflow-auto">{JSON.stringify(log, null, 2)}</pre>
      </div>
    </div>
  );
}

