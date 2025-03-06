import path from 'path';
import { Configuration } from 'webpack';
// Very important !!!! ts-loader will not work without importing this as .js file
// even if in reality it is a .ts file this is caused by the fact that ts-node/esm is used
// see package.json scripts for more info
import { BuildType } from './buildTypes.js';
import createBackendConfig from './backend.js';

const buildType = process.env.NODE_ENV as BuildType;

export default createBackendConfig('server', './src/index.ts', buildType);

