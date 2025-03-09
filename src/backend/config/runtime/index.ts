import formats from '@config-runtime/formats';
import ServerApiSchema from '@config-runtime/schemas/server-api';
import configStatic from '@config';
import logger from '@logger';
import setupLogger from '@logger/setup';

import convict from 'convict';
import yaml from 'js-yaml';
import convict_format_with_validator from 'convict-format-with-validator';
import findFileUp from 'find-file-up';
import path, { dirname } from 'path';

async function loadConfiguration() {
  logger.info(`Searching configuration file (${configStatic.configFile}) ...`);
  convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.load })
  convict.addFormats(convict_format_with_validator);
  convict.addFormats(formats);
  const config = convict(ServerApiSchema);
  const executableDir: string = dirname(process.argv[1]);
  const configFile = await findFileUp(configStatic.configFile, executableDir);

  if (!configFile) {
    logger.error(`Cannot find configuration file ${configStatic.configFile}, using default configuration options`);
    return {
      runtime: config,
      paths: {
        config: '.'
      }
    }
  }

  logger.info(`Reading configuration file: ${configFile}`);

  const runtime = config.loadFile(configFile).validate({ allowed: 'strict' });

  const loggerLevel = config.get("logger.level");
  setupLogger({level: loggerLevel});

  const paths = {
    config: path.dirname(configFile)
  };

  return {
    runtime,
    paths
  };
}

const config = await loadConfiguration()

export default config;

