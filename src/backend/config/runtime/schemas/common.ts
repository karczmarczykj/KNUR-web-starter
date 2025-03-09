export interface ServerCommonSchemaType {
  readonly logger: {
    readonly level: {
      readonly doc: 'Logging level (possible values: fatal, error, warn, info, debug, trace, silent)';
      readonly format: string;
      readonly default: 'info';
    }
  }
}

export const ServerCommonSchema: ServerCommonSchemaType = {
  logger: {
    level: {
      doc: 'Logging level (possible values: fatal, error, warn, info, debug, trace, silent)',
      format: 'String',
      default: 'info'
    }
  }
};
