import { BuildType } from './build-types.js';

import { PathLike } from 'fs';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';
import aliases from './backend-aliases.json' with { type: "json" };

const workDirPath = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(workDirPath, '..', '..', 'dist');

interface Definitions {
  [name: string]: boolean | string;
}

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

function resolveAliases() {
  const retval: { [name: string]: string } = {};

  for (const key of Object.keys(aliases)) {
    retval[key] = path.resolve(workDirPath as string, '..', '..', aliases[key as keyof typeof aliases]);
  }

  return retval;
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
    target: 'node',
    externals: [nodeExternals()],
    entry: entry as string,
    output: {
      path: output,
      filename: 'main.cjs',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: resolveAliases(),
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
                noEmit: false,
                allowImportingTsExtensions: false,
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
    plugins: [createDefinitions(backendServices, frontendServices, buildType)],
  };
}
