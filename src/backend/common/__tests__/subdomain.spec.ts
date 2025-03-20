import { describe, expect, it } from '@jest/globals';
import { getSubdomainName } from '@backend/common/subdomain';
import runtimeConfig from '@config-runtime';

describe('unit: Subdomain parse tests ', () => {
  it('When a subdomain is present in the URL, it should be returned', () => {
    runtimeConfig.runtime.set('domain', 'example.com');
    const url = 'http://subdomain.example.com/my-path';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe('subdomain');
  });

  it('When domain is other than defined in config, it should return null', () => {
    runtimeConfig.runtime.set('domain', 'example.com');
    const url = 'http://subdomain.other.com/my-path';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe(null);
  });

  it('Whenn there is no subdomain in the URL, it should return empty string', () => {
    runtimeConfig.runtime.set('domain', 'example.com');
    const url = 'http://example.com/my-path';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe('');
  });

  it('When domain is subdomain, it should return null', () => {
    runtimeConfig.runtime.set('domain', 'example.com');
    const url = 'http://example.com.org/my-path';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe(null);
  });

  it('When domain is localhost, it should return empty string', () => {
    runtimeConfig.runtime.set('domain', 'localhost');
    const url = 'http://localhost:3000/my-path';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe('');
  });

  it('When request is comming from localhost, it should return empty string', () => {
    runtimeConfig.runtime.set('domain', 'localhost');
    const url = 'http://localhost';
    const subdomain = getSubdomainName(url);
    expect(subdomain).toBe('');
  });
});
