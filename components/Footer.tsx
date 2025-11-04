export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Built for demo purposes. Do not use secrets in client. Configure via env vars.
        </div>
        <div className="flex gap-4">
          <a className="hover:text-brand" href="https://stripe.com/docs" target="_blank" rel="noreferrer">Stripe Docs</a>
          <a className="hover:text-brand" href="https://nextjs.org/docs" target="_blank" rel="noreferrer">Next.js Docs</a>
          <a className="hover:text-brand" href="https://playwright.dev/" target="_blank" rel="noreferrer">Playwright</a>
        </div>
      </div>
    </footer>
  );
}

