export declare const __DEVELOPMENT__: boolean;
export declare const __PRODUCTION__: boolean;
export declare const __TEST__: boolean;
export declare const __TEST_JEST__: boolean;
export const __BACKEND_SERVICES__: string[] = parseArrayString(
  __BACKEND_SERVICES_STRING__
);
export const __FRONTEND_SERVICES__: string[] = parseArrayString(
  __FRONTEND_SERVICES_STRING__
);

declare const __BACKEND_SERVICES_STRING__: string;
declare const __FRONTEND_SERVICES_STRING__: string;

function parseArrayString(arrayString: string): string[] {
  return String(arrayString).split(',');
}
