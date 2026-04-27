import { test, expect } from "@playwright/test";

test("time: redirects to /login when unauthenticated", async ({ page }) => {
  await page.goto("/time");
  await expect(page).toHaveURL(/.*\/login/);
});
