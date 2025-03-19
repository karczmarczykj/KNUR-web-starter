import { logger } from '@logger';
import Koa from 'koa';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';

import { Context } from 'koa';
import { Readable } from 'stream';
import { ServerResponse } from 'http';

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
  compiler: webpack.Compiler,
  options: webpackDevMiddleware.Options
) {
  const devMiddleware = webpackDevMiddleware(compiler, options);
  logger.info('Webpack dev middleware initialized');

  return async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    logger.info(`Request from ${ctx.hostname}`);
    const wrappedRes = new KOAResponseWrapper(ctx);
    // eslint-disable-next-line
    return await devMiddleware(ctx.req, wrappedRes, next);
  };
}
