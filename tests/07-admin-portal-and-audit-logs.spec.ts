import { test, expect } from '@playwright/test';

test.describe('Feature 7: Admin Portal & System Audit Logs Suite', () => {
  test('should enforce RBAC security and redirect unauthenticated guests from /admin/audit-logs to signin', async ({ page }) => {
    await page.goto('/admin/audit-logs');

    // Should be redirected to signin page
    await expect(page).toHaveURL(/.*signin.*/);

    // Verify sign in page is presented
    await expect(page.locator('h1, h2').first()).toContainText(/Welcome Back|Sign In/i);
  });

  test('should enforce RBAC security on /admin/relief and redirect to signin', async ({ page }) => {
    await page.goto('/admin/relief');
    await expect(page).toHaveURL(/.*signin.*/);
  });
});
