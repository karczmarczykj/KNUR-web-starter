import pino from 'pino';
import staticConfig from '@config';

const logger = pino(staticConfig.pinoOptions);

export function destroy(done: () => void) {
  logger.flush();
  done();
}

export default logger;

