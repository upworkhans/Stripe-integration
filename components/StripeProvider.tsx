"use client";
import { ReactNode, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe, type StripeElementsOptions } from '@stripe/stripe-js';

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
);

export function StripeElementsProvider({ children, clientSecret }: { children: ReactNode; clientSecret?: string | null }) {
  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (clientSecret) {
      return { appearance: { theme: 'stripe' }, clientSecret } as StripeElementsOptions;
    }
    return undefined;
  }, [clientSecret]);
  // Force Elements remount when clientSecret changes so amount updates take effect
  return <Elements key={clientSecret || 'no-secret'} stripe={stripePromise} options={options}>{children}</Elements>;
}

