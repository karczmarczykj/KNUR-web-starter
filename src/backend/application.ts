import Koa from 'koa';
import Router from 'koa-router';
import { logger } from '@logger';

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  if (ctx.hostname.endsWith('.localhost')) {
    logger.info(`Request from ${ctx.hostname}`);
  }
  await next();
});

router.get('/', (ctx) => {
  ctx.body = { message: 'Hello, world!' };
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
