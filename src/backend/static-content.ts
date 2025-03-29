import Koa from 'koa';
import { logger } from '@logger';
import {
  __TEST_JEST__,
  __DEVELOPMENT__,
  __FRONTEND_SERVICES__,
} from '@backend/common/build-defined';
import serve from 'koa-static';
import path from 'path';
import { getSubdomainName } from '@backend/common/subdomain';

declare const __dirname: string;

export default async function setup(app: Koa): Promise<void> {
  const frontendServiceList = [...__FRONTEND_SERVICES__];
  logger.info(`Running frontend services: ${frontendServiceList.join(', ')}`);
  if (__TEST_JEST__) return;

  if (__DEVELOPMENT__) {
    const { default: setFrontendMiddleware } = await import(
      '@backend/dev/frontend-middleware'
    );
    setFrontendMiddleware(app, frontendServiceList);
  } else {
    const staticContent: { [key: string]: ReturnType<typeof serve> } = {};
    for (const service of frontendServiceList) {
      const publicPath = path.resolve(__dirname, `../content/${service}`);
      logger.info(`Serving static content for ${service} from ${publicPath}`);
      staticContent[service] = serve(publicPath);
    }

    app.use(async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
      logger.info(`Serving static content for ${ctx.hostname}`);
      const subdomain = getSubdomainName('http://' + ctx.hostname);
      if (subdomain === null) {
        logger.info(
          `Request from ${ctx.hostname} does not match any component... continuing`
        );
        return await next();
      }

      if (subdomain === '' && 'root' in staticContent) {
        logger.info(
          `Request from ${ctx.hostname} matches component root... serving`
        );
        await staticContent['root'](ctx, next);
      } else if (subdomain in staticContent) {
        logger.info(
          `Request from ${ctx.hostname} matches component ${subdomain}... serving`
        );
        await staticContent[subdomain](ctx, next);
      } else {
        logger.info(
          `Request from ${ctx.hostname} does not match any component... continuing`
        );
        await next();
      }
    });
  }
}
