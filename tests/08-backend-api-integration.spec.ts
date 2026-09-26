import { test, expect } from '@playwright/test';

const BACKEND_URL = process.env.PLAYWRIGHT_BACKEND_URL || 'http://localhost:5000';

test.describe('Feature 8: Backend Live API Integration Suite', () => {
  test('GET /api/health should return ok', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });

  test('GET /api/incident-categories should return categories array', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/incident-categories`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/hospitals should return hospital registry', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/hospitals?limit=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/emergency-services should return national hotlines', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/emergency-services`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/blood/requests/public should return public blood requests', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/blood/requests/public?limit=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.requests)).toBe(true);
  });

  test('GET /api/relief/public should return verified relief campaigns', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/relief/public?limit=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.campaigns)).toBe(true);
    expect(body.data.campaigns.length).toBeGreaterThan(0);
  });

  test('GET /api/relief/:id should return single relief campaign details', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/relief/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(1);
    expect(body.data.bkash_number).toBeDefined();
  });
});
