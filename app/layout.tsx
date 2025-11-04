import './globals.css';
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Stripe Playground Demo',
  description: 'Comprehensive Stripe integration demos using Next.js + TypeScript.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header />
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

