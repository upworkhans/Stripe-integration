export default function OneTimePage() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h1 className="text-xl font-semibold mb-2">One-time Direct Payment</h1>
      <p className="text-gray-600">Server-created PaymentIntent + manual confirmation (coming next).</p>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        When testing payments, use 4242 4242 4242 4242, any future date, any CVC, any ZIP. See
        <a href="https://stripe.com/docs/testing" target="_blank" rel="noreferrer" className="ml-1 underline text-brand">Stripe testing docs</a>.
      </div>
    </div>
  );
}

