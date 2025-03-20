import { test, expect } from '@playwright/test';

test('GET / returns 200', async ({ request }) => {
    const response = await request.get('/');
    
    expect(response.status()).toBe(200);
});

