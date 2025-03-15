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
  http: {
    port: {
      doc: 'The HTTP or HTTPS port the server listens',
      format: 'port',
      default: 80,
    },
    version: {
      doc: 'Version of the HTTP protocol (possible values: 1.1, 2)',
      format: 'port',
      default: 80,
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
  },
  domain: {
    doc: 'The domain taht server listens listens on',
    format: String,
    default: 'localhost',
  },
};
