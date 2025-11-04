/*
  Seed Stripe resources (idempotent-ish demo):
  - Product(s), Price(s), Coupon(s)
*/
import { getStripe } from '@/lib/stripe';
import { env } from '@/lib/env';

async function main() {
  const stripe = getStripe();

  // Create a product
  const product = await stripe.products.create({
    name: 'Demo Pro Plan',
    default_price_data: {
      currency: env.DEFAULT_CURRENCY,
      unit_amount: 1200,
      recurring: { interval: 'month' }
    }
  });

  // Create a one-time price
  const productOneTime = await stripe.products.create({ name: 'Demo One-time' });
  const price = await stripe.prices.create({
    currency: env.DEFAULT_CURRENCY,
    unit_amount: 2000,
    product: productOneTime.id
  });

  // Create a coupon
  const coupon = await stripe.coupons.create({
    duration: 'once',
    percent_off: 25
  });

  // eslint-disable-next-line no-console
  console.log('Seeded:', { product: product.id, price: price.id, coupon: coupon.id });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

