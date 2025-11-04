import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().default('3000'),
  DEFAULT_CURRENCY: z.string().default('usd'),
  ALLOWED_HOSTS: z.string().default('localhost'),
  LOG_LEVEL: z.string().default('debug'),

  ENABLE_DB: z.string().default('false'),
  DATABASE_URL: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_CLIENT_URL: z.string().default('http://localhost:3000'),

  ENABLE_CONNECT: z.string().default('false'),
  STRIPE_ACCOUNT: z.string().optional(),

  USE_MOCK_STRIPE: z.string().default('false'),
  SEED_ONLY: z.string().default('false'),

  NEXTAUTH_URL: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsed.data,
  bool: {
    ENABLE_DB: parsed.data.ENABLE_DB === 'true',
    ENABLE_CONNECT: parsed.data.ENABLE_CONNECT === 'true',
    USE_MOCK_STRIPE: parsed.data.USE_MOCK_STRIPE === 'true',
    SEED_ONLY: parsed.data.SEED_ONLY === 'true'
  }
};

export type AppEnv = typeof env;

