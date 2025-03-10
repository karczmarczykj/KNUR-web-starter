import path from 'path';
import { Configuration } from 'webpack';
// Very important !!!! ts-loader will not work without importing this as .js file
// even if in reality it is a .ts file this is caused by the fact that ts-node/esm is used
// see package.json scripts for more info
import { BuildType } from './build-types.js';
import createBackendConfig from './backend.js';

const buildType = process.env.NODE_ENV as BuildType;

const entry = './src/backend/index.ts';
const configurations: Configuration[] = [];

if (buildType === 'production') {
  const releaseComponents = ['api_server', 'auth_server', 'frontend_server'];
  for (const component of releaseComponents) {
    configurations.push(createBackendConfig(component, entry, buildType));
  }
} else {
  configurations.push(createBackendConfig('server', entry, buildType));
}

export default configurations;
