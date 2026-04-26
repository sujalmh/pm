import { test, expect } from '@playwright/test';

test('redirects to login when unauthenticated', async ({ page }) => {
  // Assuming a project key is needed, e.g. /projects/KEY/time
  await page.goto('/projects/DEMO/time');
  await expect(page).toHaveURL(/.*\/login/);
});
