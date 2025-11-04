export default function AdvancedPage() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
      <h1 className="text-xl font-semibold mb-2">Advanced: SCA/3DS, Tax, Multi-currency</h1>
      <div className="rounded-lg border p-4 bg-gray-50">
        <div className="font-medium">Strong Customer Authentication (3DS)</div>
        <p className="text-sm text-gray-700 mt-1">Use Payment Element or Card Element with the following test cards:</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 mt-2">
          <li>3DS required: 4000 0027 6000 3184</li>
          <li>3DS authentication failure: 4000 0000 0000 0101</li>
        </ul>
        <a href="https://stripe.com/docs/testing#regulatory-cards" target="_blank" rel="noreferrer" className="inline-block mt-2 text-brand underline">SCA testing docs</a>
      </div>
      <div className="rounded-lg border p-4 bg-gray-50">
        <div className="font-medium">Multi-currency</div>
        <p className="text-sm text-gray-700 mt-1">Change currency via API when creating a PaymentIntent. This demo uses default currency from env.</p>
        <a href="https://stripe.com/docs/currencies" target="_blank" rel="noreferrer" className="inline-block mt-2 text-brand underline">Currency docs</a>
      </div>
      <div className="rounded-lg border p-4 bg-gray-50">
        <div className="font-medium">Tax</div>
        <p className="text-sm text-gray-700 mt-1">Stripe Tax can be enabled and configured to automatically calculate taxes in Checkout or Payment Element.</p>
        <a href="https://stripe.com/docs/tax" target="_blank" rel="noreferrer" className="inline-block mt-2 text-brand underline">Stripe Tax docs</a>
      </div>
    </div>
  );
}

