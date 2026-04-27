import { test, expect } from "@playwright/test";

test("issues: redirects to /login when unauthenticated", async ({ page }) => {
  // Using a clearly-fake slug — the auth redirect fires before the page resolves
  await page.goto("/projects/nonexistent/issues");
  await expect(page).toHaveURL(/.*\/login/);
});
