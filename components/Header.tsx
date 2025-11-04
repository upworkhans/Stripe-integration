import Link from 'next/link';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/payment-element', label: 'Payment Element' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/billing', label: 'Billing' },
  { href: '/webhooks', label: 'Webhooks' },
  { href: '/connect', label: 'Connect' },
  { href: '/dev-tools', label: 'Dev Tools' }
];

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand" />
          <span className="font-semibold">Stripe Playground</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-gray-700 hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

