import { printGlobals } from "./defined-globals";
import logger from "@logger";
import config from "@config-runtime";
import chalk from "chalk";

if (!config) {
  logger.error('Configuration cannot be initialized, exiting...');
  process.exit(1);
}

printGlobals();

logger.info(chalk.yellow('🚀 Server is starting...'));
logger.info(chalk.greenBright(`Server configuration: \n${JSON.stringify(config.runtime.getProperties(), null, 2)}`));

