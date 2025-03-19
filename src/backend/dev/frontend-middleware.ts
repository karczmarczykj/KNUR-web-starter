import { logger } from '@logger';
import { URL } from 'url';
import koa from 'koa';
import webpack, { Configuration } from 'webpack';
import koaConnect from 'koa-connect';
import chalk from 'chalk';
import Buffer from 'buffer';
import runtimeConfig from '@config-runtime';
import devMiddlewareWrapper from '@backend/dev/dev-middleware-wrapper';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getFrontendComponentConfig from '@backend/../../config/webpack/frontend';
import components from '@backend/../../config/webpack/components.json' with { type: 'json' };

function getSubdomainFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname;
    const subdomain = hostname.split('.')[0];
    return subdomain;
  } catch {
    return null;
  }
}

function frontendComponentMiddleware(
  app: koa,
  config: Configuration,
  componentName: string
): void {
  logger.info(
    'Preparing to build frontend component ' +
      chalk.bold(componentName) +
      ' on the fly with webpack'
  );
  const webpackCompiler = webpack(config);
  logger.info(
    'Setting up webpack middleware for component ' + chalk.bold(componentName)
  );

  if (!config?.output?.publicPath) {
    logger.error(
      'Webpack configuration component ' +
        chalk.bold(componentName) +
        ' does not have publicPath defined'
    );
    process.exit(1);
  }

  const publicPath = config.output.publicPath;

  app.use(devMiddlewareWrapper(webpackCompiler, { publicPath }));

  logger.info(
    `Setting up webpack HRM middleware for component "${componentName}"`
  );
  const hot = webpackHotMiddleware(webpackCompiler);
  app.use(koaConnect(hot));

  app.use(async (ctx, next) => {
    const requestSubdomain = getSubdomainFromUrl(ctx.request.origin);
    const mainDomain = runtimeConfig.runtime.get('domain');
    if (componentName === 'public') {
      if (requestSubdomain !== mainDomain) {
        logger.info(
          'Request from ' +
            chalk.bold(ctx.hostname) +
            ' does not match main domain ' +
            chalk.bold(mainDomain) +
            ' with public component... continuing'
        );
        await next();
        return;
      }
    } else if (componentName !== requestSubdomain) {
      logger.info(
        'Request from ' +
          chalk.bold(ctx.hostname) +
          ' does not match component ' +
          chalk.bold(componentName) +
          ' component... continuing'
      );
      await next();
      return;
    }

    try {
      ctx.type = 'text/html';
      ctx.body = await handleCompilerBody(webpackCompiler);
      ctx.status = 200;
    } catch (err: unknown) {
      ctx.status = 500;
      ctx.body = 'Internal server error';
      if (err instanceof Error) {
        logger.error(`Error while handling compiler body: ${err}`);
      }
    }
  });
}

function handleCompilerBody(
  compiler: webpack.Compiler
): Promise<Buffer | undefined> {
  return new Promise((resolve, reject) => {
    if (compiler.outputFileSystem == null) {
      logger.error('Compiler outputFileSystem is not defined');
      process.exit(1);
    }
    compiler.outputFileSystem.readFile(
      './dist/development/public/index.html',
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

export default function frontendFullMiddleware(app: koa): void {
  const configLists = getFrontendComponentConfig('development');
  const componentsNames = components.frontend;
  if (configLists.length !== componentsNames.length) {
    logger.error(
      `Number of components does not match number of configurations`
    );
    process.exit(1);
  }

  for (let i = 0; i < configLists.length; i++) {
    frontendComponentMiddleware(app, configLists[i], componentsNames[i]);
  }
}
