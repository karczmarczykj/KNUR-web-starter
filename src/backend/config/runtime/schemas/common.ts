import { Schema } from 'convict';

export interface ServerCommonSchemaInterface {
  logger: {
    level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  };
  ports: {
    http: number;
    https: number;
  };
  ssl: {
    certFile: string;
    keyFile: string;
  };
  domain: string;
}

export const ServerCommonSchema: Schema<ServerCommonSchemaInterface> = {
  logger: {
    level: {
      doc: 'Logging level (possible values: fatal, error, warn, info, debug, trace, silent)',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
    },
  },
  ports: {
    http: {
      doc: 'The HTTP port the server listens redirects',
      format: 'port',
      default: 80,
    },
    https: {
      doc: 'The HTTPS port the server listens on',
      format: 'port',
      default: 443,
    },
  },
  ssl: {
    certFile: {
      doc: 'Path to the SSL certificate file',
      format: 'file',
      default: null,
    },
    keyFile: {
      doc: 'Path to the SSL key file',
      format: 'file',
      default: null,
    },
  },
  domain: {
    doc: 'The domain taht server listens listens on',
    format: String,
    default: 'localhost',
  },
};
