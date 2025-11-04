import Stripe from 'stripe';
import { env } from '@/lib/env';

type MockResponse<T> = T & { __mock: true };

function createMockStripe() {
  return {
    paymentIntents: {
      create: async (params: any) =>
        ({ id: 'pi_mock_123', client_secret: 'pi_secret_mock', status: 'requires_payment_method', ...params, __mock: true } as MockResponse<any>),
      confirm: async (id: string, params: any) =>
        ({ id, status: 'succeeded', ...params, __mock: true } as MockResponse<any>)
    },
    checkout: {
      sessions: {
        create: async (params: any) =>
          ({ id: 'cs_mock_123', url: env.STRIPE_CLIENT_URL + '/mock/checkout', ...params, __mock: true } as MockResponse<any>)
      }
    },
    setupIntents: {
      create: async (params: any) => ({ id: 'seti_mock_123', client_secret: 'seti_secret_mock', ...params, __mock: true } as MockResponse<any>)
    },
    customers: {
      create: async (params: any) => ({ id: 'cus_mock_123', ...params, __mock: true } as MockResponse<any>),
      retrieve: async (id: string) => ({ id, email: 'mock@example.com', __mock: true } as MockResponse<any>)
    },
    billingPortal: {
      sessions: {
        create: async (params: any) => ({ id: 'bps_mock_123', url: env.STRIPE_CLIENT_URL + '/mock/portal', ...params, __mock: true } as MockResponse<any>)
      }
    },
    prices: { 
      create: async (p: any) => ({ id: 'price_mock_123', ...p, __mock: true }),
      list: async (_params?: any) => ({
        data: [
          { id: 'price_mock_basic', unit_amount: 1000, currency: env.DEFAULT_CURRENCY, nickname: 'Basic', recurring: { interval: 'month' }, active: true, product: { id: 'prod_mock_basic', name: 'Mock Basic' } },
          { id: 'price_mock_onetime', unit_amount: 2000, currency: env.DEFAULT_CURRENCY, nickname: 'One-time', active: true, product: { id: 'prod_mock_one', name: 'Mock One-time' } }
        ],
        has_more: false
      }) as any
    },
    products: { 
      create: async (p: any) => ({ id: 'prod_mock_123', ...p, __mock: true }),
      retrieve: async (id: string) => ({ id, name: 'Mock Product', __mock: true })
    },
    coupons: { create: async (p: any) => ({ id: 'coupon_mock_123', ...p, __mock: true }) },
    subscriptions: {
      create: async (p: any) => ({ id: 'sub_mock_123', status: 'active', ...p, __mock: true }),
      update: async (id: string, p: any) => ({ id, ...p, __mock: true }),
      del: async (id: string) => ({ id, status: 'canceled', __mock: true })
    },
    webhookEndpoints: {
      create: async (p: any) => ({ id: 'we_mock_123', ...p, __mock: true })
    },
    accounts: {
      create: async (p: any) => ({ id: 'acct_mock_123', ...p, __mock: true })
    },
    transfers: {
      create: async (p: any) => ({ id: 'tr_mock_123', ...p, __mock: true })
    },
    ephemeralKeys: {
      create: async (p: any, opts: any) => ({ id: 'ephkey_mock_123', secret: 'ek_test_mock', opts, ...p, __mock: true })
    }
  } as unknown as Stripe;
}

export function getStripe(): Stripe {
  if (env.bool.USE_MOCK_STRIPE) return createMockStripe();
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required unless USE_MOCK_STRIPE=true');
  }
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });
}

export function publishableKey(): string {
  return (
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  );
}

