import { test, expect } from '@playwright/test';

test.describe('Feature 5: Disaster Relief Aid & Direct P2P Donation Suite', () => {
  test('should display verified relief campaigns with progress bars', async ({ page }) => {
    await page.goto('/relief');

    // Page heading
    await expect(page.locator('h1')).toContainText(/ত্রাণ|Relief/i);

    // Verify verified badge or progress bar exists
    const campaignCards = page.locator('.rounded-3xl, .rounded-2xl').filter({ hasText: /৳|BDT|লক্ষ|হাজার/ });
    await expect(campaignCards.first()).toBeVisible({ timeout: 10000 });

    // Click "Send Direct Relief / Report Aid" button to open P2P donation modal
    const donateBtn = page.locator('button:has-text("Send Direct Relief"), button:has-text("Report Aid")').first();
    await expect(donateBtn).toBeVisible({ timeout: 10000 });
    await donateBtn.click();

    // Verify modal appears with bKash/Nagad instructions
    const modal = page.locator('.fixed.inset-0');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(/বিকাশ|নগদ|bKash|Nagad/i);

    // Close modal
    const closeBtn = modal.locator('button[aria-label*="বন্ধ"], button:has(svg)').first();
    await closeBtn.click();
  });

  test('should navigate to citizen relief application page', async ({ page }) => {
    await page.goto('/relief/apply');

    // Application form title
    await expect(page.locator('h1, h2').first()).toContainText(/আবেদন|ত্রাণ|Relief/i);

    // Financial account inputs
    await expect(page.locator('input[placeholder*="01"], input[placeholder*="বিকাশ"]').first()).toBeVisible();
  });
});
