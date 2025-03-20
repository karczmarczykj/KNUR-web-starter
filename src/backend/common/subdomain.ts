import runtimeConfig from '@config-runtime';
import { URL } from 'url';

export function getSubdomainName(url: string): string | null {
  const domain = runtimeConfig.runtime.get('domain');
  const hostname = new URL(url).hostname;
  if (hostname.endsWith(domain)) {
    return hostname.slice(0, -domain.length - 1);
  }
  return null;
}
