import Link from 'next/link';

const pages = [
  { href: '/checkout', label: 'Off-site Checkout' },
  { href: '/payment-element', label: 'On-site Payment Element' },
  { href: '/card-element', label: 'Card Element' },
  { href: '/payment-request', label: 'Payment Request Button' },
  { href: '/rest-api', label: 'Direct REST API' },
  { href: '/iframe', label: 'Iframe Integration' },
  { href: '/subscriptions', label: 'Subscriptions & Plans' },
  { href: '/one-time', label: 'One-time Direct Payment' },
  { href: '/saved-methods', label: 'Saved Payment Methods' },
  { href: '/billing', label: 'Invoices & Billing Portal' },
  { href: '/webhooks', label: 'Webhooks' },
  { href: '/connect', label: 'Connect' },
  { href: '/customers', label: 'Portal & Customer Management' },
  { href: '/advanced', label: 'Advanced (SCA/3DS, Tax, Multi-currency)' },
  { href: '/dev-tools', label: 'Dev Tools' }
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-2">Stripe Playground Demo</h1>
        <p className="text-gray-600">
          Explore end-to-end examples of Stripe integrations. Configure via environment variables and
          toggle features for Checkout, Elements, Subscriptions, Connect, Webhooks, and more.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Demos</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-brand transition-colors shadow-sm"
            >
              <div className="font-medium">{p.label}</div>
              <div className="text-sm text-gray-500 mt-1">{p.href}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

