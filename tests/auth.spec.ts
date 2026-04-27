import { test, expect } from "@playwright/test";

test("auth: redirects to /login when unauthenticated accessing dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/.*\/login/);
});
