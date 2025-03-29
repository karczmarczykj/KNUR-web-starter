import { logger } from '@logger';
import koa from 'koa';
import koaMiddleware from 'koa-connect';
import history from 'connect-history-api-fallback';
import devMiddlewareWrapper from '@backend/dev/dev-middleware-wrapper';
import { createFrontendConfig } from '@webpack-config/frontend';
import { FrontendParams } from '@webpack-config/utils/build-types';

function createFrontendConfigurations(
  serviceList: string[]
): ReturnType<typeof createFrontendConfig>[] {
  let configList: ReturnType<typeof createFrontendConfig>[] = [];
  serviceList.forEach((frontendService) => {
    logger.info(`Creating webpack dev middleware for ${frontendService}`);
    const createFrontendParams: FrontendParams = {
      service: frontendService,
      buildType: 'development',
      entry: `./src/frontend/${frontendService}/index.tsx`,
    };
    const frontendServiceConfig = createFrontendConfig(createFrontendParams);
    configList.push(frontendServiceConfig);
  });
  return configList;
}

export default function frontendFullMiddleware(
  app: koa,
  serviceList: string[]
): void {
  // eslint-disable-next-line
  app.use(koaMiddleware(history() as unknown as any));

  app.use(
    devMiddlewareWrapper(createFrontendConfigurations(serviceList), serviceList)
  );
}
