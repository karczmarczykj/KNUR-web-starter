import { logger } from '@logger';
import chalk from 'chalk';

export declare const __DEVELOPMENT__: boolean;
export declare const __PRODUCTION__: boolean;
export declare const __TEST__: boolean;
export declare const __COMPONENT_SERVER__: boolean;
export declare const __COMPONENT_AUTH_SERVER__: boolean;

export function printGlobals(): void {
  let result = 'Running ';
  const ornament = '▀▄'.repeat(15);

  if (typeof __COMPONENT_SERVER__ !== 'undefined' && __COMPONENT_SERVER__) {
    result += '͟S͟E͟R͟V͟E͟R͟ component ';
  }

  if (
    typeof __COMPONENT_AUTH_SERVER__ !== 'undefined' &&
    __COMPONENT_AUTH_SERVER__
  ) {
    result += '͟A͟U͟T͟H͟ ͟S͟E͟R͟V͟E͟R͟ component ';
  }

  result += 'in ';

  if (typeof __DEVELOPMENT__ !== 'undefined' && __DEVELOPMENT__) {
    result += '͟D͟E͟V͟E͟L͟O͟P͟M͟E͟N͟T͟ mode';
  } else if (typeof __PRODUCTION__ !== 'undefined' && __PRODUCTION__) {
    result += '͟P͟R͟O͟D͟U͟C͟T͟I͟O͟N͟ mode';
  } else if (typeof __TEST__ !== 'undefined' && __TEST__) {
    result += '͟T͟E͟S͟T͟ mode';
  }

  logger.info(chalk.magenta(ornament + ' ' + result + ' ' + ornament));
}
