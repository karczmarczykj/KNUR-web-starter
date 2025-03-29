import { logger } from '@logger';
import Koa from 'koa';
import chalk from 'chalk';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';

import webpack from 'webpack';

import { Context } from 'koa';
import { Readable } from 'stream';
import { ServerResponse } from 'http';
import { getSubdomainName } from '@backend/common/subdomain';

class KOAResponseWrapper extends ServerResponse {
  private ctx: Context;

  constructor(ctx: Context) {
    super(ctx.req);
    this.ctx = ctx;
  }

  getStatusCode(): number {
    return this.ctx.status;
  }

  setStatusCode(code: number): void {
    this.ctx.status = code;
  }

  getReadyReadableStreamState(): string {
    return 'open';
  }

  stream(stream: Readable): void {
    this.ctx.body = stream;
  }

  send(data: unknown): void {
    this.ctx.body = data;
  }

  finish(data?: unknown): void {
    this.ctx.status = this.statusCode;
    this.end(data);
  }
}

export default function wrappedMiddleware(
  configurations: webpack.Configuration[],
  serviceList: string[]
) {
  const devMiddlewares: {
    [key: string]: ReturnType<typeof webpackDevMiddleware>;
  } = {};
  const hotMiddlware: { [key: string]: ReturnType<typeof webpackHot> } = {};
  const compilerList: { [key: string]: webpack.Compiler } = {};

  configurations.forEach((config, index) => {
    const service = serviceList[index];
    logger.info(`Creating webpack dev middleware for ${service}`);
    const compiler = webpack(config);
    logger.info(
      `Public path for ${service} is ${config.output?.publicPath as string}`
    );
    const options: webpackDevMiddleware.Options = {
      publicPath: '/',
      mimeTypeDefault: 'text/html',
    };
    hotMiddlware[service] = webpackHot(compiler);
    devMiddlewares[service] = webpackDevMiddleware(compiler, options);
    compilerList[service] = compiler;
  });

  return async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const wrappedRes = new KOAResponseWrapper(ctx);
    logger.info('Request from ' + ctx.hostname + '...');
    const requestSubdomain = getSubdomainName('http://' + ctx.hostname);
    const hostnameBold = chalk.bold(ctx.hostname);
    const requestSubdomainBold = chalk.bold(requestSubdomain);

    if (requestSubdomain === null) {
      logger.info(
        `Request from ${hostnameBold} does not match any component... continuing`
      );
      await next();
      return;
    }

    if (requestSubdomain !== '' && !serviceList.includes(requestSubdomain)) {
      logger.info(
        `Request from ${hostnameBold} does not match component ${requestSubdomainBold} component... continuing`
      );
      await next();
      return;
    }

    let service = requestSubdomain;
    if (service === '') {
      service = 'root';
    }
    const serviceBold = chalk.bold(service);
    logger.info(
      `Request from ${hostnameBold} matches component ${serviceBold}... serving`
    );

    try {
      await new Promise((resolve, reject) => {
        // eslint-disable-next-line
        devMiddlewares[service](ctx.req, wrappedRes, (err) => {
          // eslint-disable-next-line
          if (err) reject(err);
          else resolve(null);
        });
      });
      await new Promise((resolve, reject) =>
        hotMiddlware[service](ctx.req, ctx.res, (err) => {
          // eslint-disable-next-line
          if (err) reject(err);
          else resolve(null);
        })
      );
    } catch (err: unknown) {
      if (err instanceof Koa.HttpError) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = { message: err.message };
      }
    }

    // WARNING: This is a hack to fix the issue with the content-type being set to application/octet-stream
    // when the response is a stream. This is a temporary fix until the issue is resolved in the webpack-dev-middleware
    if (ctx.method === 'GET') {
      if (ctx.response.type === 'application/octet-stream') {
        ctx.type = 'text/html';
      }
    }

    await next();
  };
}
