import app from '@backend/application';

import { describe, expect, it } from '@jest/globals';
import httpMocks from 'node-mocks-http';

describe('Koa API healthcheck tests', () => {
  it('should return 200 and JSON response', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });

    const response = httpMocks.createResponse();

    await app.callback()(request, response);

    expect(response.statusCode).toBe(200);
    expect(response._getJSONData()).toStrictEqual({ message: 'Hello, world!' });
  });

  it('should return 404 for an unknown route', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/unknown',
    });

    const response = httpMocks.createResponse();

    await app.callback()(request, response);

    expect(response.statusCode).toBe(404);
  });
});
