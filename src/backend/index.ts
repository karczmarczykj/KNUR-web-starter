import { printBuildSettings } from '@backend/build-info';
import { logger } from '@logger';
import config from '@config-runtime';
import app from '@backend/application';
import readCerts from '@config-runtime/certificates';
import runtimeConfig from '@config-runtime';

import chalk from 'chalk';
import http2 from 'http2';
import http from 'http';

if (!config) {
  logger.error('Configuration cannot be initialized, exiting...');
  process.exit(1);
}

printBuildSettings();

logger.info(chalk.yellow('🚀 Server is starting...'));
logger.info(
  chalk.greenBright(
    `Server runtime configuration: \n${JSON.stringify(config.runtime.getProperties(), null, 2)}`
  )
);

const httpPort = runtimeConfig.runtime.get('ports.http');
const httpsPort = runtimeConfig.runtime.get('ports.https');
const domain = runtimeConfig.runtime.get('domain');

logger.info(`Creating HTTPS server on port ${httpsPort}`);
const certs = await readCerts();

const options = {
  ...certs.content,
  allowHTTP1: true,
};

http2
  .createSecureServer(options, (req, res) => void app.callback()(req, res))
  .listen(httpsPort, () => {
    logger.info(
      'Server HTTP/2 is running on ' +
        chalk.redBright(`https://${domain}:${httpsPort}`)
    );
  });

http
  .createServer((req, res) => void app.callback()(req, res))
  .listen(httpPort, () => {
    logger.info(
      'Server is redirecting to HTTPS from ' +
        chalk.redBright(`http://${domain}:${httpPort}`)
    );
  });
