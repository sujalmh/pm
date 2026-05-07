import { test, expect } from "@playwright/test";

test("issues: redirects to /login when unauthenticated", async ({ page }) => {
  await page.goto("/projects/nonexistent/issues");
  await expect(page).toHaveURL(/.*\/login/);
});
