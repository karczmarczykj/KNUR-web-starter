import pino, { LoggerOptions } from "pino";

const pinoOptions: LoggerOptions = {
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss"
    },
  },
};

const staticConfig = {
  pinoOptions,
  configFile: "server-config.yaml",
};

export default staticConfig;
