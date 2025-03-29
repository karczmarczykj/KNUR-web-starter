import { BuildType } from './utils/build-types.ts';
import * as resolveAliases from './utils/resolveAliases.ts';

import { PathLike } from 'fs';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import backendAliases from './backend-aliases.json' with { type: "json" };
import * as workdir from './utils/workdir.ts';

const workDirPath = workdir.default();
const distPath = path.resolve(workDirPath, 'dist');

type Definitions = Record<'__DEVELOPMENT__' | 
                          '__TEST__' | 
                          '__TEST_JEST__' |
                          '__PRODUCTION__' | 
                          '__BACKEND_SERVICES_STRING__' | 
                          '__FRONTEND_SERVICES_STRING__', string | boolean>;

function createDefinitions(backendServices: string[], frontnedServices: string[], buildType: BuildType) {
  const definitions : Definitions = {
    __DEVELOPMENT__: buildType === 'development',
    __TEST__: buildType === 'test',
    __TEST_JEST__: false,
    __PRODUCTION__: buildType === 'production',
    __BACKEND_SERVICES_STRING__: JSON.stringify(backendServices, null, 2),
    __FRONTEND_SERVICES_STRING__: JSON.stringify(frontnedServices, null, 2),
  };

  return new webpack.DefinePlugin(definitions);
}

export default function createBackendConfig(
  name: string,
  backendServices: string[],
  frontendServices: string[],
  entry: PathLike,
  buildType: BuildType
): Configuration {
  const output = path.resolve(distPath, buildType as string, name);
  const mode = buildType === 'development' ? 'development' : 'production';

  return {
    mode,
    name,
    target: 'node',
    externals: [nodeExternals()],
    externalsPresets : {
      node: true,
    },
    entry: entry as string,
    stats: 'minimal',
    output: {
      path: output,
      filename: 'main.cjs',
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: resolveAliases.default(backendAliases, workDirPath),
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ],
              plugins: [
                ["@babel/plugin-syntax-import-assertions"],
              ]
            }
          },
        },
        {
          test: /\.json$/,
          type: 'json'
        }
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
    plugins: [createDefinitions(backendServices, frontendServices, buildType)],
  };
}
