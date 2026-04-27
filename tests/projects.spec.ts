import { test, expect } from "@playwright/test";

test("projects: redirects to /login when unauthenticated", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveURL(/.*\/login/);
});
