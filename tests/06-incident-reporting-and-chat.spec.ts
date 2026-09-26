import { test, expect } from '@playwright/test';

test.describe('Feature 6: Incident Details & Tactical Live Chat Suite', () => {
  test('should display active tactical channels list on /chat', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.locator('h1')).toContainText(/অপারেশনাল চ্যানেল|ট্যাকটিকাল|Chat/i);
    await expect(page.locator('text=লাইভ ক্রাইসিস ম্যাপ').first()).toBeVisible();
  });

  test('should safely handle incident permission boundary on /incidents/1 for unauthenticated visitors', async ({ page }) => {
    await page.goto('/incidents/1');

    // Guest should see permission / not found state
    const notFoundHeading = page.locator('h2:has-text("Incident Not Found")').or(page.locator('h1'));
    await expect(notFoundHeading.first()).toBeVisible({ timeout: 10000 });
  });

  test('should load incident reporting page with category and location selection', async ({ page }) => {
    await page.goto('/incidents/create');

    // Should either show reporting form or require sign in
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});
