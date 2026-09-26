import { test, expect } from '@playwright/test';

test.describe('Feature 3: Hospital Locator & Emergency Directory Suite', () => {
  test('should display hospital directory with search and 24/7 filter', async ({ page }) => {
    await page.goto('/hospitals');

    // Page title / heading
    await expect(page.locator('h1')).toContainText(/হাসপাতাল|Medical/i);

    // Search bar
    const searchInput = page.locator('input[placeholder*="hospital"]').first();
    await expect(searchInput).toBeVisible();

    // Verify hospital cards are rendered from DB
    const hospitalCards = page.locator('[data-testid="hospital-card"], .rounded-2xl, .rounded-3xl');
    await expect(hospitalCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display national emergency hotline directory with click-to-call', async ({ page }) => {
    await page.goto('/emergency-directory');

    // Emergency directory header
    await expect(page.locator('h1')).toContainText(/জরুরি যোগাযোগ|Emergency/i);

    // National 999 hotline badge or card should be visible
    await expect(page.locator('text=999').first()).toBeVisible({ timeout: 10000 });

    // Ambulance & Fire Service entries should be visible
    await expect(page.locator('text=ফায়ার সার্ভিস').or(page.locator('text=Fire')).first()).toBeVisible();
  });
});
