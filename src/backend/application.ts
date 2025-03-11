import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = { message: 'Hello, world!' };
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
