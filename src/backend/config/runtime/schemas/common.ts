import { Schema } from 'convict';

export interface ServerCommonSchemaInterface {
  logger: {
    level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  };
}

export const ServerCommonSchema: Schema<ServerCommonSchemaInterface> = {
  logger: {
    level: {
      doc: 'Logging level (possible values: fatal, error, warn, info, debug, trace, silent)',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
    },
  },
};
