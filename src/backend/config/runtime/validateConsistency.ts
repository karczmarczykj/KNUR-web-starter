import { ServerCommonSchemaInterface } from '@config-runtime/schemas/common';

export function validate(input: ServerCommonSchemaInterface): void {
  if (input.http.ssl) {
    if (
      (!input.http.ssl.cert || !input.http.ssl.key) &&
      (input.http.ssl.cert || input.http.ssl.key)
    ) {
      throw new Error('Both cert and key files must be provided for SSL');
    }
  }
}
