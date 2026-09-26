import { test, expect } from '@playwright/test';

test.describe('Feature 2: GIS Live Crisis Map Suite', () => {
  test('should load crisis map with interactive controls and division flight buttons', async ({ page }) => {
    await page.goto('/crisis-map');

    // Wait for the map container to mount
    const mapContainer = page.locator('.leaflet-container');
    await expect(mapContainer).toBeVisible({ timeout: 15000 });

    // Verify division flight buttons
    const dhakaBtn = page.locator('button:has-text("Dhaka")').first();
    await expect(dhakaBtn).toBeVisible();

    const ctgBtn = page.locator('button:has-text("Chittagong")').first();
    await expect(ctgBtn).toBeVisible();

    // Verify GPS safety check button exists
    const gpsBtn = page.locator('button:has-text("Scan My Live Location Safety")').first();
    await expect(gpsBtn).toBeVisible();
  });
});
