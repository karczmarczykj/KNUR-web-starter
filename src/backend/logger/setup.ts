import logger from '@logger';

export default function setupLogger({ level }: { level: string }) {
  logger.info(`Setting up logger level: ${level}`);
  logger.level = level;
}
