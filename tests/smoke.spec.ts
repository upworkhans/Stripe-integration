import { test, expect } from '@playwright/test';

test('home loads and shows demos', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Stripe Playground Demo')).toBeVisible();
  await expect(page.getByText('Off-site Checkout')).toBeVisible();
});

