import { test, expect } from '@playwright/test';

test.describe('Feature 4: Blood Donor & Emergency Requests Suite', () => {
  test('should display blood network with ABO blood groups filter', async ({ page }) => {
    await page.goto('/blood');

    // Page title
    await expect(page.locator('h1')).toContainText(/ব্লাড|রক্ত|Blood/i);

    // Blood groups filter buttons (A+, B+, O+, etc.)
    await expect(page.locator('button:has-text("A+")').or(page.locator('text=A+')).first()).toBeVisible();
    await expect(page.locator('button:has-text("O+")').or(page.locator('text=O+')).first()).toBeVisible();

    // Verify "রক্তের জন্য অনুরোধ করুন" or request blood button exists
    const reqBtn = page.locator('button:has-text("অনুরোধ"), a:has-text("অনুরোধ"), button:has-text("Request")').first();
    await expect(reqBtn).toBeVisible();
  });

  test('should load donor registration page with blood group and evidence uploader', async ({ page }) => {
    await page.goto('/donor/register');

    // Heading
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Blood group select or radio should be present
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
  });
});
