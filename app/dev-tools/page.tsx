'use client';
import { useState } from 'react';

export default function DevToolsPage() {
  const [path, setPath] = useState('/api/stripe/payment_intents');
  const [method, setMethod] = useState<'GET' | 'POST'>('POST');
  const [body, setBody] = useState('{"amount":2000}');
  const [resText, setResText] = useState('');

  async function send() {
    const res = await fetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: method==='POST'? body : undefined });
    const text = await res.text();
    setResText(text);
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
      <h1 className="text-xl font-semibold">Dev Tools</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-gray-600">Endpoint Path</span>
          <input className="mt-1 w-full border rounded px-3 py-2" value={path} onChange={(e)=>setPath(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Method</span>
          <select className="mt-1 w-full border rounded px-3 py-2" value={method} onChange={(e)=>setMethod(e.target.value as any)}>
            <option>POST</option>
            <option>GET</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-gray-600">Body (JSON)</span>
        <textarea className="mt-1 w-full border rounded px-3 py-2 h-32" value={body} onChange={(e)=>setBody(e.target.value)} />
      </label>
      <button onClick={send} className="bg-brand text-white px-4 py-2 rounded">Send</button>
      <div>
        <div className="font-medium mb-1">Response</div>
        <pre className="bg-gray-100 rounded p-3 text-sm max-h-80 overflow-auto">{resText}</pre>
      </div>
    </div>
  );
}

