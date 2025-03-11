import { promises as fs } from 'fs';
import path from 'path';
import runtimeConfig from '@config-runtime';
import { logger } from '@logger';
import { Buffer } from 'buffer';

export interface Certificates {
  paths: {
    cert: string;
    key: string;
  };
  content: {
    cert: Buffer;
    key: Buffer;
  };
}

export default async function (): Promise<Certificates> {
  const certFile = path.join(runtimeConfig.runtime.get('ssl.certFile'));
  const keyFile = path.join(runtimeConfig.runtime.get('ssl.keyFile'));
  logger.info(
    `Reading certificates files (cert file: ${certFile}, key file: ${keyFile})`
  );
  return {
    paths: {
      cert: certFile,
      key: keyFile,
    },
    content: {
      cert: await fs.readFile(certFile),
      key: await fs.readFile(keyFile),
    },
  };
}
