import { test, expect } from '@playwright/test';

test('GET / returns 200', async ({ request }) => {
    const response = await request.get('/');
    
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({ "message": "Hello, world!" });
});

test('Redirects HTTP to HTTPS', async ({ request }) => {
  const response = await request.get('http:localhost:2999');
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toEqual({ "message": "Hello, world!" });
});
