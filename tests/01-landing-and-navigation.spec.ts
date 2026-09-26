import { test, expect } from '@playwright/test';

test.describe('Feature 1: Landing Page & Navigation Suite', () => {
  test('should render the homepage with brand logo, hero section, and stats', async ({ page }) => {
    await page.goto('/');

    // Page title verification
    await expect(page).toHaveTitle(/মানব প্রহরী|Manob Prohori/i);

    // Brand logo should be visible
    const logo = page.locator('img[alt="Manob Prohori Logo"]').first();
    await expect(logo).toBeVisible();

    // Verify key nav links
    await expect(page.locator('text=Home').first()).toBeVisible();
    await expect(page.locator('text=Live Crisis Map').first()).toBeVisible();
    await expect(page.locator('text=Hospitals').first()).toBeVisible();
    await expect(page.locator('text=Blood Network').first()).toBeVisible();
    await expect(page.locator('text=Relief Aid').first()).toBeVisible();
    await expect(page.locator('text=Emergency Contacts').first()).toBeVisible();
  });

  test('should navigate to emergency crisis map from navbar', async ({ page }) => {
    await page.goto('/');
    const mapLink = page.locator('a[href="/crisis-map"]').first();
    await mapLink.click();
    await expect(page).toHaveURL(/.*crisis-map/);
  });
});
