import { BuildType } from './build-types.js';
import getBackendAliases from './backend-aliases.js';

import { PathLike } from 'fs';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

function createDefinitions(name: string, buildType: BuildType) {
  const componentMacro = `__COMPONENT_${name.toUpperCase()}__`;
  const definitions = {
        __DEVELOPMENT__: buildType === 'development',
        __TEST__: buildType === 'test',
        __PRODUCTION__: buildType === 'production',
        [componentMacro]: true,
      };

  return new webpack.DefinePlugin(definitions);
}

export default function createBackendConfig(name: string, entry: PathLike, buildType: BuildType) : Configuration {
  const output = path.resolve(distPath, buildType as string, name);
  const mode = buildType === 'development' ? 'development' : 'production';

  return {
    mode,
    target: 'node',
    externals: [nodeExternals()],
    entry: entry as string,
    output: {
      path: output,
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: getBackendAliases(path.resolve(workDirPath, '..', '..')),
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'ts-loader',
            options: {
              logLevel: 'INFO',
              compilerOptions: {
                module: 'preserve',
                moduleResolution: 'bundler',
              },
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    experiments: {
      topLevelAwait: true,
    },
    plugins: [
      createDefinitions(name, buildType)
    ],
  };
}


