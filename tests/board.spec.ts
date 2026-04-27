import { test, expect } from '@playwright/test';

test('redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/board');
  await expect(page).toHaveURL(/.*\/login/);
});
