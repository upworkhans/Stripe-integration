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
      <section className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-indigo-50 p-8 shadow-sm">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Stripe Playground Demo</h1>
          <p className="text-gray-700 max-w-2xl">
            Explore end-to-end examples of Stripe integrations. Configure via environment variables and
            toggle features for Checkout, Elements, Subscriptions, Billing, Webhooks, Connect, and more.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/payment-element" className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-white hover:opacity-90">
              Try Payment Element
            </Link>
            <Link href="/checkout" className="inline-flex items-center rounded-md border border-brand/30 px-4 py-2 text-brand hover:bg-brand/5">
              Start with Checkout
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/10 blur-3xl" />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand"><path fill="currentColor" d="M4 7h16v2H4zM4 11h16v2H4zM4 15h10v2H4z"/></svg>
            </div>
            <div className="font-medium">Accept payments quickly</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Use Checkout, Payment Element, or Card Element.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/checkout" className="text-brand text-sm hover:underline">Checkout</Link>
            <Link href="/payment-element" className="text-brand text-sm hover:underline">Payment Element</Link>
            <Link href="/card-element" className="text-brand text-sm hover:underline">Card Element</Link>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand"><path fill="currentColor" d="M4 6h16v12H4zM6 8h12v8H6z"/></svg>
            </div>
            <div className="font-medium">Bill subscriptions</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Create plans, manage trials, and handle invoices.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/subscriptions" className="text-brand text-sm hover:underline">Subscriptions</Link>
            <Link href="/billing" className="text-brand text-sm hover:underline">Billing Portal</Link>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand"><path fill="currentColor" d="M12 2l4 7h-8l4-7zm0 20l-4-7h8l-4 7zM2 12l7-4v8l-7-4zm20 0l-7 4V8l7 4z"/></svg>
            </div>
            <div className="font-medium">Automate operations</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Listen to webhooks and use dev tools to test flows.</p>
          <div className="mt-3 flex gap-2">
            <Link href="/webhooks" className="text-brand text-sm hover:underline">Webhooks</Link>
            <Link href="/dev-tools" className="text-brand text-sm hover:underline">Dev Tools</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="font-medium">Connect marketplace payouts</div>
            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand"><path fill="currentColor" d="M3 6h18v2H3zm2 4h14v8H5z"/></svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Create connected accounts and transfer funds to sellers.</p>
          <div className="mt-3">
            <Link href="/connect" className="inline-flex items-center rounded-md border border-brand/30 px-3 py-2 text-brand hover:bg-brand/5">Explore Connect</Link>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="font-medium">Direct REST API</div>
            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand"><path fill="currentColor" d="M4 4h16v4H4zm0 6h10v10H4zM16 12h4v8h-4z"/></svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Call Stripe endpoints directly for custom flows.</p>
          <div className="mt-3">
            <Link href="/rest-api" className="inline-flex items-center rounded-md border border-brand/30 px-3 py-2 text-brand hover:bg-brand/5">Use REST API</Link>
          </div>
        </div>
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

