import Link from 'next/link';
import type { Route } from 'next';

type NavGroup = {
  label: string;
  items: { href: Route; label: string }[];
};

const groups: NavGroup[] = [
  {
    label: 'Payments',
    items: [
      { href: '/checkout', label: 'Checkout' },
      { href: '/payment-element', label: 'Payment Element' },
      { href: '/card-element', label: 'Card Element' },
      { href: '/payment-request', label: 'Payment Request' },
      { href: '/one-time', label: 'One-time Payment' },
      { href: '/rest-api', label: 'Direct REST API' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { href: '/subscriptions', label: 'Subscriptions' },
      { href: '/billing', label: 'Invoices & Portal' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { href: '/customers', label: 'Customer Portal' },
      { href: '/saved-methods', label: 'Saved Methods' },
    ],
  },
  {
    label: 'Webhooks',
    items: [
      { href: '/webhooks', label: 'Events' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/connect', label: 'Connect' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { href: '/advanced', label: 'Advanced' },
      { href: '/dev-tools', label: 'Dev Tools' },
      { href: '/iframe', label: 'Iframe' },
      { href: '/rest-api', label: 'REST API' },
    ],
  },
];

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 relative z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand" />
          <span className="font-semibold">Stripe Playground</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-700 hover:text-brand">Home</Link>
          {groups.map((group) => (
            <div key={group.label} className="relative group">
              <button className="text-gray-700 hover:text-brand inline-flex items-center gap-1">
                {group.label}
                <svg className="h-3 w-3 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 mt-2 min-w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-lg z-50">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className="block rounded px-3 py-2 text-gray-700 hover:bg-brand/5 hover:text-brand">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

