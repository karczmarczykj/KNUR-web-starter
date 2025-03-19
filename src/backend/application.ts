import Koa from 'koa';
import { router } from '@routes';
import { logger } from '@logger';
import { __DEVELOPMENT__ } from '@common/build-defined';
import serve from 'koa-static';
import path from 'path';

declare const __dirname: string;
const publicPath = path.resolve(__dirname, '../public');
const app = new Koa();

logger.info(`Static files will be served from: ${publicPath}`);
if (__DEVELOPMENT__) {
  const { default: setFrontendMiddleware } = await import(
    '@backend/dev/frontend-middleware'
  );
  setFrontendMiddleware(app);
} else {
  app.use(serve(publicPath));
}

app.use(async (ctx, next) => {
  if (ctx.hostname.endsWith('.localhost')) {
    logger.info(`Request from ${ctx.hostname}`);
  }
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
